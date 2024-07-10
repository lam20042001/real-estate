# Real Estate Web App
## Deployed Website
You can access the deployed website at the following link:
https://real-estate-client-9wbp.onrender.com
## Overview
This web application facilitates property discovery, management, and interaction. Users can explore detailed property listings for sale or rent, create and modify their own property listings, and engage with property owners and agents. Additionally, users can save favorite properties and contact sellers directly for inquiries.

## Features

### Property Listings and Search
- Users can browse and search for properties listed for sale or rent.

### Post Properties for Sale or Rent
- Property owners and agents can create new listings for properties available for sale or rent.
- Includes features to upload property photos, provide detailed descriptions, and specify pricing details.

### Manage Property Listings
- Users can edit existing property listings to update information such as price, availability, and property features.
- Ability to delete listings that are no longer available or relevant.

### Save Favorite Properties
- Registered users can save properties they are interested in to their favorites list for quick access later.
- Allows users to easily track and revisit properties of interest without searching again.

### Contact Property Sellers
- Users can send inquiries or messages directly to property sellers or agents regarding specific properties.

## Technologies Used
- **Backend Technologies:**
	- **Node.js**: JavaScript runtime for server-side development.
	- **Express.js**: Web application framework for Node.js.
	- **MongoDB**: NoSQL database for storing.

- **Frontend Technologies:**
	- **React**: JavaScript library for building user interfaces.
	- **Redux**: State management library for React applications.

## Prerequisites
Before running this application locally, make sure you have the following installed: **Node.js**

## Environment Variables

To run this project, you will need to add the following environment variables:

### For the Client (.env file in client directory):

- `REACT_APP_API_URL`

### For the Server (.env file in server directory):

- `DATABASE_URL`
- `EMAIL_FROM`
- `EMAIL_PASSWORD`
- `JWT_SECRET`
- `CLIENT_URL`
- `CLOUD_NAME`
- `API_KEY`
- `API_SECRET`

## Getting Started
### Running with Node.js

1. Clone the repository:

    ```
    git clone https://github.com/lam20042001/real-estate.git
    ```

2. Navigate to the project directory:

    ```
    cd real-estate
    ```

3. Set up the server:

    ```
    cd server
    npm install
    npm start
    ```

4. In a new terminal window, set up the client:

    ```
    cd ../client
    npm install
    npm start
    ```

5. Open a web browser and go to [http://localhost:3000](http://localhost:3000) to view the application. The client will interact with the server running on [http://localhost:8000](http://localhost:8000).
