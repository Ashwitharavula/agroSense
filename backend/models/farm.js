import mongoose from "mongoose";

const farmSchema = new mongoose.Schema(
{
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },

    farmName:{
        type:String,
        required:true
    },

    location:{
        type:String,
        required:true
    },

    soilPH:{
        type:Number,
        required:true
    },

    nitrogen:{
        type:Number,
        required:true
    },

    phosphorus:{
        type:Number,
        required:true
    },

    potassium:{
        type:Number,
        required:true
    }
},
{
    timestamps:true
}
);

const Farm = mongoose.model("Farm",farmSchema);

export default Farm;
