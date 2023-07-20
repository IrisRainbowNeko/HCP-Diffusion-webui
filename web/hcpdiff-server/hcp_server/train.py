from hcp_server.context import app
from flask import request
import os
from constant import get_train_cfgs, TRAIN_CFG_ROOT, HF_MODELS, PRETRAINED_MODELS_ROOT, PROMPT_TEMPLATE_ROOT, EMB_ROOT, TMP_ROOT, Status
from utils import proc_model_path, create_sn, wrap_response
from hcpdiff.utils.utils import load_config
from omegaconf import OmegaConf
import glob
from secession import TrainSecession

API_PREFIX = '/api/v1/train'

ts = TrainSecession()

@app.route(API_PREFIX+"/", methods=["GET"])
def get_train_info():
    sn = request.args.get("sn", default='text2img')
    if not os.path.exists(os.path.join(TRAIN_CFG_ROOT, sn+'.yaml')):
        sn = 'examples/fine-tuning'

    cfg = load_config(os.path.join(TRAIN_CFG_ROOT, sn+'.yaml'))
    pretrained_model_local = glob.glob(PRETRAINED_MODELS_ROOT+'*')
    pretrained_model_list = proc_model_path(pretrained_model_local+HF_MODELS)

    train_cfgs = get_train_cfgs()
    train_cfgs_names = [x[len(TRAIN_CFG_ROOT)+1:] for x in train_cfgs]
    cfg_file_list = [{'label':path[:-5], 'value':path[:-5]} for path in train_cfgs_names]

    prompt_template_list = glob.glob(os.path.join(PROMPT_TEMPLATE_ROOT, '*.txt'))
    prompt_template_list = [{'label':os.path.basename(path), 'value':path} for path in prompt_template_list]

    emb_list = glob.glob(os.path.join(EMB_ROOT, '*.pt'))
    emb_list = [{'label':os.path.basename(path)[:-3], 'value':os.path.basename(path)[:-3]} for path in emb_list]

    progress = ts.progress_rate

    status = Status.LOADING
    if progress == 100:
        status = Status.END
    elif progress == -1:
        progress = 100
        status = Status.UNACTIVE_INTERRUPT

    return wrap_response({
        'info':OmegaConf.to_container(cfg, resolve=True),
        'pretrained_mode':pretrained_model_list,
        'pretrained_model_name_or_path':pretrained_model_list,
        'prompt_template':prompt_template_list,
        'tokenizer_pt_train_name':emb_list,
        'server_yaml_file':cfg_file_list,
        'is_pending':progress<100,
        'progress':progress,
        'status':status,
        'sn':sn,
    })

@app.route(API_PREFIX+"/", methods=["POST"])
def train_model():
    body = request.json
    cfg = body['info']
    train_mode = body['train_mode']

    sn = create_sn()
    train_file = os.path.join(TMP_ROOT, f'train_{sn}.yaml')
    with open(train_file, 'w', encoding='utf-8') as f:
        f.write(OmegaConf.to_yaml(cfg))

    if train_mode==0:
        ts.start(f'accelerate launch -m hcpdiff.train_ac --cfg "{train_file}"')
    elif train_mode==1:
        ts.start(f'accelerate launch -m hcpdiff.train_ac_single --cfg "{train_file}"')
    elif train_mode==2:
        ts.start(f'torchrun --nproc_per_node 1 -m hcpdiff.train_colo --cfg "{train_file}"')

    return wrap_response({'sn':sn})

@app.route(API_PREFIX+"/progress", methods=["DELETE"])
def train_interrupt():
    sn = request.args.get("sn", default='')
    ts.stop()
    return wrap_response({'sn':sn})

@app.route(API_PREFIX+"/progress", methods=["GET"])
def train_progress():
    sn = request.args.get("sn", default='')
    progress = ts.progress_rate

    status = Status.LOADING
    if progress == 100:
        status = Status.END
    elif progress == -1:
        progress = 100
        status = Status.UNACTIVE_INTERRUPT

    return wrap_response({
        'sn':sn,
        'progress':progress,
        'status':status
    })
