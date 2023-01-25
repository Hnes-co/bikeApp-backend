import express from 'express';
import { importCsvToDatabase } from './assets/databaseImport';
import mongoose from 'mongoose';
import * as dotenv from 'dotenv';
import cors from 'cors';
import Journey from './models/journey';
dotenv.config();
const app = express();
app.use(express.json());
app.use(cors());
const PORT = process.env.PORT;
const MONGODB_URI = process.env.MONGODB_URI ?? "";

mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('connected to MongoDB');
  })
  .catch((error) => {
    console.log('error connection to MongoDB:', error.message);
  });

app.post('/api/import', async (req, res) => {
  const paths: string[] = req.body.paths;
  const result = await importCsvToDatabase(paths);
  res.json(result);
});

app.get('/api/journeys', async (req, res) => {
  console.log('Method:', req.method);
  console.log('Path:  ', req.path);
  try {
    const journeys = await Journey.find({}, null, { limit: 1000 });
    const size = await Journey.countDocuments();
    res.send({ data: journeys, size: size });
  }
  catch(error) {
    res.status(500).json(error);
  }
});

app.get('/api/journeys/:index', async (req, res) => {
  console.log('Method:', req.method);
  console.log('Path:  ', req.path);
  const skip = Number(req.params.index ?? 0);
  try {
    const journeys = await Journey.find({}, null, { limit: 1000, skip: skip });
    res.send({ data: journeys });
  }
  catch(error) {
    res.status(500).json(error);
  }
});

app.get('/api/stations', async (req, res) => {
  console.log('Method:', req.method);
  console.log('Path:  ', req.path);
  try {
    const stations = await Journey.distinct("departureStationName");
    //const returnStations = await Journey.distinct("returnStationName");
    //const uniqueStations = stations.concat(returnStations.filter(returnStation => !stations.includes(returnStation)));
    res.send({ data: stations, size: stations.length });
  }
  catch(error) {
    res.status(500).json(error);
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
