import db from '../db.js';
import { handleError, validateID, badRequest }
    from '../utils/APIHelper.js';

export async function getComment(req, res) {
    try {
        const postID = validateID(req.params.postID);
        const commentID = validateID(req.params.commentID);
        if (!postID || !commentID) return badRequest(res);
        const sql = `select * from comments
        where postID = ? and id = ?`;
        const [result] = await db
            .query(sql, [postID, commentID]);
        if (result.length === 0) {
            return res.status(404)
                .json({ error: "Comment wasn't found!" });
        }
        return res.status(200).json(result[0]);
    } catch (err) {
        return handleError(res, err);
    }
}

export async function getComments(req, res) {
    try {
        const postID = validateID(req.params.postID);
        if (!postID) return badRequest(res);
        const sql = `select * from comments
        where postID = ?`;
        const [result] = await db.query(sql, [postID]);
        if (result.length === 0) {
            return res.status(404).json({
                error: "Comments for this post weren't found!"
            });
        }
        return res.status(200).json(result);
    } catch (err) {
        return handleError(res, err);
    }
}

export async function createComment(req, res) {
    try {
        const postID = validateID(req.params.postID);
        if (!postID) return badRequest(res);
        const { author, content } = req.body;
        if (!author || !content) {
            return res.status(400).json(
                { error: "Missing fields or invalid format!" });
        }
        const checksql = `select 1 from posts
        where id = ?`;
        const [checkResult] = await db
            .query(checksql, [postID]);
        if (checkResult.length === 0) {
            return res.status(404)
                .json({ error: "Post wasn't found!" });
        }
        const now = new Date().toISOString();
        const createsql = `insert into comments(postID,
        author, content, createdAt, updatedAt)
        values(?, ?, ?, ?, ?)`;
        const values = [postID, author, content, now, now];
        const [result] = await db.query(createsql, values);
        const createdComment = {
            id: result.insertId, postID, author,
            content, createdAt: now, updatedAt: now
        };
        return res.status(201).json(createdComment);
    } catch (err) {
        return handleError(res, err);
    }
}

export async function changeComment(req, res) {
    try {
        const postID = validateID(req.params.postID);
        const commentID = validateID(req.params.commentID);
        if (!postID || !commentID) return badRequest(res);
        const { author, content } = req.body;
        if (!author || !content) {
            return res.status(400).json({
                error: "PUT request missing required fields!"
            });
        }
        const selectsql = `select * from comments where id = ?`;
        const [selectResult] = await db
            .query(selectsql, [commentID]);
        if (selectResult.length === 0) {
            return res.status(404)
                .json({ error: "Comment wasn't found!" });
        }
        const currentComment = selectResult[0];
        if (currentComment.postID !== postID) {
            return res.status(400).json({
                error:
                    "Comment doesn't belong to the specified post!"
            });
        }
        const now = new Date();
        const createdAt = currentComment.createdAt;
        const updatedAt = now.toISOString();
        const updatesql = `update comments set author = ?,
        content = ?, updatedAt = ? where id = ?`;
        const values = [author, content, updatedAt, commentID];
        await db.query(updatesql, values);
        const updatedComment = {
            id: commentID, postID, author,
            content, createdAt, updatedAt
        }
        return res.status(200).json(updatedComment);
    } catch (err) {
        return handleError(res, err);
    }
}

export async function updateComment(req, res) {
    try {
        const postID = validateID(req.params.postID);
        const commentID = validateID(req.params.commentID);
        if (!postID || !commentID) return badRequest(res);
        const { author, content } = req.body;
        if (author == null && content == null) {
            return res.status(400).json({
                error:
                    "PATCH request must contain at least one field!"
            });
        }
        const selectsql = "select * from comments where id = ?";
        const [selectResult] = await db
            .query(selectsql, [commentID]);
        if (selectResult.length === 0) {
            return res.status(404)
                .json({ error: "Comment wasn't found!" });
        }
        const currentComment = selectResult[0];
        if (currentComment.postID !== postID) {
            return res.status(400).json({
                error:
                    "Comment doesn't belong to the specified post!"
            });
        }
        const updatedAuthor = author ?? currentComment.author;
        const updatedContent = content ?? currentComment.content;
        const updatedAt = new Date().toISOString();
        const updatesql = `update comments set author = ?,
        content = ?, updatedAt = ? where id = ?`;
        const values = [updatedAuthor, updatedContent,
            updatedAt, commentID];
        await db.query(updatesql, values);
        const updatedComment = {
            id: commentID, postID,
            author: updatedAuthor, content: updatedContent,
            createdAt: currentComment.createdAt, updatedAt
        }
        return res.status(200).json(updatedComment);
    } catch (err) {
        return handleError(res, err);
    }
}

export async function deleteComment(req, res) {
    try {
        const postID = validateID(req.params.postID);
        const commentID = validateID(req.params.commentID);
        if (!postID || !commentID) return badRequest(res);
        const checksql = `select postID from comments
        where id = ?`;
        const [checkResult] = await db
            .query(checksql, [commentID]);
        if (checkResult.length === 0) {
            return res.status(404)
                .json({ error: "Comment wasn't found!" });
        }
        if (checkResult[0].postID !== postID) {
            return res.status(400).json({
                error:
                    "Comment doesn't belong to the specified post!"
            });
        }
        const deletesql = "delete from comments where id = ?";
        await db.query(deletesql, [commentID]);
        return res.status(204).send();
    } catch (err) {
        return handleError(res, err);
    }
}