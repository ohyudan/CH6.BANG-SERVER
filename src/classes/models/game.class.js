class Game {
    constructor(id) {
        this.id = id;
        this.users = [];
        this.state = 'waiting'; // 'waiting', 'inProgress'
    }
}