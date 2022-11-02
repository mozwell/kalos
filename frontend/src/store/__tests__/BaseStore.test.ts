import { observable } from "mobx";

import { BaseStore } from "../BaseStore";

describe("BaseStore", () => {
  class ChildStore extends BaseStore<{}> {
    constructor(props: any) {
      super(props);
    }
  }

  it("should has props set as passed arg when construct child class", () => {
    const childStore = new ChildStore({ child: "child" });
    expect(childStore.props.child).toBe("child");
  });

  it("should has props changed when its source observable is modified", () => {
    const dataObserved = observable({ child: "child" });
    const childStore = new ChildStore(dataObserved);
    expect(childStore.props.child).toBe("child");
    dataObserved.child = "parent";
    expect(childStore.props.child).toBe("parent");
  });
});
