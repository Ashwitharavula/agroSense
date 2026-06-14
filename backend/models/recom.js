import mongoose from "mongoose";

const recommendationSchema =
new mongoose.Schema(
{
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },

    farmId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Farm",
        required:true
    },

    recommendedCrop:{
        type:String,
        required:true
    },

    fertilizer:{
        type:String,
        required:true
    },

    waterRequirement:{
        type:String,
        default:"Medium"
    },

    weatherCondition:{
        type:String,
        default:"Normal"
    },

    alertMessage:{
        type:String,
        default:"No Alerts"
    }
},
{
    timestamps:true
}
);

const Recommendation =
mongoose.model(
"Recommendation",
recommendationSchema
);

export default Recommendation;
