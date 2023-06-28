import os
import glob

HCP_ROOT = ''
SERVER_ROOT = 'web/hcpdiff_back'

TMP_ROOT = os.path.join(HCP_ROOT, 'tmp/')
os.makedirs(TMP_ROOT, exist_ok=True)

with open(os.path.join(SERVER_ROOT, 'hf_models.txt'), encoding='utf8') as f:
    HF_MODELS = f.read().split('\n')

INFER_CFG_ROOT = os.path.join(HCP_ROOT, 'cfgs/infer')
PRETRAINED_MODELS_ROOT = os.path.join(HCP_ROOT, 'sd_models/')
EMB_ROOT = os.path.join(HCP_ROOT, 'embs/')
PROMPT_TEMPLATE_ROOT = os.path.join(HCP_ROOT, 'prompt_tuning_template/')
CKPT_ROOT = os.path.join(HCP_ROOT, 'ckpts/')

os.makedirs(PRETRAINED_MODELS_ROOT, exist_ok=True)
os.makedirs(EMB_ROOT, exist_ok=True)
os.makedirs(CKPT_ROOT, exist_ok=True)

TRAIN_CFG_ROOT = os.path.join(HCP_ROOT, 'cfgs/train')

def get_train_cfgs():
    return glob.glob(os.path.join(TRAIN_CFG_ROOT, '**/*.yaml'), recursive=True)

PROMPT_DS_ROOT = os.path.join(HCP_ROOT, 'prompt_dataset')


os.makedirs(PROMPT_DS_ROOT, exist_ok=True)