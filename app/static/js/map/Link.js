import {map} from "./NodeMap.js";

let maxID = 0;

export class Link
{
    startNodeID = null;
    endNodeID = null;

    element = null;

    constructor(startNodeID, endNodeID)
    {
        this.startNodeID = startNodeID;
        this.endNodeID = endNodeID;

        this.element = this.createLinkElement();
        this.updatePosition();
    }

    createLinkElement()
    {
        const linkElement = document.createElement('div');
        linkElement.className = 'link';
        linkElement.id = 'link-' + maxID;
        maxID++;
        map.element.appendChild(linkElement);

        this.GetStartNode().links.push(linkElement.id);
        this.GetEndNode().links.push(linkElement.id);

        return linkElement;
    }

    updatePosition()
    {
        let bounds = map.element.getBoundingClientRect();

        let startNode = this.GetStartNode();
        let endNode = this.GetEndNode();

        const startRect = startNode.element.getBoundingClientRect();
        const endRect = endNode.element.getBoundingClientRect();

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

    GetStartNode() {return map.node_by_element[this.startNodeID];}
    GetEndNode() {return map.node_by_element[this.endNodeID];}
}