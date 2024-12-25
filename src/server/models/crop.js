// models/Crop.js
import mongoose from 'mongoose';

const cropSchema = new mongoose.Schema({
    name: { type: String, required: true },
    quantity: { type: Number, required: true },
    plantingDate: { type: Date, required: false }, // Add planting date
    harvestDate: { type: Date, required: false },  // Add harvest date
    price: { type: Number, required: false },      // Add price
    farmerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Farmer' }, // Optional
});

const Crop = mongoose.model('Crop', cropSchema);

export default Crop;
