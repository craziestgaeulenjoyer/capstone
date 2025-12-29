<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Mi Amore - Password Reset</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { text-align: center; background: #8CB662; padding: 20px; color: white; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; }
        .otp-code { font-size: 32px; font-weight: bold; text-align: center; color: #8CB662; margin: 20px 0; }
        .footer { text-align: center; margin-top: 30px; font-size: 12px; color: #666; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Mi Amore Café</h1>
            <p>Password Reset</p>
        </div>
        <div class="content">
            <h2>Hello, {{ $name }}!</h2>
            <p>We received a request to reset your password. Please use the following verification code to proceed:</p>
            
            <div class="otp-code">{{ $otp }}</div>
            
            <p>This code will expire in 10 minutes.</p>
            <p>If you didn't request a password reset, please ignore this email.</p>
            
            <p>Best regards,<br>The Mi Amore Team</p>
        </div>
        <div class="footer">
            <p>&copy; {{ date('Y') }} Mi Amore Café. All rights reserved.</p>
        </div>
    </div>
</body>
</html>