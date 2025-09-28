# SealTheDeal API Documentation

This document provides comprehensive documentation for the SealTheDeal API endpoints, including authentication, request/response formats, and examples.

## 📋 Table of Contents

1. [Authentication](#authentication)
2. [Base URL](#base-url)
3. [Contract Endpoints](#contract-endpoints)
4. [Client Endpoints](#client-endpoints)
5. [Notification Endpoints](#notification-endpoints)
6. [Analytics Endpoints](#analytics-endpoints)
7. [Admin Endpoints](#admin-endpoints)
8. [Health Check](#health-check)
9. [Error Handling](#error-handling)
10. [Rate Limiting](#rate-limiting)

## 🔐 Authentication

All API endpoints require authentication using Clerk JWT tokens. Include the token in the Authorization header:

```http
Authorization: Bearer <jwt_token>
```

### Getting a Token

Tokens are automatically managed by Clerk and included in requests from authenticated users. For server-to-server communication, use Clerk's server-side authentication.

## 🌐 Base URL

```
Production: https://your-domain.com/api
Development: http://localhost:3000/api
```

## 📄 Contract Endpoints

### Get All Contracts

```http
GET /api/contracts?clerkId={clerkId}
```

**Parameters:**
- `clerkId` (string, required): User's Clerk ID

**Response:**
```json
{
  "success": true,
  "contracts": [
    {
      "id": "contract_123",
      "title": "Freelance Agreement",
      "content": "Contract content...",
      "status": "DRAFT",
      "templateId": null,
      "clientId": "client_456",
      "expiresAt": "2024-12-31T23:59:59Z",
      "sentAt": null,
      "signedAt": null,
      "createdAt": "2024-01-01T00:00:00Z",
      "updatedAt": "2024-01-01T00:00:00Z",
      "user": {
        "id": "user_123",
        "email": "user@example.com"
      },
      "client": {
        "id": "client_456",
        "firstName": "John",
        "lastName": "Doe",
        "email": "john@example.com"
      }
    }
  ]
}
```

### Create Contract

```http
POST /api/contracts
```

**Request Body:**
```json
{
  "title": "Freelance Agreement",
  "type": "Freelance",
  "parties": ["John Doe", "Jane Smith"],
  "description": "Web development services",
  "paymentTerms": "$100/hour",
  "deadline": "2024-12-31",
  "specialClauses": ["Confidentiality", "IP Rights"],
  "generatedContent": "Generated contract content...",
  "clerkId": "user_123"
}
```

**Response:**
```json
{
  "success": true,
  "contract": {
    "id": "contract_123",
    "title": "Freelance Agreement",
    "content": "Generated contract content...",
    "status": "DRAFT",
    "createdAt": "2024-01-01T00:00:00Z"
  },
  "message": "Contract saved successfully"
}
```

### Get Single Contract

```http
GET /api/contracts/{id}
```

**Response:**
```json
{
  "success": true,
  "contract": {
    "id": "contract_123",
    "title": "Freelance Agreement",
    "content": "Contract content...",
    "status": "DRAFT",
    "client": {
      "id": "client_456",
      "firstName": "John",
      "lastName": "Doe"
    }
  }
}
```

### Update Contract

```http
PUT /api/contracts/{id}
```

**Request Body:**
```json
{
  "title": "Updated Title",
  "content": "Updated content...",
  "status": "SENT",
  "expiresAt": "2024-12-31T23:59:59Z"
}
```

**Response:**
```json
{
  "success": true,
  "contract": {
    "id": "contract_123",
    "title": "Updated Title",
    "status": "SENT",
    "updatedAt": "2024-01-01T00:00:00Z"
  }
}
```

### Delete Contract

```http
DELETE /api/contracts/{id}
```

**Response:**
```json
{
  "success": true,
  "message": "Contract deleted successfully"
}
```

### Generate Contract with AI

```http
POST /api/contracts/generate
```

**Request Body:**
```json
{
  "title": "Freelance Agreement",
  "type": "Freelance",
  "parties": ["John Doe", "Jane Smith"],
  "description": "Web development services",
  "paymentTerms": "$100/hour",
  "deadline": "2024-12-31",
  "specialClauses": ["Confidentiality"],
  "clerkId": "user_123"
}
```

**Response:**
```json
{
  "success": true,
  "content": "AI-generated contract content..."
}
```

### Generate PDF

```http
POST /api/contracts/pdf
```

**Request Body:**
```json
{
  "content": "Contract content to convert to PDF",
  "title": "Contract Title"
}
```

**Response:** PDF file (binary)

## 👥 Client Endpoints

### Get All Clients

```http
GET /api/clients
```

**Response:**
```json
{
  "success": true,
  "clients": [
    {
      "id": "client_123",
      "firstName": "John",
      "lastName": "Doe",
      "company": "Acme Corp",
      "email": "john@example.com",
      "phone": "+1234567890",
      "address": "123 Main St",
      "notes": "Preferred contact method: email",
      "createdAt": "2024-01-01T00:00:00Z",
      "updatedAt": "2024-01-01T00:00:00Z"
    }
  ]
}
```

### Create Client

```http
POST /api/clients
```

**Request Body:**
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "company": "Acme Corp",
  "email": "john@example.com",
  "phone": "+1234567890",
  "address": "123 Main St",
  "notes": "Preferred contact method: email"
}
```

**Response:**
```json
{
  "success": true,
  "client": {
    "id": "client_123",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "createdAt": "2024-01-01T00:00:00Z"
  }
}
```

### Get Single Client

```http
GET /api/clients/{id}
```

### Update Client

```http
PUT /api/clients/{id}
```

### Delete Client

```http
DELETE /api/clients/{id}
```

## 🔔 Notification Endpoints

### Get Notifications

```http
GET /api/notifications?filter=all&limit=50&offset=0
```

**Parameters:**
- `filter` (string): `all`, `unread`, `contracts`, `clients`
- `limit` (number): Number of notifications to return
- `offset` (number): Pagination offset

**Response:**
```json
{
  "success": true,
  "notifications": [
    {
      "id": "notification_123",
      "type": "CONTRACT_CREATED",
      "title": "New Contract Created",
      "message": "Freelance Agreement has been created",
      "isRead": false,
      "contract": {
        "id": "contract_123",
        "title": "Freelance Agreement"
      },
      "client": {
        "id": "client_456",
        "firstName": "John",
        "lastName": "Doe"
      },
      "createdAt": "2024-01-01T00:00:00Z"
    }
  ],
  "unreadCount": 5
}
```

### Mark Notification as Read

```http
PUT /api/notifications/{id}
```

**Request Body:**
```json
{
  "isRead": true
}
```

### Delete Notification

```http
DELETE /api/notifications/{id}
```

## 📊 Analytics Endpoints

### Get Analytics Overview

```http
GET /api/analytics
```

**Response:**
```json
{
  "success": true,
  "data": {
    "totalContracts": 25,
    "signedContracts": 18,
    "sentContracts": 5,
    "draftContracts": 2,
    "conversionRate": 72.0,
    "averageTurnaround": 3.5,
    "monthlyTrends": [
      {
        "month": "2024-01",
        "created": 5,
        "signed": 4
      }
    ],
    "statusDistribution": {
      "DRAFT": 2,
      "SENT": 5,
      "SIGNED": 18,
      "EXPIRED": 0,
      "CANCELLED": 0
    },
    "recentActivity": [
      {
        "id": "contract_123",
        "title": "Freelance Agreement",
        "status": "SIGNED",
        "updatedAt": "2024-01-01T00:00:00Z"
      }
    ],
    "topClients": [
      {
        "id": "client_123",
        "name": "John Doe",
        "contractCount": 5,
        "signatureRate": 100.0
      }
    ]
  }
}
```

## 🔧 Admin Endpoints

### Create Backup

```http
POST /api/admin/backup
```

**Request Body:**
```json
{
  "options": {
    "includeUsers": true,
    "includeContracts": true,
    "includeClients": true,
    "includeTemplates": true,
    "includeNotifications": true
  }
}
```

**Response:**
```json
{
  "success": true,
  "message": "Backup created successfully",
  "backupPath": "/backups/backup-2024-01-01.json"
}
```

### List Backups

```http
GET /api/admin/backup
```

**Response:**
```json
{
  "success": true,
  "backups": [
    {
      "filename": "backup-2024-01-01.json",
      "size": 1024000,
      "created": "2024-01-01T00:00:00Z"
    }
  ]
}
```

### Export User Data

```http
GET /api/users/{id}/export
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "user_123",
      "email": "user@example.com",
      "firstName": "John",
      "lastName": "Doe"
    },
    "contracts": [...],
    "clients": [...],
    "notifications": [...],
    "exportedAt": "2024-01-01T00:00:00Z"
  }
}
```

## 🏥 Health Check

### System Health

```http
GET /api/health
```

**Response:**
```json
{
  "status": "healthy",
  "timestamp": "2024-01-01T00:00:00Z",
  "checks": {
    "database": true,
    "external_apis": true,
    "disk_space": true
  },
  "response_time": 150,
  "uptime": 86400000,
  "version": "1.0.0"
}
```

### Performance Metrics

```http
GET /api/monitoring/metrics?minutes=60
```

**Response:**
```json
{
  "success": true,
  "data": {
    "metrics": [...],
    "aggregated": {
      "avgResponseTime": 250.5,
      "maxResponseTime": 1200.0,
      "minResponseTime": 50.0,
      "totalRequests": 150,
      "totalErrors": 2,
      "avgMemoryUsage": 45.2,
      "maxMemoryUsage": 67.8
    },
    "system": {
      "nodeVersion": "v18.17.0",
      "platform": "linux",
      "arch": "x64",
      "uptime": 86400,
      "memoryUsage": {
        "rss": 67108864,
        "heapTotal": 25165824,
        "heapUsed": 18874368,
        "external": 1048576
      }
    }
  }
}
```

## ❌ Error Handling

### Error Response Format

```json
{
  "error": "Error message",
  "details": "Detailed error information",
  "code": "ERROR_CODE",
  "timestamp": "2024-01-01T00:00:00Z"
}
```

### Common Error Codes

| Code | Status | Description |
|------|--------|-------------|
| `UNAUTHORIZED` | 401 | Invalid or missing authentication token |
| `FORBIDDEN` | 403 | Insufficient permissions |
| `NOT_FOUND` | 404 | Resource not found |
| `VALIDATION_ERROR` | 400 | Invalid request data |
| `RATE_LIMIT_EXCEEDED` | 429 | Too many requests |
| `INTERNAL_ERROR` | 500 | Server error |

### Example Error Responses

**Validation Error:**
```json
{
  "error": "Validation failed",
  "details": [
    {
      "field": "email",
      "message": "Invalid email format"
    }
  ],
  "code": "VALIDATION_ERROR"
}
```

**Rate Limit Error:**
```json
{
  "error": "Rate limit exceeded",
  "limit": 100,
  "remaining": 0,
  "resetTime": 1640995200000,
  "code": "RATE_LIMIT_EXCEEDED"
}
```

## 🚦 Rate Limiting

### Limits by Endpoint

| Endpoint | Limit | Window |
|----------|-------|--------|
| `/api/contracts/generate` | 10 requests | 15 minutes |
| `/api/contracts` | 20 requests | 15 minutes |
| `/api/clients` | 30 requests | 15 minutes |
| `/api/notifications` | 50 requests | 15 minutes |

### Rate Limit Headers

```http
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1640995200
```

### Handling Rate Limits

```javascript
// Check rate limit headers
const limit = response.headers.get('X-RateLimit-Limit');
const remaining = response.headers.get('X-RateLimit-Remaining');
const resetTime = response.headers.get('X-RateLimit-Reset');

if (remaining === '0') {
  // Wait until reset time
  const waitTime = resetTime - Date.now();
  await new Promise(resolve => setTimeout(resolve, waitTime));
}
```

## 📝 Examples

### JavaScript/TypeScript

```javascript
// Create a new contract
const response = await fetch('/api/contracts', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({
    title: 'Freelance Agreement',
    type: 'Freelance',
    parties: ['John Doe', 'Jane Smith'],
    description: 'Web development services',
    clerkId: 'user_123'
  })
});

const data = await response.json();
```

### Python

```python
import requests

# Generate contract with AI
response = requests.post(
    'https://your-domain.com/api/contracts/generate',
    headers={
        'Authorization': f'Bearer {token}',
        'Content-Type': 'application/json'
    },
    json={
        'title': 'Freelance Agreement',
        'type': 'Freelance',
        'parties': ['John Doe', 'Jane Smith'],
        'description': 'Web development services',
        'clerkId': 'user_123'
    }
)

data = response.json()
```

### cURL

```bash
# Get all contracts
curl -X GET \
  'https://your-domain.com/api/contracts?clerkId=user_123' \
  -H 'Authorization: Bearer your_jwt_token' \
  -H 'Content-Type: application/json'

# Create a client
curl -X POST \
  'https://your-domain.com/api/clients' \
  -H 'Authorization: Bearer your_jwt_token' \
  -H 'Content-Type: application/json' \
  -d '{
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "company": "Acme Corp"
  }'
```

## 🔄 Webhooks

### Clerk Webhooks

SealTheDeal uses Clerk webhooks to sync user data:

**Endpoint:** `POST /api/webhooks/clerk`

**Supported Events:**
- `user.created`
- `user.updated`
- `user.deleted`

**Payload Example:**
```json
{
  "type": "user.created",
  "data": {
    "id": "user_123",
    "email_addresses": [
      {
        "email_address": "user@example.com",
        "id": "email_123"
      }
    ],
    "first_name": "John",
    "last_name": "Doe"
  }
}
```

## 📚 SDK and Libraries

### Official SDKs

- **JavaScript/TypeScript**: Built-in with Next.js
- **React**: Use React hooks for data fetching
- **Node.js**: Direct API calls with fetch or axios

### Community Libraries

- **Python**: Use requests library
- **PHP**: Use Guzzle HTTP client
- **Go**: Use net/http package
- **Ruby**: Use HTTParty or Faraday

## 🔐 Security Considerations

1. **Always use HTTPS** in production
2. **Validate all input** on both client and server
3. **Use proper authentication** tokens
4. **Implement rate limiting** on client side
5. **Handle errors gracefully**
6. **Log security events**
7. **Regular security audits**

## 📞 Support

For API support:
- **Documentation**: Check this guide first
- **GitHub Issues**: Report bugs and request features
- **Email**: api-support@sealthedeal.com
- **Discord**: Join our developer community

---

**API Version**: v1.0.0  
**Last Updated**: January 2024  
**Base URL**: `https://your-domain.com/api`
