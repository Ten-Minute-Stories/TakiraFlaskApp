import glob
import pickle

from flask import Flask


def find_files_with_extension(folder_path, extension):
    search_pattern = folder_path + '/*.' + extension
    files = glob.glob(search_pattern)
    return files


app = Flask(__name__)
quests = {}
selected_act = 1


selected_quest = None

folder_path = 'app/data'
extension = 'etw'

files_with_extension = find_files_with_extension(folder_path, extension)
for file in files_with_extension:
    quest = pickle.load(open(file, "rb"), encoding="utf-8")
    quests[quest.uid] = quest
    quest.log()

from .routes.actions_routes import *
from .routes.pages_routes import *
