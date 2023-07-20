# view

## Project setup

```
npm install
```

### Compiles and hot-reloads for development

```
npm run serve
```

### Compiles and minifies for production

```
npm run build
```

### Lints and fixes files

```
npm run lint
```

### Customize configuration

See [Configuration Reference](https://cli.vuejs.org/config/).

accelerate launch -m hcpdiff.train_ac_single --cfg cfgs/train/shuimoma.yaml

python -m hcpdiff.visualizer --cfg cfgs/infer/text2img.yaml prompt='apple' neg_prompt='bad quality' pretrained_model=runwayml/stable-diffusion-v1-5
