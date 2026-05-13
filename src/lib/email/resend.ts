import { Resend } from "resend";

import { env } from "@/config/env";

import type { EmailClient, SendEmailParams, SendEmailResult } from "./types";

export const resend = new Resend(env.RESEND_API_KEY);

const FROM_EMAIL = env.RESEND_FROM_EMAIL;

// ─── EmailClient Interface Implementation ─────────────────────────────────────

/**
 * Creates an EmailClient backed by Resend.
 * Use this factory function for dependency injection.
 */
export function createResendClient(): EmailClient {
  const client = new Resend(env.RESEND_API_KEY);

  return {
    async sendEmail(params: SendEmailParams): Promise<SendEmailResult> {
      const { data, error } = await client.emails.send({
        from: FROM_EMAIL,
        to: params.to,
        subject: params.subject,
        html: params.html,
      });

      if (error) {
        throw new Error(`Failed to send email: ${error.message}`);
      }

      return { id: data?.id ?? "" };
    },
  };
}

// ─── Email Templates ──────────────────────────────────────────────────────────

export async function sendPaymentConfirmationEmail({
  to,
  name,
  packageName,
  credits,
  amount,
  orderId,
}: {
  to: string;
  name: string;
  packageName: string;
  credits?: number;
  amount: number;
  orderId: string;
}) {
  const formattedAmount = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount);

  await resend.emails.send({
    from: FROM_EMAIL,
    to,
    subject: `✅ Pembayaran Berhasil — SiLamar`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8" />
          <title>Konfirmasi Pembayaran SiLamar</title>
        </head>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #1a1a1a;">
          <div style="text-align: center; margin-bottom: 32px;">
            <h1 style="color: #7C3AED; font-size: 28px; margin: 0;">SiLamar</h1>
            <p style="color: #6b7280; margin: 4px 0 0;">Lamar Kerja Lebih Cerdas</p>
          </div>
          
          <div style="background: #f9fafb; border-radius: 12px; padding: 24px; margin-bottom: 24px;">
            <h2 style="margin: 0 0 16px; font-size: 20px;">✅ Pembayaran Berhasil!</h2>
            <p style="margin: 0; color: #374151;">Halo <strong>${name}</strong>,</p>
            <p style="color: #374151;">Pembayaran kamu untuk <strong>${packageName}</strong> telah berhasil dikonfirmasi.</p>
          </div>

          <div style="border: 1px solid #e5e7eb; border-radius: 12px; padding: 24px; margin-bottom: 24px;">
            <h3 style="margin: 0 0 16px; font-size: 16px; color: #374151;">Detail Transaksi</h3>
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px 0; color: #6b7280;">Order ID</td>
                <td style="padding: 8px 0; text-align: right; font-weight: 500;">${orderId}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #6b7280;">Paket</td>
                <td style="padding: 8px 0; text-align: right; font-weight: 500;">${packageName}</td>
              </tr>
              ${
                credits
                  ? `<tr>
                <td style="padding: 8px 0; color: #6b7280;">Credit Ditambahkan</td>
                <td style="padding: 8px 0; text-align: right; font-weight: 500; color: #7C3AED;">+${credits} credits</td>
              </tr>`
                  : ""
              }
              <tr style="border-top: 1px solid #e5e7eb;">
                <td style="padding: 12px 0 0; font-weight: 600;">Total Pembayaran</td>
                <td style="padding: 12px 0 0; text-align: right; font-weight: 600; font-size: 18px; color: #7C3AED;">${formattedAmount}</td>
              </tr>
            </table>
          </div>

          <div style="text-align: center; margin-bottom: 24px;">
            <a href="${env.NEXT_PUBLIC_APP_URL}/dashboard" 
               style="display: inline-block; background: #7C3AED; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 600;">
              Mulai Gunakan SiLamar →
            </a>
          </div>

          <p style="text-align: center; color: #9ca3af; font-size: 13px;">
            Jika kamu tidak merasa melakukan transaksi ini, hubungi kami di support@silamar.id
          </p>
        </body>
      </html>
    `,
  });
}

export async function sendWelcomeEmail({
  to,
  name,
}: {
  to: string;
  name: string;
}) {
  await resend.emails.send({
    from: FROM_EMAIL,
    to,
    subject: "🎉 Selamat Datang di SiLamar!",
    html: `
      <!DOCTYPE html>
      <html>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #1a1a1a;">
          <div style="text-align: center; margin-bottom: 32px;">
            <h1 style="color: #7C3AED; font-size: 28px; margin: 0;">SiLamar</h1>
          </div>
          <h2>Selamat Datang, ${name}! 🎉</h2>
          <p>Kamu telah berhasil bergabung dengan SiLamar dan mendapat <strong>3 kredit gratis</strong> untuk mencoba fitur AI kami.</p>
          <p>Dengan SiLamar, kamu bisa:</p>
          <ul>
            <li>📄 Buat CV/Resume yang ATS-friendly</li>
            <li>🤖 Analisis CV dengan AI</li>
            <li>📝 Generate cover letter otomatis</li>
            <li>📊 Track semua lamaran kerja kamu</li>
            <li>🎯 Analisis skill gap</li>
          </ul>
          <div style="text-align: center; margin: 32px 0;">
            <a href="${env.NEXT_PUBLIC_APP_URL}/dashboard"
               style="display: inline-block; background: #7C3AED; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 600;">
              Mulai Sekarang →
            </a>
          </div>
        </body>
      </html>
    `,
  });
}
