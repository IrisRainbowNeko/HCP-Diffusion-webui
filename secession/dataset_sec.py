from threading import Thread

from hcpdiff.tools.gen_from_ptlist import DatasetCreator

class DatasetSecession:
    def __init__(self):
        self.progress = [0, 1]
        self.make_stop = False

    def progress_callback(self, count, total):
        self.progress = count, total
        if self.make_stop:
            self.make_stop = False
            return False
        else:
            return True

    @property
    def progress_rate(self):
        return self.progress[0]/self.progress[1]

    def interrupt(self):
        self.make_stop = True

    def _create_dataset(self, pretrained_model, prompt_file: str, negative_prompt: str, out_dir: str, bs: int, num: int):
        ds_creator = DatasetCreator(pretrained_model)
        ds_creator.create_from_prompt_dataset(prompt_file, negative_prompt, out_dir, bs, num, callback=self.progress_callback)

    def create_dataset(self, pretrained_model, prompt_file: str, negative_prompt: str, out_dir: str, bs: int, num: int):
        Thread(target=self._create_dataset, args=(pretrained_model, prompt_file, negative_prompt, out_dir, bs, num)).start()
