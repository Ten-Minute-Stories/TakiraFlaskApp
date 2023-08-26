import json
import uuid

from flask import redirect, request, send_file
from app import app, quests
from app.models.quest import Quest


@app.route("/action/new_quest")
def new_quest_action():
    quest = Quest(uuid.uuid4())
    quest_id = quest.uid
    quests[quest_id] = quest
    return redirect(f"/quest/{quest_id}/")


@app.route("/action/save/events/<string:quest_id>")
def save_events_action(quest_id):
    if quest_id not in quests:
        return redirect("/")
    quest = quests[quest_id]
    quest.events = json.loads(request.values['events'])
    quest.objects = json.loads(request.values['objects'])
    quest.actions = json.loads(request.values['actions'])
    quest.save()
    return redirect(f"/quest/{quest_id}/map")


@app.route("/action/save/passport/<string:quest_id>")
def save_quest_action(quest_id):
    if quest_id not in quests:
        return redirect("/")
    quest = quests[quest_id]
    quest.name = request.values['name']
    quest.description = request.values['desc']
    quest.act = int(request.values['act'])
    quest.world_rate = int(request.values['world_rate'])
    quest.generate_images = bool(request.values['generate_images'])
    quest.save()
    return redirect(f"/quest/{quest_id}/")


@app.route("/export/<string:quest_id>/<string:format>")
def export_quest_action(quest_id, format):
    if quest_id not in quests:
        return redirect("/")
    quest = quests[quest_id]
    quest.save()
    return send_file(f"data/{quest.uid}.{format}")
