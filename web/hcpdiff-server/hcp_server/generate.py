import glob
import os
from multiprocessing import Pipe
from multiprocessing.connection import Connection

from flask import request
from hcpdiff.utils.utils import load_config
from loguru import logger
from omegaconf import OmegaConf

from constant import INFER_CFG_ROOT, HF_MODELS, PRETRAINED_MODELS_ROOT, CKPT_ROOT, Status
from hcp_server.context import app
from secession.gen_sec import GenerateSecession
from utils import proc_model_path, create_sn, wrap_response

API_PREFIX = '/api/v1/generate'

class VisData:
    def __init__(self):
        self.pipe: Connection = None
        self.interface = None

    def get_data(self, msg):
        if self.pipe is not None:
            if isinstance(msg, str):
                msg = {'cmd':msg}
            self.pipe.send(msg)
            return self.pipe.recv()

vis_data = VisData()

@app.route(API_PREFIX+"/", methods=["GET"])
def get_generate_info():
    sn = request.args.get("sn", default='text2img')
    if not os.path.exists(os.path.join(INFER_CFG_ROOT, sn+'.yaml')):
        sn = 'text2img'

    cfg = load_config(os.path.join(INFER_CFG_ROOT, sn+'.yaml'))
    pretrained_model_local = glob.glob(PRETRAINED_MODELS_ROOT+'*')
    pretrained_model_list = proc_model_path(pretrained_model_local+HF_MODELS)
    ckpt_list = glob.glob(os.path.join(CKPT_ROOT, '*.ckpt'))
    cfg_file_list = [{'label':path[:-5], 'value':path[:-5]} for path in os.listdir(INFER_CFG_ROOT)]

    progress = vis_data.get_data('progress') or 100

    status = Status.LOADING
    if progress == 100:
        status = Status.END
    elif progress == -1:
        progress = 100
        status = Status.UNACTIVE_INTERRUPT
    elif progress == -2:
        progress = 100
        status = Status.ACTIVE_INTERRUPT

    return wrap_response({
        'info':OmegaConf.to_container(cfg, resolve=True),
        'pretrained_mode':pretrained_model_list,
        'pretrained_model_name_or_path':pretrained_model_list,
        'condition_image':[],
        'merge_group_lora_path':ckpt_list,
        'merge_group_part_path':ckpt_list,
        'merge_group_plugin_controlnet1_path':ckpt_list,
        'server_yaml_file':cfg_file_list,
        'is_pending':progress<100,
        'progress':progress,
        'images':[],
        'status':status,
        'sn':sn,
    })

@app.route(API_PREFIX+"/", methods=["POST"])
def generate_images():
    cfg = request.json['info']
    cfg = OmegaConf.create(cfg)
    sn = create_sn()

    logger.info('sn: '+str(sn))

    if vis_data.interface is None:
        vis_data.pipe, child_pipe = Pipe()
        # cfg = load_config(sn+'.yaml')
        vis_data.interface = GenerateSecession(child_pipe, cfg)
        vis_data.interface.start()

    vis_data.pipe.send({'cmd':'generate', 'cfg':cfg})
    return wrap_response({'sn':sn})

@app.route(API_PREFIX+"/progress", methods=["DELETE"])
def gen_interrupt():
    sn = request.args.get("sn", default='')
    vis_data.pipe.send({'cmd':'interrupt'})
    return wrap_response({'sn':sn})

@app.route(API_PREFIX+"/progress", methods=["GET"])
def gen_progress():
    sn = request.args.get("sn", default='')
    images = vis_data.get_data('images')
    progress = vis_data.get_data('progress')
    if len(images) == 0 and progress == 100:
        progress = 99

    status = Status.LOADING
    if progress == 100:
        status = Status.END
    elif progress == -1:
        progress = 100
        status = Status.UNACTIVE_INTERRUPT
    elif progress == -2:
        progress = 100
        status = Status.ACTIVE_INTERRUPT

    return wrap_response({
        'sn':sn,
        'progress':progress,
        'images':images,
        'status':status
    })
