import mongoose from "mongoose";
import CropGuide from "../models/cropGuide.js";

const DEFAULT_CROP_GUIDES = [
    // CEREALS (1-15)
    { name: "Paddy", category: "Cereals", fertilizer: "Urea + DAP + MOP", npk: "80–40–40", waterRequirement: "High" },
    { name: "Maize", category: "Cereals", fertilizer: "Urea + DAP + MOP", npk: "100–50–40", waterRequirement: "Medium" },
    { name: "Wheat", category: "Cereals", fertilizer: "Urea + DAP", npk: "80–40–20", waterRequirement: "Medium" },
    { name: "Barley", category: "Cereals", fertilizer: "Urea + SSP", npk: "60–30–20", waterRequirement: "Low–Medium" },
    { name: "Jowar", category: "Cereals", fertilizer: "Urea + DAP", npk: "70–40–20", waterRequirement: "Low–Medium" },
    { name: "Bajra", category: "Cereals", fertilizer: "Urea + MOP", npk: "60–30–20", waterRequirement: "Low" },
    { name: "Ragi", category: "Cereals", fertilizer: "FYM + Urea", npk: "50–25–20", waterRequirement: "Low" },
    { name: "Rice hybrid", category: "Cereals", fertilizer: "Urea + DAP + Zn", npk: "90–50–40", waterRequirement: "High" },
    { name: "Sweet Corn", category: "Cereals", fertilizer: "Urea + DAP", npk: "100–60–40", waterRequirement: "Medium" },
    { name: "Popcorn", category: "Cereals", fertilizer: "Urea + MOP", npk: "80–40–30", waterRequirement: "Medium" },
    { name: "Baby corn", category: "Cereals", fertilizer: "Urea + DAP", npk: "90–50–40", waterRequirement: "Medium" },
    { name: "Sorghum", category: "Cereals", fertilizer: "Urea + DAP", npk: "70–40–20", waterRequirement: "Low–Medium" },
    { name: "Quinoa", category: "Cereals", fertilizer: "Organic + NPK", npk: "60–30–20", waterRequirement: "Low" },
    { name: "Oats", category: "Cereals", fertilizer: "Urea + DAP", npk: "60–40–20", waterRequirement: "Medium" },
    { name: "Millet mix", category: "Cereals", fertilizer: "FYM + NPK", npk: "50–30–20", waterRequirement: "Low" },
    // VEGETABLES (16-40)
    { name: "Tomato", category: "Vegetables", fertilizer: "DAP + Urea + MOP", npk: "120–60–60", waterRequirement: "Medium–High" },
    { name: "Brinjal", category: "Vegetables", fertilizer: "Urea + DAP", npk: "100–50–50", waterRequirement: "Medium" },
    { name: "Chili", category: "Vegetables", fertilizer: "Urea + MOP", npk: "90–50–50", waterRequirement: "Medium" },
    { name: "Onion", category: "Vegetables", fertilizer: "SSP + Urea", npk: "80–40–40", waterRequirement: "Medium" },
    { name: "Garlic", category: "Vegetables", fertilizer: "DAP + Urea", npk: "80–40–30", waterRequirement: "Medium" },
    { name: "Potato", category: "Vegetables", fertilizer: "High K fertilizer", npk: "120–60–100", waterRequirement: "High" },
    { name: "Cabbage", category: "Vegetables", fertilizer: "Urea + DAP", npk: "100–50–60", waterRequirement: "Medium–High" },
    { name: "Cauliflower", category: "Vegetables", fertilizer: "Urea + Boron mix", npk: "100–50–60", waterRequirement: "Medium" },
    { name: "Spinach", category: "Vegetables", fertilizer: "Urea only", npk: "60–30–20", waterRequirement: "Medium" },
    { name: "Lettuce", category: "Vegetables", fertilizer: "Organic compost", npk: "50–20–20", waterRequirement: "Medium" },
    { name: "Okra", category: "Vegetables", fertilizer: "Urea + DAP", npk: "90–40–40", waterRequirement: "Medium" },
    { name: "Carrot", category: "Vegetables", fertilizer: "SSP + MOP", npk: "80–40–60", waterRequirement: "Medium" },
    { name: "Beetroot", category: "Vegetables", fertilizer: "DAP + Urea", npk: "80–40–40", waterRequirement: "Medium" },
    { name: "Radish", category: "Vegetables", fertilizer: "Urea + compost", npk: "60–30–20", waterRequirement: "Medium" },
    { name: "Pumpkin", category: "Vegetables", fertilizer: "DAP + Urea", npk: "90–50–40", waterRequirement: "Medium" },
    { name: "Cucumber", category: "Vegetables", fertilizer: "Urea + MOP", npk: "80–40–40", waterRequirement: "Medium–High" },
    { name: "Bitter gourd", category: "Vegetables", fertilizer: "Urea + DAP", npk: "80–40–40", waterRequirement: "Medium" },
    { name: "Bottle gourd", category: "Vegetables", fertilizer: "Urea + compost", npk: "80–40–40", waterRequirement: "Medium" },
    { name: "Ridge gourd", category: "Vegetables", fertilizer: "Urea + MOP", npk: "70–30–30", waterRequirement: "Medium" },
    { name: "Beans", category: "Vegetables", fertilizer: "Rhizobium + P", npk: "60–40–20", waterRequirement: "Low–Medium" },
    { name: "Peas", category: "Vegetables", fertilizer: "SSP + compost", npk: "60–40–20", waterRequirement: "Low–Medium" },
    { name: "Capsicum", category: "Vegetables", fertilizer: "DAP + Urea", npk: "100–50–50", waterRequirement: "Medium" },
    { name: "Sweet potato", category: "Vegetables", fertilizer: "MOP + Urea", npk: "80–40–60", waterRequirement: "Low–Medium" },
    { name: "Mushroom", category: "Vegetables", fertilizer: "Organic compost", npk: "N/A", waterRequirement: "High" },
    { name: "Drumstick", category: "Vegetables", fertilizer: "Organic manure", npk: "50–30–20", waterRequirement: "Low" },
    // PULSES (41-55)
    { name: "Moong", category: "Pulses", fertilizer: "Rhizobium + SSP", npk: "20–40–20", waterRequirement: "Low" },
    { name: "Urad", category: "Pulses", fertilizer: "Rhizobium + SSP", npk: "20–40–20", waterRequirement: "Low" },
    { name: "Tur (Pigeon pea)", category: "Pulses", fertilizer: "SSP + FYM", npk: "25–50–20", waterRequirement: "Low" },
    { name: "Chickpea", category: "Pulses", fertilizer: "SSP + Biofertilizer", npk: "20–40–20", waterRequirement: "Low" },
    { name: "Lentil", category: "Pulses", fertilizer: "SSP + compost", npk: "20–40–20", waterRequirement: "Low" },
    { name: "Cowpea", category: "Pulses", fertilizer: "Rhizobium", npk: "20–30–20", waterRequirement: "Low" },
    { name: "Horse gram", category: "Pulses", fertilizer: "Organic only", npk: "10–20–10", waterRequirement: "Low" },
    { name: "Green gram", category: "Pulses", fertilizer: "Biofertilizer", npk: "20–40–20", waterRequirement: "Low" },
    { name: "Black gram", category: "Pulses", fertilizer: "SSP + Rhizobium", npk: "20–40–20", waterRequirement: "Low" },
    { name: "Field pea", category: "Pulses", fertilizer: "SSP + compost", npk: "30–40–20", waterRequirement: "Low–Medium" },
    { name: "Soybean", category: "Pulses", fertilizer: "Rhizobium + DAP", npk: "40–60–40", waterRequirement: "Medium" },
    { name: "Groundnut", category: "Pulses", fertilizer: "Gypsum + SSP", npk: "20–40–40", waterRequirement: "Low–Medium" },
    { name: "Peanut", category: "Pulses", fertilizer: "MOP + compost", npk: "20–40–40", waterRequirement: "Low–Medium" },
    { name: "French bean", category: "Pulses", fertilizer: "SSP + Urea", npk: "40–60–40", waterRequirement: "Medium" },
    { name: "Cluster bean", category: "Pulses", fertilizer: "Organic manure", npk: "20–30–20", waterRequirement: "Low" },
    // CASH CROPS (56-75)
    { name: "Sugarcane", category: "Cash Crops", fertilizer: "Urea + DAP + MOP", npk: "150–60–60", waterRequirement: "High" },
    { name: "Cotton", category: "Cash Crops", fertilizer: "Urea + MOP", npk: "120–60–60", waterRequirement: "Medium" },
    { name: "Tobacco", category: "Cash Crops", fertilizer: "Urea + K", npk: "100–50–80", waterRequirement: "Medium" },
    { name: "Jute", category: "Cash Crops", fertilizer: "Urea + DAP", npk: "80–40–40", waterRequirement: "High" },
    { name: "Tea", category: "Cash Crops", fertilizer: "Organic + NPK", npk: "100–50–50", waterRequirement: "High" },
    { name: "Coffee", category: "Cash Crops", fertilizer: "Compost + NPK", npk: "80–40–40", waterRequirement: "High" },
    { name: "Rubber", category: "Cash Crops", fertilizer: "Organic + Urea", npk: "80–40–40", waterRequirement: "Medium–High" },
    { name: "Coconut", category: "Cash Crops", fertilizer: "Organic + K", npk: "100–50–80", waterRequirement: "High" },
    { name: "Arecanut", category: "Cash Crops", fertilizer: "Compost + NPK", npk: "80–40–40", waterRequirement: "High" },
    { name: "Betel leaf", category: "Cash Crops", fertilizer: "Organic manure", npk: "60–30–30", waterRequirement: "High" },
    { name: "Cardamom", category: "Cash Crops", fertilizer: "Organic + NPK", npk: "70–40–40", waterRequirement: "High" },
    { name: "Pepper", category: "Cash Crops", fertilizer: "FYM + compost", npk: "80–40–40", waterRequirement: "Medium–High" },
    { name: "Clove", category: "Cash Crops", fertilizer: "Organic fertilizer", npk: "60–30–30", waterRequirement: "High" },
    { name: "Cinnamon", category: "Cash Crops", fertilizer: "Compost", npk: "60–30–20", waterRequirement: "Medium" },
    { name: "Cashew", category: "Cash Crops", fertilizer: "Organic + NPK", npk: "80–40–40", waterRequirement: "Low" },
    { name: "Banana", category: "Cash Crops", fertilizer: "High NPK", npk: "200–100–200", waterRequirement: "High" },
    { name: "Mango", category: "Cash Crops", fertilizer: "Compost + NPK", npk: "100–50–50", waterRequirement: "Medium" },
    { name: "Guava", category: "Cash Crops", fertilizer: "Compost + Urea", npk: "80–40–40", waterRequirement: "Medium" },
    { name: "Papaya", category: "Cash Crops", fertilizer: "High NPK", npk: "120–60–60", waterRequirement: "Medium–High" },
    { name: "Pomegranate", category: "Cash Crops", fertilizer: "Balanced NPK", npk: "100–50–50", waterRequirement: "Low–Medium" },
    // FRUITS & OTHERS (76-100)
    { name: "Watermelon", category: "Fruits & Others", fertilizer: "Urea + MOP", npk: "90–50–50", waterRequirement: "Medium" },
    { name: "Muskmelon", category: "Fruits & Others", fertilizer: "Urea + DAP", npk: "90–50–50", waterRequirement: "Medium" },
    { name: "Grapes", category: "Fruits & Others", fertilizer: "High K fertilizer", npk: "120–60–80", waterRequirement: "Medium" },
    { name: "Apple", category: "Fruits & Others", fertilizer: "Organic + NPK", npk: "100–50–50", waterRequirement: "Medium–High" },
    { name: "Orange", category: "Fruits & Others", fertilizer: "Compost + Urea", npk: "100–50–50", waterRequirement: "Medium–High" },
    { name: "Lemon", category: "Fruits & Others", fertilizer: "Compost + K", npk: "80–40–60", waterRequirement: "Medium" },
    { name: "Strawberry", category: "Fruits & Others", fertilizer: "High organic", npk: "60–30–30", waterRequirement: "Medium–High" },
    { name: "Pineapple", category: "Fruits & Others", fertilizer: "Organic + NPK", npk: "80–40–40", waterRequirement: "Medium" },
    { name: "Jackfruit", category: "Fruits & Others", fertilizer: "Compost", npk: "60–30–30", waterRequirement: "Low–Medium" },
    { name: "Sapota", category: "Fruits & Others", fertilizer: "Organic + NPK", npk: "80–40–40", waterRequirement: "Low–Medium" },
    { name: "Fig", category: "Fruits & Others", fertilizer: "Compost", npk: "60–30–20", waterRequirement: "Low" },
    { name: "Almond", category: "Fruits & Others", fertilizer: "NPK balanced", npk: "80–40–40", waterRequirement: "Medium" },
    { name: "Walnut", category: "Fruits & Others", fertilizer: "Organic + NPK", npk: "80–40–40", waterRequirement: "Medium" },
    { name: "Dates", category: "Fruits & Others", fertilizer: "Organic + K", npk: "100–50–80", waterRequirement: "Low" },
    { name: "Olive", category: "Fruits & Others", fertilizer: "Low fertilizer", npk: "60–30–30", waterRequirement: "Low" },
    { name: "Bamboo", category: "Fruits & Others", fertilizer: "Compost", npk: "80–40–40", waterRequirement: "Medium" },
    { name: "Eucalyptus", category: "Fruits & Others", fertilizer: "Organic", npk: "60–30–20", waterRequirement: "Low–Medium" },
    { name: "Rose", category: "Fruits & Others", fertilizer: "High NPK", npk: "120–60–60", waterRequirement: "Medium" },
    { name: "Jasmine", category: "Fruits & Others", fertilizer: "Organic + NPK", npk: "80–40–40", waterRequirement: "Medium" },
    { name: "Marigold", category: "Fruits & Others", fertilizer: "Urea + compost", npk: "80–40–40", waterRequirement: "Medium" },
    { name: "Sunhemp", category: "Fruits & Others", fertilizer: "Green manure", npk: "20–40–20", waterRequirement: "Low" },
    { name: "Fodder maize", category: "Fruits & Others", fertilizer: "Urea + DAP", npk: "80–40–40", waterRequirement: "Medium" },
    { name: "Napier grass", category: "Fruits & Others", fertilizer: "High nitrogen", npk: "120–50–40", waterRequirement: "Medium–High" },
    { name: "Alfalfa", category: "Fruits & Others", fertilizer: "Biofertilizer", npk: "40–60–20", waterRequirement: "Medium" },
    { name: "Vetiver", category: "Fruits & Others", fertilizer: "Low fertilizer", npk: "30–20–20", waterRequirement: "Low" },
    { name: "Sunflower", category: "Fruits & Others", fertilizer: "Urea + DAP + MOP", npk: "80–40–40", waterRequirement: "Medium" }
];

const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/agrosense";

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(MONGO_URI);

        console.log(
            `MongoDB Connected: ${conn.connection.host}`
        );

        // Delete existing guide entries if they lack the waterRequirement column (so it forces re-seeding)
        const sample = await CropGuide.findOne();
        if (sample && !sample.waterRequirement) {
            console.log("Upgrading CropGuide schema: dropping old collection to seed with water needs...");
            await CropGuide.deleteMany({});
        }

        // Auto-seed Crop Guides if empty
        const count = await CropGuide.countDocuments();
        if (count === 0) {
            console.log("Seeding initial 100 crops with water needs into database...");
            await CropGuide.insertMany(DEFAULT_CROP_GUIDES);
            console.log("Successfully seeded 100 crops with water requirements.");
        }

    } catch (error) {
        console.log(error.message);
        process.exit(1);
    }
};

export default connectDB;
