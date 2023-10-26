import {Element} from "./Element.js";
import {actionsManager, objectsManager} from "./NodeMap.js";

export class Event extends Element
{
    Pick(e)
    {
        objectsManager.SetEvent(this);
        objectsManager.Clear();
        actionsManager.Clear();
        objectsManager.Fill();
    }
}
