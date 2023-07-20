from flask import Flask, render_template
from constant import SERVER_ROOT
import os

app = Flask(__name__,
            static_folder=os.path.join(SERVER_ROOT, '../dist'),  #设置静态文件夹目录
            template_folder = os.path.join(SERVER_ROOT, "../dist"),
            static_url_path="")

@app.route("/")
def root():
    return render_template("index.html", name='index')
