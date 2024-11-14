const registerHandler = async ({socket, payload}) => {
    const {id, password, email} = payload;
    try {
        console.log(socket);
        console.log(payload);
    } catch (err) {
        console.error(err);
    }
}

export default registerHandler;