import pickle
import random
import uuid


class Quest:
    uid: str
    name: str
    description: str
    author: str
    tags: list[str]
    act: int
    is_generative_images: bool
    world_rate: int

    events: list
    objects: list
    actions: list

    def __init__(self, name):
        self.name = name
        self.uid = str(uuid.uuid4())
        self.description = ""
        self.author = "Test"
        self.tags = []
        self.act = 1
        self.is_generative_images = False
        self.world_rate = random.randint(100, 999)
        self.events = []
        self.objects = []
        self.actions = []

    def log(self):
        print(self.name)
        print(self.uid)
        print(self.author)
        print(self.events)
        print(self.objects)
        print(self.actions)

    def save(self):
        pickle.dump(self, open(f"app/data/{self.uid}.etw", "wb"))
        pickle.dump(self, open(f"app/data/{self.uid}.tw", "wb"))
