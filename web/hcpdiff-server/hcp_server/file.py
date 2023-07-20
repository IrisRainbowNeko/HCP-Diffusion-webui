from hcp_server.context import app
from flask import Response, request
import io
import os
from PIL import Image
from constant import IMG_SAVE_ROOT, TMP_ROOT, INDEX_PATH
from loguru import logger
from utils import wrap_response, get_paths

API_PREFIX = '/api/v1/file'

@app.route("/image/<image_name>")
def get_image(image_name):
    img = Image.open(os.path.join(IMG_SAVE_ROOT, image_name)).convert('RGB')
    img_byte = io.BytesIO()
    img.save(img_byte, format='WEBP', quality=90)
    return Response(img_byte.getvalue(), mimetype="image/webp")

@app.route(API_PREFIX+"/upload", methods=["POST"])
def upload():
    f = request.files['file']
    logger.info(f'upload: {f.filename}')
    f.save(os.path.join(TMP_ROOT, f.filename))
    return wrap_response({
        'url': os.path.join(TMP_ROOT, f.filename)
    })

@app.route(API_PREFIX+"/dir", methods=["GET"])
def get_files():
    name = request.args.get("path", default='')

    return wrap_response({
        'files': get_paths(**INDEX_PATH[name])
    })
