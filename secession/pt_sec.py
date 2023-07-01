from threading import Thread

from hcpdiff.tools.create_embedding import PTCreator

class PTSecession:

    def _create_pt(self, pretrained_model_name_or_path, name, n_word, init_text, replace):
        if not hasattr(self, 'pt_creator'):
            self.pt_creator = PTCreator(pretrained_model_name_or_path)

        self.pt_creator.creat_word_pt(name, n_word, init_text, replace)

    def create_pt(self, pretrained_model_name_or_path, name, n_word, init_text, replace):
        Thread(target=self._create_pt, args=(pretrained_model_name_or_path, name, n_word, init_text, replace)).start()
