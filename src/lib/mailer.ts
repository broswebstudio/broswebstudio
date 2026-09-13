import nodemailer from 'nodemailer';

// Configure the transporter using Gmail SMTP
// Note: Requires EMAIL_USER and EMAIL_PASS environment variables
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendOtpEmail = async (email: string, otp: string) => {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.warn("EMAIL_USER or EMAIL_PASS not configured. Skipping OTP email.");
    return false;
  }

  const htmlTemplate = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 8px;">
      <h2 style="color: #0f172a;">Verify Your Email</h2>
      <p style="color: #475569; font-size: 16px;">Please use the following 6-digit OTP to verify your account at Bros WebStudio.</p>
      
      <div style="background-color: #facc15; color: #0f172a; padding: 15px; border-radius: 6px; margin: 20px 0; text-align: center; font-size: 24px; font-weight: bold; letter-spacing: 4px;">
        ${otp}
      </div>

      <p style="color: #475569; font-size: 14px;">This OTP is valid for 10 minutes. If you did not request this, please ignore this email.</p>
      <br/>
      <p style="color: #64748b; font-size: 14px;">Best Regards,<br/><strong>The Bros WebStudio Team</strong></p>
    </div>
  `;

  try {
    await transporter.sendMail({
      from: `"Bros WebStudio" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: `Your OTP for Bros WebStudio - ${otp}`,
      html: htmlTemplate,
    });
    return true;
  } catch (error) {
    console.error("Error sending OTP email:", error);
    return false;
  }
};

export const sendSubmissionEmail = async (details: any) => {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.warn("EMAIL_USER or EMAIL_PASS not configured. Skipping email notification.");
    return false;
  }

  // Parse servicesSelected if it's a string
  let parsedServices = details.servicesSelected;
  if (typeof parsedServices === 'string') {
    try {
      parsedServices = JSON.parse(parsedServices);
    } catch (e) {
      console.error("Failed to parse servicesSelected", e);
    }
  }

  const { category, projectName, projectDesc, target, techStack, deadline } = parsedServices || {};
  const contactName = details.contactName || "Client";
  const contactEmail = details.contactEmail || "No Email Provided";
  const contactPhone = details.contactPhone || "No Phone Provided";

  const adminHtmlTemplate = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 8px;">
      <h2 style="color: #0f172a;">🚀 New Project Submission</h2>
      <p style="color: #475569; font-size: 16px;">You have received a new project request on Bros WebStudio.</p>
      
      <div style="background-color: #f8fafc; padding: 15px; border-radius: 6px; margin: 20px 0;">
        <h3 style="margin-top: 0; color: #334155;">Client Details</h3>
        <ul style="list-style: none; padding-left: 0;">
          <li><strong>Name:</strong> ${contactName}</li>
          <li><strong>Email:</strong> ${contactEmail}</li>
          <li><strong>Phone:</strong> ${contactPhone}</li>
        </ul>
      </div>

      <div style="background-color: #f8fafc; padding: 15px; border-radius: 6px; margin: 20px 0;">
        <h3 style="margin-top: 0; color: #334155;">Project Details</h3>
        <ul style="list-style: none; padding-left: 0;">
          <li><strong>Category:</strong> ${category?.toUpperCase()}</li>
          <li><strong>Project Title:</strong> ${projectName || 'N/A'}</li>
          ${techStack ? `<li><strong>Tech Stack:</strong> ${techStack}</li>` : ''}
          ${deadline ? `<li><strong>Deadline:</strong> ${deadline}</li>` : ''}
          <li><strong>Target Audience:</strong> ${target || 'N/A'}</li>
          <li><strong>Estimated Price:</strong> ₹${details.totalEstimate || 0}</li>
          ${details.message ? `<li><strong>Additional Message:</strong> ${details.message}</li>` : ''}
        </ul>
        ${projectDesc ? `<p><strong>Requirements:</strong><br/>${projectDesc}</p>` : ''}
      </div>
      
      <p style="color: #64748b; font-size: 14px;">This email was generated automatically by the BWS Estimator.</p>
    </div>
  `;

  const userHtmlTemplate = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 8px;">
      <h2 style="color: #0f172a;">Request Submitted Successfully!</h2>
      <p style="color: #475569; font-size: 16px;">Hi ${contactName},</p>
      <p style="color: #475569; font-size: 16px;">Thank you for reaching out to Bros WebStudio. We have received your project details for <strong>${projectName || 'your project'}</strong>.</p>
      <p style="color: #475569; font-size: 16px;">Our team will review your requirements and get back to you within 1-2 business days to discuss the next steps.</p>
      
      <div style="background-color: #facc15; color: #0f172a; padding: 15px; border-radius: 6px; margin: 20px 0; text-align: center; font-weight: bold;">
        Estimated Price: ₹${details.totalEstimate || 0}
      </div>

      <p style="color: #475569; font-size: 16px;">We look forward to working with you!</p>
      <br/>
      <p style="color: #64748b; font-size: 14px;">Best Regards,<br/><strong>The Bros WebStudio Team</strong></p>
    </div>
  `;

  try {
    // Send email to Admin
    await transporter.sendMail({
      from: `"${contactName} (via BWS)" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER, // Sending to yourself
      replyTo: contactEmail !== "No Email Provided" ? contactEmail : process.env.EMAIL_USER,
      subject: `New Lead: ${projectName || category || 'Project'} from ${contactName}`,
      html: adminHtmlTemplate,
    });

    // Send confirmation email to Client (if email is provided)
    if (contactEmail && contactEmail !== "No Email Provided") {
      await transporter.sendMail({
        from: `"Bros WebStudio" <${process.env.EMAIL_USER}>`,
        to: contactEmail,
        subject: `We've received your request! - Bros WebStudio`,
        html: userHtmlTemplate,
      });
    }
    
    return true;
  } catch (error) {
    console.error("Error sending email:", error);
    return false;
  }
};
