// test-email.js
import dotenv from "dotenv";
dotenv.config(); // ✅ Load env vars FIRST

// ✅ Debug: confirm env vars loaded
console.log("🔐 Env check:", {
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  user: process.env.EMAIL_USER,
  passLen: process.env.EMAIL_PASS?.length,
});

// ✅ Dynamic import — runs AFTER dotenv.config()
const { transporter, sendEmail } = await import("./Config/Email.js");

console.log("🔌 Verifying transporter...");
try {
  await transporter.verify();
  console.log("✅ Transporter ready");
} catch (error) {
  console.error("❌ Verify failed:", error.message);
  process.exit(1);
}

console.log("\n📤 Sending test email...");
try {
  const result = await sendEmail({
    to: "itu@gmail.com",
    subject: "🧪 Test Email - Nodemailer",
    text: "If you see this, nodemailer is working!",
    html: "<h2>✅ Success!</h2><p>Nodemailer + Gmail is configured correctly.</p>",
  });
  console.log("✅ Email sent!", result);
  process.exit(0);
} catch (err) {
  console.error("❌ Send failed:", err.message);
  process.exit(1);
}