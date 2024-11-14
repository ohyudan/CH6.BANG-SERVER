import { findUserById } from "../../dataBase/user/user.db.js";
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

//email은 id와 같은값을 보낸다.
const registerHandler = async ({socket, payload}) => {
    const {id, password} = payload;
    let success=true;
    try {
        //console.log(socket);
        console.log(payload);
        findUserById(id);
    } catch (err) {
        console.error(err);
    }
}

export default registerHandler;