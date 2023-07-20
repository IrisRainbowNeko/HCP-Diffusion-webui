import os
import random
from multiprocessing import Process
from multiprocessing.connection import Connection
from threading import Thread

from hcpdiff import VisualizerReloadable
from hcpdiff.utils.img_size_tool import types_support
from hcpdiff.vis import BaseInterface
from loguru import logger
import traceback

from constant import IMG_SAVE_ROOT

class WebUIInterface(BaseInterface):
    def __init__(self):
        super().__init__(show_steps=1)
        self.step_now = 0
        self.step_total = 1
        self.img_name_list = []

        self.save_root = IMG_SAVE_ROOT
        self.interrupt = False

    def on_inter_step(self, i, num_steps, t, latents, images):
        if i+1<num_steps:  # 最后一步要等图片储存完毕
            self.step_now = i+1
            self.step_total = num_steps

        return self.interrupt

    def on_infer_finish(self, images, prompt, negative_prompt, cfgs_raw=None, seeds=None):
        img_id_path_map = {int(x.split('-', 1)[0]):x for x in os.listdir(self.save_root) if x.rsplit('.', 1)[-1] in types_support}
        num_imgs = max(img_id_path_map.keys())
        self.img_name_list = ['image/'+img_id_path_map[img_id] for img_id in range(num_imgs-len(prompt)+1, num_imgs+1)]

class GenerateSecession(Process):
    def __init__(self, pipe: Connection, cfgs):
        super().__init__()
        self.pipe = pipe
        self.cfgs = cfgs

        self.inter = WebUIInterface()
        self.imgs = []

        self.gen_num_now = 0
        self.gen_num_total = 1

        self.is_init = False
        self.has_exception = False

    def run(self):
        while True:
            msg = self.pipe.recv()
            if msg['cmd'] == 'generate':
                cfg = msg['cfg']
                self.generate(cfg)
            elif msg['cmd'] == 'progress':
                if self.has_exception:
                    self.pipe.send(-1)
                elif self.inter.interrupt:
                    self.pipe.send(-2)
                else:
                    self.pipe.send(100*((self.inter.step_now/self.inter.step_total)/self.gen_num_total+self.gen_num_now/self.gen_num_total))
            elif msg['cmd'] == 'images':
                self.pipe.send(self.imgs)
            elif msg['cmd'] == 'stop':
                break
            elif msg['cmd'] == 'interrupt':
                self.inter.interrupt = True

    def do_generate(self, cfgs):
        self.gen_num_now = 0
        self.gen_num_total = cfgs.num

        if not self.is_init:
            logger.info(f'init viser')
            self.viser = VisualizerReloadable(self.cfgs)
            self.is_init = True
            self.img_save_root = self.cfgs.out_dir
        else:
            logger.info(f'reload')
            self.viser.check_reload(cfgs)

        self.cfgs = cfgs
        self.viser.cfgs.interface.append(self.inter)

        if cfgs.seed is not None:
            seeds = list(range(cfgs.seed, cfgs.seed+cfgs.num*cfgs.bs))
        else:
            seeds = [random.randint(0, 1 << 30) for _ in range(cfgs.num*cfgs.bs)]

        prompt = [cfgs.prompt]*cfgs.bs
        negative_prompt = [cfgs.neg_prompt]*cfgs.bs
        for i in range(cfgs.num):
            images = self.viser.vis_images(prompt=prompt, negative_prompt=negative_prompt, seeds=seeds[i*cfgs.bs:(i+1)*cfgs.bs], **cfgs.infer_args)
            # self.imgs.extend(images)
            self.viser.save_images(images, prompt, negative_prompt, save_cfg=cfgs.save.save_cfg, seeds=seeds)
            self.imgs.extend(self.inter.img_name_list)
            self.gen_num_now = i+1

    def _generate(self, cfgs):
        try:
            self.do_generate(cfgs)
        except:
            traceback.print_exc()
            self.has_exception = True

    def generate(self, cfgs):
        self.inter.step_now = 0
        self.inter.interrupt = False
        self.imgs.clear()
        self.has_exception = False

        Thread(target=self._generate, args=(cfgs,)).start()
