# Event Management System

This is an Event Management System built with the MERN (MongoDB, Express, React, Node.js) stack. This repository contains both the backend (Node.js server) and frontend (React.js app) for the project.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Getting Started](#getting-started)
    - [Pulling the Repository](#pulling-the-repository)
    - [Setting up the Backend](#setting-up-the-backend)
    - [Setting up MongoDB](#setting-up-mongodb)
    - [Setting up the Frontend](#setting-up-the-frontend)
3. [Login Credentials](#login-credentials)
4. [Running the Project](#running-the-project)
5. [Folder Structure](#folder-structure)
6. [License](#license)

---

## Prerequisites

Before you begin, make sure you have the following installed on your system:

- [Node.js](https://nodejs.org/) (LTS version)
- [MongoDB](https://www.mongodb.com/try/download/community) (for local development)
- [Git](https://git-scm.com/)

---

## Getting Started

### Pulling the Repository

First, you need to clone the repository to your local machine. You can do this using the following Git command:

```bash
git clone https://github.com/sivanarayanamiriyala/EventManagementSystem.git
This will create a local copy of the repository in your current directory.

Setting up the Backend
Navigate to the backend/ directory:

bash
Copy code
cd EventManagementSystem/backend
Install the backend dependencies using npm:

bash
Copy code
npm install
Create an .env file in the backend/ directory for environment variables. This file should contain:

bash
Copy code
MONGO_URI=mongodb://localhost:27017/event_management
JWT_SECRET=your_jwt_secret_key
MONGO_URI should point to your local MongoDB instance (mongodb://localhost:27017/event_management).
JWT_SECRET can be any secret key you choose, which will be used for encoding JSON Web Tokens (JWT) for authentication.
To run the backend server, use the following command:

bash
Copy code
npm start
The backend server will now be running at http://localhost:5000.

Setting up MongoDB
Download and Install MongoDB:

Download MongoDB from MongoDB Community Edition.
Install it based on your operating system's instructions.
Start MongoDB:

Open a new terminal window and start MongoDB with the following command (make sure MongoDB is installed and available in your system's PATH):
bash
Copy code
mongod
MongoDB will start running on localhost:27017 by default.

Setting up the Frontend
Navigate to the frontend/ directory:

bash
Copy code
cd EventManagementSystem/frontend
Install the frontend dependencies using npm:

bash
Copy code
npm install
Run the React app:

bash
Copy code
npm start
The React app will now be running at http://localhost:3000.

Login Credentials
To log in to the system, use the following default credentials:

Username: admin
Password: admin123
These credentials are used to authenticate users in the system. You can later update them in the backend database if needed.

Running the Project
Backend: The backend should be running at http://localhost:5000.
Frontend: The frontend should be running at http://localhost:3000.
Make sure both are running to fully test the Event Management System.

Folder Structure
The folder structure of the project is as follows:

bash
Copy code
EventManagementSystem/
│
├── backend/                # Node.js backend
│   ├── models/             # MongoDB models
│   ├── routes/             # API routes
│   ├── controllers/        # Controllers for handling requests
│   ├── server.js           # Main entry point for the server
│   └── .env                # Environment variables for the backend
│
└── frontend/               # React frontend
    ├── src/
    │   ├── components/     # React components
    │   ├── App.js          # Main entry point for the React app
    │   └── index.js        # React app renderer
    └── public/              # Static assets for the frontend
License
This project is licensed under the MIT License - see the LICENSE file for details.
