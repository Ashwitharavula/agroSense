import mongoose from "mongoose";

const cropGuideSchema = new mongoose.Schema(
{
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    category: {
        type: String,
        required: true,
        trim: true
    },
    fertilizer: {
        type: String,
        required: true,
        trim: true
    },
    npk: {
        type: String,
        required: true,
        trim: true
    },
    waterRequirement: {
        type: String,
        required: true,
        trim: true
    }
},
{
    timestamps: true
}
);

const CropGuide = mongoose.model("CropGuide", cropGuideSchema);

export default CropGuide;
