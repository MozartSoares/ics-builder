import { IcalEngine } from "./IcalEngine/index.js";
import {
  type IcsBuilderContract,
  IcsEngine,
  IcsEvent,
  IcsResult,
} from "./interfaces.js";

const DEFAULT_ENGINE = new IcalEngine();

export class IcsBuilder implements IcsBuilderContract {
  constructor(private readonly engine: IcsEngine = DEFAULT_ENGINE) {}

  buildCreateIcs(event: IcsEvent): IcsResult {
    return this.engine.create(event);
  }
  buildUpdateIcs(event: IcsEvent): IcsResult {
    return this.engine.update(event);
  }
  buildCancelIcs(event: IcsEvent): IcsResult {
    return this.engine.cancel(event);
  }
}
