import {eventsManager, defaultNode} from "./NodeMap.js";

const maxDisplayNameLength = 12;

let maxID = 0;

export class Node
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

    x = 0;
    y = 0;

    constructor(type)
    {
        this.events = [];
        this.buttons = [];
        this.type = type;
        this.maxID = 0;

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
//        this.link_directions_element = this.element.querySelector('.link-directions');
//        this.link_directions_element.style.display = 'block';
//        this.link_directions_element.addEventListener('mouseleave',
//            (e) => {e.target.style.display = 'none';});
    }

    RegisterEvents()
    {
        this.element.addEventListener('mouseenter', () => this.ShowLinkDirections());
    }

    SetPosition(x, y)
    {
        this.x = x;
        this.y = y;
        this.element.style.left = `${x}px`;
        this.element.style.top = `${y}px`;
    }

    AddEvent(event)
    {
        this.events.push(event);
    }

    UpdateDisplayName()
    {
        let value = this.name;
        if (value.length >= maxDisplayNameLength) {value = value.slice(0, maxDisplayNameLength);}
        this.element.querySelector('.node-name').textContent = value;
    }
}
