import {actionsManager} from "./NodeMap.js";
import { Obj } from "./Obj.js"

export class ObjectsManager
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
        actionsManager.Clear();

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
        this.event.Add(newObject);
        this.selectedObject = newObject;
        actionsManager.SetObject(newObject);
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
