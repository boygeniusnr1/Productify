import { createClient } from '@supabase/supabase-js';

const supabaseUrl = "https://tcytveeeabzqxmaegybf.supabase.co";
const supabaseAnonKey = "sb_publishable_f5V8AZLhp6G2ngYlOcVndw_jL9tfaZ_";
const supabase = createClient(supabaseUrl, supabaseAnonKey);

const prerender = false;
async function GET({ params }) {
  const { userId } = params;
  const { data: logs } = await supabase.from("logs").select("*").eq("user_id", userId);
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
      `DURATION:PT${log.duration.replace(/\D/g, "")}M`,
      // Assumes duration is a string like "30 mins"
      `SUMMARY:${log.activity}`,
      "END:VEVENT"
    ].join("\r\n") + "\r\n";
  });
  icsContent += "END:VCALENDAR";
  return new Response(icsContent, {
    headers: {
      "Content-Type": "text/calendar",
      "Content-Disposition": `attachment; filename="activity-log.ics"`
    }
  });
}

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  GET,
  prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
