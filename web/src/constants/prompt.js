export default {
  yaml_template: '推理用配置文件模板(cfgs/infer目录下的文件)',
  pretrained_model: '预训练模型(diffusers格式)',
  generate: {
    prompt: '正面文本描述',
    neg_prompt: '负面文本描述',
    pretrained_model: '预训练模型(diffusers格式)',
    out_dir: '图片输出目录',
    emb_dir: 'embedding文件目录(自定义单词)',
    N_repeats: '句子长度拓展倍数(一倍是75个单词)',
    clip_skip: 'CLIP跳过层数(从0开始!! 不是从1开始!!)',
    bs: 'batch size',
    num: '生成几批',
    seed: '随机种子(相同种子生成的图相同)',
    dtype: '推理精度',
    condition: {
      type: '条件类型',
      image: '条件图像文件路径',
      mask: '图像蒙版文件'
    },
    save: {
      save_cfg: '是否保存生成配置文件',
      image_type: '输出图像格式',
      quality: '输出图像质量'
    },
    offload: {
      max_VRAM: '最大使用显存',
      max_RAM: '最大使用内存',
      vae_cpu: '是否把VAE放到cpu上推理(不用显卡推理)'
    },
    infer_args: {
      width: '图像宽度',
      height: '图像高度',
      guidance_scale: 'CFG引导强度 [负+CFG*(正-负)]',
      num_inference_steps: '迭代步数(越多越精细)',
      strength: '加噪强度(强度越高改变幅度越大)'
    },
    new_components: {
      schedulerTip: '采样器配置',
      scheduler: {
        _target_: '采样器类型',
        beta_start: 'β起始值(不懂论文不要动)',
        beta_end: 'β结束值(不懂论文不要动)',
        beta_schedule: 'β变化函数(不懂论文不要动)'
      },
      vaeTip: 'VAE编解码器配置',
      vae: {
        _target_: 'VAE类的python路径',
        pretrained_model_name_or_path: 'VAE模型路径 (diffusers格式)'
      }
    },
    merge: {
      groupTip:
        '把训练好的模型添加到基础大模型上，包括part(模型部分层训练的参数),lora,plugin(自定义插件，比如controlnet)',
      group: {
        type: '添加到unet还是text encoder上',
        base_model_alpha: '基础模型的权重 (可用于模型融合)',
        loraTip: 'lora插件配置',
        lora: {
          path: 'lora模型文件路径',
          alpha: 'lora的权重',
          layers: '把哪些层加进来，all表示全部层',
          mask: '把lora加到正分支还是负分支，或者两个分支一起'
        },
        partTip: '模型部分层参数融合配置',
        part: {
          path: '模型文件路径',
          alpha: '融合权重'
        },
        pluginTip: '自定义插件配置',
        plugin: {
          controlnet: {
            path: '插件路径',
            layers: '把哪些层加进来'
          }
        }
      }
    }
  },
  train: {
    exp_dir: '模型输出文件夹',
    mixed_precision: '混合精度训练类型',
    allow_tf32: '是否开启tf32训练',
    seed: '随机种子',
    ckpt_type: '输出模型文件格式',
    modelTip: '模型参数配置',
    model: {
      enable_xformers: '开启xformers (可以减少显存占用，加快速度)',
      gradient_checkpointing: '开启梯度分段计算 (大幅减少显存占用，但会变慢)',
      revision: '版本',
      pretrained_model_name_or_path: '预训练模型路径',
      tokenizer_name: '事例文本',
      tokenizer_repeats: '拓展句子长度倍数',
      ema_unet: 'unet部分ema模型参数 (0为关闭)',
      ema_text_encoder: 'text encoder部分ema模型参数 (0为关闭)',
      clip_skip: 'CLIP跳过层数(从0开始!! 不是从1开始!!)',
      noise_scheduler: {
        _target_: '噪声生成器类型',
        _partial_: '事例文本'
      }
    },
    tokenizer_ptTip: 'embedding(自定义单词)训练配置',
    tokenizer_pt: {
      emb_dir: 'embedding文件路径',
      replace: '是否替换原有文件',
      trainTip: '单词训练参数配置',
      train: {
        name: '自定义单词名',
        lr: '学习率'
      }
    },
    trainTip: '模型训练参数配置',
    train: {
      train_steps: '训练总步数',
      gradient_accumulation_steps: '梯度累积步数',
      workers: '加载数据的线程数量',
      max_grad_norm: '梯度剪裁范围',
      set_grads_to_none: '清空梯度时，是否设置成none',
      save_step: '每隔多少步存一次',
      cfg_scale: '引导强度 (用于DreamArtist系列训练)',
      resume: '接着训练',
      lossTip: '损失函数配置',
      loss: {
        criterion: '损失函数类型',
        type: 'DDPM预测类型 (不用改)',
        gamma: 'min_snr loss的超参数'
      },
      optimizerTip: '模型参数化器配置',
      optimizer: {
        type: '优化器类型',
        weight_decay: 'weight decay (L2正则化)'
      },
      optimizer_ptTip: 'embedding优化器配置',
      optimizer_pt: {
        type: '优化器类型',
        weight_decay: 'weight decay (L2正则化)'
      },
      scale_lr: '是否根据batch size自动缩放学习率',
      schedulerTip: '学习率调整器配置 (学习率曲线见文档)',
      scheduler: {
        name: '学习率调整器类型',
        num_warmup_steps: 'warmup的步数',
        num_training_steps: '训练总步数',
        scheduler_kwargs: '其他参数'
      },
      scale_lr_pt: '是否根据batch size自动缩放embedding学习率',
      scheduler_ptTip: '学习率调整器配置 (学习率曲线见文档)',
      scheduler_pt: {
        name: '学习率调整器类型',
        num_warmup_steps: 'warmup的步数',
        num_training_steps: '训练总步数',
        scheduler_kwargs: '其他参数'
      }
    },
    unetTip: '配置需要训练的unet层',
    unet: {
      lr: '这一组参数的学习率',
      layers: '这一组训练哪些层，根据层的名字匹配 (模型结构见cfgs/unet_struct.txt)(支持正则表达式)'
    },
    text_encoderTip: '配置需要训练的text encoder层',
    text_encoder: {
      lr: '这一组参数的学习率',
      layers: '这一组训练哪些层，根据层的名字匹配 (模型结构见cfgs/te_struct.txt)(支持正则表达式)'
    },
    lora_unetTip: '配置unet部分的lora',
    lora_unet: {
      lr: '学习率',
      rank: 'rank为整数则固定rank值；为小数则根据所在层输出维度，按比例给rank',
      branch: '配置正负分支 (DreamArtist系列)',
      dropout: 'dropout概率，可以减少过拟合',
      layers: '给哪些层加lora，根据层的名字匹配 (模型结构见cfgs/unet_struct.txt)(支持正则表达式)'
    },
    lora_text_encoderTip: '配置text encoder部分的lora',
    lora_text_encoder: {
      lr: '学习率',
      rank: 'rank为整数则固定rank值；为小数则根据所在层输出维度，按比例给rank',
      branch: '配置正负分支 (DreamArtist系列)',
      dropout: 'dropout概率，可以减少过拟合',
      layers: '给哪些层加lora，根据层的名字匹配 (模型结构见cfgs/te_struct.txt)(支持正则表达式)'
    },
    plugin_unetTip: 'unet部分插件配置',
    plugin_unet: {
      controlnetTip: '插件名称(不能重复)',
      controlnet: {
        _target_: '插件类型',
        _partial_: '事例文本',
        lr: '插件部分学习率',
        from_layers: '从哪些层输入',
        to_layers: '输出到哪些层'
      }
    },
    plugin_TETip: 'text encoder部分插件配置',
    plugin_TE: {
      controlnetTip: '插件名称(不能重复)',
      controlnet: {
        _target_: '插件类型',
        _partial_: '事例文本',
        lr: '插件部分学习率',
        from_layers: '从哪些层输入',
        to_layers: '输出到哪些层'
      }
    },
    dataTip: '数据集配置',
    data: {
      datasetTip: '数据集配置 (可以配置多个并行数据集，每个step各抽一个batch)',
      dataset: {
        _target_: '数据集类型',
        _partial_: '事例文本',
        batch_size: '这部分数据集的batch_size',
        loss_weight: '这部分数据集的loss占比',
        cache_latents: '是否提前用VAE编码图像特征 (数据增强只会做一次)',
        att_mask_encode: '用VAE的self-attention编码注意力图',
        bucketTip: 'bucket配置 (bucket确定数据怎么分组)',
        bucket: {
          _target_: 'bucket的类型',
          target_areaTip: '目标图像面积',
          target_area: {
            _target_: '事例文本',
            _args_: '事例文本'
          },
          num_bucket: '用多少个桶',
          target_size: '目标尺寸'
        },
        sourceTip: '数据源配置，一个数据集可以有多个数据源',
        source: {
          data_sourceTip: '数据源',
          data_source: {
            img_root: '图像文件夹',
            prompt_template: 'prompt模板',
            caption_file: '图像标注文件',
            att_mask: '注意力图文件夹，改变模型学习的关注点',
            bg_color: '背景填充色',
            image_transformsTip: '图像变换和增强',
            image_transforms: {
              _target_: '变换类型',
              transformsTip: '图像变化配置',
              transforms: {
                _target_: '变换类型',
                mean: 'mean',
                std: 'std',
                size: 'size',
                p: 'p',
                brightness: 'brightness',
                contrast: 'contrast',
                saturation: 'saturation',
                hue: 'hue',
                kernel_size: 'kernel_size',
                sigma: 'sigma'
              }
            },
            tag_transformsTip: '文本变换和增强',
            tag_transforms: {
              _target_: '文本变换类型',
              transformsTip: '变换配置',
              transforms: {
                // 不可编辑
                _target_: '文本变换类型',
                p: '删除词的概率(按","分割)',
                word_names: '填充词',
                size: '事例文本'
              }
            }
          }
        }
      }
    }
  },
  dataset: {
    out_dir: '输出文件夹',
    prompt_file: 'prompt数据库'
  },
  pt: {
    word_name: '自定义单词名',
    length_of_word: '单词长度',
    init_text: '初始化文本 (*std 为用std大小的标准差随机初始化) '
  }
};
