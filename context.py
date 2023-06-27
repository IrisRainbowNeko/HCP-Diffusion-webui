from flask import Flask, render_template

app = Flask(__name__,
            static_folder='../dist',  #设置静态文件夹目录
            template_folder = "../dist",
            static_url_path="")

@app.route("/")
def root():
    return render_template("index.html", name='index')