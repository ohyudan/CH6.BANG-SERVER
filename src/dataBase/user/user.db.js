import { toCamelCase } from "../../utils/transformCase.js";
import dbPool from "../dataBase.js";
import { SQL_QUERIES } from "./user.queries.js"



export const findUserById=async(id)=>{
    const [rows] =await dbPool.query(SQL_QUERIES.FIND_USER_BY_ID);
    console.log(rows);
    return toCamelCase(rows[0]);
}