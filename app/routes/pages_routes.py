import random
from flask import render_template, redirect, request
from app import app, quests, selected_act


@app.route("/")
def quests_page():
    global selected_act
    if "act" in request.values:
        selected_act = int(request.values['act'])
    else:
        selected_act = 1
    return render_template("Quests.html", quests=quests, selected_act=selected_act)


@app.route("/quest/<string:quest_id>")
@app.route("/quest/<string:quest_id>/")
@app.route("/quest/<string:quest_id>/passport")
@app.route("/quest/<string:quest_id>/passport/")
def passport_page(quest_id):
    if quest_id not in quests:
        return redirect("/")
    return render_template("Passport.html", quest=quests[quest_id])


@app.route("/quest/<string:quest_id>/conditions")
@app.route("/quest/<string:quest_id>/conditions/")
def conditions_page(quest_id):
    if quest_id not in quests:
        return redirect("/")
    return render_template("Conditions.html", quest=quests[quest_id])


@app.route("/quest/<string:quest_id>/flags")
@app.route("/quest/<string:quest_id>/flags/")
def flags_page(quest_id):
    if quest_id not in quests:
        return redirect("/")
    return render_template("Flags.html", quest=quests[quest_id])


@app.route("/quest/<string:quest_id>/export")
@app.route("/quest/<string:quest_id>/export/")
def export_page(quest_id):
    if quest_id not in quests:
        return redirect("/")
    return render_template("Export.html", quest=quests[quest_id])


@app.route("/quest/<string:quest_id>/map")
@app.route("/quest/<string:quest_id>/map/")
def map_page(quest_id):
    if quest_id not in quests:
        return redirect("/")
    return render_template("Map.html", quest=quests[quest_id])


@app.route("/quest/<string:quest_id>/events/<string:node_id>")
@app.route("/quest/<string:quest_id>/events/<string:node_id>/")
def events_page(quest_id, node_id):
    return ""


@app.errorhandler(404)
def page_not_found(error):
    return render_template('404.html'), 404
