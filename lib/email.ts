import { Resend } from "resend";

const FROM = "PromptPixel <noreply@makobytes.com>";
const SUPPORT = "rsailors@makologics.com";

function client(): Resend {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) throw new Error("RESEND_API_KEY not set");
  return new Resend(apiKey);
}

export async function sendLicenseKeyEmail(opts: {
  to: string;
  licenseKey: string;
  customerName?: string | null;
}) {
  const name = opts.customerName?.trim() || "there";
  const html = renderHtml({ name, licenseKey: opts.licenseKey });
  const text = renderText({ name, licenseKey: opts.licenseKey });

  const { data, error } = await client().emails.send({
    from: FROM,
    to: opts.to,
    replyTo: SUPPORT,
    subject: "Your PromptPixel license key",
    html,
    text,
  });

  if (error) throw new Error(`Resend send failed: ${JSON.stringify(error)}`);
  return data;
}

function renderHtml(opts: { name: string; licenseKey: string }): string {
  return `<!DOCTYPE html>
<html>
  <body style="margin:0;padding:0;background:#0f1218;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;color:#e8edf3;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#0f1218;padding:32px 16px;">
      <tr>
        <td align="center">
          <table role="presentation" width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;background:#1e2330;border-radius:12px;overflow:hidden;">
            <tr>
              <td style="padding:32px 32px 16px 32px;">
                <div style="font-size:13px;color:#8b95a7;letter-spacing:1px;text-transform:uppercase;margin-bottom:8px;">PromptPixel</div>
                <h1 style="margin:0;font-size:24px;font-weight:600;color:#ffffff;">Thanks for your purchase, ${escapeHtml(opts.name)}.</h1>
              </td>
            </tr>
            <tr>
              <td style="padding:8px 32px 16px 32px;font-size:15px;line-height:1.6;color:#c7cfdb;">
                Your license key is below. Keep it somewhere safe — you'll need it to activate PromptPixel.
              </td>
            </tr>
            <tr>
              <td style="padding:16px 32px;">
                <div style="background:#0f1218;border:1px solid #2a3142;border-radius:8px;padding:20px;font-family:Consolas,'Courier New',monospace;font-size:16px;color:#3b82f6;word-break:break-all;text-align:center;letter-spacing:0.5px;">
                  ${escapeHtml(opts.licenseKey)}
                </div>
              </td>
            </tr>
            <tr>
              <td style="padding:16px 32px;font-size:15px;line-height:1.6;color:#c7cfdb;">
                <strong style="color:#e8edf3;">How to activate:</strong>
                <ol style="margin:8px 0 0 0;padding-left:20px;color:#c7cfdb;">
                  <li>Open PromptPixel</li>
                  <li>Go to <strong>Settings &rarr; License</strong></li>
                  <li>Paste your key and click <strong>Activate</strong></li>
                </ol>
              </td>
            </tr>
            <tr>
              <td style="padding:16px 32px 32px 32px;font-size:14px;line-height:1.6;color:#8b95a7;border-top:1px solid #2a3142;">
                Questions or trouble activating? Just reply to this email &mdash; it goes straight to me.<br><br>
                &mdash; Russell, Mako Logics
              </td>
            </tr>
          </table>
          <div style="margin-top:16px;font-size:12px;color:#6b7585;">
            Mako Logics LLC &middot; <a href="https://makobytes.com" style="color:#6b7585;text-decoration:underline;">makobytes.com</a>
          </div>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

function renderText(opts: { name: string; licenseKey: string }): string {
  return `Thanks for your purchase, ${opts.name}.

Your PromptPixel license key:

  ${opts.licenseKey}

How to activate:
  1. Open PromptPixel
  2. Go to Settings -> License
  3. Paste your key and click Activate

Questions or trouble activating? Just reply to this email.

-- Russell, Mako Logics
https://makobytes.com
`;
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
