import { AppointmentModel, AppointmentDetailsModel } from "../Models/DB.js";

// FIXED: Use lowercase enum values that match your schema
import { sendEmail } from "../Config/Email.js";


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
          chapters: appointment.chapters || "", // <--- include chapters
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
import { randomUUID } from 'crypto';

// Helper: Escape regex special characters to prevent injection
const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

export const updatePaymentDetails = async (req, res) => {
  const { fullName, PaymentStatus, AmountPaid, Note } = req.body;

  const normalizedStatus = PaymentStatus
    ? PaymentStatus.toLowerCase().trim()
    : "unpaid";

  const validStatuses = ["unpaid", "partial", "paid"];

  // ─── Validation ──────────────────────────────────────
  if (!fullName || fullName.trim().length < 3) {
    return res.status(400).json({
      success: false,
      message: "Full name is required (min 3 characters)",
    });
  }

  if (!validStatuses.includes(normalizedStatus)) {
    return res.status(400).json({
      success: false,
      message: `Invalid payment status. Must be one of: ${validStatuses.join(", ")}`,
    });
  }

  // Parse and validate amount safely
  const amount = normalizedStatus !== "unpaid" ? parseFloat(AmountPaid) : null;
  if (normalizedStatus !== "unpaid" && (!AmountPaid || isNaN(amount) || amount <= 0)) {
    return res.status(400).json({
      success: false,
      message: "Amount must be a valid number greater than zero for partial or paid status",
    });
  }

  try {
    // ─── Find Appointment (safe regex) ─────────────────
    const appointment = await AppointmentModel.findOne({
      fullName: { $regex: `^${escapeRegex(fullName.trim())}$`, $options: "i" },
    });

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found",
      });
    }

    // ─── Find or Initialize Payment Details ────────────
    let paymentDetails = await AppointmentDetailsModel.findOne({
      appointmentId: appointment._id,
    });

    const previousStatus = paymentDetails?.PaymentStatus?.toLowerCase() || "unpaid";
    const becamePaid = normalizedStatus === "paid" && previousStatus !== "paid";

    // ─── Generate secure IDs only on transition to PAID ─
    const transactionId = becamePaid
      ? `TXN-${Date.now()}-${randomUUID().slice(0, 6).toUpperCase()}`
      : paymentDetails?.TransactionID || null;

    const invoiceNumber = becamePaid
      ? `INV-${new Date().getFullYear()}-${randomUUID().slice(0, 8).toUpperCase()}`
      : paymentDetails?.invoiceNumber || null;

    const performanceValue = "Payment Updated";

    // ─── Update or Create Payment Record ───────────────
    const updateData = {
      PaymentStatus: normalizedStatus,
      AmountPaid: amount,
      Note: Note?.trim() || "",
      TransactionID: transactionId,
      invoiceNumber,
      Performance: performanceValue,
      updatedAt: new Date(), // optional: track last update
    };

    if (paymentDetails) {
      Object.assign(paymentDetails, updateData);
      await paymentDetails.save();
    } else {
      paymentDetails = new AppointmentDetailsModel({
        appointmentId: appointment._id,
        ...updateData,
        createdAt: new Date(),
      });
      await paymentDetails.save();
    }

    // ─── Send Invoice Email (best-effort) ──────────────
    if (becamePaid && appointment.email) {
      try {
        await sendEmail({
          to: appointment.email,
          subject: `Invoice ${invoiceNumber} - Payment Confirmed`,
          text: `Hello ${appointment.fullName},\n\nYour payment of R${amount?.toFixed(2)} has been received.\nInvoice: ${invoiceNumber}\nTransaction ID: ${transactionId}\n\nThank you for your business.`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; color: #333;">
              <h2 style="color: #16a34a; border-bottom: 2px solid #16a34a; padding-bottom: 10px;">✅ Payment Received</h2>
              <p>Hello <strong>${appointment.fullName}</strong>,</p>
              <p>We have successfully received your payment.</p>
              <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;"/>
              <table style="width: 100%; border-collapse: collapse;">
                <tr><td style="padding: 6px 0;"><strong>Invoice:</strong></td><td>${invoiceNumber}</td></tr>
                <tr><td style="padding: 6px 0;"><strong>Transaction ID:</strong></td><td>${transactionId}</td></tr>
                <tr><td style="padding: 6px 0;"><strong>Amount Paid:</strong></td><td>R${amount?.toFixed(2)}</td></tr>
                <tr><td style="padding: 6px 0;"><strong>Date:</strong></td><td>${new Date().toLocaleDateString()}</td></tr>
              </table>
              <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;"/>
              <p style="font-size: 14px; color: #666;">Thank you for your business. Please keep this email for your records.</p>
            </div>
          `,
        });
        console.log(`✅ Invoice email sent to ${appointment.email}`);
      } catch (emailError) {
        console.error("❌ Invoice email failed:", emailError.message);
        // Optional: log to error tracking service (e.g., Sentry)
        // Do NOT fail the request — email is best-effort
      }
    }

    // ─── Success Response ──────────────────────────────
    return res.status(200).json({
      success: true,
      message: "Payment details updated successfully",
      data: {
        paymentStatus: normalizedStatus,
        amountPaid: amount?.toFixed(2) || null,
        note: Note?.trim() || "",
        transactionId,
        invoiceNumber,
        becamePaid, // helpful for frontend logic
      },
    });

  } catch (error) {
    console.error("💥 Update payment error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      // Avoid leaking error details in production:
      // error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};