
# Forecast Golf 

## Website Summary and Application Flow

ForeCast Golf is a comprehensive golf course management application designed to streamline operations, optimize decision-making, and enhance the overall golfing experience. This application provides a centralized platform for golf course managers, administrators, and staff to track daily rounds played, manage events using a calendar interface, access weather data and forecasts, and gain insights through data visualizations and reports.

[User Flow](https://github.com/jason-ehrlicher/Mini-Project-II/assets/145376122/af2fed89-19f5-4855-9c8d-007785b09466)


[ForeCast Golf](https://docs.google.com/document/d/1EcNyStuKZMT6oxdce0QkIrljRRvrvcrXnfQdPf7P0r8/edit?usp=sharing)

## Figma
[Lo-Fi Figma](https://www.figma.com/file/FGMenTFkTijGt2Roxo0Ycj/Untitled?type=design&node-id=0%3A1&mode=design&t=6JYsDUN32u71WAn0-1)

## Project Status
**Under Construction** - The website is currently in development. More features and functionalities will be added progressively. Stay tuned for updates!

## Planned Features
- **Dashboard**: The "Dashboard" provides an interactive overview of key golf course metrics and recent activities, offering a quick snapshot of the course's current status and operations.
- **Calendar**: The "Calendar" feature is a scheduling tool for managing golf course events, maintenance, and personal appointments. It integrates with other app features, supports reminders and invitations, and offers a clear, easy-to-navigate interface.
- **Weather**: The "Weather" feature provides real-time weather updates and forecasts specifically for golf courses. It includes information on temperature, wind speed, and precipitation, along with advanced forecasting to aid in planning and safety.
- **Manage Team**: "Team Management" is a platform for organizing golf course staff into roles like administrators, managers, and users. It offers role assignment, performance tracking, and a user-friendly interface for efficient staff management.
- **Reports**: The "Reports" feature enables the generation and viewing of comprehensive reports detailing various aspects of golf course activity, aiding in data-driven decision-making.
- **History**: "History" allows for the uploading and analysis of historical golf course data, offering insights into long-term trends and operational efficiencies.
- **Upload**: The "Upload" feature offers a secure platform for users to upload and manage golf-related data, ensuring easy access and organization of important information.
- **Forecast**: "Forecast" provides advanced tools for predicting outcomes and trends in golf course activity, aiding in strategic planning and resource allocation.


## Technology Stack 
- **Frontend:** React JS, HTML, CSS, JavaScript
- **Backend:** Express.js framework on Node.js for RESTful API services, Sequelize ORM for database management.
- **Database:** MySQL for storing user, event, and other data.
- **Additional Tools:** Node-fetch for external API calls (e.g., weather data fetching), CORS for handling cross-origin requests, dotenv for environment variable management.
- **External APIs:** OpenWeatherMap
- **Charting Libraries:** Nivo
- **UI Components:** Material-UI

  [Architecture Diagram](https://github.com/jason-ehrlicher/Mini-Project-II/assets/145376122/1f3bbdcb-efc9-4c66-b5c5-0e8bd8b88450)


## Frontend Overview
The frontend is developed using React JS, emphasizing modularity and reusability of components. The application structure is designed to support scalability and ease of maintenance.

-  **Dashboard, Reports, Weather, and More:** Separate scenes for each major feature, facilitating organized development and navigation.
-  **Topbar and Sidebar:** Global components for navigation and settings, enhancing user experience and accessibility.
-  **Custom Hooks and Contexts:** For managing themes, authentication, and location services, ensuring a consistent and dynamic UI across the platform.
-  **Theme Customization:** Utilizes MUI's theme capabilities to support light and dark modes, with custom tokens for color schemes and typography, adapting the UI to user preferences.
- **Protected Routes:** Leveraging React Router and context for authentication, securing access to application features based on user session.
-  **Responsive Design:** Ensures a seamless experience across devices, with adjustments to layout and navigation elements for mobile and desktop views.


## Backend Overview
The backend architecture is structured to support the website's core functionalities, including user management, event scheduling, weather forecasting, and data analysis. Key components include:

- **Controllers:** Manage the logic for handling requests and responses, including user and event management.
- **Models:** Define the data structure for users, events, and other entities, facilitating interaction with the MySQL database.
- **Routes:** Define API endpoints for frontend-backend communication, ensuring seamless data flow for features like the calendar, weather updates, and team management.
- **Utilities:** Include functions for processing and analyzing weather and golf rounds data, supporting the Forecast and History features.

Further backend documentation can be found in the [server](https://github.com/jason-ehrlicher/Mini-Project-II/tree/main/server) folder

## Prerequisites
- Node.js
- MySQL Database
- OpenWeatherMap API Key

## Installation
1. Clone the repository:
   `git clone https://github.com/jason-ehrlicher/Mini-Project-II.git`
   
2. Navigate to the project directory:
   `cd mini-project-ii`

3. Install the dependencies for the frontend and backend:
- `cd mini-project2`
- `npm install`

- `cd ../server`
- `npm install`

4. Setup the MySQL database
  - Create a new MySQL database for the application
  - Update the database configuration in `dbconnect.js`

5. Setup enviromental variables:
   - Create a `.env` file in the `server` directory
   - Specify the requires environment variables such as `DB_HOST`, `DB_USER`, `DB_PASSWORD`, and `DB_NAME`

6. Start the development server:
  - `cd server`
  - `nodemon server.js`

  - `cd ../mini-project2`
  - `npm run dev`

7. Access the application at http://localhost:5173


## Contribution
As the website is still under construction, we are open to ideas and suggestions. If you're interested in contributing or have feedback, please reach out to Jason Ehrlicher.

## Future Updates
Stay tuned for updates regarding the development progress, feature releases, and launch details.

## Contact
For inquiries, suggestions, or collaboration opportunities, please contact Jason Ehrlicher at [jason.ehrlicher@gmail.com](mailto:jason.ehrlicher@gmail.com).
