import { AppointmentModel, AppointmentDetailsModel } from "../Models/DB.js";

export const getAppointmentDetails = async (req, res) => {
  const { fullName } = req.body;

  if (!fullName || fullName.trim().length < 3) {
    return res.status(400).json({
      success: false,
      message: "Full name is required"
    });
  }

  try {
    // Case-insensitive search
    const appointment = await AppointmentModel.findOne({
      fullName: { $regex: `^${fullName.trim()}$`, $options: "i" }
    }).lean();

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found"
      });
    }

    const paymentDetails = await AppointmentDetailsModel.findOne({
      appointmentId: appointment._id
    }).lean();

    return res.status(200).json({
      success: true,
      message: "Appointment details retrieved successfully",
      data: {
        appointment: {
          id: appointment._id,
          fullName: appointment.fullName,
          email: appointment.email,
          phoneNumber: appointment.phoneNumber,
          packageName: appointment.packageName,
          date: appointment.date?.toISOString().split("T")[0],
          tutor: appointment.tutor,
          createdAt: appointment.createdAt
        },
        paymentDetails: paymentDetails
          ? {
              paymentStatus: paymentDetails.PaymentStatus,
              transactionId: paymentDetails.TransactionID,
              amountPaid: paymentDetails.AmountPaid,
              invoiceNumber: paymentDetails.invoiceNumber,
              note: paymentDetails.Note
            }
          : null
      }
    });

  } catch (error) {
    console.error("Search error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};
