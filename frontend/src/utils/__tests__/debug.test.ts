import util from "util";

import { wait, isLocalEnv } from "../debug";

describe("debug", () => {
  // describe("wait", () => {
  //   jest.useFakeTimers();
  //   function isPromisePending(promise: Promise<unknown>) {
  //     return util.inspect(promise).includes("pending");
  //   }

  //   fit("should resolve after the given milliseconds passed without setting isRejected", () => {
  //     const fakeResolver = jest.fn();
  //     const fakeRejecter = jest.fn();
  //     const waitPromise = wait(12345).then(fakeResolver, fakeRejecter);
  //     expect(isPromisePending(waitPromise)).toBeTruthy();
  //     jest.runAllTimers();
  //     return waitPromise;
  //   });
  //   it("should resolve after the given milliseconds passed when setting isRejected as false", () => {
  //     const waitPromise = wait(12345, false).then((data) => {
  //       expect(data).toBeUndefined();
  //     });
  //     expect(isPromisePending(waitPromise)).toBeTruthy();
  //     jest.runAllTimers();
  //     return waitPromise;
  //   });
  //   it("should reject after the given milliseconds passed when setting isRejected as true", () => {
  //     const waitPromise = wait(12345, true).then((data) => {
  //       expect(data).toBeUndefined();
  //     });
  //     expect(isPromisePending(waitPromise)).toBeTruthy();
  //     jest.runAllTimers();
  //   });
  // });
  describe("isLocalEnv", () => {
    const originalNodeEnv = process.env.NODE_ENV;
    beforeEach(() => {
      process.env.NODE_ENV = undefined;
    });
    afterEach(() => {
      process.env.NODE_ENV = originalNodeEnv;
    });
    it("should return false when use production env", () => {
      process.env.NODE_ENV = "production";
      expect(isLocalEnv()).toEqual(false);
    });
    it("should return true when use development env", () => {
      process.env.NODE_ENV = "development";
      expect(isLocalEnv()).toEqual(true);
    });
  });
});
