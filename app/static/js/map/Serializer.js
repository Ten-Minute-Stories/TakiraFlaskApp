import { Base64 } from "../utils/Base64.js";

export function serialize(className) {
    // TODO: проверка на конкретный класс и что это инстанс, а не прототип
    // Конвертируем JSON в строку, а потом в Base64 и озвращаем в виде результата выполнения функции
    return Base64.encode(JSON.stringify(className.valueOf()));
}

export function deserialize(b64str) {
    // Конвертируем Base64 -> JSON
    return JSON.parse(Base64.decode(b64str));
}

