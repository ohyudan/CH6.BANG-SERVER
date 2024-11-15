import { createHeader } from "../header/createHeader.js"

const makeNotification = (message, type) => {
    const headerBuffer = createHeader(type, message, 1);

    return Buffer.concat([headerBuffer, message]);
}