import subprocess
from threading import Thread

from utils import decode_data

class TrainSecession:
    def __init__(self):
        self.steps = [1, 1]
        self.p = None

    def analysis_prog(self, line):
        st = line.find('Step =')
        if st != -1:
            info = line[st+8:line.find(']', st+8)].split('/')
            self.steps = [int(info[0]), int(info[1])]

    @property
    def progress(self):
        if self.p is None:
            return [1, 1]
        else:
            return self.steps

    @property
    def progress_rate(self):
        if self.p is None:
            return 100
        else:
            return self.steps[0]/self.steps[1]

    def state_monitor(self):
        while self.p.poll() is None:
            line = self.p.stdout.readline().strip()
            if line:
                line = decode_data(line)
                self.analysis_prog(line)

    def start(self, cmd, shell=False):
        self.p = subprocess.Popen(cmd, shell=shell, stdout=subprocess.PIPE, stderr=subprocess.STDOUT)
        Thread(target=self.state_monitor).start()

    def stop(self):
        self.p.terminate()
        self.p.wait()
