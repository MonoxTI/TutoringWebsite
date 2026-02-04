import mongoose from "mongoose";
//import bcrypt from "bcrypt";
import bcrypt from 'bcryptjs';

const { Schema } = mongoose;

/* ─── User Schema ───────────────────────────────────────── */

const UserSchema = new Schema({
  username: { type: String, required: true, unique: true },
  email: {
  type: String,
  required: true,
  unique: true,
  lowercase: true,
  trim: true
}
,
  password: { type: String, required: true, select: false },
});

// Hash password before save
UserSchema.pre("save", async function () {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 12);
  }
});


// Compare password method
UserSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

/* ─── Appointment Schema ────────────────────────────────── */

const AppointmentSchema = new Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true, lowercase: true, trim: true },
  phoneNumber: { type: String, required: true },
  packageName: { type: String, required: true },
  date: { type: Date, required: true },
  tutor: { type: String, required: true }
}, { timestamps: true });


/* ─── Appointment Details Schema ────────────────────────── */

const AppointmentDetailsSchema = new Schema({
  appointmentId: { type: Schema.Types.ObjectId, ref: "Appointment", required: true },
  PaymentStatus: { type: String, enum: ["pending", "paid", "failed"], required: true },
  Performance: { type: String, required: true },
  TransactionID: { type: String, required: true },
  AmountPaid: { type: Number, required: true },
  invoiceNumber: { type: String, required: true, unique: true },
  Note: { type: String, trim: true }
}, { timestamps: true });


/* ─── Models ────────────────────────────────────────────── */

export const UserModel = mongoose.model("User", UserSchema);
export const AppointmentModel = mongoose.model("Appointment", AppointmentSchema);
export const AppointmentDetailsModel = mongoose.model(
  "AppointmentDetails",
  AppointmentDetailsSchema
);
