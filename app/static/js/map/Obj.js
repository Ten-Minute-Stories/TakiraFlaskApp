import {Element} from "./Element.js";
import {actionsManager} from "./NodeMap.js";

export class Obj extends Element
{
    Pick(e)
    {
        actionsManager.SetObject(this);
        actionsManager.Clear();
        actionsManager.Fill();
    }
}