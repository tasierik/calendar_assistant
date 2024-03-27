# Calendar Assistant

Calendar Assistant is a full-stack app for managing accommodations, handling bookings, rooms, and guests easily. It offers reports and supports many user roles. This guide covers the technologies used and how to set up and run the app.

## Technologies Used

- **Backend:** Utilizes Java with Spring Boot, employing Gradle as the build tool.
- **Database:** Employs MongoDB for data storage.
- **Frontend:** Built with ReactJS, leveraging Vite for efficient bundling and DaisyUI for stylish UI components. It also includes ReactBigCalendar for calendar functionalities.

## Prerequisites

Ensure the following are installed before proceeding with the setup:
- Docker and Docker Compose for containerization.
- Java JDK (Version 11 or newer) for running the backend.
- Node.js and npm for managing frontend dependencies.

## Setup Instructions

### MongoDB Initialization

1. Navigate to the `calendar_assistant_docker` folder and initiate MongoDB with sample data by running:

```bash
docker-compose up -d
```
### Backend Server
To start the backend server, navigate to the backend folder and execute the following command:

```bash
./gradlew bootRun
```

### Frontend Application
For the frontend part, move to the frontend folder and run the following commands to install dependencies, build, and start the React application:

```bash
npm install
npm run build
npm start
```
### Accessing the Application
After completing the setup steps, the application will be available at http://localhost:3000 in your web browser.
