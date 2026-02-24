import sendEmail from "../Config/Email.js";

// FIXED: Use lowercase enum values that match your schema
export const updatePaymentDetails = async (req, res) => {
  const { fullName, PaymentStatus, AmountPaid, Note } = req.body;

  const normalizedStatus = PaymentStatus
    ? PaymentStatus.toLowerCase()
    : "unpaid";

  const validStatuses = ["unpaid", "partial", "paid"];

  // validation
  if (!fullName || fullName.trim().length < 3) {
    return res.status(400).json({
      success: false,
      message: "Full name is required",
    });
  }

  if (!validStatuses.includes(normalizedStatus)) {
    return res.status(400).json({
      success: false,
      message: `Invalid payment status. Must be one of: ${validStatuses.join(
        ", "
      )}`,
    });
  }

  if (
    normalizedStatus !== "unpaid" &&
    (!AmountPaid || parseFloat(AmountPaid) <= 0)
  ) {
    return res.status(400).json({
      success: false,
      message:
        "Amount must be greater than zero for partial or paid status",
    });
  }

  try {
    const appointment = await AppointmentModel.findOne({
      fullName: { $regex: `^${fullName.trim()}$`, $options: "i" },
    });

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found",
      });
    }

    // 🔥 find existing payment
    let paymentDetails = await AppointmentDetailsModel.findOne({
      appointmentId: appointment._id,
    });

    // 🧠 detect transition to PAID
    const previousStatus = paymentDetails?.PaymentStatus || "unpaid";
    const becamePaid =
      normalizedStatus === "paid" && previousStatus !== "paid";

    // ✅ generate invoice ONLY when fully paid
    const transactionId = becamePaid
      ? `TXN-${Date.now()}-${Math.random()
          .toString(36)
          .substr(2, 6)
          .toUpperCase()}`
      : paymentDetails?.TransactionID || null;

    const invoiceNumber = becamePaid
      ? `INV-${new Date().getFullYear()}-${Math.random()
          .toString(36)
          .substr(2, 8)
          .toUpperCase()}`
      : paymentDetails?.invoiceNumber || null;

    const performanceValue = "Payment Updated";

    if (paymentDetails) {
      paymentDetails.PaymentStatus = normalizedStatus;
      paymentDetails.AmountPaid =
        normalizedStatus !== "unpaid" ? parseFloat(AmountPaid) : null;
      paymentDetails.Note = Note || "";
      paymentDetails.TransactionID = transactionId;
      paymentDetails.invoiceNumber = invoiceNumber;
      paymentDetails.Performance = performanceValue;

      await paymentDetails.save();
    } else {
      paymentDetails = new AppointmentDetailsModel({
        appointmentId: appointment._id,
        PaymentStatus: normalizedStatus,
        AmountPaid:
          normalizedStatus !== "unpaid" ? parseFloat(AmountPaid) : null,
        Note: Note || "",
        TransactionID: transactionId,
        invoiceNumber: invoiceNumber,
        Performance: performanceValue,
      });

      await paymentDetails.save();
    }

    // 📧 SEND INVOICE ONLY WHEN JUST PAID
    if (becamePaid) {
      try {
        await sendEmail({
          to: appointment.email,
          subject: `Invoice ${invoiceNumber}`,
          text: `Hello ${appointment.fullName}, your payment has been received.`,
          html: `
            <div style="font-family: Arial; max-width: 600px;">
              <h2 style="color:#16a34a;">Payment Received</h2>
              <p>Hello <b>${appointment.fullName}</b>,</p>
              <p>We have successfully received your payment.</p>
              <hr/>
              <p><b>Invoice:</b> ${invoiceNumber}</p>
              <p><b>Transaction ID:</b> ${transactionId}</p>
              <p><b>Amount Paid:</b> R${parseFloat(AmountPaid).toFixed(2)}</p>
              <hr/>
              <p>Thank you for your business.</p>
            </div>
          `,
        });

        console.log("Invoice email sent");
      } catch (emailError) {
        console.error("Invoice email failed:", emailError);
      }
    }

    return res.status(200).json({
      success: true,
      message: "Payment details updated successfully",
      transactionId,
      invoiceNumber,
      data: {
        paymentStatus: normalizedStatus,
        amountPaid:
          normalizedStatus !== "unpaid"
            ? parseFloat(AmountPaid)
            : null,
        note: Note || "",
        transactionId,
        invoiceNumber,
      },
    });
  } catch (error) {
    console.error("Update payment error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};