abstract class BaseStore<P extends Record<string, unknown>> {
  props: P;

  constructor(props: P) {
    this.props = props;
  }
}

export { BaseStore };
