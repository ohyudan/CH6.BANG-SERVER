





// message C2SRegisterRequest {
//     string id = 1;
//     string password = 2;
//     string email = 3;
// }

// message S2CRegisterResponse {
//     bool success = 1;
//     string message = 2;
//     GlobalFailCode failCode = 3;
// }
const registerHandler = async ({socket, payload}) => {
    const {id, password, email} = payload;
    let success=true;
    try {
        console.log(socket);
        //console.log(payload);
    } catch (err) {
        console.error(err);
    }
}

export default registerHandler;