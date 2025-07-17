# Blog Post REST API Documentation

Base URL: `http://localhost:8080`

All responses are in `application/json`.

---

### GET `/posts`

**Description**: Retrieve all blog posts.

**Query Parameters**: None

**Response**:

* `200 OK`: Returns an array of all posts.

```json
[
  {
    "id": 1,
    "title": "First Post",
    "content": "This is the content of first post.",
    "category": "Tech",
    "tags": ["node", "mysql"],
    "createdAt": "2025-07-17T12:00:00Z",
    "updatedAt": "2025-07-17T12:00:00Z"
  }
]
```

---

### GET `/posts?term=searchTerm`

**Description**: Search posts by keyword in title, content, category, or tags.

**Query Parameters**:

* `term`: (optional) string — search keyword

**Response**:

* `200 OK`: Matching posts

---

### GET `/posts/:id`

**Description**: Get a single post by its ID.

**Path Parameters**:

* `id`: number — Post ID

**Response**:

* `200 OK`: Post object
* `400 Bad Request`: Invalid ID
* `404 Not Found`: Post not found

---

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

* `201 Created`: Returns the created post with `id`, `createdAt`, and `updatedAt`
* `400 Bad Request`: Missing or invalid fields

---

### PUT `/posts/:id`

**Description**: Fully update an existing post. All fields are required.

**Path Parameters**:

* `id`: number — Post ID

**Request Body**:

```json
{
  "title": "Updated Title",
  "content": "Updated Content",
  "category": "Updated Category",
  "tags": ["tag1", "tag2"]
}
```

**Response**:

* `200 OK`: Updated post
* `400 Bad Request`: Missing fields or invalid ID
* `404 Not Found`: Post not found

---

### PATCH `/posts/:id`

**Description**: Partially update a post. Only include fields to be updated.

**Path Parameters**:

* `id`: number — Post ID

**Request Body** (any combination of fields):

```json
{
  "title": "Partial Title Update"
}
```

**Response**:

* `200 OK`: Updated post
* `400 Bad Request`: Invalid ID
* `404 Not Found`: Post not found

---

### DELETE `/posts/:id`

**Description**: Delete a post by ID.

**Path Parameters**:

* `id`: number — Post ID

**Response**:

* `204 No Content`: Post deleted
* `400 Bad Request`: Invalid ID
* `404 Not Found`: Post not found

---

## Status Codes Reference

| Code | Description           |
| ---- | --------------------- |
| 200  | OK                    |
| 201  | Created               |
| 204  | No Content            |
| 400  | Bad Request           |
| 404  | Not Found             |
| 500  | Internal Server Error |

---