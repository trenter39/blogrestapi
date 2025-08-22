export function handleError(res, err) {
    console.error(err);
    return res.status(500).json({error: "Database error!"});
}