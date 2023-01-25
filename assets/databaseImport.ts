import Journey from '../models/journey';
import csv from 'csvtojson';

interface journey {
  departure: Date,
  return: Date,
  departureStationId: String,
  departureStationName: String,
  returnStationId: String,
  returnStationName: String,
  distance: Number,
  duration: Number;
}

export async function importCsvToDatabase(paths: string[]) {
  const keys = [
    'departure',
    'return',
    'departureStationId',
    'departureStationName',
    'returnStationId',
    'returnStationName',
    'distance',
    'duration'
  ];

  let journeys: journey[] = [];
  console.log(`Attempting to import documents to database...`);
  for(const path of paths) {
    try {
      journeys = journeys.concat(await csv({ noheader: false, headers: keys }).fromFile(path));
    } catch(error) {
      console.log(`convert to JSON failed.`);
      return `failed to convert csv to JSON: ${error}`;
    }
  }
  try {
    const results = await Journey.insertMany(journeys, { ordered: false });
    console.log(`Import success.`);
    return `Import and validation successful. ${results.length} documents were inserted to database.`;
  } catch(error) {
    console.log(`Import failed.`);
    return `failed to import documents: ${error}`;
  }
}