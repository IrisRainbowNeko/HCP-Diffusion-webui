from hcp_server.context import app
from flask import request
from secession import PTSecession
from hcpdiff.utils.utils import str2bool

from utils import wrap_response, create_sn

API_PREFIX = '/api/v1/pt'

pt_sec = PTSecession()

@app.route(API_PREFIX+"/", methods=["GET"])
def get_pt_info():
    sn = request.args.get("sn", default='')
    return wrap_response({'sn':sn,})

@app.route(API_PREFIX+"/", methods=["POST"])
def creat_pt():
    sn = create_sn()

    info = request.json['info']
    pt_sec.create_pt(info['pretrained_model'], info['word_name'], info['length_of_word'], info['init_text'], replace=info['replace'])

    return wrap_response({'sn':sn,})