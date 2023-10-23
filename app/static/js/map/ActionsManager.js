import { Action } from "./Action.js"

export class ActionsManager
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

        let newAction = new Action(newActionNode);
        newAction.id = this.actionCounter++;
        this.obj.Add(newAction);
        this.selectedAction = newAction;
    }

    Clear()
    {
        while (this.actionsBlock.firstChild)
            this.actionsBlock.removeChild(this.actionsBlock.firstChild);
    }

    Fill()
    {
        for(let action of this.obj.objects)
        {
            let actionNode = this.defaultAction.cloneNode(true);
            this.actionsBlock.appendChild(actionNode);
            action.SetElement(actionNode);
        }
    }
}