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