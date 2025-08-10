# Manual API Testing for Co-Shop Vendor APIs

## 🔧 **Cookie Handling Issue - Manual Solution**

### **Step 1: Get Authentication Cookie**

**Request:**
```
POST http://localhost:9000/auth/session
Content-Type: application/json

{
  "email": "admin@coshop.com",
  "password": "supersecret123"
}
```

**Response Headers to Look For:**
```
Set-Cookie: connect.sid=s%3A[long-string]; Path=/; HttpOnly
```

### **Step 2: Copy the Cookie Value**

From the response headers, copy the **entire Set-Cookie value**, for example:
```
connect.sid=s%3Aabcdefghijklmnopqrstuvwxyz.1234567890; Path=/; HttpOnly
```

### **Step 3: Use Cookie in Admin Requests**

**Request:**
```
GET http://localhost:9000/admin/vendors
Cookie: connect.sid=s%3Aabcdefghijklmnopqrstuvwxyz.1234567890
```

## 🧪 **Testing Order:**

### 1. **Health Check (No Auth)**
```
GET http://localhost:9000/health
```
Expected: `{"status": "ok"}`

### 2. **Store APIs (No Auth)**
```
GET http://localhost:9000/store/vendors
```
Expected: `{"vendors": []}`

### 3. **Admin Login**
```
POST http://localhost:9000/auth/session
Content-Type: application/json

{
  "email": "admin@coshop.com",
  "password": "supersecret123"
}
```
Expected: Status 200 + Set-Cookie header

### 4. **Admin APIs (With Cookie)**
```
GET http://localhost:9000/admin/vendors
Cookie: [paste the cookie from step 3]
```

### 5. **Create Test Vendor**
```
POST http://localhost:9000/admin/vendors
Content-Type: application/json
Cookie: [paste the cookie from step 3]

{
  "email": "farmer1@example.com",
  "name": "John Farmer",
  "farm_name": "Green Valley Farm",
  "farm_description": "Organic vegetables and fruits",
  "phone": "+1-555-0123",
  "address": "123 Farm Road",
  "city": "Farmville",
  "state": "CA",
  "zip_code": "95123",
  "country": "USA",
  "commission_rate": 10.0,
  "is_active": true
}
```

## 🚨 **Common Issues:**

1. **"Unauthorized" Error** = Wrong cookie or expired session
2. **"404 Not Found"** = Wrong endpoint URL
3. **"500 Internal Error"** = Service not properly registered

## 🔧 **Postman Settings:**

1. **Turn OFF** automatic cookie handling
2. **Manually copy/paste** cookies between requests
3. Use **Environment Variables** to store cookies
4. Check **Headers** tab for Set-Cookie responses
