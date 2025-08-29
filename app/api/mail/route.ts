import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
  try {
    const { name, email, subject, message } = await request.json();

    // Validate required fields
    if (!subject || !message) {
      return NextResponse.json(
        { error: "Subject and message are required" },
        { status: 400 }
      );
    }

    const emailContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #333; border-bottom: 2px solid #007bff; padding-bottom: 10px;">
          New Contact Form Submission
        </h2>
        
        <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #007bff; margin-top: 0;">Message Details</h3>
          
          ${name ? `<p><strong>Name:</strong> ${name}</p>` : ""}
          ${email ? `<p><strong>Email:</strong> ${email}</p>` : ""}
          <p><strong>Subject:</strong> ${subject}</p>
          <p><strong>Message:</strong></p>
          <div style="background-color: white; padding: 15px; border-radius: 5px; border-left: 4px solid #007bff;">
            ${message.replace(/\n/g, "<br>")}
          </div>
        </div>
        
        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; color: #666; font-size: 14px;">
          <p>This message was sent from your portfolio contact form.</p>
          <p>Timestamp: ${new Date().toLocaleString()}</p>
        </div>
      </div>
    `;

    const result = await resend.emails.send({
      from: "portfolio@updates.bydm.site",
      to: "dkmanwani2000@gmail.com",
      subject: `Portfolio Contact: ${subject}`,
      html: emailContent,
    });

    console.log("resend result::::::::::::::::", result);

    if (result.error) {
      console.error("Resend error:", result.error);
      return NextResponse.json(
        { error: "Failed to send email" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
