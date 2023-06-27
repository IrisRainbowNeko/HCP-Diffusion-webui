import os

HCP_ROOT = ''
SERVER_ROOT = 'web/hcpdiff_back'

with open(os.path.join(SERVER_ROOT, 'hf_models.txt'), encoding='utf8') as f:
    HF_MODELS = f.read().split('\n')

INFER_CFG_ROOT = os.path.join(HCP_ROOT, 'cfgs/infer')
PRETRAINED_MODELS_ROOT = os.path.join(HCP_ROOT, 'sd_models/')
EMB_ROOT = os.path.join(HCP_ROOT, 'embs/')
CKPT_ROOT = os.path.join(HCP_ROOT, 'ckpts/')

os.makedirs(PRETRAINED_MODELS_ROOT, exist_ok=True)
os.makedirs(EMB_ROOT, exist_ok=True)
os.makedirs(CKPT_ROOT, exist_ok=True)
