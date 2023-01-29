# Helsinki city bike app
## Node.js server with MongoDB

### Requirements
- Git, NodeJS, Npm
- Postman or something equivalent for sending post request to import csv files to database 

### Usage
- Open a console, clone repository, install modules:
```bash
$ git clone https://github.com/Hnes-co/bikeApp-backend.git
$ cd bikeApp-backend
$ npm install
```
- Create .env file inside bikeApp-backend/ with following data:
```bash
MONGODB_URI=<mongodb_uri_here>
PORT=3001
```
- Start the server & check that the console logs a successful connection:
```bash
$ npm start
...
> Server running on port 3001
> connected to MongoDB
```


### Endpoints
#### /api/import
- Import journey / station data from csv files to database
- Data validation with mongoose schemas
### NOTE: This server is using MongoDB free cluster which has a 512MB storage limit.
### This means that the database can only hold about 1.5-2 million journey documents. 
#### Example usage with Postman:
- Make sure the server is running
- Download your csv file and place it inside bikeApp-backend/assets
- Open postman and create new POST request to http://localhost:3001/api/import
- To request headers add Content-Type: application/json
- To request body add:
```bash
{
  "paths": ["./assets/your_csv_filename.csv"],
  "type": "station" OR "journey"
}
```
- Note that "paths" is an array, you can import multiple csv files at once.
#### /api/journeys
- Get journeys
- Sorting & Filtering
- Limit of 1000 documents returned at once
#### /api/journeys/:index
- Get journeys at index for pagination
- Skips {index} number of documents and returns the next 1000 or remaining documents
#### /api/stations
- Get stations 
- Filtering
#### /api/stations/:id
- Get Journey data for a single station
- Number of journeys started from the station
- Number of journeys ended at the station
