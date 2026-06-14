import express from "express";
import cors from "cors";

import connectDB from "./config/db.js";

import authRoutes from "./routes/authorR.js";
import farmRoutes from "./routes/farmR.js";
import recommendationRoutes from "./routes/recomR.js";
import cropGuideRoutes from "./routes/cropGuideR.js";

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.send("AgroSense API Running...");
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/farm", farmRoutes);
app.use("/api/recommendation", recommendationRoutes);
app.use("/api/fertilizer-guide", cropGuideRoutes);


const startServer = async () => {
    await connectDB();

    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
};

startServer();
