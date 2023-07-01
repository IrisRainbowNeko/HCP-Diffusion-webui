import glob
import os

from flask import request

from constant import PROMPT_DS_ROOT
from hcp_server.context import app
from secession import DatasetSecession
from utils import wrap_response, create_sn

API_PREFIX = '/api/v1/dataset'
negative_prompt = 'lowres, bad anatomy, bad hands, text, error, missing fingers, extra digit, fewer digits, cropped, worst quality, low quality, normal quality, jpeg artifacts, signature, watermark, username, blurry'

ds_sec = DatasetSecession()

@app.route(API_PREFIX+"/", methods=["GET"])
def get_prompt_ds_info():
    sn = request.args.get("sn", default='')

    prompt_dataset = glob.glob(os.path.join(PROMPT_DS_ROOT, '*.parquet'))
    prompt_dataset = [{'label':os.path.basename(path), 'value':path} for path in prompt_dataset]

    return wrap_response({
        'prompt_file':prompt_dataset,
        'progress':100,
        'status':4,
        'sn':sn,
    })

@app.route(API_PREFIX+"/", methods=["POST"])
def generate_dataset():
    sn = create_sn()

    info = request.json['info']
    ds_sec.create_dataset(info['model'], info['word_name'], negative_prompt, info['out_dir'], bs=4, num=200)

    return wrap_response({'sn':sn, })

@app.route(API_PREFIX+"/progress", methods=["DELETE"])
def ds_interrupt():
    sn = request.args.get("sn", default='')
    ds_sec.interrupt()
    return wrap_response({'sn':sn, })

@app.route(API_PREFIX+"/progress", methods=["GET"])
def ds_progress():
    sn = request.args.get("sn", default='')
    progress = ds_sec.progress_rate

    return wrap_response({
        'sn':sn,
        'progress':progress,
        'status':2 if progress == 100 else 1
    })
