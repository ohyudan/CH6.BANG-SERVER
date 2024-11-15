import { toCamelCase } from "../../utils/transformCase.js";
import dbPool from "../dataBase.js";
import { SQL_QUERIES } from "./user.queries.js"


//id를 통해서 유저를 찾는 함수
export const findUserById = async (id) => {
    const [rows] = await dbPool.query(SQL_QUERIES.FIND_USER_BY_ID, [id]);
    console.log(rows);
    if (rows.length === 0)//중복이 없다는뜻
    {
        return null;
    }
    return toCamelCase(rows[0]);
}
//유저를 만드는 함수
export const createUser = async (email, nickname, password ) => {
    console.log(`create user nick name: ${nickname} memail:${id}, password: ${password}`);
    await dbPool.query(SQL_QUERIES.CREATE_USER, [email, nickname, password]);
    return { id, password };
}