# 🏘️ Barangay Information System (BIS)

A comprehensive full-stack web application for managing barangay (village) information, residents, households, incidents, and official documents with role-based access control.

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Database Structure](#database-structure)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Application](#running-the-application)
- [API Endpoints](#api-endpoints)
- [User Roles](#user-roles)
- [Project Structure](#project-structure)

---

## ✨ Features

### 👥 Resident Management
- Add, view, update, and delete resident records
- Store personal information (name, DOB, address, contact details)
- Photo upload for each resident
- Search and filter capabilities

### 🏠 Household Management
- Manage household information
- Track household members
- Classification (socio-economic status)
- Special categories: Senior citizens, PWDs, solo parents, indigents

### ⚠️ Incident Management
- Record and manage incidents
- Track resolution status (Settled, Referred, Ongoing)
- Store mediation records and outcomes
- Date and type tracking

### 📄 Document Management
- Generate and manage official documents
- Barangay certificates
- Document templates

### 🔐 User Management & Authentication
- **Admin**: Full access to all features including user account management
- **Staff**: Access to resident, household, incident, and document management (no admin features)
- JWT-based authentication (24-hour token expiration)
- Password hashing with bcryptjs
- Secure login system

---

## 🛠️ Tech Stack

### Backend
- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MySQL
- **Authentication:** JWT (jsonwebtoken)
- **Password Hashing:** bcryptjs
- **File Upload:** Multer
- **CORS:** Enabled for frontend communication

### Frontend
- **Framework:** React 18
- **Build Tool:** Vite
- **UI Library:** Material-UI (MUI)
- **HTTP Client:** Axios
- **Routing:** React Router v6
- **Icons:** Material-UI Icons

---

## 📊 Database Structure

### Tables

#### `residents`
- id (INT, AUTO_INCREMENT, PRIMARY KEY)
- first_name, middle_name, last_name (VARCHAR)
- dob (DATE)
- gender (ENUM: Male, Female, Other)
- civil_status (VARCHAR)
- place_of_birth (VARCHAR)
- address (VARCHAR)
- household_no (VARCHAR)
- phone, email (VARCHAR)
- photo (VARCHAR) - URL path
- created_at, updated_at (TIMESTAMP)

#### `households`
- id (INT, AUTO_INCREMENT, PRIMARY KEY)
- household_no (VARCHAR, UNIQUE)
- head_of_family (VARCHAR)
- members (TEXT)
- socio_economic_classification (VARCHAR)
- senior_citizens, pwds, solo_parents, indigents (INT)
- created_at (TIMESTAMP)

#### `incidents`
- id (INT, AUTO_INCREMENT, PRIMARY KEY)
- date (DATE)
- type (VARCHAR)
- persons_involved (TEXT)
- resolution_status (ENUM: Settled, Referred, Ongoing)
- mediation_records (TEXT)
- outcome (TEXT)
- created_at (TIMESTAMP)

#### `accounts`
- user_id (INT, AUTO_INCREMENT, PRIMARY KEY)
- username (VARCHAR, UNIQUE)
- password (VARCHAR, hashed)
- role (ENUM: Admin, Staff)
- created_at (TIMESTAMP)

---

## 🚀 Installation

### Prerequisites
- Node.js (v14 or higher)
- MySQL Server (v5.7 or higher)
- npm or yarn

### Backend Setup

```bash
cd backend
npm install
```

### Frontend Setup

```bash
cd frontend
npm install
```

---

## ⚙️ Configuration

### Backend `.env` File

Create a `.env` file in the `backend` directory:

```env
PORT=4000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password_here
DB_DATABASE=barangay_bis
DB_PORT=3306
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
```

### Frontend Environment Variables

Create a `.env` file in the `frontend` directory:

```env
VITE_API_URL=http://localhost:4000/api
```

### MySQL Database Setup

Run this SQL to create the database and tables:

```sql
CREATE DATABASE IF NOT EXISTS barangay_bis;
USE barangay_bis;

CREATE TABLE IF NOT EXISTS residents (
  id INT AUTO_INCREMENT PRIMARY KEY,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  middle_name VARCHAR(100),
  dob DATE,
  gender ENUM('Male','Female','Other'),
  civil_status VARCHAR(50),
  place_of_birth VARCHAR(200),
  address VARCHAR(255),
  household_no VARCHAR(50),
  phone VARCHAR(50),
  email VARCHAR(100),
  photo VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS households (
  id INT AUTO_INCREMENT PRIMARY KEY,
  household_no VARCHAR(50) NOT NULL UNIQUE,
  head_of_family VARCHAR(100) NOT NULL,
  members TEXT,
  socio_economic_classification VARCHAR(100),
  senior_citizens INT DEFAULT 0,
  pwds INT DEFAULT 0,
  solo_parents INT DEFAULT 0,
  indigents INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS incidents (
  id INT AUTO_INCREMENT PRIMARY KEY,
  date DATE NOT NULL,
  type VARCHAR(100) NOT NULL,
  persons_involved TEXT,
  resolution_status ENUM('Settled', 'Referred', 'Ongoing') DEFAULT 'Ongoing',
  mediation_records TEXT,
  outcome TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS accounts (
  user_id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role ENUM('Admin', 'Staff') NOT NULL DEFAULT 'Staff',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## ▶️ Running the Application

### Terminal 1 - Start Backend

```bash
cd backend
npm run dev
```

Expected output:
```
✅ Connecting to DB: root @ localhost
✅ Server running on port 4000
```

### Terminal 2 - Start Frontend

```bash
cd frontend
npm run dev
```

Expected output:
```
VITE v5.x.x  ready in xxx ms
➜  Local:   http://localhost:5173/
```

### Access the Application

Open your browser and navigate to:
```
http://localhost:5173/
```

---

## 🔌 API Endpoints

### Authentication (`/api/auth`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/login` | Login with username/password, returns JWT token |
| GET | `/auth/me` | Get current user info (requires token) |
| POST | `/auth/logout` | Logout endpoint |

**Login Request:**
```json
{
  "username": "admin",
  "password": "password123"
}
```

**Login Response:**
```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "user_id": 1,
    "username": "admin",
    "role": "Admin"
  }
}
```

### Residents (`/api/residents`)

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/residents` | Get all residents | Required |
| GET | `/residents/:id` | Get single resident | Required |
| POST | `/residents` | Create resident (with photo upload) | Required |
| PUT | `/residents/:id` | Update resident | Required |
| DELETE | `/residents/:id` | Delete resident | Required |

### Accounts (`/api/accounts`) - Admin Only

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/accounts` | Get all accounts |
| GET | `/accounts/:userId` | Get single account |
| POST | `/accounts` | Create new account |
| PUT | `/accounts/:userId` | Update account |
| DELETE | `/accounts/:userId` | Delete account |

### Households, Incidents, Documents

Similar CRUD operations available for:
- `/api/households`
- `/api/incidents`
- `/api/documents`

---

## 👥 User Roles

### Admin
✅ Manage Accounts (create, edit, delete users)
✅ Manage Residents
✅ Manage Households
✅ Manage Incidents
✅ Manage Documents
✅ View Certificates

### Staff
✅ Manage Residents
✅ Manage Households
✅ Manage Incidents
✅ Manage Documents
✅ View Certificates
❌ Cannot access Manage Accounts

---

## 📁 Project Structure

```
barangay-main/
├── backend/
│   ├── src/
│   │   ├── index.js                 # Express server
│   │   ├── config/
│   │   │   └── db.js               # MySQL connection
│   │   ├── routes/
│   │   │   ├── auth.js             # Authentication
│   │   │   ├── accounts.js         # User management (Admin only)
│   │   │   ├── residents.js        # Resident CRUD
│   │   │   ├── households.js       # Household CRUD
│   │   │   ├── incidents.js        # Incident CRUD
│   │   │   └── documents.js        # Document CRUD
│   │   └── utils/
│   │       └── checkDb.js          # Database diagnostics
│   ├── uploads/                     # File uploads directory
│   ├── .env                         # Environment variables
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── App.jsx                 # Main app with routing & auth
│   │   ├── main.jsx                # Entry point
│   │   ├── api/
│   │   │   ├── authApi.js          # Authentication API client
│   │   │   ├── residentsApi.js     # Residents API client
│   │   │   ├── accountsApi.js      # Accounts API client
│   │   │   ├── householdsApi.js    # Households API client
│   │   │   ├── incidentsApi.js     # Incidents API client
│   │   │   └── documentsApi.js     # Documents API client
│   │   ├── pages/
│   │   │   ├── LoginPage.jsx       # Login form
│   │   │   ├── ResidentsPage.jsx   # Residents management
│   │   │   ├── HouseholdsPage.jsx  # Households management
│   │   │   ├── IncidentsPage.jsx   # Incidents management
│   │   │   ├── DocumentsPage.jsx   # Documents management
│   │   │   ├── CertificatePage.jsx # Certificate generation
│   │   │   └── Manageuser.jsx      # User account management (Admin only)
│   │   ├── components/
│   │   │   ├── UserForm.jsx        # User creation/edit dialog
│   │   │   ├── residentForm.jsx    # Resident form
│   │   │   ├── HouseholdForm.jsx   # Household form
│   │   │   ├── IncidentForm.jsx    # Incident form
│   │   │   └── DocumentForm.jsx    # Document form
│   │   ├── theme/
│   │   │   └── theme.js            # Material-UI theme
│   │   └── assets/
│   ├── .env                         # Environment variables
│   └── package.json
│
├── .gitignore
└── README.md
```

---

## 🔑 Default Test Credentials

After creating accounts, use these to test:

```
Username: admin
Password: admin123

Username: staff
Password: staff123
```

*Note: Use the Manage Account page (as Admin) to create these accounts or insert them directly into the database.*

---

## 🛡️ Security Features

- ✅ Password hashing with bcryptjs (10 salt rounds)
- ✅ JWT token-based authentication (24-hour expiration)
- ✅ Role-based access control (RBAC)
- ✅ Protected API routes requiring authentication
- ✅ Admin-only endpoints for sensitive operations
- ✅ CORS enabled with Express
- ✅ Environment variables for sensitive data

---

## 📝 License

This project is licensed under the MIT License.

---

## 👨‍💻 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

## 📧 Support

For issues or questions, please create an issue in the GitHub repository.

---

**Last Updated:** November 6, 2025
**Version:** 1.0.0