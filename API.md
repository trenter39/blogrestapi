# Blog Post REST API Documentation

Base URL (Development): `http://localhost:8080`

> **Note:** This is the development URL. For production deployments, replace with your server's public endpoint (e.g., `https://api.yourdomain.com`).

All responses are in `application/json`.

## Post Endpoints

### GET `/posts`

**Description**: Retrieve all blog posts.

**Response**:

- `200 OK`: Returns an array of all posts.

### GET `/posts?term=searchTerm`

**Description**: Search posts by keyword in title, content, category, or tags.

**Response**:

- `200 OK`: Matching posts

### GET `/posts/:id`

**Description**: Get a single post by its ID.

**Response**:

- `200 OK`: Post object
- `400 Bad Request`: Invalid ID
- `404 Not Found`: Post not found

### POST `/posts`

**Description**: Create a new post.

**Request Body**:

```json
{
  "title": "Post Title",
  "content": "Post Content",
  "category": "Tech",
  "tags": ["node", "api"]
}
```

**Response**:

- `201 Created`: Created post
- `400 Bad Request`: Missing or invalid fields

### PUT `/posts/:id`

**Description**: Fully update an existing post. All fields are required.

**Response**:

- `200 OK`: Updated post
- `400 Bad Request`: Missing fields or invalid ID
- `404 Not Found`: Post not found

### PATCH `/posts/:id`

**Description**: Partially update a post. Only include fields to be updated.

**Response**:

- `200 OK`: Updated post
- `400 Bad Request`: Invalid ID
- `404 Not Found`: Post not found

### DELETE `/posts/:id`

**Description**: Delete a post by ID.

**Response**:

- `204 No Content`: Post deleted
- `400 Bad Request`: Invalid ID
- `404 Not Found`: Post not found

## Comment Endpoints

### GET `/posts/:postID/comments`

**Description**: Retrieve all comments for a specific post.

**Response**:

- `200 OK`: List of comments (empty array if none)
- `400 Bad Request`: Invalid ID
- `404 Not Found`: Post not found

### GET `/posts/:postID/comments/:commentID`

**Description**: Retrieve a single comment by ID for a specific post.

**Response**:

- `200 OK`: Comment object
- `400 Bad Request`: Invalid ID
- `404 Not Found`: Comment not found or does not belong to post

### POST `/posts/:postID/comments`

**Description**: Create a comment on a post.

**Request Body**:

```json
{
  "author": "Jane",
  "content": "Nice post!"
}
```

**Response**:

- `201 Created`: Created comment
- `400 Bad Request`: Missing fields or invalid input
- `404 Not Found`: Post not found

### PUT `/posts/:postID/comments/:commentID`

**Description**: Fully update a comment. All fields are required.

**Response**:

- `200 OK`: Updated comment
- `400 Bad Request`: Missing fields or invalid ID
- `404 Not Found`: Comment not found or does not belong to post

### PATCH `/posts/:postID/comments/:commentID`

**Description**: Partially update a comment. Only provide fields to update.

**Response**:

- `200 OK`: Updated comment
- `400 Bad Request`: Invalid ID or invalid body
- `404 Not Found`: Comment not found or does not belong to post

### DELETE `/posts/:postID/comments/:commentID`

**Description**: Delete a specific comment.

**Response**:

- `204 No Content`: Comment deleted
- `400 Bad Request`: Invalid ID
- `404 Not Found`: Comment not found or does not belong to post

## Status Codes Reference

| Code | Description           | Usage Examples                                   |
| ---- | --------------------- | ------------------------------------------------ |
| 200  | OK                    | Successful GET, PUT, PATCH requests              |
| 201  | Created               | Successful POST requests (resource created)      |
| 204  | No Content            | Successful DELETE requests                       |
| 400  | Bad Request           | Invalid or missing fields, invalid IDs           |
| 404  | Not Found             | Resource not found or does not belong to parent  |
| 409  | Conflict              | Duplicate resource (e.g., username/email exists) |
| 500  | Internal Server Error | Unexpected server error                          |