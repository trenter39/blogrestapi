import db from '../db.js';
import bcrypt from 'bcrypt';
import { handleError } from '../utils/APIHelper.js';

export async function getUser(req, res) {
    try {
        const username = req.params.username;
        const sql = "select id, username, email, createdAt, updatedAt from users where username = ?";
        const [result] = await db.query(sql, [username]);
        if (result.length === 0) return res.status(404).json({ error: "User wasn't found!" });
        return res.status(200).json(result[0]);
    } catch (err) { handleError(res, err); }
}

export async function getUsers(req, res) {
    try {
        const sql = "select id, username, email, createdAt, updatedAt from users";
        const [result] = await db.query(sql);
        return res.status(200).json(result);
    } catch (err) { handleError(res, err); }
}

export async function createUser(req, res) {
    try {
        const { username, email, password } = req.body;
        if (!username || !email || !password) return res.status(400).json({ error: "Missing fields!" });
        const checksql = "select 1 from users where username = ? or email = ?";
        const [checkResult] = await db.query(checksql, [username, email]);
        if (checkResult.length > 0) return res.status(409).json({ error: "Username or email is already in use!" });
        const hashedPassword = await bcrypt.hash(password, 10);
        const createsql = "insert into users(username, email, password) values(?, ?, ?)";
        const [result] = await db.query(createsql, [username, email, hashedPassword]);
        const [rows] = await db.query("select id, username, email, createdAt, updatedAt from users where id = ?", [result.insertId]);
        const createdUser = rows[0];
        createdUser.createdAt = createdUser.createdAt.toISOString();
        createdUser.updatedAt = createdUser.updatedAt.toISOString();
        return res.status(201).json(createdUser);
    } catch (err) { handleError(res, err); }
}

export async function changeUser(req, res) {
    try {
        const defaultUsername = req.params.username;
        const { username, email, password } = req.body;
        if (!username || !email || !password) return res.status(400).json({ error: "PUT request missing required fields!" });
        const checksql = "select 1 from users where username = ? or email = ?";
        const [checkResult] = await db.query(checksql, [username, email]);
        if (checkResult.length > 0) return res.status(409).json({ error: "Username or email is already in use!" });
        const selectsql = "select 1 from users where username = ?";
        const [selectResult] = await db.query(selectsql, [defaultUsername]);
        if (selectResult.length === 0) return res.status(404).json({ error: "User wasn't found!" });
        const hashedPassword = await bcrypt.hash(password, 10);
        const updatesql = "update users set username = ?, email = ?, password = ? where username = ?";
        const values = [username, email, hashedPassword, defaultUsername];
        await db.query(updatesql, values);
        const [updatedResult] = await db.query("select id, username, email, createdAt, updatedAt from users where username = ?", [username]);
        const updatedUser = updatedResult[0];
        updatedUser.createdAt = updatedUser.createdAt.toISOString();
        updatedUser.updatedAt = updatedUser.updatedAt.toISOString();
        return res.status(200).json(updatedUser);
    } catch (err) { handleError(res, err); }
}

export async function updateUser(req, res) {
    try {
        const defaultUsername = req.params.username;
        const { username, email, password } = req.body;
        if (username == null && email == null && password == null) return res.status(400).json({ error: "PATCH request must contain at least one field!" });
        const checksql = "select 1 from users where username = ? or email = ?";
        const [checkResult] = await db.query(checksql, [username, email]);
        if (checkResult.length > 0) return res.status(409).json({ error: "Username or email is already in use!" });
        const selectsql = "select 1 from users where username = ?";
        const [selectResult] = await db.query(selectsql, [defaultUsername]);
        if (selectResult.length === 0) return res.status(404).json({ error: "User wasn't found!" });
        const fields = [];
        const values = [];
        if (username) { fields.push("username = ?"); values.push(username); }
        if (email) { fields.push("email = ?"); values.push(email); }
        if (password) { const hashedPassword = await bcrypt.hash(password, 10); fields.push("password = ?"); values.push(hashedPassword); }
        values.push(defaultUsername);
        const updatesql = `update users set ${fields.join(", ")} where username = ?`;
        await db.query(updatesql, values);
        const [updatedResult] = await db.query("select id, username, email, createdAt, updatedAt from users where username = ?", [username])
        const updatedUser = updatedResult[0];
        updatedUser.createdAt = updatedUser.createdAt.toISOString();
        updatedUser.updatedAt = updatedUser.updatedAt.toISOString();
        return res.status(200).json(updatedUser)
    } catch (err) { handleError(res, err); }
}

export async function deleteUser(req, res) {
    try {
        const username = req.params.username;
        const checksql = "select 1 from users where username = ?";
        const [checkResult] = await db.query(checksql, [username]);
        if (checkResult.length === 0) return res.status(404).json({ error: "User wasn't found!" });
        await db.query("delete from users where username = ?", [username]);
        return res.status(204).send();
    } catch (err) { handleError(res, err); }
}
