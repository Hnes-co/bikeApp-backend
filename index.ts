import express from 'express';
import { importCsvToDatabase } from './assets/databaseImport';
import mongoose from 'mongoose';
import * as dotenv from 'dotenv';
import cors from 'cors';
import Journey from './models/journey';
import Station from './models/station';
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
  const path: string = req.body.path;
  const type: string = req.body.type;
  const result = await importCsvToDatabase(path, type);
  res.json(result);
});

app.get('/api/reset', async (req, res) => {
  console.log('Method:', req.method);
  console.log('Path:  ', req.path);
  console.log('Query:  ', req.query);
  try {
    await Journey.deleteMany({});
    await Station.deleteMany({});
    res.json("Database reseted.");
  }
  catch(error) {
    res.status(500).json(error);
  }
});

app.get('/api/journeys', async (req, res) => {
  console.log('Method:', req.method);
  console.log('Path:  ', req.path);
  console.log('Query:  ', req.query);
  const sortRule = req.query.sort?.toString();
  const options = sortRule ? { limit: 1000, sort: { [sortRule]: Number(req.query.order) } } : { limit: 1000 };
  const searchQuery = req.query.search ? new RegExp(req.query.search.toString(), "gi") : null;
  const search = searchQuery ? { [req.query.stationType?.toString() ?? ""]: searchQuery } : {};
  try {
    const journeys = await Journey.find(search, null, options);
    const size = await Journey.countDocuments(search);
    res.send({ data: journeys, size: size });
  }
  catch(error) {
    res.status(500).json(error);
  }
});

app.get('/api/journeys/:index', async (req, res) => {
  console.log('Method:', req.method);
  console.log('Path:  ', req.path);
  console.log('Query:  ', req.query);
  const skip = Number(req.params.index ?? 0);
  const sortRule = req.query.sort?.toString();
  const options = sortRule ? { limit: 1000, skip: skip, sort: { [sortRule]: Number(req.query.order) } } : { limit: 1000, skip: skip };
  const searchQuery = req.query.search ? new RegExp(req.query.search.toString(), "gi") : null;
  const search = searchQuery ? { [req.query.stationType?.toString() ?? ""]: searchQuery } : {};
  try {
    const journeys = await Journey.find(search, null, options);
    res.send({ data: journeys });
  }
  catch(error) {
    res.status(500).json(error);
  }
});

app.get('/api/stations', async (req, res) => {
  console.log('Method:', req.method);
  console.log('Path:  ', req.path);
  console.log('Query:  ', req.query);
  const searchQuery = req.query.search ? new RegExp(req.query.search.toString(), "gi") : null;
  const search = searchQuery ? { Nimi: searchQuery } : {};
  try {
    const stations = await Station.find(search, null, { sort: { Name: 1 } });
    res.send({ data: stations, size: stations.length });
  }
  catch(error) {
    res.status(500).json(error);
  }
});

app.get('/api/stations/:id', async (req, res) => {
  console.log('Method:', req.method);
  console.log('Path:  ', req.path);
  console.log('Query:  ', req.query);
  try {
    const journeyStarts = await Journey.find({ departureStationId: req.params.id });
    const journeyEnds = await Journey.find({ returnStationId: req.params.id });
    res.send({ journeyStarts: journeyStarts.length, journeyEnds: journeyEnds.length });
  }
  catch(error) {
    res.status(500).json(error);
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
