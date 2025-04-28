# Game Backend Developer Assignment

## To run the completed project with Docker:

### Build the Docker image:
`npm run buildImage`

### Run the Docker container:
`npm run start`

### Access the services:

Firebase Emulator UI: http://localhost:5000

Admin Dashboard: http://localhost:5002

### Seed the database:
`npm run seed`


## To run the completed project locally:

### Install project dependencies:
Install Firebase CLI globally
`npm install -g firebase-tools`

### Install Functions dependencies
`cd functions`

`npm install`

`npm run build`

`cd ..`

### Install Admin dependencies
`cd admin`

`npm install`

`npm run build`

`cd ..`

### Start the Firebase emulators

`firebase emulators:start --project=demo-project`

### Access the services:

Firebase Emulator UI: http://localhost:5000

Admin Dashboard: http://localhost:5002

### Seed Database with curl or UI Button

`curl -X POST http://localhost:5102/demo-project/europe-west3/api/v1/games/seed`


##
##

This repository contains the boilerplate code for a coding assignment.
You have received 4 assignment tasks in a separate PDF by email.

## Disclaimer

*This boilerplate code is intentionally sloppy and incomplete.
Follow best practices, identify the flaws and improve the code where you see fit.*

## Preparation

- Download and install the [Firebase CLI](https://firebase.google.com/docs/cli)
- Download this repository as a zip (don't fork or clone) and commit the initial state to a new public repository of your choice (e.g. on Github).
- Commit your changes in meaningful units and speaking commit messages


## We have provided the boilerplate for:
1. The Firebase scaffolding to run in the Firebase Emulator
2. A `functions/` folder for cloud function endpoints based on express
   - Currently just one endpoint to fetch games
3. An `admin/` folder for an Admin frontend based on React and ant.design
   - Currently just the Layout and the Table view of existing games
      with a hardwired table content directly imported from a JSON file
4. The `games.json` file to seed a Firestore database (the same JSON file
   that's currently imported directly in the frontend)

*Note: Check the package.json scripts in the `functions/` and `admin/` folders*


## We will evaluate your submission by:

1. Cloning your repository
2. Reviewing your code
3. Running the package json scripts mentioned in the assignment PDF