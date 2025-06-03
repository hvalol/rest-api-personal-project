# Task Public API Documentation

**Base URL (Production)**: `https://my-api-demo.onrender.com/api/public`

## Get All Public Tasks

**Endpoint**: `GET /tasks`

**Headers Required**:

```
x-api-key: my_public_api_key_secret
```

**Request Body** (optional JSON parameters):

```json
{
  "sortBy": "string",    // Optional: "createdAt", "updatedAt", "dueDate", or "title"
  "order": "string",     // Optional: "ASC" or "DESC" (defaults to "DESC")
  "limit": number,       // Optional: Number of items per page (defaults to 10)
  "page": number        // Optional: Page number (defaults to 1)
}
```

**Success Response** (200 OK):

```json
{
  "totalTasks": number,
  "totalPages": number,
  "currentPage": number,
  "tasks": [
    {
      "id": number,
      "title": "string",
      "description": "string",
      "dueDate": "string",
      "status": "string",
      "createdAt": "string",
      "updatedAt": "string",
      "categories": [
        {
          "id": number,
          "name": "string"
        }
      ],
      "user": {
        "id": number,
        "email": "string"
      }
    }
  ]
}
```

**Error Responses**:

- `401 Unauthorized`: Invalid or missing API key
- `500 Internal Server Error`: Server-side error

**Example cURL Request**:

```bash
curl -X GET "https://my-api-demo.onrender.com/api/public/tasks" \
-H "x-api-key: my_public_api_key_secret" \
-H "Content-Type: application/json" \
-d '{
  "sortBy": "createdAt",
  "order": "DESC",
  "limit": 10,
  "page": 1
}'
```

**Notes**:

1. The API is protected by an API key that must be included in the request headers
2. Pagination is implemented with `limit` and `page` parameters
3. Sorting is available on multiple fields with customizable order
4. Sensitive user information is excluded from the response
5. Task categories are included in the response
6. Response includes pagination metadata (totalTasks, totalPages, currentPage)
