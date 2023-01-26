import Journey from '../models/journey';
import Station from '../models/station';
import csv from 'csvtojson';

interface journey {
  departure: Date,
  return: Date,
  departureStationId: string,
  departureStationName: string,
  returnStationId: string,
  returnStationName: string,
  distance: number,
  duration: number;
}

interface station {
  ID: number,
  Nimi: string,
  Namn: string,
  Name: string,
  Osoite: string,
  Adress: string,
  Kaupunki: string,
  Stad: string,
  Operaattor: string,
  Kapasiteet: string,
  x: number,
  y: number;
}

export async function importCsvToDatabase(paths: string[], type: string) {
  const journeyKeys = [
    'departure',
    'return',
    'departureStationId',
    'departureStationName',
    'returnStationId',
    'returnStationName',
    'distance',
    'duration'
  ];

  if(type === "journey") {
    let journeys: journey[] = [];
    console.log(`Attempting to import documents to database...`);
    for(const path of paths) {
      try {
        journeys = journeys.concat(await csv({ noheader: false, headers: journeyKeys }).fromFile(path));
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
  else if(type === "station") {
    let stations: station[] = [];
    console.log(`Attempting to import documents to database...`);
    for(const path of paths) {
      try {
        stations = stations.concat(await csv({ ignoreColumns: /(FID)/, }).fromFile(path));
      } catch(error) {
        console.log(`convert to JSON failed.`);
        return `failed to convert csv to JSON: ${error}`;
      }
    }
    try {
      const results = await Station.insertMany(stations, { ordered: false });
      console.log(`Import success.`);
      return `Import and validation successful. ${results.length} documents were inserted to database.`;
    } catch(error) {
      console.log(`Import failed.`);
      return `failed to import documents: ${error}`;
    }
  }
  else return `Import failed. Invalid csv file.`;
}