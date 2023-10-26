import {Inspector} from "./Inspector.js";
import {EventsManager} from "./EventsManager.js";
import {ObjectsManager} from "./ObjectsManager.js";
import {ActionsManager} from "./ActionsManager.js";
import {Map} from './Map.js';

export const defaultNode = document.querySelector("#default-node");
const links = document.querySelector('.links');

export const map = new Map();
export const inspector = new Inspector();

export const eventsManager = new EventsManager();
export const objectsManager = new ObjectsManager();
export const actionsManager = new ActionsManager();
