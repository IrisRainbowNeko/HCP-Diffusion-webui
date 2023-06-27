import os

def list_files(root):
    return [os.path.join(root, x) for x in os.listdir(root)]

def proc_model_path(path_list):
    return [{'label':os.path.basename(path), 'value':path} for path in path_list]