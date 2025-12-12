export enum IcsAttendeeStatus {
  NEEDSACTION = 'needs-action',
  ACCEPTED = 'accepted',
  DELEGATED = 'delegated',
  DECLINED = 'declined',
  TENTATIVE = 'tentative',
}

export enum IcsAttendeeRole {
  REQUIRED = 'required',
  OPTIONAL = 'optional',
  NONE = 'none',
  CHAIR = 'chair',
}

export type IcsAttachment = {
  filename: string;
  content: string | Buffer;
  contentType?: string;
  contentDisposition?: string;
};

/** Event organizer (ORGANIZER). */
export interface IcsParticipant {
  name?: string;
  email: string;
}

/** Event attendee (ATTENDEE). */
export interface IcsAttendee extends IcsParticipant {
  role?: IcsAttendeeRole;
  status?: IcsAttendeeStatus;
  rsvp?: boolean;
}

/** Main input to build an ICS. */
export type IcsEvent = {
  /**
   * Stable event UID (RFC 5545).
   * Use a example domain, e.g.: `schedule-<id>@example.com`.
   */
  uid: string;
  /** Increments on every update for calendar dedupe (SEQUENCE). */
  sequence: number;
  start: Date;
  end: Date;
  title: string;
  description?: string;
  organizer: IcsParticipant;
  attendees: IcsAttendee[];
  timezone?: string;
  location?: string;
  url?: string;
  rrule?: string;
  extras?: Record<string, string>;
  createdAt?: Date;
  lastModifiedAt?: Date;
  recurrenceId?: string;
  /** Optional alarms;*/
  alarms?: IcsAlarm[];
};

/** Alarm/reminder */
export enum IcsAlarmTriggerWhen {
  BEFORE = 'before',
  AFTER = 'after',
}
export type IcsAlarm = {
  triggerWhen: IcsAlarmTriggerWhen;
  /** Seconds to trigger. */
  triggerSeconds: number;
  /** Optional text for display alarms. */
  description?: string;
};

export interface IcsBuilderContract {
  buildCreateIcs(event: IcsEvent): IcsResult;
  buildUpdateIcs(event: IcsEvent): IcsResult;
  buildCancelIcs(event: IcsEvent): IcsResult;
}

export interface IcsEngine {
  create(event: IcsEvent): IcsResult;
  update(event: IcsEvent): IcsResult;
  cancel(event: IcsEvent): IcsResult;
}

export type IcsAttachments = {
  calendar: IcsAttachment; //text/calendar file
  raw: IcsAttachment; //application/ics file
};

export interface IcsResult {
  sequence: number;
  uid: string;
  attachments: IcsAttachments;
}
