const newEvent = document.querySelector("#new-event");
const newObject = document.querySelector("#new-object");
const newAction = document.querySelector("#new-action");

const events = document.querySelector(".events");
const objects = document.querySelector(".objects");
const actions = document.querySelector(".actions");

const objectsRow = document.querySelector("#objects-row");
const actionsRow = document.querySelector("#actions-row");

const defaultEvent = document.querySelector("#default-event").cloneNode(true);
const defaultObject = document.querySelector("#default-object").cloneNode(true);
const defaultAction = document.querySelector("#default-action").cloneNode(true);

const defaultObjects = document.querySelector("#default-objects").cloneNode(true);
const defaultActions = document.querySelector("#default-actions").cloneNode(true);

for (let def of [defaultEvent, defaultObject, defaultAction])
{
    def.id = '';
    def.style.display = "";
}

let currentEvent = undefined;
let currentObject = undefined;
let currentObjects = undefined;
let currentAction = undefined;
let currentActions = undefined;

let currentEventID = -1;
let currentObjectID = -1;
let currentObjectsID = -1;
let currentActionID = -1;
let currentActionsID = -1;

let eventCount = 0;
let objectsCount = 0;
let objectCount = 0;
let actionsCount = 0;
let actionCount = 0;

function RegisterKeyUp(node)
{
    node.addEventListener('keyup', (e) =>
    {
        if (e.key === "Enter")
        {
            let newEventLabel = document.createElement('span');
            newEventLabel.textContent = e.target.value;
            node.querySelector('.group').appendChild(newEventLabel);
            e.target.value = '';
        }
    });
}

function RegisterEventClick(Node)
{
    Node.addEventListener('click', () =>
    {
        for (let eventObject of objects.querySelectorAll(".event-objects"))
            eventObject.style.display = "none";

        for (let objectAction of actions.querySelectorAll(".object-actions"))
            objectAction.style.display = "none";

        for (let selected of events.querySelectorAll('.selected'))
            selected.className = selected.className.replaceAll(' selected', '');

        currentEvent = Node;
        currentEventID = Number(Node.id.split('-')[1]);
        currentObjects = Node.linked;
        currentObjects.style.display = '';

        Node.className += " selected";
        actionsRow.className = 'unavailable';
    });
}

function RegisterObjectClick(Node)
{
    Node.addEventListener('click', (e) =>
    {
        for (let objectAction of actions.querySelectorAll(".object-actions"))
            objectAction.style.display = "none";

        for (let selected of currentObjects.querySelectorAll('.selected'))
            selected.className = selected.className.replaceAll(' selected', '');

        currentObject = Node;
        currentObjectsID = Number(Node.id.split('-')[1]);
        currentActions = Node.linked;
        currentActions.style.display = "";

        actionsRow.className = '';
        Node.className += " selected";
    });
}


function CreateEvent()
{
    let eventID = "event-" + eventCount;
    let newEventNode = defaultEvent.cloneNode(true);
    newEventNode.id = eventID;
    events.appendChild(newEventNode);
    eventCount++;

    for (let eventObject of objects.querySelectorAll(".event-objects"))
        eventObject.style.display = "none";

    let objectsID = "objects-" + objectsCount;
    let newObjects = defaultObjects.cloneNode(true);
    objectsCount++;

    newObjects.id = objectsID;
    newObjects.style.display = '';
    newEventNode.linked = newObjects;
    objects.appendChild(newObjects);
    currentObjects = newObjects;

    RegisterEventClick(newEventNode);
    RegisterKeyUp(newEventNode);

    objectsRow.className = '';
    actionsRow.className = 'unavailable';

    for (let selected of events.querySelectorAll('.selected'))
        selected.className = selected.className.replaceAll(' selected', '');

    newEventNode.className += " selected";
}

function CreateObject()
{
    let newObjectID = "object-" + objectCount;
    let newObjectNode = defaultObject.cloneNode(true);
    newObjectNode.id = newObjectID;
    currentObjects.appendChild(newObjectNode);
    objectCount++;

    for (let objectAction of actions.querySelectorAll(".object-actions"))
        objectAction.style.display = "none";

    let actionsID = "actions-" + actionsCount;
    let newActions = defaultActions.cloneNode(true);
    newActions.id = actionsID;
    newObjectNode.linked = newActions;
    actions.appendChild(newActions);
    actionsCount++;

    currentActions = newActions;
    currentObject = newObjectNode;
    currentObjectsID = newObjectID;

    RegisterObjectClick(newObjectNode);
    RegisterKeyUp(newObjectNode);

    actionsRow.className = '';
    currentActions.style.display = '';

    for (let selected of currentObjects.querySelectorAll('.selected'))
        selected.className = selected.className.replaceAll(' selected', '');

    newObjectNode.className += " selected";
}

function CreateAction()
{
    let actionID = "action-" + actionCount;
    let newActionNode = defaultAction.cloneNode(true);
    newActionNode.id = actionID;
    currentActions.appendChild(newActionNode);
    actionCount++;

    newActionNode.addEventListener('click', (e) =>
    {
        for (let selected of currentActions.querySelectorAll('.selected'))
            selected.className = selected.className.replaceAll(' selected', '');

        currentAction = newActionNode;
        currentActionID = actionID;
        newActionNode.className += " selected";
    });

    for (let selected of currentActions.querySelectorAll('.selected'))
        selected.className = selected.className.replaceAll(' selected', '');

    newActionNode.className += " selected";
    RegisterKeyUp(newActionNode);
}

function Remove(obj)
{
    const parent = obj.parentNode;
    parent.parentNode.removeChild(parent);
}

function SaveQuest(questID)
{
    const eventsData = [];
    const objectsData = [];
    const actionsData = [];

    const datas = [eventsData, objectsData, actionsData];
    const selectors = ['.event', '.object', '.action'];

    for (let i = 0; i < 3; i++)
    {
        for (let data of document.querySelectorAll(selectors[i]))
        {
            if (data.id.startsWith('default')) continue;

            let group = [];
            for (let span of data.querySelector('.group').childNodes)
                group.push(span.textContent);

            console.log(data);
            datas[i].push({
                'ID': data.id,
                'Group': group,
                'Linked': data.linked !== undefined ? data.linked.id : ''
            });
        }
    }

    window.location.href =
      "/action/save/events/" + questID + "?" +
      "events=" + encodeURIComponent(JSON.stringify(eventsData)) + "&" +
      "objects=" + encodeURIComponent(JSON.stringify(objectsData)) + "&" +
      "actions=" + encodeURIComponent(JSON.stringify(actionsData));
}

for (let obj of document.querySelectorAll(".loaded"))
{
    let link = obj.querySelector('linked');
    if (obj.querySelector('linked') !== null)
    {
        let linker;

        if (obj.className.startsWith('event'))
        {
            linker = defaultObjects.cloneNode(true);
            objects.appendChild(linker);
        }

        if (obj.className.startsWith('object')) {
            linker = defaultActions.cloneNode(true);
            actions.appendChild(linker);
        }

        linker.id = link.textContent;
        linker.style.display = 'none';

        obj.linked = linker;
        obj.removeChild(link);
    }

    if (obj.className.startsWith('event')) {RegisterEventClick(obj);}
    else if (obj.className.startsWith('object')) {RegisterObjectClick(obj);}
}