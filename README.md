# Time Capsule API

## Overview

Time Capsule is a Node.js-based API for creating, storing, and retrieving time-locked capsules. Users can create capsules with messages and set unlock times. The API allows users to retrieve the capsules when the unlock time has passed and ensures the capsule expires 30 days after the unlock time.

This API also handles the creation of secure unlock codes, validation of those codes, and manages capsule expiration through a background task.

## Features

- **Create a Capsule**: Allow users to create time-locked capsules with a message and an unlock time.
- **Retrieve a Capsule**: Users can retrieve a capsule using a valid unlock code after the unlock time has passed.
- **Capsule Expiration**: Capsules expire 30 days after the unlock time, and expired capsules return a `410 Gone` status.
- **Capsule Listing**: Paginated listing of capsules for the user.
- **Capsule Update/Delete**: Update or delete capsules before the unlock time.

## Technologies

- **Node.js**: Backend server
- **Express.js**: Web framework
- **Sequelize ORM**: PostgreSQL database interaction
- **PostgreSQL**: Database for storing capsule data
- **Moment.js**: Date-time handling
- **Cron Jobs**: Periodic background task to mark expired capsules

## Installation

### Prerequisites

- **Node.js** and **npm** installed on your machine.
- A PostgreSQL database running locally or remotely.
  
### Steps to install:

1. Clone this repository:
   ```bash
   git clone https://github.com/yourusername/time-capsule-api.git
