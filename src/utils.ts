export enum CalendarProvider {
  GOOGLE = 'google',
  OUTLOOK = 'outlook',
}

type CalendarProviderLinkProps = {
  provider: CalendarProvider;
  title: string;
  description: string;
  start: Date;
  end: Date;
  location: string;
};

export function buildCalendarProviderLink({
  provider,
  title,
  description,
  start,
  end,
  location,
}: CalendarProviderLinkProps) {
  const formatDate = (d: Date) => d.toISOString().replace(/-|:|\.\d\d\d/g, '');
  const details = encodeURIComponent(description);
  const text = encodeURIComponent(title);
  const loc = encodeURIComponent(location);
  const dates = `${formatDate(start)}/${formatDate(end)}`;
  switch (provider) {
    case CalendarProvider.GOOGLE:
      return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${text}&dates=${dates}&details=${details}&location=${loc}`;
    case CalendarProvider.OUTLOOK:
      return `https://outlook.live.com/calendar/0/action/compose?subject=${text}&body=${details}&location=${loc}&startdt=${dates}&enddt=${dates}`;
    default:
      throw new Error(`Invalid calendar provider: ${provider}`);
  }
}
