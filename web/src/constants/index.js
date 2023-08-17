export const pretrained_model_options = [
  { label: '1', value: 1 },
  { label: '1', value: 2 }
];
export const dtype_options = [
  { label: 'fp16', value: 'fp16' },
  { label: 'fp32', value: 'fp32' },
  { label: 'amp', value: 'amp' }
];
export const type_options = [
  { label: 'i2i', value: 'i2i' },
  { label: 'controlnet', value: 'controlnet' }
];
export const image_typ_options = [
  { label: 'jpg', value: 'jpg' },
  { label: 'png', value: 'png' }
];
export const scheduler_options = [
  { label: 'PNDM(prk+plms)', value: 'diffusers.PNDMScheduler' },
  { label: 'DDIM', value: 'diffusers.DDIMScheduler' },
  { label: 'Euler A', value: 'diffusers.EulerAncestralDiscreteScheduler' },
  { label: 'Euler', value: 'diffusers.EulerDiscreteScheduler' },
  { label: 'DPM++', value: 'diffusers.DPMSolverMultistepScheduler' },
  { label: 'DPM++(single step)', value: 'diffusers.DPMSolverSinglestepScheduler' },
  { label: 'Heun', value: 'diffusers.HeunDiscreteScheduler' },
  { label: 'KDPM2 A', value: 'diffusers.KDPM2AncestralDiscreteScheduler' },
  { label: 'LMS', value: 'diffusers.LMSDiscreteScheduler' },
  { label: 'DEIs', value: 'diffusers.DEISMultistepScheduler' }
];
export const dpm_type_options = [
  { label: 'dpmsolver++', value: 'dpmsolver++' },
  { label: 'dpmsolver', value: 'dpmsolver' }
];

export const dmp_schedulers = [
  'diffusers.DPMSolverMultistepScheduler',
  'diffusers.DPMSolverSinglestepScheduler'
];

export const karras_schedulers = [
  'diffusers.DPMSolverMultistepScheduler',
  'diffusers.DPMSolverSinglestepScheduler',
  'diffusers.HeunDiscreteScheduler',
  'diffusers.LMSDiscreteScheduler'
];

export const pretrained_model_name_or_path_options = [];

export const default_generate_data = {
  // 文本输入
  prompt: '',
  // 文本输入
  neg_prompt: '',
  // 列表 options
  pretrained_model: '',
  // 文本输入 不可编辑
  out_dir: 'output/',
  // 文本输入 不可编辑
  emb_dir: 'embs/',
  // range [1, 5]
  N_repeats: 1,
  // range [0, 4]
  clip_skip: 0,
  // range [1, 12]
  bs: 1,
  // range [1, 10]
  num: 1,
  // 数字输入 任意正数 默认null
  seed: null,
  // 列表 [fp16,fp32,amp]
  dtype: 'fp16',
  // 默认值为 null 根据checkbox判断 是否需要该选项
  condition: {
    // 必须值 否
    // 列表 [i2i, controlnet]
    type: 'i2i',
    // file, 用户上传图片 文件路径 需要upload接口支持
    image: '',
    // file, 用户上传图片 文件路径 需要upload接口支持
    mask: ''
  },
  ex_input: {
    // 必须值 否
    cond: {
      _target_: 'hcpdiff.data.data_processor.ControlNetProcessor',
      // condition图片路径
      image: ''
    }
  },
  save: {
    // 开关
    save_cfg: true,
    // 列表 [jpg, png]
    image_type: 'png',
    // range [1, 100]
    quality: 95
  },
  // 默认值为 null 根据checkbox判断 是否需要该选项
  offload: {
    // 输入 任意数字
    max_VRAM: '8GiB',
    // 输入 任意数字
    max_RAM: '30GiB',
    // 开关
    vae_cpu: false
  },
  infer_args: {
    // 数字输入 [128, 2048]
    width: 512,
    // 数字输入 [128, 2048]
    height: 512,
    // range [1, 20] 一位小数
    guidance_scale: 7.5,
    // range 【1， 100】整数
    num_inference_steps: 50,
    // range [0, 1]
    // 当且仅当condition.type选择i2i时有该选项
    strength: 0.75
  },

  //----------
  // 默认值为{} 根据checkbox判断 是否需要该选项
  new_components: {
    scheduler: {
      // 文本输入 不可编辑
      _target_: 'diffusers.PNDMScheduler',
      // 数字输入  [0, 1]
      beta_start: 0.00085,
      // 数字输入 [0, 1]
      beta_end: 0.012,
      // 文本输入 不可编辑
      beta_schedule: 'scaled_linear'
    },
    // 默认值为 null 根据checkbox判断 是否需要该选项
    vae: {
      // 文本 不可编辑
      _target_: 'diffusers.AutoencoderKL.from_pretrained',
      // 列表
      pretrained_model_name_or_path: ''
    }
  },
  // 类对象
  merge: {
    group1: {
      // 列表 group_plugin_options
      type: 'unet',
      // 数字输入 【0， 1】
      base_model_alpha: 1,
      lora: [
        {
          // 文本输入
          path: '',
          // 数字输入【0， 1】
          alpha: 0.65,
          // 文本 任意输入 默认all
          layers: 'all',
          // 右边值比左边大
          // mask_options 列表选择
          mask: [0.5, 1]
        }
      ],
      part: [
        {
          // 文本输入
          path: '',
          // 数字输入
          alpha: 0.65
        }
      ],
      plugin: [
        // default_group_plugin
        // {
        //   // condition.type === controlnet 才会有显示 默认为null
        //   controlnet1: {
        //     // 文本
        //     path: '',
        //     // 文本 支持所有 默认为all
        //     layers: 'all'
        //   }
        // }
      ]
    }
    // group2: {
    //   // 列表 group_plugin_options
    //   type: 'TE',
    //   // 文本
    //   base_model_alpha: 1,
    //   lora: [
    //     {
    //       // 文本
    //       path: '',
    //       // 数字输入【0， 1】
    //       alpha: 0.65,
    //       // 文本 支持所有 默认为all
    //       layers: 'all',
    //       // 右边值比左边大
    //       mask: [0.5, 1]
    //     }
    //   ],
    //   // 没值时 默认为null
    //   part: [
    //     {
    //       // 文本
    //       path: '',
    //       // 文本
    //       alpha: 0.65
    //     }
    //   ]
    // }
  },
  interface: [
    {
      _target_: 'hcpdiff.vis.WebUIInterface',
      show_steps: 1,
      save_root: 'output/'
    }
  ]
};

export const default_group_plugin = {
  controlnet1: {
    // 文本
    path: '',
    // 文本 支持所有 默认为all
    layers: 'all'
  }
};
export const group_plugin_options = [
  { label: 'unet', value: 'unet' },
  { label: 'TE', value: 'TE' }
];

export const mask_options = [
  { label: 'no_mask', value: '-1' },
  { label: 'positive', value: '0.5,1' },
  { label: 'negative', value: '0,0.5' }
];

/**
 * --------------分割线-------------------
 */

export const ckpt_type_options = [
  { label: 'torch', value: 'torch' },
  { label: 'safetensors', value: 'safetensors' }
];
export const optimizer_types_options = [
  { label: 'adamw', value: 'torch.optim.AdamW' },
  { label: 'adamw_8bit', value: 'bitsandbytes.optim.AdamW8bit' },
  { label: 'adam', value: 'torch.optim.Adam' },
  { label: 'lion', value: 'lion_pytorch.Lion' }
];
export const scheduler_name_options = [
  { label: 'one_cycle', value: 'one_cycle' },
  { label: 'linear', value: 'linear' },
  { label: 'cosine', value: 'cosine' },
  { label: 'cosine_with_restarts', value: 'cosine_with_restarts' },
  { label: 'polynomial', value: 'polynomial' },
  { label: 'constant', value: 'constant' },
  { label: 'constant_with_warmup', value: 'constant_with_warmup' }
];
export const word_names_pt1_options = [
  { label: 'word1', value: 'word1' },
  { label: 'word1-neg', value: 'word1-neg' }
];
export const bucket__target__options = [
  {
    label: 'hcpdiff.data.bucket.RatioBucket.from_files',
    value: 'hcpdiff.data.bucket.RatioBucket.from_files'
  },
  { label: 'hcpdiff.data.bucket.FixedBucket', value: 'hcpdiff.data.bucket.FixedBucket' }
];

export const default_train_data = {
  // 不可编辑
  exp_dir: 'exps/',
  // 列表 dtype_options
  mixed_precision: 'fp16',
  allow_tf32: false,
  // 数字输入 任意正数
  seed: 114514,
  // 列表 ckpt_type_options [torch, safetensors]
  ckpt_type: 'safetensors',
  // 页面不展示
  logger: [
    {
      _target_: 'hcpdiff.loggers.CLILogger',
      _partial_: true,
      out_path: 'train.log',
      log_step: 20
    }
  ],
  model: {
    enable_xformers: true,
    gradient_checkpointing: true,
    // 不显示
    revision: null,
    pretrained_model_name_or_path: null,
    // 不显示
    tokenizer_name: null,
    // 句子长度拓展倍数 [1, 10] 整数
    tokenizer_repeats: 1,
    // [0, 1] 两位小数
    ema_unet: 0,
    // [0, 1] 两位小数
    ema_text_encoder: 0,
    // [0, 4]
    clip_skip: 0,
    // 页面不展示
    noise_scheduler: {
      // 不可编辑
      _target_: 'diffusers.DDPMScheduler.from_pretrained',
      _partial_: true
    }
  },
  train: {
    // 文字输入 任意整数 max=1000000
    train_steps: 1000,
    // range [1, 32]
    gradient_accumulation_steps: 1,
    // range [0, 12]
    workers: 4,
    // 数字输入 [0, 1] 不可编辑
    max_grad_norm: 1.0,
    set_grads_to_none: false,
    // 小于 train_steps
    save_step: 100,
    // 文本输入 任意字符串
    cfg_scale: '1.0',
    // TODO: 待定
    /**
     * resume: {
     *  ckpt_path: {
     *    unet: [], // 所有unet部分权重文件，list
     *    TE: [], // 所有text encoder部分权重文件，lis
     *    words:  {} # 所有训练好的自定义单词部分权重文件，dict(名字:路径)
     *  },
     * start_step: 0 起始步数
     * }
     */
    // 接着之前的训练继续训练
    resume: null,
    // TODO:--------- 页面展示
    loss: {
      // 根据下方loss参数自动生成
      criterion: {
        _target_: 'hcpdiff.loss.MSELoss',
        _partial_: true,
        reduction: 'none'
      },
      // 列表 eps、sample
      type: 'eps'
    },
    optimizer: {
      // 列表 [adamw, adamw_8bit]
      _target_: 'torch.optim.AdamW',
      _partial_: true,
      // 数字输入 [0, 1]
      weight_decay: 0.001
    },
    optimizer_pt: {
      // 列表 [adamw, adamw_8bit]
      _target_: 'torch.optim.AdamW',
      _partial_: true,
      // 数字输入 [0, 1]
      weight_decay: 0.0005
    },
    scale_lr: true,
    scheduler: {
      // 列表 scheduler_name_options [one_cycle, linear, cosine, cosine_with_restarts, polynomial, constant, constant_with_warmup]
      name: 'one_cycle',
      // 数字输入 [0, train_steps]
      num_warmup_steps: 200,
      // 不可编辑 train_steps 同步更新
      num_training_steps: 1000,
      //  字符串输入编辑 key: value 都可编辑
      scheduler_kwargs: {}
    },
    scale_lr_pt: true,
    scheduler_pt: {
      // 列表 scheduler_name_options [one_cycle, linear, cosine, cosine_with_restarts, polynomial, constant, constant_with_warmup]
      name: 'one_cycle',
      // 数字输入 [0, train_steps]
      num_warmup_steps: 200,
      // 不可编辑 train_steps 同步更新
      num_training_steps: 1000,
      //  字符串输入编辑 key: value 都可编辑
      scheduler_kwargs: {}
    }
  },
  data: {
    // 类数组对象 可添加
    dataset1: {
      // 不可编辑
      _target_: 'hcpdiff.data.TextImagePairDataset',
      // 不显示
      _partial_: true,
      // 数字输入 [1, 100]
      batch_size: 4,
      // 数字输入 [0, 10] 两位小数
      loss_weight: 1,
      cache_latents: true,
      att_mask_encode: false,
      bucket: {
        // 列表 bucket__target__options [hcpdiff.data.bucket.RatioBucket.from_files, hcpdiff.data.bucket.FixedBucket]
        _target_: 'hcpdiff.data.bucket.RatioBucket.from_files',
        // _target_等于hcpdiff.data.bucket.RatioBucket.from_files 时才会存在
        target_area: {
          _target_: 'builtins.eval',
          _args_: ['512*512']
        },
        // range [1, 16]
        num_bucket: 1,

        //_target_等于hcpdiff.data.bucket.FixedBucket 时才会存在
        // _target_: 'hcpdiff.data.bucket.FixedBucket',
        target_size: [512, 512]
      },
      source: {
        // 类数组对象 可添加
        data_source1: {
          img_root: 'imgs/train',
          // 列表 文件目录
          prompt_template: 'prompt_tuning_template/object.txt',
          // 文件选择 上传文件
          caption_file: null,
          // 文本输入
          att_mask: null,
          // 页面不展示
          bg_color: [255, 255, 255],
          // 弹框展示 不可编辑
          image_transforms: {
            _target_: 'torchvision.transforms.Compose',
            // transforms: null
            transforms: [
              {
                _target_: 'torchvision.transforms.ToTensor'
              },
              {
                _target_: 'torchvision.transforms.Normalize',
                // float or [float, float, float] 0.5
                mean: [0.5],
                // float or [float, float, float] 0.5
                std: [0.5]
              }
            ]
          },
          tag_transforms: {
            _target_: 'torchvision.transforms.Compose',
            // 数组
            // transforms: null
            transforms: [
              {
                // 不可编辑
                _target_: 'hcpdiff.utils.caption_tools.TagShuffle'
              }
              // {
              //   // 不可编辑
              //   _target_: 'hcpdiff.utils.caption_tools.TagDropout',
              //   // 数字输入
              //   p: 0.1
              // },
              // {
              //   // 不可编辑
              //   _target_: 'hcpdiff.utils.caption_tools.TemplateFill',
              //   // 字符串输入编辑 key: value 都可编辑
              //   word_names: {}
              // }
            ]
          }
        }
        // data_source2: 同上 data_source2 、data_source3 ...
      }
    }
    // dataset_class: {
    //   _target_: 'hcpdiff.data.TextImagePairDataset',
    //   _partial_: true,
    //   batch_size: 1,
    //   cache_latents: true,
    //   att_mask_encode: false,
    //   loss_weight: 1,
    //   source: {
    //     data_source1: {
    //       img_root: 'imgs/v15',
    //       prompt_template: 'prompt_tuning_template/caption.txt',
    //       caption_file: 'imgs/v15/image_captions.json',
    //       att_mask: null,
    //       bg_color: [255, 255, 255],
    //       image_transforms: {
    //         _target_: 'torchvision.transforms.Compose',
    //         transforms: [
    //           {
    //             _target_: 'torchvision.transforms.ToTensor'
    //           }
    //         ]
    //       },
    //       tag_transforms: {
    //         _target_: 'torchvision.transforms.Compose',
    //         transforms: [
    //           {
    //             _target_: 'hcpdiff.utils.caption_tools.TagShuffle'
    //           },
    //           {
    //             _target_: 'hcpdiff.utils.caption_tools.TagDropout',
    //             p: 0.1
    //           },
    //           {
    //             _target_: 'hcpdiff.utils.caption_tools.TemplateFill',
    //             word_names: {
    //               pt1: ''
    //             }
    //           }
    //         ]
    //       }
    //     }
    //   },
    //   bucket: {
    //     _target_: 'hcpdiff.data.bucket.FixedBucket',
    //     target_size: [512, 512]
    //   }
    // }
    // dataset2: 同上 dataset2 dataset3 ...
  },

  plugin_TE: {
    // 类数组 对象 可添加
    controlnet1: {
      // 不可编辑
      _target_: 'hcpdiff.models.controlnet.ControlNetPlugin',
      // 不可编辑
      _partial_: true,
      // 数字输入
      lr: 0.0001,
      // 不可编辑
      from_layers: ['pre_hook:', 'pre_hook:conv_in'],
      // 不可编辑
      to_layers: [
        'down_blocks.0',
        'down_blocks.1',
        'down_blocks.2',
        'down_blocks.3',
        'mid_block',
        'pre_hook:up_blocks.3.resnets.2'
      ]
    }
  },
  text_encoder: [
    {
      // 数字输入
      lr: 0.000001,
      // 数组 每一项是文本输入
      layers: []
    }
  ],
  lora_text_encoder: [
    // default_lora_text_encoder_value
    // {
    //   lr: 0.000001,
    //   rank: 2,
    //   branch: 'p',
    //   dropout: 0.1,
    //   layers: ['re:.*self_attn$', 're:.*mlp$']
    // },
    // {
    //   lr: 0.000001,
    //   rank: 2,
    //   branch: 'p',
    //   dropout: 0.1,
    //   layers: ['re:.*self_attn$', 're:.*mlp$']
    // }
  ],
  unet: [
    {
      // 数字输入
      lr: 0.000001,
      // 数组 每一项是文本输入
      layers: []
    }
  ],
  tokenizer_pt: {
    // 不可编辑
    emb_dir: 'embs/',
    replace: false,
    // 列表
    train: [
      {
        // 列表 文件列表  后台提供
        name: '',
        // 数字输入 【0， 1】
        lr: 0.001
      }
    ]
  },
  plugin_unet: {
    // 类数组 对象 可添加
    controlnet1: {
      // 不可编辑
      _target_: 'hcpdiff.models.controlnet.ControlNetPlugin',
      // 不可编辑
      _partial_: true,
      // 数字输入
      lr: 0.0001,
      // 不可编辑
      from_layers: ['pre_hook:', 'pre_hook:conv_in'],
      // 不可编辑
      to_layers: [
        'down_blocks.0',
        'down_blocks.1',
        'down_blocks.2',
        'down_blocks.3',
        'mid_block',
        'pre_hook:up_blocks.3.resnets.2'
      ]
    }
  },
  // lora_unet_default_value
  lora_unet: [
    // {
    //   // 数字输入【0， 1】
    //   lr: 0.0001,
    //   // 数字输入 【1， 100】
    //   rank: 0.01875,
    //   // 列表 【'p', 'n', null】
    //   branch: 'p',
    //   // 数字输入 【0， 1】 一位小数
    //   dropout: 0,
    //   bias: false,
    //   // 数组 每一项是文本输入
    //   layers: ['re:.*\\.attn.?$', 're:.*\\.ff$']
    // }
    // {
    //   lr: 0.0001,
    //   rank: 0.01875,
    //   branch: 'n',
    //   layers: ['re:.*\\.attn.?$', 're:.*\\.ff$']
    // },
    // {
    //   lr: 0.0001,
    //   rank: 0.01875,
    //   layers: ['re:.*\\.resnets$', 're:.*\\.proj_in$', 're:.*\\.proj_out$', 're:.*\\.conv$']
    // }
  ]
};

export const lora_unet_default_value = {
  // 数字输入【0， 1】
  lr: 0.0001,
  // 数字输入 【1， 100】
  rank: 0.01875,
  // 列表 【'p', 'n', null】
  branch: 'p',
  // 数字输入 【0， 1】 一位小数
  dropout: 0,
  bias: false,
  // 数组 每一项是文本输入
  layers: ['re:.*\\.attn.?$', 're:.*\\.ff$']
};

// lora_text_encoder 默认参数
export const default_lora_text_encoder_value = {
  lr: 0.000001,
  rank: 0.01875,
  branch: 'p',
  dropout: 0.1,
  layers: ['re:.*self_attn$', 're:.*mlp$']
};

export const default_image_transforms = {
  _target_: 'torchvision.transforms.Compose',
  transforms: [
    {
      _target_: 'torchvision.transforms.ToTensor'
    }
  ]
};

export const default_tag_transforms = {
  _target_: 'torchvision.transforms.Compose',
  transforms: [
    {
      _target_: 'hcpdiff.utils.caption_tools.TagShuffle'
    }
  ]
};

//train loss 参数
export const lossConfigKeys = [
  { label: 'min_snr', value: 'hcpdiff.loss.MinSNRLoss' },
  { label: 'mse', value: 'hcpdiff.loss.MSELoss' },
  { label: 'smooth_l1', value: 'torch.nn.SmoothL1Loss' },
  { label: 'l1', value: 'torch.nn.L1Loss' }
];
export const lossConfigs = {
  'hcpdiff.loss.MinSNRLoss': {
    _target_: 'hcpdiff.loss.MinSNRLoss',
    // 默认是2
    gamma: 2,
    _partial_: true,
    // 固定参数
    reduction: 'none'
  },
  'hcpdiff.loss.MSELoss': {
    _target_: 'hcpdiff.loss.MSELoss',
    _partial_: true,
    // 固定参数
    reduction: 'none'
  },
  'torch.nn.SmoothL1Loss': {
    _target_: 'torch.nn.SmoothL1Loss',
    _partial_: true,
    // 固定参数
    reduction: 'none'
  },
  'torch.nn.L1Loss': {
    _target_: 'torch.nn.L1Loss',
    _partial_: true,
    // 固定参数
    reduction: 'none'
  }
};

// train transforms img_transforms 参数
export const img_transformsConfigKeys = {
  'torchvision.transforms.Normalize': {
    _target_: 'torchvision.transforms.Normalize',
    // float or [float, float] 0.5
    mean: [0.5],
    // float or [float, float] 0.5
    std: [0.5]
  },
  'torchvision.transforms.ToTensor': {
    _target_: 'torchvision.transforms.ToTensor'
  },
  'torchvision.transforms.ColorJitter': {
    _target_: 'torchvision.transforms.ColorJitter',
    // float or [float, float]
    brightness: [],
    // float or [float, float]
    contrast: [],
    // float or [float, float]
    saturation: [],
    // float or [float, float]
    hue: []
  },
  'torchvision.transforms.CenterCrop': {
    _target_: 'torchvision.transforms.CenterCrop',
    // int -or [int, int],
    size: []
  },
  'torchvision.transforms.Resize': {
    _target_: 'torchvision.transforms.Resize',
    // int -or [int, int],
    size: []
  },
  'torchvision.transforms.RandomCrop': {
    _target_: 'torchvision.transforms.RandomCrop',
    // int -or [int, int],
    size: []
  },
  'torchvision.transforms.RandomGrayscale': {
    _target_: 'torchvision.transforms.RandomGrayscale',
    //  float (0-1:0.01),
    P: 0.01
  },
  'torchvision.transforms.GaussianBlur': {
    _target_: 'torchvision.transforms.GaussianBlur',
    // int -or [int, int],
    kernel_size: [3, 3],
    sigma: [0.1, 0.5]
  }
};

// train transforms tag_transforms 参数
export const tag_transformsConfigKeysOptions = [
  'hcpdiff.utils.caption_tools.TagShuffle',
  'hcpdiff.utils.caption_tools.TagDropout',
  'hcpdiff.utils.caption_tools.TemplateFill'
];
export const tag_transformsConfigKeys = {
  'hcpdiff.utils.caption_tools.TagShuffle': {
    _target_: 'hcpdiff.utils.caption_tools.TagShuffle'
  },
  'hcpdiff.utils.caption_tools.TagDropout': {
    _target_: 'hcpdiff.utils.caption_tools.TagDropout',
    // 数输入 0-1:0.01
    p: 0.1
  },
  'hcpdiff.utils.caption_tools.TemplateFill': {
    _target_: 'hcpdiff.utils.caption_tools.TemplateFill',
    // 类数组 对象 可添加
    word_names: {
      // 文本输入 【key 也允许编辑 value 也允许编辑】
      // pt1: 'word1'
    }
  }
};

// 接口状态
export const STATUS_TYPE = {
  BEGIN: 0,
  LOADING: 1,
  // 2 正常结束
  END: 2,
  // 3 手动打断
  ACTIVE_INTERRUPT: 3,
  // 4 执行失败
  UNACTIVE_INTERRUPT: 4,
  // 5 任务不存在或被删除
  DELETE_OR_NOT_EXIST: 5
};
