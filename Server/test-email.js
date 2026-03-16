// Server/test-email.js
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import nodemailer from "nodemailer";

// 🔧 Get __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 🔐 Load .env from project root (one level up from Server/)
dotenv.config({ path: path.resolve(__dirname, "..", ".env") });

// 🔍 Debug: Confirm env vars loaded BEFORE creating transporter
console.log("🔐 ENV CHECK:");
console.log("  EMAIL_HOST:", process.env.EMAIL_HOST);
console.log("  EMAIL_PORT:", process.env.EMAIL_PORT);
console.log("  EMAIL_USER:", process.env.EMAIL_USER);
console.log("  EMAIL_PASS length:", process.env.EMAIL_PASS?.length || "❌ undefined");

// Exit early if critical vars are missing
if (!process.env.EMAIL_HOST || !process.env.EMAIL_PASS) {
  console.error("\n❌ Missing EMAIL_HOST or EMAIL_PASS — check .env path and content");
  process.exit(1);
}

// ✅ Create transporter AFTER env is loaded
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: Number(process.env.EMAIL_PORT),
  secure: Number(process.env.EMAIL_PORT) === 465,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// 🧪 Run tests
async function runTest() {
  try {
    // 1️⃣ Verify connection
    console.log("\n🔌 Verifying transporter...");
    await transporter.verify();
    console.log("✅ Transporter ready!");

    // 2️⃣ Send test email
    console.log("\n📤 Sending test email to itu@gmail.com...");
    const info = await transporter.sendMail({
      from: `"Tutoring App" <${process.env.EMAIL_USER}>`,
      to: "itu@gmail.com",
      subject: "🧪 Nodemailer Test - " + new Date().toLocaleTimeString(),
      text: "If you see this, your email configuration is working! 🎉",
      html: `
        <div style="font-family: Arial; max-width: 600px; margin: auto;">
          <h2 style="color: #16a34a;">✅ Email Test Successful!</h2>
          <p>Hello,</p>
          <p>This is a test email from your Tutoring Website backend.</p>
          <p><b>Time:</b> ${new Date().toLocaleString()}</p>
          <hr/>
          <p style="font-size: 12px; color: #666;">If you received this, nodemailer + Gmail is configured correctly.</p>
        </div>
      `,
    });

    console.log("✅ Email sent successfully!");
    console.log("📬 Message ID:", info.messageId);
    console.log("\n🔍 Check your inbox (and spam folder) at itu@gmail.com");
    
    process.exit(0);
    
  } catch (error) {
    console.error("\n❌ Test failed:", error.message);
    console.error("🔍 Error code:", error.code);
    console.error("🔍 Error response:", error.response);
    
    // Gmail-specific hints
    if (error.code === "EAUTH" || error.message?.includes("Authentication")) {
      console.error("\n💡 Gmail Auth Tip:");
      console.error("   • Ensure 2FA is enabled on the Gmail account");
      console.error("   • Use an App Password (not your main password)");
      console.error("   • Revoke & regenerate the App Password if needed");
      console.error("   • App Passwords are 16 characters with NO spaces");
    }
    
    process.exit(1);
  }
}

runTest();