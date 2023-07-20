import os
import time

def create_sn():
    return time.time_ns()//(10**6)

def proc_model_path(path_list):
    return [{'label':os.path.basename(path), 'value':path} for path in path_list]

def decode_data(byte_data: bytes):
    try:
        return byte_data.decode('UTF-8')
    except UnicodeDecodeError:
        return byte_data.decode('GB18030')

def wrap_response(data):
    return {'code':0, 'status':'success', 'data':data}

def get_paths(dirPath, fileTypes, dropSuffix=False):
    path_list = []
    for file in os.listdir(dirPath):
        path = os.path.join(dirPath, file)
        if fileTypes=='dir':
            if os.path.isdir(path):
                path_list.append({'label':file, 'value':path})
        else:
            name, ext = file.rsplit('.', 1)
            if ext in fileTypes:
                if dropSuffix:
                    path_list.append({'label': file.rsplit('.', 1)[0], 'value': path.rsplit('.', 1)[0]})
                else:
                    path_list.append({'label': file, 'value': path})
    return path_list
