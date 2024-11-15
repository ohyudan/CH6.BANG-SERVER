class User {
    constructor(id, socket, nickname) {
        this.id = id;
        this.socket = socket;
        this.nickname = nickname;
        this.character = {};
    }
}

export default User;