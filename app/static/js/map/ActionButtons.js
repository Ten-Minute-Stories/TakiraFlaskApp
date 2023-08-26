function UpdateRemoveButtons()
{
    const removeButtons = document.querySelectorAll(".action-button-remove");
    for (let removeButton of removeButtons)
    {
        removeButton.addEventListener('click', (e) =>
        {
            e.target.parentNode.parentNode.removeChild(e.target.parentNode);
            actionButtonsCount--;

            if (actionButtonsCount < 4)
                newActionButton.style.display = "block";
        });
    }
}

const newActionButton = document.querySelector("#new-action-button");
const actionButtons = document.querySelector("#action-buttons");
const defaultActionButton = document.querySelector("#default-action-button").cloneNode(true);
defaultActionButton.id = '';

let actionButtonsCount = 1;

newActionButton.addEventListener('click', (e) =>
{
    actionButtons.innerHTML += defaultActionButton.outerHTML;
    actionButtonsCount++;

    if (actionButtonsCount === 4)
        newActionButton.style.display = "none";

    UpdateRemoveButtons();
});

UpdateRemoveButtons();