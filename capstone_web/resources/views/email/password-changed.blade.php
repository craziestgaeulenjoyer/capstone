<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Password Changed</title>
</head>
<body>
    <h2>Password Changed Successfully</h2>

    <p>Hello {{ $user->name }},</p>

    <p>
        This is a confirmation that your account password was successfully changed.
    </p>

    <p>
        If you did not perform this action, please contact support immediately.
    </p>

    <br>

    <p>— {{ config('app.name') }}</p>
</body>
</html>
