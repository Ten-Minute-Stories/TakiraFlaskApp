import {actionsManager} from "./NodeMap.js";

export class Element
{
    id = -1;
    name = '';
    element = undefined;
    input = undefined;
    groupBlock = undefined;
    objects = [];
    group = [];

    constructor(element)
    {
        this.SetElement(element);
    }

    Add(el)
    {
        this.objects.push(el);
    }

    Pick(e)
    {
        actionsManager.SetObject(this);
        actionsManager.Clear();
        actionsManager.Fill();
    }

    Input(e)
    {
        if (e.key === "Enter")
        {
            this.NewGroupObject(e.target.value);
            this.group.push(e.target.value);
            e.target.value = '';
        }
    }

    NewGroupObject(value)
    {
        let newEventLabel = document.createElement('span');
        newEventLabel.textContent = value;
        this.groupBlock.appendChild(newEventLabel);
    }

    SetElement(element)
    {
        element.addEventListener('click', (e) => {this.Pick(e);})
        this.element = element;
        this.input = element.querySelector('input');
        this.groupBlock = element.querySelector('.group');
        this.input.addEventListener('keyup', (e) => {this.Input(e);})

        for(let gr of this.group)
            this.NewGroupObject(gr);
    }
}
