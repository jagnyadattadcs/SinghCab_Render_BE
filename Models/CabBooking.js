import mongoose from "mongoose";

const cabBookingSchema = new mongoose.Schema(
  {
    carType: { type: String, required: true },
    carModel: { type: String },
    pickup: { type: String },
    drop: { type: String },
    km: { type: Number },
    pricePerKm: { type: Number }, // Added field
    name: { type: String , required: true },
    email: { type: String ,  },
    phone: { type: String , required: true },
    startDate: { type: Date },
    endDate: { type: Date },
  },
  { timestamps: true }
);

export default mongoose.model("CabBooking", cabBookingSchema);
