# Studash

Studash is a CRM system for students that they can use to organize their courses and assignments. It is developed using TypeScript, React, trpc, Prisma, and Next.js. It uses Google OAuth for user authentication.

## Installation

To get started, run the following commands:

```bash
npm install
npx prisma db push
npm run dev
```

## Environment Variables

All users should create a `.env` file with the following variables:

```makefile
DATABASE_URL="file:./db.sqlite"

NEXTAUTH_SECRET=""
NEXTAUTH_URL="http://localhost:3000"

GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""
```

Note that the `DATABASE_URL` should be set to the location of your SQLite database file, and `NEXTAUTH_SECRET` should be set to a random string for securing cookies and tokens.

## Contributing

If you would like to contribute to Studash, please open a pull request on GitHub.
