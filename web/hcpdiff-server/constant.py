import os
import glob

class Status:
    BEGIN = 0
    LOADING = 1
    END = 2
    ACTIVE_INTERRUPT = 3
    UNACTIVE_INTERRUPT = 4
    DELETE = 5

HCP_ROOT = os.getcwd()
SERVER_ROOT = os.path.join(HCP_ROOT, 'web/hcpdiff-server')

TMP_ROOT = os.path.join(HCP_ROOT, 'tmp/')
os.makedirs(TMP_ROOT, exist_ok=True)

with open(os.path.join(SERVER_ROOT, 'hf_models.txt'), encoding='utf8') as f:
    HF_MODELS = f.read().split('\n')

INFER_CFG_ROOT = os.path.join(HCP_ROOT, 'cfgs/infer')
PRETRAINED_MODELS_ROOT = os.path.join(HCP_ROOT, 'sd_models/')
EMB_ROOT = os.path.join(HCP_ROOT, 'embs/')
PROMPT_TEMPLATE_ROOT = os.path.join(HCP_ROOT, 'prompt_tuning_template/')
CKPT_ROOT = os.path.join(HCP_ROOT, 'ckpts/')
IMG_SAVE_ROOT = os.path.join(HCP_ROOT, 'output/')

os.makedirs(PRETRAINED_MODELS_ROOT, exist_ok=True)
os.makedirs(EMB_ROOT, exist_ok=True)
os.makedirs(CKPT_ROOT, exist_ok=True)

TRAIN_CFG_ROOT = os.path.join(HCP_ROOT, 'cfgs/train')

def get_train_cfgs():
    return glob.glob(os.path.join(TRAIN_CFG_ROOT, '**/*.yaml'), recursive=True)

PROMPT_DS_ROOT = os.path.join(HCP_ROOT, 'prompt_dataset')

os.makedirs(PROMPT_DS_ROOT, exist_ok=True)


INDEX_PATH = {
  'pretrained_mode': {
    'dirPath': PRETRAINED_MODELS_ROOT,
    'fileTypes': 'dir'
  },
  'pretrained_model_name_or_path': {
    'dirPath': PRETRAINED_MODELS_ROOT,
    'fileTypes': 'dir'
  },
  'out_dir': {
    'dirPath': IMG_SAVE_ROOT,
    'fileTypes': ['bmp', 'gif', 'ico', 'jpeg', 'jpg', 'png', 'tiff', 'webp']
  },
  'emb_dir': {
    'dirPath': EMB_ROOT,
    'fileTypes': ['pt']
  },
  'merge_group_lora_path': {
    'dirPath': CKPT_ROOT,
    'fileTypes': ['ckpt', 'safetensors']
  },
  'merge_group_part_path': {
    'dirPath': CKPT_ROOT,
    'fileTypes': ['ckpt', 'safetensors']
  },
  'merge_group_plugin_controlnet1_path': {
    'dirPath': CKPT_ROOT,
    'fileTypes': ['ckpt', 'safetensors']
  },
  'tokenizer_pt_train_name': {
    'dropSuffix': True,
    'dirPath': EMB_ROOT,
    'fileTypes': ['pt']
  },
  'prompt_template': {
    'dirPath': PROMPT_TEMPLATE_ROOT,
    'fileTypes': ['txt']
  },
  'prompt_file': {
    'dirPath': PROMPT_DS_ROOT,
    'fileTypes': ['parquet']
  },
}
