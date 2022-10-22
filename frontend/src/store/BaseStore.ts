import { makeObservable } from "mobx";

abstract class BaseStore<P extends Record<string, unknown>> {
  props: P;

  constructor(props: P) {
    makeObservable(this);
    this.props = props;
  }
}

export { BaseStore };
