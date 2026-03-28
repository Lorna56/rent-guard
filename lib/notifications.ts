import { Resend } from 'resend';
import { Twilio } from 'twilio';

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

const twilioClient = (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN)
  ? new Twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN)
  : null;

interface NotificationOptions {
  to: string;
  subject?: string;
  message: string;
  type: 'email' | 'sms' | 'both';
}

export async function sendNotification({ to, subject, message, type }: NotificationOptions) {
  const results = {
    email: { sent: false, error: null as string | null },
    sms: { sent: false, error: null as string | null },
  };

  // 1. Send Email via Resend
  if (type === 'email' || type === 'both') {
    if (resend) {
      try {
        const { data, error } = await resend.emails.send({
          from: 'RentGuard <notices@rentguard.io>',
          to: [to],
          subject: subject || 'Urgent Notice: RentGuard Alert',
          html: `<div style="font-family: sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
                  <h2 style="color: #ec4899;">RentGuard Urgent Notice</h2>
                  <p>${message}</p>
                  <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />
                  <p style="font-size: 12px; color: #666;">This is an automated message from your property manager via RentGuard.</p>
                 </div>`
        });
        if (error) throw error;
        results.email.sent = true;
      } catch (err) {
        console.error('Email failed:', err);
        results.email.error = err instanceof Error ? err.message : String(err);
      }
    } else {
      console.log('[SIMULATION] Email would be sent to:', to, 'Message:', message);
      results.email.sent = true;
    }
  }

  // 2. Send SMS via Twilio
  if (type === 'sms' || type === 'both') {
    if (twilioClient && process.env.TWILIO_PHONE_NUMBER) {
      try {
        await twilioClient.messages.create({
          body: `RentGuard Notice: ${message}`,
          to: to, // Ensure this is E.164 format
          from: process.env.TWILIO_PHONE_NUMBER,
        });
        results.sms.sent = true;
      } catch (err) {
        console.error('SMS failed:', err);
        results.sms.error = err instanceof Error ? err.message : String(err);
      }
    } else {
      console.log('[SIMULATION] SMS would be sent to:', to, 'Message:', message);
      results.sms.sent = true;
    }
  }

  return results;
}
