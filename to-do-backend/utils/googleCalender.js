const { google } = require("googleapis");
const User = require("../models/User");
const dotenv = require("dotenv");
dotenv.config();

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  "https://to-do-backend-liard.vercel.app/api/auth/google/callback"
);

async function addTaskToGoogleCalendar(userId, task) {
  try {
    const user = await User.findById(userId);
    if (!user || !user.google.accessToken) return;

    oauth2Client.setCredentials({ access_token: user.google.accessToken });

    const calendar = google.calendar({ version: "v3", auth: oauth2Client });

    const event = {
      summary: task.title,
      description: task.description,
      start: { dateTime: task.dueDate, timeZone: "UTC" },
      end: { dateTime: task.dueDate, timeZone: "UTC" },
    };

    const response = await calendar.events.insert({
      calendarId: "primary",
      resource: event,
    });

    return response.data.id;
    console.log(response)
  } catch (error) {
    console.error("Error syncing task with Google Calendar:", error);
  }
}

async function deleteTaskFromGoogleCalendar(userId, eventId) {
  try {
    const user = await User.findById(userId);
    if (!user || !user.google.accessToken) return;

    oauth2Client.setCredentials({ access_token: user.google.accessToken });

    const calendar = google.calendar({ version: "v3", auth: oauth2Client });

    await calendar.events.delete({
      calendarId: "primary",
      eventId,
    });
  } catch (error) {
    console.error("Error deleting task from Google Calendar:", error);
  }
}

module.exports = { addTaskToGoogleCalendar, deleteTaskFromGoogleCalendar };
