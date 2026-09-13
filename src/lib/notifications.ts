export async function sendNotification(data: any) {
  // In a real application, you would configure these in .env
  const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
  const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;
  const EMAIL_API_KEY = process.env.EMAIL_API_KEY; // e.g., Resend or SendGrid

  const message = `
🚀 *New Lead Received!*
*Type:* ${data.status}
*Name:* ${data.contactName || 'N/A'}
*Contact:* ${data.contactEmail || 'N/A'} ${data.contactPhone || ''}
*Total:* ₹${data.totalEstimate}

*Message:* 
${data.message || 'No message provided.'}
  `;

  console.log('--- NOTIFICATION DISPATCH START ---');
  console.log(message);

  // 1. Send to Telegram (Mocked/Ready)
  if (TELEGRAM_BOT_TOKEN && TELEGRAM_CHAT_ID) {
    try {
      await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: TELEGRAM_CHAT_ID,
          text: message,
          parse_mode: 'Markdown'
        })
      });
      console.log('✅ Telegram notification sent.');
    } catch (e) {
      console.error('❌ Failed to send Telegram notification:', e);
    }
  } else {
    console.log('⚠️ Telegram notification skipped (Missing env variables).');
  }

  // 2. Send Email (Mocked/Ready via Resend example)
  if (EMAIL_API_KEY) {
    try {
      await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${EMAIL_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          from: 'onboarding@resend.dev',
          to: 'broswebstudio@gmail.com',
          subject: `New Lead: ${data.status} from ${data.contactName}`,
          html: `<p>You have a new lead.</p><pre>${message}</pre>`
        })
      });
      console.log('✅ Email notification sent.');
    } catch (e) {
      console.error('❌ Failed to send Email notification:', e);
    }
  } else {
    console.log('⚠️ Email notification skipped (Missing env variables).');
  }

  console.log('--- NOTIFICATION DISPATCH END ---');
}
