import mongoose from 'mongoose';

const journeySchema = new mongoose.Schema({
  departure: { type: Date, required: true },
  return: { type: Date, required: true },
  departureStationId: { type: String, required: true },
  departureStationName: { type: String, required: true },
  returnStationId: { type: String, required: true },
  returnStationName: { type: String, required: true },
  distance: { type: Number, required: true, min: 10 },
  duration: { type: Number, required: true, min: 10 }
});

journeySchema.set('toJSON', {
  transform: (_document, returnedObject) => {
    returnedObject._id = returnedObject._id.toString();
    delete returnedObject.__v;
  }
});

export default mongoose.model('Journey', journeySchema);