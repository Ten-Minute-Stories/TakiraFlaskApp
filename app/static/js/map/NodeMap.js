class Obj
{
    id = -1;
    name = '';
    actions = [];
    element = undefined;

    constructor(element)
    {
        this.SetElement(element);
    }

    AddAction(action)
    {
        this.actions.push(action);
    }

    Pick(e)
    {

    }

    SetElement(element)
    {
        element.addEventListener('click', (e) => {this.Pick(e);})
        this.element = element;
    }
}

class Action
{
    id = -1;
    name = '';
    element = undefined;
}

class Event
{
    id = -1;
    name = '';
    objects = [];
    element = undefined;

    constructor(element)
    {
        this.SetElement(element);
    }

    AddObject(obj)
    {
        this.objects.push(obj);
    }

    Pick(e)
    {
        objectsManager.SetEvent(this);
        objectsManager.Clear();
        objectsManager.Fill();
    }

    SetElement(element)
    {
        element.addEventListener('click', (e) => {this.Pick(e);})
        this.element = element;
    }
}

class Node
{
    name = '';
    text = '';
    index = -1;
    image_url = '';
    type = '';

    id = '';
    events = [];
    buttons = [];

    element = undefined;
    link_directions_element = undefined;

    links = [];

    constructor(type)
    {
        this.events = [];
        this.buttons = [];
        this.type = type;

        this.element = defaultNode.cloneNode(true);
        this.element.className = `node ${type} picked`;
        this.element.id = `node-${++maxID}`;
        this.element.childNodes[0].textContent = type;
        this.element.style.display = '';
        this.RegisterEvents();

        eventsManager.SetNode(this);
    }

    ShowLinkDirections()
    {
        this.link_directions_element = this.element.querySelector('.link-directions');
        this.link_directions_element.style.display = 'block';
        this.link_directions_element.addEventListener('mouseleave',
            (e) => {e.target.style.display = 'none';});
    }

    RegisterEvents()
    {
        this.element.addEventListener('mouseenter', () => this.ShowLinkDirections());
    }

    SetPosition(x, y)
    {
        this.element.style.left = `${x}px`;
        this.element.style.top = `${y}px`;
    }

    AddEvent(event)
    {
        this.events.push(event);
    }
}

class Map
{
    nodes = [];
    links = [];
    node_by_element = {};
    link_by_element = {};

    picked = undefined;
    linkStartNode = undefined;

    element = undefined;


    constructor()
    {
        this.nodes = [];
        this.element = document.querySelector('.nodes');

        this.element.addEventListener('mousemove', (e) => this.OnMouseMove(e));
        this.element.addEventListener('mouseup', (e) => this.OnMouseUp(e));
        this.element.addEventListener('click', (e) => this.OnMouseClick(e));
        this.element.addEventListener('mousedown', (e) => this.OnMouseDown(e));
        this.element.addEventListener('contextmenu', (e) => this.OnRightMouseClick(e));
    }

    OnMouseMove(e)
    {
        e.preventDefault();

        if (this.picked !== undefined)
        {
            if (this.isOutOfHorizontalBounds(e) || this.isOutOfVerticalBounds(e))
                return;

            let bounds = this.element.getBoundingClientRect();
            let x = e.clientX - bounds.left;
            let y = e.clientY - bounds.top;

            this.picked.SetPosition(
                x - this.picked.element.clientWidth/2,
                y - this.picked.element.clientHeight/2
            );

            let links = this.picked.links;
            for(let link of links)
                link.updatePosition();
        }
    }

    OnMouseUp(e)
    {
        e.preventDefault();
        if (this.picked !== undefined)
            this.picked = undefined;
    }

    OnMouseDown(e)
    {
        e.preventDefault();

        if (this.picked !== undefined)
        {
            this.picked = undefined;
        }
        else
        {
            let node = this.node_by_element[e.target.id];

            if (node === undefined)
                return;

            this.picked = node;

            inspector.Set(node);
            eventsManager.SetNode(node);
        }
    }

    OnMouseClick(e)
    {
        e.preventDefault();
        let node = this.node_by_element[e.target.id];

        if (node === undefined)
            return;

        inspector.Set(node);
    }

    OnRightMouseClick(e)
    {
        e.preventDefault();
        let node = this.node_by_element[e.target.id];

        if (node === undefined)
            return;

        if (this.linkStartNode === undefined)
        {
            this.linkStartNode = node;
            return;
        }

        let link = new Link(this.linkStartNode, node);
        this.links.push(link);
        this.link_by_element[link.element.id] = link;
        this.linkStartNode = undefined;
    }

    Add(type)
    {
        let node = new Node(type);
        this.element.appendChild(node.element);
        this.nodes.push(node);
        this.picked = undefined;
        this.node_by_element[node.element.id] = node;
    }

    Remove()
    {
        // TODO: Сделать удаление ноды
    }

    isOutOfHorizontalBounds(e)
    {
        let pickedNode = this.picked.element;

        let border = document.getElementsByClassName("nodes")
        let borderLeft = border[0].offsetLeft;
        let borderRight = borderLeft + border[0].offsetWidth;
        return  pickedNode.clientWidth / 2 + e.clientX < borderLeft + pickedNode.clientWidth ||
                pickedNode.clientWidth / 2 + e.clientX > borderRight;
    }

    isOutOfVerticalBounds(e)
    {
        let pickedNode = this.picked.element;

        let border = document.getElementsByClassName("nodes")
        let borderTop = border[0].offsetTop;
        let borderBottom = borderTop + border[0].offsetHeight;
        return  pickedNode.clientHeight / 2 + e.clientY < borderTop + pickedNode.clientHeight ||
                pickedNode.clientHeight / 2 + e.clientY > borderBottom;
    }
}

class Inspector
{
    selected = undefined;

    inputElements = [];

    constructor()
    {
        this.inputElements = document.querySelectorAll(".inspector-input");
        for(let inputElement of this.inputElements)
            inputElement.addEventListener('keydown', (e) => {this.onInputChanged(e);});
    }

    Set(node)
    {
        for(let inputElement of this.inputElements)
            inputElement.value = node[inputElement.id];

        this.selected = node;
    }

    onInputChanged(e)
    {
        if (this.selected === undefined) return;
        this.selected[e.target.id] = e.target.value;
    }
}

class Link
{
    startNode = null;
    endNode = null;
    element = null;

    constructor(startNode, endNode)
    {
        this.startNode = startNode;
        this.endNode = endNode;

        this.element = this.createLinkElement();
        this.updatePosition();
    }

    createLinkElement()
    {
        const linkElement = document.createElement('div');
        linkElement.className = 'link';
        map.element.appendChild(linkElement);

        this.startNode.links.push(this);
        this.endNode.links.push(this);

        return linkElement;
    }

    updatePosition()
    {
        let bounds = map.element.getBoundingClientRect();

        const startRect = this.startNode.element.getBoundingClientRect();
        const endRect = this.endNode.element.getBoundingClientRect();

        const startX = (startRect.left - bounds.left) + startRect.width / 2;
        const startY = (startRect.top - bounds.top) + startRect.height / 2;
        const endX = (endRect.left - bounds.left) + endRect.width / 2;
        const endY = (endRect.top - bounds.top) + endRect.height / 2;

        this.element.style.left = `${startX}px`;
        this.element.style.top = `${startY}px`;

        const length = Math.sqrt(Math.pow(endX - startX, 2) + Math.pow(endY - startY, 2));
        this.element.style.width = `${length}px`;

        const angle = Math.atan2(endY - startY, endX - startX);
        this.element.style.transform = `rotate(${angle}rad)`;
        this.element.style.transformOrigin = 'left';
    }
}


class EventsManager
{
    newEventButton = undefined;
    eventsBlock = undefined;
    eventsRow = undefined;
    defaultEvent = undefined;

    node = undefined;
    selectedEvent = undefined;

    eventCounter = 0;

    constructor()
    {
        this.eventsRow = document.querySelector('#events-row');
        this.eventsBlock = document.querySelector('.events');
        this.newEventButton = document.querySelector('#new-event');
        this.defaultEvent = document.querySelector('#default-event').cloneNode(true);

        this.newEventButton.addEventListener('click', (e) => {this.NewEvent(e);});
    }

    SetNode(node)
    {
        while (this.eventsBlock.firstChild)
            this.eventsBlock.removeChild(this.eventsBlock.firstChild);
        objectsManager.Clear();

        if (node === undefined || node === null)
        {
            this.eventsRow.classList.add('unavailable');
            return;
        }

        this.eventsRow.classList.remove('unavailable');

        for(let event of node.events)
        {
            let eventNode = this.defaultEvent.cloneNode(true);
            this.eventsBlock.appendChild(eventNode);
            event.SetElement(eventNode);
        }

        this.node = node;
    }

    NewEvent(e)
    {
        if (this.node === undefined || this.node === null)
            return;

        let newEventNode = this.defaultEvent.cloneNode(true);
        this.eventsBlock.appendChild(newEventNode);
        let newEvent = new Event(newEventNode);
        newEvent.id = this.eventCounter++;
        this.node.AddEvent(newEvent);
        this.selectedEvent = newEvent;
        objectsManager.SetEvent(newEvent);
    }
}

class ObjectsManager
{
    newObjectButton = undefined;
    objectsBlock = undefined;
    objectsRow = undefined;
    defaultObject = undefined;

    event = undefined;
    selectedObject = undefined;

    objectCounter = 0;

    constructor()
    {
        this.objectsRow = document.querySelector('#objects-row');
        this.objectsBlock = document.querySelector('.objects');
        this.newObjectButton = document.querySelector('#new-object');
        this.defaultObject = document.querySelector('#default-object').cloneNode(true);

        this.newObjectButton.addEventListener('click', (e) => {this.NewObject(e);});
    }

    SetEvent(event)
    {
        this.Clear();

        if (event === undefined || event === null)
        {
            this.objectsRow.classList.add('unavailable');
            return;
        }

        this.objectsRow.classList.remove('unavailable');
        this.event = event;
        this.Fill();
    }

    NewObject(e)
    {
        if (this.event === undefined || this.event === null)
            return;

        let newObjectNode = this.defaultObject.cloneNode(true);
        this.objectsBlock.appendChild(newObjectNode);

        let newObject = new Obj(newObjectNode);
        newObject.id = this.objectCounter++;
        this.event.AddObject(newObject);
        this.selectedObject = newObject;
    }

    Clear()
    {
        while (this.objectsBlock.firstChild)
            this.objectsBlock.removeChild(this.objectsBlock.firstChild);
    }

    Fill()
    {
        for(let obj of this.event.objects)
        {
            let objNode = this.defaultObject.cloneNode(true);
            this.objectsBlock.appendChild(objNode);
            obj.SetElement(objNode);
        }
    }
}

class ActionsManager
{
    newActionButton = undefined;
    actionsBlock = undefined;
    actionsRow = undefined;
    defaultAction = undefined;

    obj = undefined;
    selectedAction = undefined;

    actionCounter = 0;

    constructor()
    {
        this.actionsRow = document.querySelector('#actions-row');
        this.actionsBlock = document.querySelector('.actions');
        this.newActionButton = document.querySelector('#new-action');
        this.defaultAction = document.querySelector('#default-action').cloneNode(true);

        this.newActionButton.addEventListener('click', (e) => {this.NewAction(e);});
    }

    SetObject(obj)
    {
        this.Clear();

        if (obj === undefined || obj === null)
        {
            this.actionsRow.classList.add('unavailable');
            return;
        }

        this.actionsRow.classList.remove('unavailable');
        this.obj = obj;
        this.Fill();
    }

    NewAction(e)
    {
        if (this.obj === undefined || this.obj === null)
            return;

        let newActionNode = this.defaultAction.cloneNode(true);
        this.actionsBlock.appendChild(newActionNode);

        let newAction = new Obj(newActionNode);
        newAction.id = this.actionCounter++;
        this.obj.AddObject(newObject);
        this.selectedAction = newObject;
    }

    Clear()
    {
        while (this.actionsBlock.firstChild)
            this.actionsBlock.removeChild(this.actionsBlock.firstChild);
    }

    Fill()
    {
        for(let action of this.obj.actions)
        {
            let actionNode = this.defaultAction.cloneNode(true);
            this.actionsBlock.appendChild(actionNode);
            action.SetElement(actionNode);
        }
    }
}


let zIndex = 0;
let maxID = 0;

export const defaultNode = document.querySelector("#default-node");
const links = document.querySelector('.links');

const map = new Map();
const inspector = new Inspector();

const eventsManager = new EventsManager();
const objectsManager = new ObjectsManager();
const actionsManager = new ActionsManager();