import CropGuide from "../models/cropGuide.js";

export const getCropGuides = async (req, res) => {
    try {
        const { query } = req.query;
        let filter = {};
        if (query) {
            const regex = new RegExp(query, "i");
            filter = {
                $or: [
                    { name: regex },
                    { category: regex },
                    { fertilizer: regex }
                ]
            };
        }
        const guides = await CropGuide.find(filter).sort({ name: 1 });
        res.status(200).json(guides);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const createCropGuide = async (req, res) => {
    try {
        const { name, category, fertilizer, npk, waterRequirement } = req.body;
        if (!name || !category || !fertilizer || !npk || !waterRequirement) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const existing = await CropGuide.findOne({ name: { $regex: new RegExp(`^${name.trim()}$`, "i") } });
        if (existing) {
            return res.status(400).json({ message: "A crop guide with this name already exists." });
        }

        const newGuide = await CropGuide.create({
            name: name.trim(),
            category: category.trim(),
            fertilizer: fertilizer.trim(),
            npk: npk.trim(),
            waterRequirement: waterRequirement.trim()
        });


        res.status(201).json(newGuide);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
