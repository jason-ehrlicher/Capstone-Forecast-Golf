# ForeCast Golf Backend Documentation

## Overview

This documentation provides an overview of the ForeCast Golf backend system designed for weather data processing, event management, and user management. Built with Node.js and Express, the application interfaces with a MySQL database using Sequelize ORM for data storage and manipulation. It offers a comprehensive solution for managing events, users, and integrating external weather data into applications.

## Prerequisites
- Node.js installed on your system
- MySQL database setup and accessible
- Basic understanding of JavaScript, Node.js, Express, and Sequelize ORM

## Setup and Installation

1. Clone the Repository: Clone the backend system code from its repository to your local machine.
2. Install Dependencies: Navigate to the project's root directory and execute `npm install` to install all necessary dependencies.
3. Configure Environment Variables: Create a .env file in the root directory and configure the following variables:
    - PORT: Port on which the server will run (e.g., 3000).
    - DB_NAME: Name of your MySQL database.
    - DB_USER: Username for MySQL database access.
    - DB_PASSWORD: Password for the MySQL database user.
    - DB_HOST: Hostname where your MySQL database is hosted (typically localhost).
    - OPENWEATHER_API_KEY: API key for accessing OpenWeather data.

## Running the Application

Start the server by running `node server.js` (or `npm start` if you have defined a start script in package.json) from the root directory. Ensure your MySQL database is running before you start the application.

## Application Structure

- server.js: Main application file where the Express app is defined and middleware is configured.
- /controllers: Contains controllers for handling the logic for user and event routes, processing weather data, and managing rounds played data.
- /models: Contains Sequelize models for users and events, and modules for processing weather and rounds played data.
- /routes: Defines routes for users, events, and API endpoints for fetching weather and rounds played data.
- /dbConnect.js: Manages the connection to the MySQL database with Sequelize.
- /data: Directory intended for storing CSV files or other data files used by the application.

## API Endpoints

### User Routes
- GET /api/users: Fetch all users.
- POST /api/users: Create a new user.
- PUT /api/users/:id: Update a user by ID.
- DELETE /api/users/:id: Delete a user by ID.

### Event Routes
- GET /api/events: Fetch all events.
- POST /api/events: Create a new event.
- PUT /api/events/:id: Update an event by ID.
- DELETE /api/events/:id: Delete an event by ID.

### Weather Data Routes
- GET /weather: Fetch processed weather data.
- GET /rounds-played: Fetch combined weather and rounds played data.
- GET /weather-by-location: Fetch weather data by geographic coordinates.


## Database Schemas
- User: Defines user attributes such as name, email, password, and preferences.
- Event: Contains event details including title, start and end dates, and relation to users.

## Controllers

Each endpoint is handled by a controller that performs CRUD operations on the database or processes data, ensuring modularity and separation of concerns.

## Error Handling

The application includes error handling to return appropriate responses and status codes to the client for various failure scenarios.

## Security Considerations
- Validate and sanitize all user inputs to prevent SQL injection and cross-site scripting (XSS) attacks.
- Store sensitive information like database credentials and API keys in environment variables.
- Implement authentication and authorization mechanisms to protect sensitive endpoints and data.

For more detailed implementation insights, refer to the comments and code within each file of the application. This guide offers a starting point for understanding and extending the backend system according to specific requirements.






