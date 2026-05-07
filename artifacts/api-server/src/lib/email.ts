import { Resend } from "resend";

let _client: Resend | null = null;

function getClient(): Resend | null {
  if (!process.env.RESEND_API_KEY) return null;
  if (!_client) _client = new Resend(process.env.RESEND_API_KEY);
  return _client;
}

const FROM = process.env.RESEND_FROM_EMAIL ?? "Btachon <onboarding@resend.dev>";
const APP_URL = process.env.FRONTEND_URL ?? "https://discipline-nexus--pearlysabel.replit.app";

function base(content: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Btachon</title>
</head>
<body style="margin:0;padding:0;background:#f5f1eb;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f1eb;padding:40px 0;">
    <tr><td align="center">
      <table width="560" cellpadding="0" cellspacing="0" style="background:#1a1714;border-radius:16px;overflow:hidden;max-width:560px;width:100%;">
        <!-- Header -->
        <tr>
          <td style="padding:32px 40px 24px;border-bottom:1px solid #2e2926;">
            <p style="margin:0;font-size:22px;font-weight:800;color:#e8d5b0;letter-spacing:-0.5px;">בטחון</p>
            <p style="margin:2px 0 0;font-size:10px;font-weight:700;letter-spacing:3px;color:#8a7a6a;text-transform:uppercase;">BTACHON</p>
          </td>
        </tr>
        <!-- Body -->
        <tr>
          <td style="padding:32px 40px;">
            ${content}
          </td>
        </tr>
        <!-- Footer -->
        <tr>
          <td style="padding:20px 40px 28px;border-top:1px solid #2e2926;">
            <p style="margin:0;font-size:12px;color:#5a5048;line-height:1.5;">
              You're receiving this because you have a Btachon account.<br />
              <a href="${APP_URL}" style="color:#c9964a;text-decoration:none;">Open Btachon</a>
            </p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

function btn(text: string, url: string): string {
  return `<a href="${url}" style="display:inline-block;margin-top:24px;padding:13px 28px;background:#c9964a;color:#1a1714;font-weight:700;font-size:14px;border-radius:10px;text-decoration:none;">${text}</a>`;
}

function h1(text: string): string {
  return `<h1 style="margin:0 0 12px;font-size:24px;font-weight:800;color:#f0e6d3;line-height:1.2;">${text}</h1>`;
}

function p(text: string): string {
  return `<p style="margin:0 0 8px;font-size:15px;color:#b0a090;line-height:1.6;">${text}</p>`;
}

function highlight(label: string, value: string): string {
  return `<div style="margin:20px 0;padding:16px 20px;background:#231f1c;border-left:3px solid #c9964a;border-radius:0 8px 8px 0;">
    <p style="margin:0 0 4px;font-size:11px;font-weight:700;letter-spacing:2px;color:#8a7a6a;text-transform:uppercase;">${label}</p>
    <p style="margin:0;font-size:15px;color:#e8d5b0;font-weight:600;">${value}</p>
  </div>`;
}

// ── Welcome email ──────────────────────────────────────────────────────────────

export async function sendWelcomeEmail(to: string, firstName: string | null) {
  const client = getClient();
  if (!client) return;
  const name = firstName ? `, ${firstName}` : "";
  try {
    await client.emails.send({
      from: FROM,
      to,
      subject: "Welcome to Btachon",
      html: base(`
        ${h1(`Welcome to Btachon${name}`)}
        ${p("You've just joined a community built around Jewish growth, accountability, and connection.")}
        ${p("Here's what you can do:")}
        <ul style="margin:12px 0;padding-left:20px;color:#b0a090;font-size:14px;line-height:2;">
          <li>Track daily mitzvos and build a growth streak</li>
          <li>Connect with friends and send each other challenges</li>
          <li>Request Tehillim from your chevra</li>
          <li>Learn with shiurim and find a chavrusa</li>
          <li>Set your location for accurate Shabbos zmanim</li>
        </ul>
        ${btn("Open Btachon", APP_URL)}
      `),
    });
  } catch (err) {
    console.error("[email] welcome failed:", err);
  }
}

// ── Challenge notification ─────────────────────────────────────────────────────

export async function sendChallengeEmail(
  to: string,
  toFirstName: string | null,
  fromDisplayName: string,
  message: string | null
) {
  const client = getClient();
  if (!client) return;
  const name = toFirstName ? `, ${toFirstName}` : "";
  try {
    await client.emails.send({
      from: FROM,
      to,
      subject: `${fromDisplayName} sent you a growth challenge`,
      html: base(`
        ${h1(`You've been challenged${name}`)}
        ${p(`<strong style="color:#e8d5b0;">${fromDisplayName}</strong> is inviting you to take on a growth challenge together.`)}
        ${message ? highlight("The Challenge", message) : ""}
        ${p("Accept or decline directly in the app.")}
        ${btn("View Challenge", `${APP_URL}/connect`)}
      `),
    });
  } catch (err) {
    console.error("[email] challenge notification failed:", err);
  }
}

// ── Tehillim request notification ─────────────────────────────────────────────

export async function sendTehillimEmail(
  to: string,
  toFirstName: string | null,
  fromDisplayName: string,
  message: string | null
) {
  const client = getClient();
  if (!client) return;
  const name = toFirstName ? `, ${toFirstName}` : "";
  try {
    await client.emails.send({
      from: FROM,
      to,
      subject: `${fromDisplayName} is asking you to say Tehillim`,
      html: base(`
        ${h1(`Tehillim request${name}`)}
        ${p(`<strong style="color:#e8d5b0;">${fromDisplayName}</strong> is asking you to say Tehillim.`)}
        ${message ? highlight("Who to daven for", message) : ""}
        ${p("Open the app to accept or decline.")}
        ${btn("View Request", `${APP_URL}/connect`)}
      `),
    });
  } catch (err) {
    console.error("[email] tehillim notification failed:", err);
  }
}
