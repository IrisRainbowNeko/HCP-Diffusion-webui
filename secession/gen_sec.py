from multiprocessing import Process, Pipe
from hcpdiff.visualizer import Visualizer
from hcpdiff.vis import BaseInterface

class WebUIInterface(BaseInterface):
    def __init__(self):
        super().__init__(show_steps=1)
        self.step_now = 0
        self.images = []

    def on_inter_step(self, i, num_steps, t, latents, images):
        if i==0:
            self.images.clear()
        self.step_now = i

    def on_infer_finish(self, images, prompt, negative_prompt, save_cfg=False):
        self.images = images

class GenerateSecession(Process):
    def __init__(self, pipe, cfgs):
        super().__init__()
        self.pipe=pipe
        self.cfgs=cfgs
        self.infer_steps=50

        self.inter = WebUIInterface()

    def run(self):
        viser = Visualizer(self.cfgs)
        viser.cfgs.interface.append(self.inter)

        msg = self.pipe.recv()
        if msg['cmd']=='generate':
            cfg = msg['cfg']
            if hasattr(cfg.infer_args, 'num_inference_steps'):
                self.infer_steps = cfg.infer_args.num_inference_steps
            else:
                self.infer_steps = 50
        elif msg['cmd']=='progress':
            self.pipe.send(self.inter.step_now / self.infer_steps)
        elif msg['cmd'] == 'images':
            self.pipe.send(self.inter.images)

    def need_reload(self, cfg):
        return False
