export const prerender = false;
import { supabase } from "../../../lib/supabase";

export async function GET({ params }) {
  const { userId } = params;

  // 1. Fetch logs for this specific user
  const { data: logs } = await supabase
    .from('logs')
    .select('*')
    .eq('user_id', userId);

  // 2. Build the iCalendar string
  let icsContent = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//YourApp//NONSGML v1.0//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH"
  ].join("\r\n") + "\r\n";

  logs?.forEach((log) => {
    const dt = new Date(log.created_at).toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
    icsContent += [
      "BEGIN:VEVENT",
      `UID:${log.id}@yourapp.com`,
      `DTSTAMP:${dt}`,
      `DTSTART:${dt}`,
      `DURATION:PT${log.duration.replace(/\D/g, "")}M`, // Assumes duration is a string like "30 mins"
      `SUMMARY:${log.activity}`,
      "END:VEVENT"
    ].join("\r\n") + "\r\n";
  });

  icsContent += "END:VCALENDAR";

  // 3. Return as a downloadable file
  return new Response(icsContent, {
    headers: {
      "Content-Type": "text/calendar",
      "Content-Disposition": `attachment; filename="activity-log.ics"`
    }
  });
}