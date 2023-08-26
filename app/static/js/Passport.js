function getRandomNumber(min, max) {return Math.floor(Math.random() * (max - min + 1)) + min;}

function SaveQuest(questID)
{
    const name = document.querySelector("#name").value;
    const desc = document.querySelector("#desc").value;
    // const tags = document.querySelector("#tags");
    const act = document.querySelector("#act").value;
    const generate_images = document.querySelector("#generate_images").value;
    const world_rate = document.querySelector("#world_rate").value;

    window.location.href = "/action/save/" + questID + "?" +
        "name=" + name + "&" +
        "desc=" + desc + "&" +
        "act=" + act + "&" +
        "generate_images=" + generate_images + "&" +
        "world_rate=" + world_rate
    ;
}

document.querySelector("#rnd-btn").addEventListener("click", () =>
{
    const worldRateEl = document.querySelector("#world_rate");
    worldRateEl.value = getRandomNumber(100, 999);
});