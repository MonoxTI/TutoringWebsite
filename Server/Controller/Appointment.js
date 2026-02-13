import { AppointmentModel } from "../Models/DB.js";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const createAppointment = async (req, res) => {
  const {
    fullName,
    email,
    phoneNumber,
    chapters
  } = req.body;

  // Validate required fields
  if (!fullName?.trim() || !email?.trim() || !phoneNumber || !chapters?.trim()) {
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

  try {
    const newAppointment = new AppointmentModel({
      fullName: fullName.trim(),
      email: email.trim().toLowerCase(),
      phoneNumber: phoneNumberClean,
      chapters: chapters.trim(),
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
        chapters: savedAppointment.chapters,
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
