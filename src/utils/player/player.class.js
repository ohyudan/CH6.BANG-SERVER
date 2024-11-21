class player {
    constructor(socket,id,nickname){
        this.id=id;
        this.nickname=nickname;
        this.socket=socket;

        this.character=new CharacterData();

    }
}
