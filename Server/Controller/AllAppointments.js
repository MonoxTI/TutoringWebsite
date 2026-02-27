import {AppointmentModel} from "../Models/DB.js";

// ✅ CORRECTED getAllAppointments controller
export const getAllAppointments = async (req, res) => {
  try {
    const appointments = await AppointmentModel.find().sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      message: "All appointments retrieved successfully",
      data: {
        count: appointments.length,
        appointments: appointments.map(apt => ({
          id: apt._id.toString(),
          fullName: apt.fullName,
          email: apt.email,
          phoneNumber: apt.phoneNumber,
          chapters: apt.chapters,  // 👈 ADD THIS LINE - THIS IS THE FIX!
          createdAt: apt.createdAt || null,
          updatedAt: apt.updatedAt || null,
        })),
      },
    });
  } catch (error) {
    console.error("Error fetching appointments:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};