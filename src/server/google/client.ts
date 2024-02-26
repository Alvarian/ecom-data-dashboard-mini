import { google } from "googleapis";
import { env } from "~/env.js";


const auth = await google.auth.getClient({
    scopes: "https://www.googleapis.com/auth/spreadsheets",
    credentials: {
        "private_key": atob(env.GOOGLE_PRIVATE_KEY),
        // "private_key": env.GOOGLE_PRIVATE_KEY,
        "client_email": process.env.GOOGLE_CLIENT_EMAIL
    }
});

export const sheets = google.sheets({ version: "v4", auth }).spreadsheets;