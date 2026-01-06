<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Email Change Verification</title>
</head>
<body style="margin:0;padding:0;background-color:#f4f6f8;font-family:Arial, Helvetica, sans-serif;">

  <table width="100%" cellpadding="0" cellspacing="0">
    <tr>
      <td align="center" style="padding:40px 16px;">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;background:#ffffff;border-radius:12px;box-shadow:0 10px 25px rgba(0,0,0,0.08);overflow:hidden;">

          <!-- Header -->
          <tr>
            <td style="padding:24px 28px;border-bottom:1px solid #e5e7eb;">
              <h2 style="margin:0;font-size:20px;color:#111827;">
                Verify Email Change
              </h2>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding:24px 28px;">
              <p style="margin:0 0 12px;font-size:14px;color:#374151;">
                We received a request to change the email address associated with your account:
              </p>

              <p style="margin:0 0 20px;font-size:14px;font-weight:600;color:#111827;">
                {{ $email }}
              </p>

              <p style="margin:0 0 24px;font-size:14px;color:#374151;line-height:1.6;">
                To proceed, please confirm this request by clicking the button below. If you did not make this request, you can safely deny it.
              </p>

              <!-- CTA Buttons -->
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center" style="padding-bottom:12px;">
                    <a href="{{ $changeUrl }}"
                       style="
                         display:inline-block;
                         padding:12px 22px;
                         background:#8cb662;
                         color:#ffffff;
                         text-decoration:none;
                         font-size:14px;
                         font-weight:600;
                         border-radius:8px;
                       ">
                      Change Email
                    </a>
                  </td>
                </tr>
                <tr>
                  <td align="center">
                    <a href="{{ $denyUrl }}"
                       style="
                         display:inline-block;
                         padding:10px 18px;
                         background:#f3f4f6;
                         color:#374151;
                         text-decoration:none;
                         font-size:13px;
                         border-radius:8px;
                       ">
                      Deny Request
                    </a>
                  </td>
                </tr>
              </table>

              <!-- Security Note -->
              <p style="margin-top:28px;font-size:12px;color:#6b7280;line-height:1.5;">
                This verification link will expire in 10 minutes.  
                If you did not request this action, no further action is required.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:16px 28px;background:#f9fafb;border-top:1px solid #e5e7eb;">
              <p style="margin:0;font-size:11px;color:#9ca3af;text-align:center;">
                © {{ date('Y') }} Your Admin System. All rights reserved.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>

</body>
</html>
