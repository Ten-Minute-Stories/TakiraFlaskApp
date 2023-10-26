const maxNameLength = 12;

export class Inspector
{
    selected = undefined;

    inputElements = [];

    constructor()
    {
        this.inputElements = document.querySelectorAll(".inspector-input");
        for(let inputElement of this.inputElements)
            inputElement.addEventListener('keydown', (e) => {this.onInputChanged(e);});
    }

    Set(node)
    {
        for(let inputElement of this.inputElements)
            inputElement.value = node[inputElement.id];

        this.selected = node;
    }

    onInputChanged(e)
    {
        if (this.selected === undefined) return;
        this.selected[e.target.id] = e.target.value;

        if (e.target.id === 'name')
            this.selected.UpdateDisplayName();
    }
}
