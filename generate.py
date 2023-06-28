import json
import os
from multiprocessing import Pipe
import glob

from flask import request
from hcpdiff.utils.utils import load_config
from omegaconf import OmegaConf

from constant import INFER_CFG_ROOT, HF_MODELS, PRETRAINED_MODELS_ROOT, CKPT_ROOT
from secession.gen_sec import GenerateSecession
from utils import proc_model_path, create_sn
from context import app

API_PREFIX = '/api/v1/generate'

class VisData:
    def __init__(self):
        self.pipe: Pipe = None
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
    cfg_file_list = [{'label':path[:-5], 'value':''} for path in os.listdir(INFER_CFG_ROOT)]

    progress = vis_data.get_data('progress') or 100

    return {
        'info':OmegaConf.to_container(cfg),
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
        'status':4,
        'sn':sn,
    }

@app.route(API_PREFIX+"/", methods=["POST"])
def generate_images():
    cfg = json.loads(request.json)['info']
    sn = create_sn()

    if vis_data.interface is None:
        vis_data.pipe = Pipe()
        cfg = load_config(sn)
        vis_data.interface = GenerateSecession(vis_data.pipe, cfg)

    vis_data.pipe.send({'cmd':'generate', 'cfg':cfg})
    return {'sn':sn}

@app.route(API_PREFIX+"/progress", methods=["DELETE"])
def progress_finish():
    sn = request.args.get("sn", default='')
    return {'sn':sn}

@app.route(API_PREFIX+"/progress", methods=["GET"])
def progress():
    sn = request.args.get("sn", default='')
    images = vis_data.get_data('images')
    progress = vis_data.get_data('progress')
    if len(images) == 0 and progress == 100:
        progress = 99

    return {
        'sn':sn,
        'progress':progress,
        'images':images,
        'status':2 if progress == 100 else 1
    }
