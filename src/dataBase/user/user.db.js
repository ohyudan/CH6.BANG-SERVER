import dbPool from "../database.js";
import { SQL_QUERIES } from "./user.querise.js";

export const findUserByNameId = async (nameId) => {
    const [rows] = await dbPool.query(SQL_QUERIES.FIND_USER_BY_NAME_ID, [nameId]);
    return rows[0];
};

export const CreateUser = async (nameId, password) => {
    await dbPool.query(SQL_QUERIES.CREATE_USER, [accountId, password]);
    return { nameId };
};