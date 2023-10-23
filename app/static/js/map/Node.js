import {eventsManager, defaultNode} from "./NodeMap.js";

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
