# 🎥 Movie Rental System

**Created by Michael O'Brien**

## 📖 Overview

This CLI application serves as a management tool for a movie rental system. It allows users to interact with a PostgreSQL database containing information about movies, customers, and movie rentals.

## ✨ Features

- 🗃 **Create Database Tables:** Automatically sets up tables for movies, customers, and rentals if they don't already exist.
- 🎬 **Insert New Movies:** Easily add new movies to the database.
- ✉️ **Update Customer Email:** Change a customer's email address when needed.
- 🗑 **Remove Customers:** Delete a customer and their rental history from the database.
- 📋 **Display All Movies:** View a list of all movies available in the database.

## 🛠 Prerequisites

Before running this application, ensure you have the following installed:

- **Node.js** (v22 is recommended)
- **PostgreSQL** server running

## 🚀 How to Use this Template

This repository is set up as a **GitHub template** to help you quickly create your own version of the **Movie Rental System**.

### 📥 Steps to Create Your Own Repository

1. **Click the "Use this template" button** at the top of this page on GitHub.
2. **Name your new repository** and choose its visibility (**public** or **private**).

3. Once your repository is created, **clone your new repo** to your local machine:

   ```bash
   git clone <your-new-repo-url>
   ```

4. Navigate into the project directory and install the necessary dependencies:

   ```bash
   cd <your-new-repo-name>
   npm install
   ```

5. **Run the app:**
   ```bash
   node index.js
   ```

By using this template, you'll have the project structure and initial setup ready to go, so you can focus on building the functionality! 🚀

## 🎮 Usage

Run the application with the following commands:

### 🔹 Insert a Movie

To insert a new movie, use:

```bash
node index.js insert "<title>" <year> "<genre>" "<director>"
Example:
```

```bash
Copy code
node index.js insert "Inception" 2010 "Science Fiction" "Christopher Nolan"
🔹 Show All Movies
To display all movies in the database, use:
```

```bash
Copy code
node index.js show
🔹 Update Customer Email
To update a customer's email address, use:
```

```bash
Copy code
node index.js update <customer_id> "<new_email>"
Example:
```

```bash
Copy code
node index.js update 1 "newemail@example.com"
🔹 Remove a Customer
To remove a customer from the database, use:
```

```bash
Copy code
node index.js remove <customer_id>
Example:
```

```bash
Copy code
node index.js remove 1
🔹 Help Command
To view all available commands, use:
```

```bash
Copy code
node index.js
```

📌 Notes
✅ PostgreSQL Server: Make sure your PostgreSQL server is running and that you have created a database for the application to connect to.
🔧 Database Configuration: Modify the database connection details in the code to match your PostgreSQL setup.
