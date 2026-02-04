import { AppointmentModel } from "../Models/DB.js";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const createAppointment = async (req, res) => {
  const {
    fullName,
    email,
    phoneNumber,
    packageName,
    date: appointmentDate,
    tutor
  } = req.body;

  // Validate required fields
  if (!fullName?.trim() || !email?.trim() || !phoneNumber || !packageName?.trim() || !appointmentDate || !tutor?.trim()) {
    return res.status(400).json({ success: false, message: "All fields are required" });
  }

  // Validate email
  if (!emailRegex.test(email)) {
    return res.status(400).json({ success: false, message: "Invalid email format" });
  }

  // Validate phone
  const phoneNumberClean = String(phoneNumber).replace(/\D/g, '');
  if (phoneNumberClean.length < 9 || phoneNumberClean.length > 15) {
    return res.status(400).json({ success: false, message: "Invalid phone number" });
  }

  // Validate date
  const parsedDate = new Date(appointmentDate);
  if (isNaN(parsedDate.getTime())) return res.status(400).json({ success: false, message: "Invalid date format" });
  const today = new Date();
  today.setHours(0,0,0,0);
  if (parsedDate < today) return res.status(400).json({ success: false, message: "Appointment date cannot be in the past" });

  try {
    const newAppointment = new AppointmentModel({
      fullName: fullName.trim(),
      email: email.trim().toLowerCase(),
      phoneNumber: phoneNumberClean,
      packageName: packageName.trim(),
      date: parsedDate,
      tutor: tutor.trim(),
    });

    const savedAppointment = await newAppointment.save();

    return res.status(201).json({
      success: true,
      message: "Appointment created successfully",
      data: {
        id: savedAppointment._id.toString(),
        fullName: savedAppointment.fullName,
        email: savedAppointment.email,
        phoneNumber: savedAppointment.phoneNumber,
        packageName: savedAppointment.packageName,
        date: savedAppointment.date.toISOString().split("T")[0],
        tutor: savedAppointment.tutor,
      },
    });
  } catch (error) {
    console.error("Appointment creation error:", error);

    if (error.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        error: Object.values(error.errors).map(e => e.message),
      });
    }

    if (error.code === 11000) {
      return res.status(400).json({ success: false, message: "Duplicate entry", error: error.keyValue });
    }

    return res.status(500).json({
      success: false,
      message: "Server error occurred while creating appointment",
    });
  }
};
