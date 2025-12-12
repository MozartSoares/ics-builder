import ical, {
  ICalCalendar,
  ICalCalendarMethod,
  ICalEvent,
  ICalEventStatus,
  ICalEventTransparency,
} from 'ical-generator';

import { IcsAlarm, IcsAttachment, IcsAttendeeStatus, IcsEvent, IcsResult } from '../interfaces.js';
import { alarmAdapter, roleAdapter, statusAdapter } from './adapters.js';

const addAlarm = (vevent: ICalEvent, alarm: IcsAlarm): void => {
  vevent.createAlarm(alarmAdapter(alarm));
};

const toCalendarAttachment = (calendar: ICalCalendar): IcsAttachment => ({
  filename: 'invitation.ics',
  content: calendar.toString(),
  contentType: `text/calendar; charset=UTF-8; method=${calendar.method()}`,
  contentDisposition: 'attachment',
});

const toRawIcsAttachment = (calendar: ICalCalendar): IcsAttachment => ({
  filename: 'invite.ics',
  content: calendar.toString(),
  contentType: 'application/ics',
  contentDisposition: 'attachment',
});

const getEvent = (calendar: ICalCalendar, event: IcsEvent, method: ICalCalendarMethod) => {
  if (method === ICalCalendarMethod.CANCEL) {
    // CANCEL events must be minimal.
    const vevent = calendar.createEvent({
      id: event.uid,
      sequence: event.sequence,
      start: event.start,
      status: ICalEventStatus.CANCELLED,
      lastModified: event.lastModifiedAt,
      created: event.createdAt,
      stamp: new Date(),
    });

    if (event.recurrenceId) {
      vevent.recurrenceId(event.recurrenceId);
    }
    return vevent;
  }
  return calendar.createEvent({
    id: event.uid,
    sequence: event.sequence,
    start: event.start,
    end: event.end,
    summary: event.title,
    description: event.description,
    location: event.location ?? event.url,
    url: event.url,
    organizer: {
      name: event.organizer.name,
      email: event.organizer.email,
    },
    transparency: ICalEventTransparency.OPAQUE,
    status: ICalEventStatus.CONFIRMED,
    created: event.createdAt ?? new Date(),
    lastModified: event.lastModifiedAt ?? new Date(),
    stamp: new Date(),
  });
};

const getCalendar = (method: ICalCalendarMethod) => {
  return ical({
    prodId: {
      product: 'calendar',
    },
    method,
    scale: 'GREGORIAN',
    // timezone: event.timezone,
  });
};

export function buildIcalIcs(event: IcsEvent, method: ICalCalendarMethod): IcsResult {
  const calendar = getCalendar(method);
  const vevent = getEvent(calendar, event, method);
  // Extras
  if (event.extras) {
    Object.entries(event.extras).forEach(([key, value]) => {
      vevent.x(key, value);
    });
  }

  if (method === ICalCalendarMethod.REQUEST) {
    // Alarms
    if (event.alarms?.length) {
      for (const alarm of event.alarms) {
        addAlarm(vevent, alarm);
      }
    }

    // Recurrence
    if (event.rrule) {
      vevent.repeating(event.rrule);
    }

    // Attendees
    for (const attendee of event.attendees) {
      const isOrganizer = attendee.email === event.organizer.email;
      const status = isOrganizer ? IcsAttendeeStatus.ACCEPTED : attendee.status;

      // Default to true if the attendee has no RSVP
      let rsvp = attendee.rsvp ?? true;
      // If the attendee is the organizer, the RSVP is always false
      if (isOrganizer) {
        rsvp = false;
      }

      vevent.createAttendee({
        email: attendee.email,
        name: attendee.name,
        role: roleAdapter(attendee.role),
        status: statusAdapter(status),
        rsvp,
      });
    }

    return {
      sequence: event.sequence,
      uid: event.uid,
      attachments: {
        calendar: toCalendarAttachment(calendar),
        raw: toRawIcsAttachment(calendar),
      },
    };
  }

  return {
    sequence: event.sequence,
    uid: event.uid,
    attachments: {
      calendar: toCalendarAttachment(calendar),
      raw: toRawIcsAttachment(calendar),
    },
  };
}
