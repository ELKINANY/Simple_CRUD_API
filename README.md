# Project: Simple CRUD API (Express + MongoDB)

This project is a small example REST API built with Node.js, Express, and MongoDB (Mongoose). It handles user registration, login, and password reset via email.

## Overview

- Language: JavaScript (Node.js)
- Framework: Express
- Database: MongoDB (Mongoose)
- Email: nodemailer (SMTP)

Repository structure (important files/folders):

- `server.js` - application entry point
- `config/` - DB and JWT configuration
- `controllers/` - controllers (e.g. `auth.controller.js`)
- `models/` - Mongoose models (e.g. `user.model.js`)
- `routes/` - API routes (e.g. `auth.route.js`)
- `utils/` - helper utilities (e.g. `apiError.js`, `sendmail.js`)
- `middlewares/` - middlewares (error handler, auth, validators)

## Prerequisites

- Node.js (recommended v18+)
- MongoDB URI (Atlas or local)
- SMTP account for sending email (Gmail with App Password, Mailtrap, etc.)

## Setup & Run

1. Clone the repository.
2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file in the project root and set values (example):

```properties
PORT=7000
MONGO_URI=<your_mongo_uri>
JWT_SECRET=<your_jwt_secret>

# SMTP settings used by utils/sendmail.js
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your.email@gmail.com
SMTP_PASS=your_smtp_password_or_app_password
# Optional: from display address
SMTP_FROM="Book Store" <your.email@gmail.com>
```

Important note for Gmail users: if you use Gmail for sending emails, create an App Password (requires enabling 2-Step Verification) and use that as `SMTP_PASS`.

4. Start the server:

```bash
npm start
```

The server will run on the port set in `PORT`.

## API Endpoints

Base path: `/api/auth`

1) Register

- URL: `POST /api/auth/register`
- Body (JSON):

```json
{
	"name": "Mohamed",
	"email": "mohamed@example.com",
	"password": "password123"
}
```

- Success response (201):

```json
{
	"data": { /* user data */ },
	"token": "<jwt-token>"
}
```

2) Login

- URL: `POST /api/auth/login`
- Body (JSON):

```json
{
	"email": "mohamed@example.com",
	"password": "password123"
}
```

- Success response (200):

```json
{
	"data": { /* user data */ },
	"token": "<jwt-token>"
}
```

3) Forgot password (send reset code)

- URL: `POST /api/auth/forgot-password`
- Body (JSON):

```json
{
	"email": "mohamed@example.com"
}
```

- Success response (200):

```json
{
	"status": "Success",
	"message": "Reset code sent to email"
}
```

Note: the email sender uses `utils/sendmail.js`. If sending fails you may see an error: `There is an error in sending email`.

4) Verify reset code

- URL: `POST /api/auth/verify-reset-code`
- Body (JSON):

```json
{
	"email": "mohamed@example.com",
	"resetCode": "123456"
}
```

- Success response (200):

```json
{
	"status": "Success",
	"message": "Reset code verified successfully"
}
```

5) Reset password

- URL: `POST /api/auth/reset-password`
- Body (JSON):

```json
{
	"email": "mohamed@example.com",
	"newPassword": "newStrongPassword"
}
```

- Success response (200):

```json
{
	"status": "Success",
	"message": "Password reset successfully"
}
```

## Email Troubleshooting

If you encounter the error below when calling the `forgotPassword` controller:

```json
{
	"status": "error",
	"statusCode": 500,
	"error": "There is an error in sending email",
	"stack": "Error: There is an error in sending email\n    at ..."
}
```

Check the following:

1. Environment variables
	 - Ensure `.env` contains `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS` and names match those used in `utils/sendmail.js`.
	 - For Gmail, use an App Password and enable 2-Step Verification.

2. Value formatting
	 - Avoid accidental spaces around values.
	 - If a value contains spaces or special characters, quote it in `.env`.

3. Test with a SMTP testing tool
	 - Use services like Mailtrap or Ethereal (smtp.ethereal.email) to capture messages during development without sending real emails.

4. Notes about `utils/sendmail.js`
	 - That utility uses `nodemailer` and SMTP settings. If you modified it, make sure `from`, `auth.user` and `auth.pass` point to correct values.

## Security Notes

- Do not commit `.env` to git. Add it to `.gitignore`.
- Use App Passwords or service-specific credentials for SMTP.
- Keep `JWT_SECRET` secure.

## Quick curl examples

Register:

```bash
curl -X POST http://localhost:7000/api/auth/register \
	-H "Content-Type: application/json" \
	-d '{"name":"Mohamed","email":"m@m.com","password":"123456"}'
```

Login:

```bash
curl -X POST http://localhost:7000/api/auth/login \
	-H "Content-Type: application/json" \
	-d '{"email":"m@m.com","password":"123456"}'
```

## Next steps

If you want, I can:

- Add a Postman collection for quick tests.
- Restore or improve `utils/sendmail.js` to use `SMTP_*` env vars and more robust error logging.
- Add small automated tests for auth routes.

---

This README has been replaced with the English-only version as requested.

