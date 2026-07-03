export const verifyEmailTemplate = (name: string, otp: string) => `
<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Verify your RateFlow account</title>
  </head>
  <body style="font-family: Arial, sans-serif; background:#f5f7fb; margin:0; padding:0;">
    <table width="100%" cellpadding="0" cellspacing="0">
      <tr>
        <td align="center">
          <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff; margin:24px; border-radius:8px; overflow:hidden;">
            <tr style="background:#0b63ff; color:#fff;"><td style="padding:20px; text-align:left;"><img src="https://rateflow.in/logo.png" alt="RateFlow" height="28" style="vertical-align:middle;"> <span style="margin-left:12px; font-weight:700;">RateFlow</span></td></tr>
            <tr><td style="padding:28px; color:#333;">
              <h2 style="margin-top:0;">Hi ${name || 'there'},</h2>
              <p>Please use the following One Time Password (OTP) to verify your RateFlow account. This OTP will expire in 10 minutes.</p>
              <p style="font-size:22px; font-weight:700; letter-spacing:4px;">${otp}</p>
              <p>If you did not create an account, please ignore this email.</p>
              <p>Thanks,<br/>The RateFlow Team</p>
            </td></tr>
            <tr><td style="background:#f2f6ff; padding:14px; color:#6b7280; font-size:13px;">© ${new Date().getFullYear()} RateFlow — Accounting SaaS</td></tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>
`;

export const resetPasswordTemplate = (name: string, otp: string) => `
<!doctype html>
<html>
  <head><meta charset="utf-8" /><meta name="viewport" content="width=device-width, initial-scale=1" /></head>
  <body style="font-family: Arial, sans-serif; background:#f5f7fb; margin:0; padding:0;">
    <table width="100%"><tr><td align="center">
      <table width="600" style="background:#fff; border-radius:8px; overflow:hidden; margin:24px;">
        <tr style="background:#0b63ff; color:#fff;"><td style="padding:20px;"><img src="https://rateflow.in/logo.png" alt="RateFlow" height="28"> RateFlow</td></tr>
        <tr><td style="padding:28px; color:#333;"><h2>Reset your password</h2><p>Use the OTP below to reset your RateFlow password. The code expires in 10 minutes.</p><p style="font-size:22px; font-weight:700;">${otp}</p><p>If you didn't request this, ignore this email.</p><p>Thanks,<br/>RateFlow Team</p></td></tr>
        <tr><td style="background:#f2f6ff; padding:14px; color:#6b7280; font-size:13px;">© ${new Date().getFullYear()} RateFlow</td></tr>
      </table>
    </td></tr></table>
  </body>
</html>
`;

export const passwordChangedTemplate = (name: string) => `
<!doctype html>
<html>
  <head><meta charset="utf-8" /></head>
  <body style="font-family: Arial, sans-serif; background:#f5f7fb; margin:0; padding:0;">
    <table width="100%"><tr><td align="center">
      <table width="600" style="background:#fff; border-radius:8px; overflow:hidden; margin:24px;">
        <tr style="background:#0b63ff; color:#fff;"><td style="padding:20px;">RateFlow</td></tr>
        <tr><td style="padding:28px; color:#333;"><h2>Password changed</h2><p>Hi ${name || ''}, your account password was changed successfully. If you did not perform this action, please contact support immediately.</p><p>Thanks,<br/>RateFlow Team</p></td></tr>
        <tr><td style="background:#f2f6ff; padding:14px; color:#6b7280; font-size:13px;">© ${new Date().getFullYear()} RateFlow</td></tr>
      </table>
    </td></tr></table>
  </body>
</html>
`;
