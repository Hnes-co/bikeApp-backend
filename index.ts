import express from 'express';
import { importCsvToDatabase } from './assets/databaseImport';
import mongoose from 'mongoose';
import * as dotenv from 'dotenv';
import cors from 'cors';
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

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
