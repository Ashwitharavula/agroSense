import Recommendation from "../models/recom.js";
import CropGuide from "../models/cropGuide.js";


// Crop Recommendation
export const cropRecommendation = async (req, res) => {

    try {

        const {
            userId,
            farmId,
            soilPH,
            nitrogen,
            phosphorus,
            potassium
        } = req.body;

        const CROPS = [
            { name: "Paddy (Rice)", minPH: 5.0, maxPH: 6.5, minN: 60, maxN: 120, minP: 40, maxP: 60, minK: 40, maxK: 80 },
            { name: "Maize", minPH: 5.5, maxPH: 7.0, minN: 50, maxN: 110, minP: 35, maxP: 60, minK: 30, maxK: 70 },
            { name: "Wheat", minPH: 6.0, maxPH: 7.5, minN: 45, maxN: 85, minP: 30, maxP: 55, minK: 30, maxK: 65 },
            { name: "Sugarcane", minPH: 6.0, maxPH: 7.5, minN: 80, maxN: 160, minP: 50, maxP: 90, minK: 70, maxK: 140 },
            { name: "Cotton", minPH: 5.8, maxPH: 8.0, minN: 50, maxN: 100, minP: 30, maxP: 60, minK: 60, maxK: 110 },
            { name: "Soybean", minPH: 6.0, maxPH: 7.5, minN: 20, maxN: 55, minP: 30, maxP: 60, minK: 30, maxK: 65 },
            { name: "Groundnut", minPH: 5.5, maxPH: 7.0, minN: 20, maxN: 50, minP: 20, maxP: 45, minK: 20, maxK: 50 },
            { name: "Sunflower", minPH: 6.0, maxPH: 7.5, minN: 40, maxN: 80, minP: 30, maxP: 60, minK: 30, maxK: 75 },
            { name: "Mustard", minPH: 6.0, maxPH: 7.5, minN: 30, maxN: 70, minP: 25, maxP: 50, minK: 15, maxK: 40 },
            { name: "Sesame", minPH: 5.5, maxPH: 7.5, minN: 30, maxN: 70, minP: 25, maxP: 50, minK: 15, maxK: 40 },
            { name: "Tomato", minPH: 5.5, maxPH: 7.0, minN: 70, maxN: 120, minP: 40, maxP: 70, minK: 65, maxK: 110 },
            { name: "Brinjal", minPH: 5.5, maxPH: 7.0, minN: 50, maxN: 95, minP: 35, maxP: 65, minK: 35, maxK: 70 },
            { name: "Chili", minPH: 5.5, maxPH: 6.8, minN: 50, maxN: 95, minP: 35, maxP: 65, minK: 35, maxK: 70 },
            { name: "Onion", minPH: 6.0, maxPH: 7.0, minN: 40, maxN: 80, minP: 30, maxP: 60, minK: 30, maxK: 70 },
            { name: "Garlic", minPH: 6.0, maxPH: 7.5, minN: 40, maxN: 80, minP: 30, maxP: 60, minK: 30, maxK: 70 },
            { name: "Potato", minPH: 5.0, maxPH: 6.5, minN: 70, maxN: 130, minP: 40, maxP: 70, minK: 80, maxK: 150 },
            { name: "Carrot", minPH: 6.0, maxPH: 7.0, minN: 40, maxN: 80, minP: 30, maxP: 60, minK: 45, maxK: 80 },
            { name: "Cabbage", minPH: 6.0, maxPH: 7.5, minN: 60, maxN: 110, minP: 35, maxP: 65, minK: 50, maxK: 90 },
            { name: "Cauliflower", minPH: 6.0, maxPH: 7.5, minN: 60, maxN: 110, minP: 35, maxP: 65, minK: 40, maxK: 80 },
            { name: "Spinach", minPH: 6.0, maxPH: 7.5, minN: 40, maxN: 80, minP: 30, maxP: 60, minK: 35, maxK: 70 },
            { name: "Coriander", minPH: 6.0, maxPH: 7.5, minN: 25, maxN: 60, minP: 20, maxP: 45, minK: 20, maxK: 50 },
            { name: "Fenugreek", minPH: 6.0, maxPH: 7.5, minN: 25, maxN: 60, minP: 20, maxP: 45, minK: 20, maxK: 50 },
            { name: "Okra", minPH: 6.0, maxPH: 7.5, minN: 40, maxN: 80, minP: 30, maxP: 60, minK: 35, maxK: 75 },
            { name: "Moong (Green Gram)", minPH: 6.0, maxPH: 7.5, minN: 20, maxN: 50, minP: 20, maxP: 45, minK: 15, maxK: 40 },
            { name: "Urad (Black Gram)", minPH: 6.0, maxPH: 7.5, minN: 20, maxN: 50, minP: 20, maxP: 45, minK: 15, maxK: 40 },
            { name: "Tur (Pigeon Pea)", minPH: 6.0, maxPH: 7.5, minN: 35, maxN: 70, minP: 20, maxP: 45, minK: 15, maxK: 40 },
            { name: "Chickpea", minPH: 6.0, maxPH: 7.5, minN: 20, maxN: 50, minP: 20, maxP: 45, minK: 15, maxK: 40 },
            { name: "Lentil", minPH: 6.0, maxPH: 7.5, minN: 15, maxN: 40, minP: 20, maxP: 45, minK: 15, maxK: 45 },
            { name: "Bajra", minPH: 5.5, maxPH: 7.5, minN: 20, maxN: 45, minP: 15, maxP: 35, minK: 10, maxK: 30 },
            { name: "Jowar", minPH: 5.5, maxPH: 7.5, minN: 30, maxN: 65, minP: 20, maxP: 45, minK: 15, maxK: 45 },
            { name: "Barley", minPH: 6.0, maxPH: 7.5, minN: 30, maxN: 65, minP: 20, maxP: 45, minK: 15, maxK: 45 },
            { name: "Ragi", minPH: 5.0, maxPH: 7.0, minN: 20, maxN: 45, minP: 15, maxP: 35, minK: 15, maxK: 40 },
            { name: "Banana", minPH: 5.5, maxPH: 7.5, minN: 80, maxN: 160, minP: 40, maxP: 70, minK: 100, maxK: 200 },
            { name: "Mango", minPH: 5.5, maxPH: 7.5, minN: 40, maxN: 80, minP: 30, maxP: 60, minK: 35, maxK: 75 },
            { name: "Guava", minPH: 5.5, maxPH: 7.5, minN: 40, maxN: 80, minP: 30, maxP: 60, minK: 35, maxK: 75 },
            { name: "Papaya", minPH: 5.5, maxPH: 7.5, minN: 50, maxN: 100, minP: 30, maxP: 60, minK: 35, maxK: 75 },
            { name: "Pomegranate", minPH: 6.0, maxPH: 7.5, minN: 40, maxN: 80, minP: 30, maxP: 60, minK: 25, maxK: 55 },
            { name: "Coconut", minPH: 5.2, maxPH: 8.0, minN: 40, maxN: 80, minP: 35, maxP: 60, minK: 70, maxK: 130 },
            { name: "Grapes", minPH: 6.0, maxPH: 7.5, minN: 40, maxN: 80, minP: 30, maxP: 60, minK: 35, maxK: 75 },
            { name: "Watermelon", minPH: 6.0, maxPH: 7.5, minN: 40, maxN: 80, minP: 30, maxP: 60, minK: 35, maxK: 75 },
            { name: "Muskmelon", minPH: 6.0, maxPH: 7.5, minN: 40, maxN: 80, minP: 30, maxP: 60, minK: 35, maxK: 75 },
            { name: "Coffee", minPH: 5.0, maxPH: 6.5, minN: 40, maxN: 85, minP: 30, maxP: 60, minK: 40, maxK: 80 },
            { name: "Tea", minPH: 4.5, maxPH: 5.5, minN: 40, maxN: 85, minP: 35, maxP: 60, minK: 60, maxK: 110 },
            { name: "Turmeric", minPH: 5.5, maxPH: 7.0, minN: 70, maxN: 130, minP: 50, maxP: 90, minK: 45, maxK: 80 },
            { name: "Ginger", minPH: 5.5, maxPH: 6.5, minN: 70, maxN: 130, minP: 50, maxP: 90, minK: 50, maxK: 95 },
            { name: "Cardamom", minPH: 5.0, maxPH: 6.5, minN: 40, maxN: 80, minP: 30, maxP: 60, minK: 60, maxK: 110 },
            { name: "Clove", minPH: 5.5, maxPH: 6.5, minN: 40, maxN: 80, minP: 30, maxP: 60, minK: 35, maxK: 70 },
            { name: "Pepper", minPH: 5.5, maxPH: 6.5, minN: 50, maxN: 95, minP: 35, maxP: 65, minK: 65, maxK: 110 },
            { name: "Arecanut", minPH: 5.5, maxPH: 6.5, minN: 40, maxN: 80, minP: 30, maxP: 60, minK: 60, maxK: 110 },
            { name: "Betel Leaf", minPH: 5.5, maxPH: 6.5, minN: 40, maxN: 80, minP: 30, maxP: 60, minK: 60, maxK: 110 }
        ];

        let bestCrop = "Millets";
        let maxScore = -1;

        for (const cropItem of CROPS) {
            let score = 0;

            // pH check (Weight: 35%)
            if (soilPH >= cropItem.minPH && soilPH <= cropItem.maxPH) {
                score += 35;
            } else if (soilPH >= cropItem.minPH - 0.5 && soilPH <= cropItem.maxPH + 0.5) {
                score += 15;
            }

            // Nitrogen check (Weight: 25%)
            if (nitrogen >= cropItem.minN && nitrogen <= cropItem.maxN) {
                score += 25;
            } else if (nitrogen >= cropItem.minN * 0.7 && nitrogen <= cropItem.maxN * 1.3) {
                score += 10;
            }

            // Phosphorus check (Weight: 20%)
            if (phosphorus >= cropItem.minP && phosphorus <= cropItem.maxP) {
                score += 20;
            } else if (phosphorus >= cropItem.minP * 0.7 && phosphorus <= cropItem.maxP * 1.3) {
                score += 8;
            }

            // Potassium check (Weight: 20%)
            if (potassium >= cropItem.minK && potassium <= cropItem.maxK) {
                score += 20;
            } else if (potassium >= cropItem.minK * 0.7 && potassium <= cropItem.maxK * 1.3) {
                score += 8;
            }

            if (score > maxScore) {
                maxScore = score;
                bestCrop = cropItem.name;
            }
        }

        const crop = bestCrop;

        // Custom fertilizer mapping from the 100 crops dataset
        let fertilizer = "Organic Compost";
        let waterNeed = "Medium";
        const cleanName = crop.replace(/\s*\(.*\)/, "").trim();
        const guide = await CropGuide.findOne({
            $or: [
                { name: { $regex: new RegExp(`^${crop}$`, "i") } },
                { name: { $regex: new RegExp(`^${cleanName}$`, "i") } }
            ]
        });

        if (guide) {
            fertilizer = `${guide.fertilizer} (NPK: ${guide.npk})`;
            waterNeed = guide.waterRequirement;
        } else {
            // Default generic fallback
            if (nitrogen < 40) {
                fertilizer = "Urea";
            } else if (phosphorus < 30) {
                fertilizer = "DAP (Diammonium Phosphate)";
            } else if (potassium < 30) {
                fertilizer = "Muriate of Potash (MOP)";
            }
        }


        const recommendation =
            await Recommendation.create({
                userId,
                farmId,
                recommendedCrop: crop,
                fertilizer: fertilizer,
                waterRequirement: waterNeed
            });

        res.status(200).json({
            crop,
            fertilizer,
            waterRequirement: waterNeed,
            recommendation
        });


    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }
};

// Fertilizer Recommendation
export const fertilizerRecommendation =
async (req, res) => {

    try {

        const { nitrogen } = req.body;

        let fertilizer = "";

        if (nitrogen < 50) {
            fertilizer = "Urea";
        }
        else {
            fertilizer = "Organic Compost";
        }

        res.status(200).json({
            fertilizer
        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }
};

// Recommendation History
export const getHistory = async (req, res) => {

    try {

        const { userId } = req.query;
        const filter = userId ? { userId } : {};

        const history =
            await Recommendation.find(filter)
            .populate("userId")
            .populate("farmId");

        res.status(200).json(history);

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }
};

// Farmer Dashboard
export const getDashboard = async (req, res) => {

    try {

        const { userId } = req.query;
        const filter = userId ? { userId } : {};

        const totalRecommendations =
            await Recommendation.countDocuments(filter);

        const recentRecommendations =
            await Recommendation.find(filter)
            .sort({ createdAt: -1 })
            .limit(5)
            .populate("farmId");

        res.status(200).json({
            totalRecommendations,
            recentRecommendations
        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }
};
