const valueChanger = document.querySelector("#value-type-changer");
const value = document.querySelector("#value");

valueChanger.addEventListener("change", (e) =>
{
    if (valueChanger.value === "Логическое") {value.type = "checkbox";}
    if (valueChanger.value === "Число") {value.type = "number";}
    if (valueChanger.value === "Текст") {value.type = "text";}
});