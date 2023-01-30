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

export async function importCsvToDatabase(path: string, type: string) {
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
    try {
      journeys = journeys.concat(await csv({ noheader: false, headers: journeyKeys }).fromFile(path));
    } catch(error) {
      console.log(`convert to JSON failed.`);
      return `failed to convert csv to JSON: ${error}`;
    }
    try {
      let result = 0;
      if(journeys.length > 500000) {
        const chunkSize = Math.round(journeys.length / 10);
        for(let i = 0; i < journeys.length; i += chunkSize) {
          const chunk = journeys.slice(i, i + chunkSize);
          const response = await Journey.insertMany(chunk, { ordered: false });
          result += response.length;
          console.log(`${result} / ${i + chunkSize} out of ${journeys.length} validated and inserted to database.`);
        }
      }
      else {
        const response = await Journey.insertMany(journeys, { ordered: false });
        result += response.length;
      }

      console.log(`Import success.`);
      return `Import and validation successful. ${result} documents were inserted to database.`;
    } catch(error) {
      console.log(`Import failed.`);
      return `failed to import documents: ${error}`;
    }
  }
  else if(type === "station") {
    let stations: station[] = [];
    console.log(`Attempting to import documents to database...`);
    try {
      stations = stations.concat(await csv({ ignoreColumns: /(FID)/, }).fromFile(path));
    } catch(error) {
      console.log(`convert to JSON failed.`);
      return `failed to convert csv to JSON: ${error}`;
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