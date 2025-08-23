import db from '../db.js';
import bcrypt from 'bcrypt';
import { handleError }
    from '../utils/APIHelper.js';

export async function getUser(req, res) {
    try {
        const username = String(req.params.username).trim();
        const sql = `select id, username, email,
        createdAt, updatedAt from users where username = ?`;
        const [result] = await db.query(sql, [username]);
        if (result.length === 0) {
            return res.status(404)
                .json({ error: "User wasn't found!" });
        }
        return res.status(200).json(result[0]);
    } catch (err) {
        handleError(res, err);
    }
}

export async function getUsers(req, res) {
    try {
        const sql = `select id, username, email,
        createdAt, updatedAt from users`;
        const [result] = await db.query(sql);
        return res.status(200)
            .json(result);
    } catch (err) {
        handleError(res, err);
    }
}

export async function createUser(req, res) {
    try {
        const { username, email, password } = req.body;
        if (!username || !email || !password) {
            return res.status(400)
                .json({ error: "Missing fields!" });
        }
        const checksql = `select 1 from users where
            username = ? or email = ?`;
        const [result] = await db
            .query(checksql, [username, email]);
        if (result.length > 0) {
            return res.status(409).json(
                { error: "Username or email is already in use!" });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const now = new Date().toISOString();
        const createsql = `insert into users(username, email,
        password, createdAt, updatedAt) values(?, ?, ?, ?, ?)`;
        const values = [username, email,
            hashedPassword, now, now];
        await db.query(createsql, values);
        const createdUser = {
            username,
            email,
            createdAt: now,
            updatedAt: now
        };
        return res.status(201).json(createdUser);
    } catch (err) {
        handleError(res, err);
    }
}

export async function changeUser(req, res) {
    try {
        const defaultUsername = req.params.username;
        const { username, email, password } = req.body;
        if (!username || !email || !password) {
            return res.status(400).json(
                { error: "PUT request missing required fields!" });
        }
        const checksql = `select 1 from users
        where username = ? or email = ?`;
        const [checkResult] = await db
            .query(checksql, [username, email]);
        if (checkResult.length > 0) {
            return res.status(409).json(
                { error: "Username or email is already in use!" });
        }
        const selectsql = `select * from users
        where username = ?`;
        const [selectResult] = await db
            .query(selectsql, [defaultUsername]);
        if (selectResult.length === 0) {
            return res.status(404)
                .json({ error: "User wasn't found!" });
        }
        const currentUser = selectResult[0];
        const hashedPassword = await bcrypt.hash(password, 10);
        const updatedAt = new Date().toISOString();
        const updatesql = `update users set username = ?,
        email = ?, password = ?, updatedAt = ?
        where username = ?`;
        const values = [username, email, hashedPassword,
            updatedAt, defaultUsername];
        await db.query(updatesql, values);
        const updatedUser = {
            id: currentUser.id, username, email,
            createdAt: currentUser.createdAt, updatedAt
        };
        return res.status(200).json(updatedUser);
    } catch (err) {
        handleError(res, err);
    }
}

export async function updateUser(req, res) {
    try {
        const defaultUsername = req.params.username;
        const { username, email, password } = req.body;
        if (username == null && email == null
            && password == null) {
            return res.status(400).json({
                error:
                    "PATCH request must contain at least one field!"
            });
        }
        const selectsql = `select 1 from users
        where username = ?`;
        const [selectResult] = await db
            .query(selectsql, [defaultUsername]);
        if (selectResult.length === 0) {
            return res.status(404).json(
                { error: "User wasn't found!" });
        }
        const currentUser = selectResult[0];
        const fields = [];
        const values = [];
        if (username) {
            fields.push("username = ?");
            values.push(username);
        }
        if (email) {
            fields.push("email = ?");
            values.push(email);
        }
        if (password) {
            const hashedPassword = await
                bcrypt.hash(password, 10);
            fields.push("password = ?");
            values.push(hashedPassword);
        }
        fields.push("updatedAt = ?");
        const updatedAt = new Date().toISOString();
        values.push(updatedAt);
        values.push(defaultUsername);
        const updatesql = `update users set
        ${fields.join(", ")} where username = ?`;
        await db.query(updatesql, values);
        const updatedUser = {
            id: currentUser.id,
            username: username ?? defaultUsername,
            email: email ?? currentUser.email,
            createdAt: currentUser.createdAt,
            updatedAt
        }
        return res.status(200).json(updatedUser)
    } catch (err) {
        handleError(res, err);
    }
}

export async function deleteUser(req, res) {
    try {
        const username = req.params.username;
        const checksql = "select 1 from users where username = ?";
        const [result] = await db.query(checksql, [username]);
        if (result.length === 0) {
            return res.status(404)
                .json({ error: "User wasn't found!" });
        }
        const deletesql = "delete from users where username = ?";
        await db.query(deletesql, [username]);
        return res.status(204).send();
    } catch (err) {
        handleError(res, err);
    }
}
