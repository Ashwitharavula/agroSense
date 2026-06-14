import Farm from "../models/farm.js";

// Add Farm
export const addFarm = async (req, res) => {
    try {

        const farm = await Farm.create(req.body);

        res.status(201).json({
            message: "Farm Added Successfully",
            farm
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

// Get All Farms
export const getFarms = async (req, res) => {
    try {

        const { userId } = req.query;
        const filter = userId ? { userId } : {};
        const farms = await Farm.find(filter);

        res.status(200).json(farms);

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

// Get Farm By Id
export const getFarmById = async (req, res) => {
    try {

        const farm = await Farm.findById(req.params.id);

        if (!farm) {
            return res.status(404).json({
                message: "Farm Not Found"
            });
        }

        res.status(200).json(farm);

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

// Update Farm
export const updateFarm = async (req, res) => {
    try {

        const farm = await Farm.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );

        res.status(200).json({
            message: "Farm Updated Successfully",
            farm
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

// Delete Farm
export const deleteFarm = async (req, res) => {
    try {

        await Farm.findByIdAndDelete(req.params.id);

        res.status(200).json({
            message: "Farm Deleted Successfully"
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};
