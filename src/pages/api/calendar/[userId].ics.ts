import type { APIRoute } from 'astro';
import { createClient } from '@supabase/supabase-js';

export const prerender = false;

export const GET: APIRoute = async ({ params }) => {
  const { userId } = params;

  const supabase = createClient(
    import.meta.env.PUBLIC_SUPABASE_URL,
    import.meta.env.SUPABASE_SERVICE_ROLE_KEY
  );

  // Fetching your columns: id, user_id, activity, duration, created_at
  const { data: logs, error } = await supabase
    .from('logs')
    .select('id, activity, duration, created_at')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    return new Response(`Error: ${error.message}`, { status: 500 });
  }

  const formatDate = (date: Date) => {
    return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
  };

const events = logs?.map((log) => {
  const startDate = new Date(log.created_at);
  
  // 1. Parse "01:30:00" into total minutes
  const durationParts = (log.duration || "00:30:00").split(':');
  const hours = parseInt(durationParts[0]) || 0;
  const minutes = parseInt(durationParts[1]) || 0;
  const seconds = parseInt(durationParts[2]) || 0;
  
  const totalDurationMinutes = (hours * 60) + minutes + (seconds / 60);
  
  // 2. Calculate the end date
  const endDate = new Date(startDate.getTime() + totalDurationMinutes * 60000);

  return `BEGIN:VEVENT
UID:${log.id}@productify.m-creates.com
DTSTAMP:${formatDate(new Date())}
DTSTART:${formatDate(startDate)}
DTEND:${formatDate(endDate)}
SUMMARY:🚀 ${log.activity || 'Focus Session'}
DESCRIPTION:Total duration: ${log.duration}
END:VEVENT`;
}).join('\n');

  const icsString = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Productify//Max//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'X-WR-CALNAME:Productify Logs',
    'X-WR-TIMEZONE:Pacific/Auckland',
    events,
    'END:VCALENDAR'
  ].join('\n');

  return new Response(icsString, {
    headers: {
      'Content-Type': 'text/calendar; charset=utf-8',
      'Content-Disposition': 'attachment; filename="activity-log.ics"',
      'Cache-Control': 'no-store, no-cache, must-revalidate'
    },
  });
};