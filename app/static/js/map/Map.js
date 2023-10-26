import {Node} from "./Node.js";
import {Link} from "./Link.js";
import {eventsManager, inspector} from "./NodeMap.js";

export class Map
{
    nodes = [];
    links = [];
    node_by_element = {};
    link_by_element = {};

    picked = undefined;
    linkStartNode = undefined;

    element = undefined;


    constructor()
    {
        this.nodes = [];
        this.element = document.querySelector('.nodes');

        this.element.addEventListener('mousemove', (e) => this.OnMouseMove(e));
        this.element.addEventListener('mouseup', (e) => this.OnMouseUp(e));
        this.element.addEventListener('click', (e) => this.OnMouseClick(e));
        this.element.addEventListener('mousedown', (e) => this.OnMouseDown(e));
        this.element.addEventListener('contextmenu', (e) => this.OnRightMouseClick(e));
    }

    OnMouseMove(e)
    {
        e.preventDefault();

        if (this.picked !== undefined)
        {
            if (this.isOutOfHorizontalBounds(e) || this.isOutOfVerticalBounds(e))
                return;

            let bounds = this.element.getBoundingClientRect();
            let x = e.clientX - bounds.left;
            let y = e.clientY - bounds.top;

            this.picked.SetPosition(
                x - this.picked.element.clientWidth/2,
                y - this.picked.element.clientHeight/2
            );

            let links = this.picked.links;
            for(let linkID of links)
                this.link_by_element[linkID].updatePosition();
        }
    }

    OnMouseUp(e)
    {
        e.preventDefault();
        if (this.picked !== undefined)
            this.picked = undefined;
    }

    OnMouseDown(e)
    {
        e.preventDefault();

        if (this.picked !== undefined)
        {
            this.picked = undefined;
        }
        else
        {
            let node = this.node_by_element[e.target.id];

            if (node === undefined)
                return;

            this.picked = node;

            inspector.Set(node);
            eventsManager.SetNode(node);
        }
    }

    OnMouseClick(e)
    {
        e.preventDefault();
        let node = this.node_by_element[e.target.id];

        if (node === undefined)
            return;

        inspector.Set(node);
    }

    OnRightMouseClick(e)
    {
        e.preventDefault();
        let node = this.node_by_element[e.target.id];

        if (node === undefined)
            return;

        if (this.linkStartNode === undefined)
        {
            this.linkStartNode = node;
            return;
        }

        this.NewLink(this.linkStartNode.element.id, node.element.id);
    }

    Add(type)
    {
        let node = new Node(type);
        this.element.appendChild(node.element);
        this.nodes.push(node);
        this.picked = undefined;
        this.node_by_element[node.element.id] = node;
    }

    Remove()
    {
        // TODO: Сделать удаление ноды
    }

    isOutOfHorizontalBounds(e)
    {
        let pickedNode = this.picked.element;

        let border = document.getElementsByClassName("nodes")
        let borderLeft = border[0].offsetLeft;
        let borderRight = borderLeft + border[0].offsetWidth;
        return  pickedNode.clientWidth / 2 + e.clientX < borderLeft + pickedNode.clientWidth ||
                pickedNode.clientWidth / 2 + e.clientX > borderRight;
    }

    isOutOfVerticalBounds(e)
    {
        let pickedNode = this.picked.element;

        let border = document.getElementsByClassName("nodes")
        let borderTop = border[0].offsetTop;
        let borderBottom = borderTop + border[0].offsetHeight;
        return  pickedNode.clientHeight / 2 + e.clientY < borderTop + pickedNode.clientHeight ||
                pickedNode.clientHeight / 2 + e.clientY > borderBottom;
    }

    NewLink(startNodeID, endNodeID)
    {
        let link = new Link(startNodeID, endNodeID);
        this.links.push(link);
        this.link_by_element[link.element.id] = link;
        this.linkStartNode = undefined;
    }
}

