import { ICalCalendarMethod } from "ical-generator";

import { type IcsEngine, IcsEvent, IcsResult } from "../interfaces.js";
import { buildIcalIcs } from "./core.js";

export class IcalEngine implements IcsEngine {
  create(event: IcsEvent): IcsResult {
    return buildIcalIcs(event, ICalCalendarMethod.REQUEST);
  }

  update(event: IcsEvent): IcsResult {
    return buildIcalIcs(event, ICalCalendarMethod.REQUEST);
  }

  cancel(event: IcsEvent): IcsResult {
    return buildIcalIcs(event, ICalCalendarMethod.CANCEL);
  }
}
