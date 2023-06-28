from multiprocessing import Process
from multiprocessing.connection import Connection
from hcpdiff.visualizer import Visualizer
from hcpdiff.vis import BaseInterface
from threading import Thread
import random

class WebUIInterface(BaseInterface):
    def __init__(self):
        super().__init__(show_steps=1)
        self.step_now = 0
        self.step_total = 1

    def on_inter_step(self, i, num_steps, t, latents, images):
        self.step_now=i
        self.step_total=num_steps

class GenerateSecession(Process):
    def __init__(self, pipe:Connection, cfgs):
        super().__init__()
        self.pipe=pipe
        self.cfgs=cfgs

        self.inter = WebUIInterface()
        self.imgs = []

    def reload(self):
        self.viser = Visualizer(self.cfgs)
        self.viser.cfgs.interface.append(self.inter)

    def run(self):
        self.reload()

        while True:
            msg = self.pipe.recv()
            if msg['cmd']=='generate':
                cfg = msg['cfg']
                self.generate(cfg)
            elif msg['cmd']=='progress':
                self.pipe.send(self.inter.step_now / self.inter.step_total)
            elif msg['cmd'] == 'images':
                self.pipe.send(self.imgs)
            elif msg['cmd'] == 'stop':
                break

    def _generate(self, cfgs):
        if self.need_reload(cfgs):
            self.reload()

        if cfgs.seed is not None:
            seeds = list(range(cfgs.seed, cfgs.seed+cfgs.num*cfgs.bs))
        else:
            seeds = [random.randint(0, 1 << 30) for _ in range(cfgs.num*cfgs.bs)]

        prompt = [cfgs.prompt]*cfgs.bs
        negative_prompt = [cfgs.neg_prompt]*cfgs.bs
        for i in range(cfgs.num):
            images = self.viser.vis_images(prompt=prompt, negative_prompt=negative_prompt, seeds=seeds[i*cfgs.bs:(i+1)*cfgs.bs], **cfgs.infer_args)
            self.imgs.extend(images)
            self.viser.save_images(images, prompt, negative_prompt, save_cfg=cfgs.save.save_cfg, seeds=seeds)

    def generate(self, cfgs):
        self.imgs.clear()
        p = Thread(target=self._generate, args=(cfgs,))
        p.start()

    def need_reload(self, cfg) -> bool:
        return False
