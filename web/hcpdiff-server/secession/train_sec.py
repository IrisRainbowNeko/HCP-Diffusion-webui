import subprocess
from threading import Thread

from utils import decode_data
from loguru import logger
import sys
import os
import signal

class TrainSecession:
    def __init__(self):
        self.steps = [1, 10000]
        self.p = None

    def analysis_prog(self, line):
        st = line.find('Step =')
        if st != -1:
            info = line[st+8:line.find(']', st+8)].split('/')
            self.steps = [int(info[0]), int(info[1])]

    @property
    def progress(self):
        if self.p is None:
            return [1, 10000]
        else:
            return self.steps

    @property
    def progress_rate(self):
        if self.p is None:
            return 100
        else:
            return (self.steps[0]/self.steps[1])*100

    def state_monitor(self):
        while self.p.poll() is None:
            line = self.p.stdout.readline().strip()
            if line:
                line = decode_data(line)
                print(line)
                self.analysis_prog(line)

    def start(self, cmd, shell=True):
        python_dir = os.path.dirname(sys.executable)
        if os.path.basename(python_dir) == 'Scripts': #win
            venv_cmd = os.path.join(python_dir, "activate.bat")
        else:
            venv_cmd = f"source {os.path.join(python_dir, 'activate')}"

        self.p = subprocess.Popen(f'call {venv_cmd} && {cmd}', shell=shell, stdout=subprocess.PIPE, stderr=subprocess.STDOUT)
        Thread(target=self.state_monitor).start()

    def stop(self):
        os.kill(self.p.pid, signal.CTRL_C_EVENT)
        self.p = None
        self.steps = [10, 10]
        #self.p.kill()
        #self.p.wait()
