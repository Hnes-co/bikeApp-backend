import mongoose from 'mongoose';

const stationSchema = new mongoose.Schema({
  ID: { type: String, required: true },
  Nimi: { type: String },
  Namn: { type: String },
  Name: { type: String },
  Osoite: { type: String },
  Adress: { type: String },
  Kaupunki: { type: String },
  Stad: { type: String },
  Operaattor: { type: String },
  Kapasiteet: { type: String },
  x: { type: Number, required: true },
  y: { type: Number, required: true }
});

stationSchema.set('toJSON', {
  transform: (_document, returnedObject) => {
    returnedObject._id = returnedObject._id.toString();
    delete returnedObject.__v;
  }
});

export default mongoose.model('Station', stationSchema);