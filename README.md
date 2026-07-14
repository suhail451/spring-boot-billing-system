# Billing & Inventory Management System

A full-stack billing, inventory, and point-of-sale management system built with **Java Spring Boot** on the backend and **HTML, CSS, and JavaScript** on the frontend. The application supports secure session-based authentication, bill creation and printing, inventory management, sales tracking, and billing history.

## Features

- 🔐 **Session-based Authentication** — Secure signup and login flow to protect access to the system
- 🧾 **Billing** — Create bills, save them, and print invoices directly from the dashboard
- 📦 **Inventory Management** — Add and delete inventory items with real-time updates
- 📊 **POS (Point of Sale) Analytics** — View today's total sales, weekly sales, and monthly sales at a glance
- 🕘 **Billing History** — Look back at bills printed on any given date

## Tech Stack

| Layer          | Technology                     |
|-----------------|---------------------------------|
| Backend         | Java, Spring Boot               |
| Frontend        | HTML, CSS, JavaScript           |
| Security        | Session-based Authentication    |

## Application Flow

Below is a walkthrough of the application screens in the order a user would typically navigate through them.

### 1. Home Page
The landing screen of the application, giving users entry into the system after login.

![Home Page](images/HomePage.jpeg)

### 2. Bill Dashboard
Create a new bill, save it, and print the invoice directly from this screen.

![Bill Dashboard](images/Bill_Dashoard.jpeg)

### 3. Inventory Dashboard
Manage stock by adding new inventory items or deleting existing ones.

![Inventory Dashboard](images/Inventry_Dashboard.jpeg)

### 4. POS Dashboard
Track sales performance with a quick view of today's total sales, this week's sales, and this month's sales.

![POS Dashboard](images/POs-Dashboard.jpeg)

### 5. History
Review past bills, including which invoices were printed on any given date.

![History](images/History.jpeg)

## Getting Started

### Prerequisites
- Java 17+ (or your project's target JDK version)
- Maven or Gradle
- A running database instance (MySQL/PostgreSQL, depending on your configuration)

### Setup
```bash
# Clone the repository
git clone <your-repo-url>
cd <project-folder>

# Build the project
mvn clean install

# Run the application
mvn spring-boot:run
```

The application will start on `http://localhost:8080` (or your configured port).

## Project Structure

```
project-root/
├── src/
│   ├── main/
│   │   ├── java/          # Spring Boot backend source
│   │   └── resources/     # Static frontend (HTML, CSS, JS), templates, config
├── images/                 # README screenshots
│   ├── HomePage.jpeg
│   ├── Bill_Dashoard.jpeg
│   ├── Inventry_Dashboard.jpeg
│   ├── POs-Dashboard.jpeg
│   └── History.jpeg
└── README.md
```

## License

This project is currently unlicensed / for personal or academic use. Update this section if you plan to open-source it.
