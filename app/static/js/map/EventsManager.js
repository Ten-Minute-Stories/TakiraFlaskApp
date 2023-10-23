import {objectsManager} from "./NodeMap.js";
import { Event } from "./Event.js";

export class EventsManager
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

    destroy()
    {
        
    }
}