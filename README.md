# DynamicDocs Backend

A backend service for managing users and user documents.

## Setup

1.  Install dependencies:
    ```bash
    npm install
    ```

2.  Run the development server:
    ```bash
    node server.js
    ```

## API Documentation

All API routes are prefixed with `/api`.

### 1. User Authentication
#### Login
```
POST /api/login
```
**Body:**
```json
{
  "mobile": "1234567890"
}
```
**Response (Existing User):**
```json
{
  "isExistingUser": true,
  "mobile": "1234567890",
  "name": "John Doe",
  "userType": "User"
}
```
**Response (New User):**
```json
{
  "isExistingUser": false
}
```

#### Register
```
POST /api/register
```
**Body:**
```json
{
  "name": "John Doe",
  "userType": "User",
  "mobile": "1234567890"
}
```
**Response:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "user": {
    "name": "John Doe",
    "userType": "User",
    "mobile": "1234567890"
  }
}
```

### 2. Document Operations

#### Get User Documents
```
GET /api/documents/:mobile
```
**Response:**
```json
{
  "documents": [
    "SampleOfferLetter",
    "SampleTerminationLetter"
  ]
}
```

#### Add Document (Admin Only)
```
POST /api/documents/add
```
**Body:**
```json
{
  "adminMobile": "0987654321",
  "mobile": "1234567890",
  "documents": ["NewDocumentName"]
}
```
**Response:**
```json
{
  "status": 200,
  "message": "Documents added successfully",
  "documents": [
    "SampleOfferLetter",
    "SampleTerminationLetter",
    "NewDocumentName"
  ]
}
```

#### Remove Document (Admin Only)
```
POST /api/documents/remove/:adminMobile/:mobile/:document
```
**Response:**
```json
{
  "message": "Document removed successfully.",
  "documents": [
    "SampleOfferLetter"
  ]
}
```

## Local Development

### Environment Variables
Create a `.env` file with the following:
```
PORT=5000
MONGO_URI=mongodb://localhost:27017/dynamicdocs
```

### Folder Structure
- `server.js`: Main entry point
- `routes/`: API route handlers
- `models/`: Mongoose models
- `config/`: Configuration
