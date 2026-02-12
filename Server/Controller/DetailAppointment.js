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

// FIXED: Use lowercase enum values that match your schema
export const updatePaymentDetails = async (req, res) => {
  const { fullName, PaymentStatus, AmountPaid, Note } = req.body;

  // Convert to lowercase to match schema enum values
  const normalizedStatus = PaymentStatus ? PaymentStatus.toLowerCase() : 'unpaid';
  
  // VALID enum values (MUST match your schema exactly)
  const validStatuses = ['unpaid', 'partial', 'paid'];

  // Validation
  if (!fullName || fullName.trim().length < 3) {
    return res.status(400).json({
      success: false,
      message: "Full name is required"
    });
  }

  if (!validStatuses.includes(normalizedStatus)) {
    return res.status(400).json({
      success: false,
      message: `Invalid payment status. Must be one of: ${validStatuses.join(', ')}`
    });
  }

  if (normalizedStatus !== 'unpaid' && (!AmountPaid || parseFloat(AmountPaid) <= 0)) {
    return res.status(400).json({
      success: false,
      message: "Amount must be greater than zero for partial or paid status"
    });
  }

  try {
    // Find appointment by full name (case-insensitive)
    const appointment = await AppointmentModel.findOne({
      fullName: { $regex: `^${fullName.trim()}$`, $options: "i" }
    });

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found"
      });
    }

    // Generate transaction ID and invoice number if paid/partial
    const transactionId = normalizedStatus !== 'unpaid' 
      ? `TXN-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`
      : null;
    
    const invoiceNumber = normalizedStatus !== 'unpaid'
      ? `INV-${new Date().getFullYear()}-${Math.random().toString(36).substr(2, 8).toUpperCase()}`
      : null;

    // CRITICAL: Handle the required Performance field
    // Check your AppointmentDetailsModel schema - Performance is required!
    const performanceValue = "Payment Updated"; // Provide a default value

    // Find or create payment details
    let paymentDetails = await AppointmentDetailsModel.findOne({
      appointmentId: appointment._id
    });

    if (paymentDetails) {
      // Update existing payment details with lowercase status
      paymentDetails.PaymentStatus = normalizedStatus;
      paymentDetails.AmountPaid = normalizedStatus !== 'unpaid' ? parseFloat(AmountPaid) : null;
      paymentDetails.Note = Note || "";
      paymentDetails.TransactionID = transactionId;
      paymentDetails.invoiceNumber = invoiceNumber;
      paymentDetails.Performance = performanceValue; // SATISFY required field
      
      await paymentDetails.save();
    } else {
      // Create new payment details with ALL required fields
      paymentDetails = new AppointmentDetailsModel({
        appointmentId: appointment._id,
        PaymentStatus: normalizedStatus, // lowercase
        AmountPaid: normalizedStatus !== 'unpaid' ? parseFloat(AmountPaid) : null,
        Note: Note || "",
        TransactionID: transactionId,
        invoiceNumber: invoiceNumber,
        Performance: performanceValue // REQUIRED FIELD - MUST BE PROVIDED
      });
      
      await paymentDetails.save();
    }

    return res.status(200).json({
      success: true,
      message: "Payment details updated successfully",
      transactionId: transactionId,
      invoiceNumber: invoiceNumber,
      data: {
        paymentStatus: normalizedStatus, // lowercase
        amountPaid: normalizedStatus !== 'unpaid' ? parseFloat(AmountPaid) : null,
        note: Note || "",
        transactionId: transactionId,
        invoiceNumber: invoiceNumber
      }
    });

  } catch (error) {
    console.error("Update payment error:", error);
    // Log specific validation errors for debugging
    if (error.name === 'ValidationError') {
      console.error("Validation errors:", error.errors);
    }
    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};