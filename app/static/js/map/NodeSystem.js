const nodeTypes = ['Start', 'End', 'Checkpoint', 'Action'];
const nodesParent = document.querySelector('.nodes');
const inspector = document.querySelector('.inspector');

const defaultNode = document.querySelector("#default-node");

const nodeInfo = {};

let zIndex = 0;
let maxID = 0;

let selectedNode = undefined;
let pickedNode = undefined;
let pickedLink = undefined;

function UpdateInspector()
{
    inspector.querySelector("#index").value = nodeInfo[selectedNode.id]['index'];
    inspector.querySelector("#name").value = nodeInfo[selectedNode.id]['name'];
    inspector.querySelector("#image_url").value = nodeInfo[selectedNode.id]['image_url'];
    inspector.querySelector("#text").value = nodeInfo[selectedNode.id]['text'];
}

function UnpickNode(node)
{
    node.className = node.className.replaceAll(' picked', '');
}

function CreateNode(nodeType)
{
    if (!nodeTypes.includes(nodeType))
        return;

    let newNode = defaultNode.cloneNode(true);
    newNode.className = 'node ' + nodeType + ' picked';
    newNode.id = 'node-' + ++maxID;
    newNode.childNodes[0].textContent = nodeType;
    newNode.style.display = '';

    nodesParent.appendChild(newNode);

    nodeInfo[newNode.id] =
    {
        'id': newNode.id,
        'name': '',
        'index': -1,
        'image_url': '',
        'text': '',
        'link': undefined,
        'buttons': []
    };

    if (selectedNode !== undefined)
        UnpickNode(selectedNode);

    if (pickedNode !== undefined)
        UnpickNode(pickedNode);

    selectedNode = newNode;
    UpdateInspector();

    selectedNode.addEventListener('mouseenter', (e) =>
    {
        let linkDirections = e.target.querySelector('.link-directions');
        linkDirections.style.display = 'block';

        linkDirections.addEventListener('mouseleave', (e) =>
        {
            e.target.style.display = 'none';
        });

        linkDirections.addEventListener('click', (e) =>
        {
            console.log(pickedLink, e.target);

            if (pickedLink === undefined)
            {
                pickedLink = e.target;
                return;
            }

            if (pickedLink === e.target) return;

        });
    });
}

function InspectorNodeEdit(inputElement)
{
    if (selectedNode === undefined)
        return;

    nodeInfo[selectedNode.id][inputElement.id] = inputElement.value;
}

function InspectorNodeNamed(inputElement)
{
    selectedNode.value = inputElement.value;
    selectedNode.textContent = inputElement.value;
    InspectorNodeEdit(inputElement);
}

nodesParent.addEventListener('mousedown', (e) =>
{
    e.stopPropagation();
    e.preventDefault();

    let node = e.target;
    if (!node.className.includes('node '))
        return;

    if (selectedNode !== undefined)
        UnpickNode(selectedNode);

    if (pickedNode !== undefined)
        UnpickNode(pickedNode);

    pickedNode = node;
    pickedNode.className += ' picked';
    pickedNode.style.zIndex = ++zIndex;

    selectedNode = pickedNode;
    UpdateInspector();
});

nodesParent.addEventListener('mouseup', (e) =>
{
    if (pickedNode !== undefined)
        pickedNode = undefined;
});

nodesParent.addEventListener('mousemove', (e) =>
{
    if (pickedNode !== undefined)
    {
        pickedNode.style.left = `${e.clientX - pickedNode.clientWidth/2}px`;
        pickedNode.style.top = `${e.clientY - pickedNode.clientHeight/2}px`;
    }
});