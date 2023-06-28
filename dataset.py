from context import app
from flask import request
import glob
from constant import PROMPT_DS_ROOT
import os

API_PREFIX = '/api/v1/dataset'

@app.route(API_PREFIX+"/", methods=["GET"])
def get_prompt_ds_info():
    sn = request.args.get("sn", default='')

    prompt_dataset = glob.glob(os.path.join(PROMPT_DS_ROOT, '*.parquet'))
    prompt_dataset = [{'label':os.path.basename(path), 'value':path} for path in prompt_dataset]

    return {
        'prompt_file': prompt_dataset,
        'progress': 100,
        'status':4,
        'sn':sn,
    }