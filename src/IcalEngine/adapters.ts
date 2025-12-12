import {
  ICalAlarmData,
  ICalAlarmTriggerAfterData,
  ICalAlarmTriggerBeforeData,
  ICalAlarmType,
  ICalAttendeeRole,
  ICalAttendeeStatus,
} from "ical-generator";

import {
  IcsAlarm,
  IcsAlarmTriggerWhen,
  IcsAttendeeRole,
  IcsAttendeeStatus,
} from "../interfaces.js";

export function roleAdapter(role?: IcsAttendeeRole): ICalAttendeeRole {
  const roleAdapterMap = {
    [IcsAttendeeRole.REQUIRED]: ICalAttendeeRole.REQ,
    [IcsAttendeeRole.OPTIONAL]: ICalAttendeeRole.OPT,
    [IcsAttendeeRole.NONE]: ICalAttendeeRole.NON,
    [IcsAttendeeRole.CHAIR]: ICalAttendeeRole.CHAIR,
  };
  return roleAdapterMap[role] ?? ICalAttendeeRole.REQ;
}

export function statusAdapter(status?: IcsAttendeeStatus): ICalAttendeeStatus {
  const statusAdapterMap = {
    [IcsAttendeeStatus.NEEDSACTION]: ICalAttendeeStatus.NEEDSACTION,
    [IcsAttendeeStatus.ACCEPTED]: ICalAttendeeStatus.ACCEPTED,
    [IcsAttendeeStatus.DELEGATED]: ICalAttendeeStatus.DELEGATED,
    [IcsAttendeeStatus.DECLINED]: ICalAttendeeStatus.DECLINED,
    [IcsAttendeeStatus.TENTATIVE]: ICalAttendeeStatus.TENTATIVE,
  };
  return statusAdapterMap[status] ?? ICalAttendeeStatus.NEEDSACTION;
}

export function alarmAdapter({
  triggerSeconds,
  triggerWhen,
  description,
}: IcsAlarm): ICalAlarmData {
  const alarm = {
    type: ICalAlarmType.display,
    description: description ?? "Reminder",
  } satisfies ICalAlarmData;
  if (triggerWhen === IcsAlarmTriggerWhen.BEFORE) {
    (alarm as ICalAlarmTriggerBeforeData).triggerBefore = triggerSeconds;
  } else {
    (alarm as ICalAlarmTriggerAfterData).triggerAfter = triggerSeconds;
  }
  return alarm;
}
