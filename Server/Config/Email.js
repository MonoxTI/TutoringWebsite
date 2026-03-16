import nodemailer from "nodemailer";

// ─── Create Transporter with Enhanced Config ───────────
export const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: Number(process.env.EMAIL_PORT),
  secure: true, // true for 465, false for 587
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  // Recommended for Gmail/Office365
  tls: {
    rejectUnauthorized: false, // ✅ Keep this true in production
  },
  // Optional: connection timeout to avoid hanging
  connectionTimeout: 10000, // 10 seconds
  socketTimeout: 10000,
});

// ─── Verify Connection on Startup (Optional but Recommended) ───
export const verifyTransporter = async () => {
  try {
    await transporter.verify();
    console.log("✅ Email transporter ready to send messages");
    return true;
  } catch (error) {
    console.error("❌ Email transporter verification failed:", error.message);
    return false;
  }
};

// ─── Enhanced sendEmail Function ───────────────────────
/**
 * @typedef {Object} EmailOptions
 * @property {string|string[]} to - Recipient email(s)
 * @property {string} subject - Email subject
 * @property {string} [text] - Plain text body
 * @property {string} [html] - HTML body
 * @property {string|string[]} [cc] - CC recipient(s)
 * @property {string|string[]} [bcc] - BCC recipient(s)
 * @property {string} [replyTo] - Reply-To address
 * @property {Object[]} [attachments] - Nodemailer attachment objects
 */

/**
 * Send an email with robust error handling
 * @param {EmailOptions} options 
 * @returns {Promise<{ success: boolean, messageId?: string, error?: string }>}
 */
export const sendEmail = async ({
  to,
  subject,
  text,
  html,
  cc,
  bcc,
  replyTo,
  attachments = [],
}) => {
  // Validate required fields
  if (!to || !subject) {
    throw new Error("Email 'to' and 'subject' are required");
  }

  // Ensure at least text or html is provided
  if (!text && !html) {
    throw new Error("Email must include either 'text' or 'html' content");
  }

  try {
    const info = await transporter.sendMail({
      from: `"${process.env.EMAIL_FROM_NAME || "Your App"}" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text,
      html,
      cc,
      bcc,
      replyTo: replyTo || process.env.EMAIL_USER,
      attachments,
      // Gmail-specific: prevent auto-threading for transactional emails
      headers: {
        "X-Mailer": "Nodemailer",
        "Precedence": "bulk", // Optional: for marketing emails
      },
    });

    console.log(`✅ Email sent to ${Array.isArray(to) ? to.join(", ") : to} | MessageId: ${info.messageId}`);
    
    return {
      success: true,
      messageId: info.messageId,
    };

  } catch (error) {
    // Handle specific nodemailer/Gmail errors
    const errorCode = error.code || error.response?.code;
    
    console.error("❌ Email sending failed:", {
      message: error.message,
      code: errorCode,
      response: error.response?.body,
      to,
      subject,
    });

    // Optional: Send to error tracking service (e.g., Sentry)
    // if (process.env.NODE_ENV === "production") {
    //   await reportErrorToSentry(error, { context: "email", to, subject });
    // }

    // Re-throw with context for upstream handling
    throw new Error(`Failed to send email: ${error.message}`, { cause: error });
  }
};