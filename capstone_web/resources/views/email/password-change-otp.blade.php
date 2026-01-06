<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Password Change OTP</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: Arial, sans-serif; background-color: #f4f6f8; margin: 0; padding: 0;">
    <table width="100%" cellpadding="0" cellspacing="0">
        <tr>
            <td align="center" style="padding: 30px 0;">
                <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden;">
                    
                    <!-- HEADER -->
                    <tr>
                        <td style="background-color: #8cb662; padding: 20px; text-align: center;">
                            <h1 style="color: #ffffff; margin: 0;">
                                Password Change Verification
                            </h1>
                        </td>
                    </tr>

                    <!-- BODY -->
                    <tr>
                        <td style="padding: 30px; color: #333333;">
                            <p style="font-size: 16px;">
                                Hello <strong>{{ $user->username ?? 'User' }}</strong>,
                            </p>

                            <p style="font-size: 15px; line-height: 1.6;">
                                We received a request to change the password for your account.
                                Please use the One-Time Password (OTP) below to continue.
                            </p>

                            <!-- OTP BOX -->
                            <div style="margin: 30px 0; text-align: center;">
                                <span
                                    style="
                                        display: inline-block;
                                        padding: 15px 30px;
                                        font-size: 28px;
                                        letter-spacing: 6px;
                                        font-weight: bold;
                                        background-color: #f0f5eb;
                                        color: #4f7f2f;
                                        border-radius: 6px;
                                    "
                                >
                                    {{ $otp }}
                                </span>
                            </div>

                            <p style="font-size: 14px; color: #555;">
                                ⏱ This code will expire in <strong>10 minutes</strong>.
                            </p>

                            <p style="font-size: 14px; color: #555;">
                                If you did not request a password change, please ignore this email.
                                Your account remains secure.
                            </p>

                            <p style="font-size: 14px; margin-top: 25px;">
                                Regards,<br>
                                <strong>{{ config('app.name') }}</strong> Team
                            </p>
                        </td>
                    </tr>

                    <!-- FOOTER -->
                    <tr>
                        <td style="background-color: #f4f6f8; padding: 15px; text-align: center; font-size: 12px; color: #888;">
                            © {{ date('Y') }} {{ config('app.name') }}. All rights reserved.
                        </td>
                    </tr>

                </table>
            </td>
        </tr>
    </table>
</body>
</html>
