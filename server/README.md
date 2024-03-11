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
- `GET /api/users`: Retrieve all users
- `GET /api/users/:id`: Retrieve a user by ID
- `POST /api/users/create`: Create a new user
- `PUT /api/users/:id`: Update a user by ID
- `DELETE /api/users/:id`: Delete a user by ID
- `POST /api/users/signin`: User sign-in


### Event Routes
- `GET /api/events`: Retrieve all events
- `POST /api/events`: Create a new event
- `PUT /api/events/:id`: Update an existing event by ID
- `DELETE /api/events/:id`: Delete an event by ID


### Daily Rounds Routes
- `GET /api/dailyRounds`: Retrieve all golf rounds
- `GET /api/dailyRounds/date/:date`: Retrieve golf rounds by date
- `POST /api/dailyRounds`: Create a new golf round
- `PUT /api/dailyRounds/:id`: Update an existing golf round by ID
- `PUT /api/dailyRounds/date/:date`: Update golf rounds by date
- `DELETE /api/dailyRounds/:id`: Delete a golf round by ID
- `DELETE /api/dailyRounds/date/:date`: Delete golf rounds by date


### Weather Data Routes
- `GET /api/weatherData`: Retrieve all weather data
- `GET /api/weatherData/date/:date`: Retrieve weather data by date
- `POST /api/weatherData`: Create a new weather data record
- `PUT /api/weatherData/:id`: Update an existing weather data record by ID
- `DELETE /api/weatherData/:id`: Delete a weather data record by ID

### Prediction Routes
- `POST /api/prediction`: Get the rounds played prediction for a specific day

### Other Routes
- `GET /weather`: Retrieve weather data
- `GET /rounds-played`: Retrieve rounds played data
- `GET /weather-by-location`: Retrieve weather data by location

**Request and Response Formats**
- All requests and responses are in JSON format.
- For `POST` and `PUT` requests, the request body should include the necessary fields for creating or updating a resource.
- Successful responses will include the relevant data or a success message.
- Error responses will include an error message and an appropriate HTTP status code.

**Authentication and Authorization**
- Some routes may require authentication and authorization.
- Protected routes may require a valid token or session to be included in the request headers.

**Error Handling**
- If a resource is not found, the API will respond with a 404 status code and an error message.
- If there is an error processing the request, the API will respond with a 500 status code and an error message.
- Validation errors will be returned with a 400 status code and an error message indicating the specific validation failure.

**Rate Limiting and Throttling**
- The API may implement rate limiting or throttling to prevent abuse and ensure fair usage.
- If the rate limit is exceeded, the API will respond with a 429 status code and an error message.




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






