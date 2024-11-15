import dbPool from "../dataBase.js";
import { SQL_QUERIES } from "./user.querise.js";

export const findUserByEmail = async (email) => {
    const [rows] = await dbPool.query(SQL_QUERIES.FIND_USER_BY_EMAIL, [email]);
    return rows[0];
};

export const findUserByNickname = async (nickname) => {
    const [rows] = await dbPool.query(SQL_QUERIES.FIND_USER_BY_NICKNAME, [nickname]);
    return rows[0];
}

export const CreateUser = async (email, nickname, password) => {
    await dbPool.query(SQL_QUERIES.CREATE_USER, [email, nickname, password]);
    return { email };
};