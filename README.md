# ics-builder

A simple, flexible ICS (iCalendar) builder for Node.js. It uses a builder pattern with pluggable engines to generate `.ics` files. Currently supports `ical-generator` as the default engine.

## Installation

```bash
npm install ics-builder
```

## Usage

### Basic Example

```typescript
import { IcsBuilder, IcsEvent } from 'ics-builder';

// 1. Create the builder (uses IcalEngine by default)
const builder = new IcsBuilder();

// 2. Define your event
const event: IcsEvent = {
  uid: 'event-123@example.com',
  sequence: 0,
  start: new Date('2023-12-25T10:00:00Z'),
  end: new Date('2023-12-25T11:00:00Z'),
  title: 'Christmas Brunch',
  description: 'Join us for a festive brunch!',
  organizer: {
    name: 'John Doe',
    email: 'john@example.com',
  },
  attendees: [
    {
      name: 'Jane Smith',
      email: 'jane@example.com',
      rsvp: true,
    },
  ],
  location: '123 Holiday Lane',
};

// 3. Generate the ICS
// Options: buildCreateIcs, buildUpdateIcs, buildCancelIcs
const result = builder.buildCreateIcs(event);

console.log(result.uid); // event-123@example.com
console.log(result.sequence); // 0

// Access the generated files
console.log(result.attachments.calendar.content); // Main .ics content
console.log(result.attachments.raw.content); // Raw content
```

### Methods

The `IcsBuilder` provides three main methods corresponding to standard iCalendar methods:

- `buildCreateIcs(event)`: Generates an ICS with `METHOD:REQUEST` for new events.
- `buildUpdateIcs(event)`: Generates an ICS with `METHOD:REQUEST` for updating events (increment `sequence`).
- `buildCancelIcs(event)`: Generates an ICS with `METHOD:CANCEL` to cancel an event.

## Architecture

- **IcsBuilder**: The main entry point. Delegates generation to the underlying engine.
- **IcalEngine**: The default implementation using the `ical-generator` library.
- **Interfaces**: Typed interfaces for Events, Attendees, Alarms, etc.

## License

MIT
