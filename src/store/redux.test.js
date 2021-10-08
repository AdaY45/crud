import { cleanup, render } from "@testing-library/react";
import * as reactRedux from "react-redux";
import store from "./index";
import { usersActions } from "./users-slice";

describe("users slice", () => {
  it("users test", () => {
    store.dispatch(
      usersActions.addUsers([
        {
          id: "1",
          username: "user1",
          email: "user2@gmail.com",
          password: "user1**",
          type: "user",
        },
        {
          id: "2",
          username: "user2",
          email: "user2@gmail.com",
          password: "user2**",
          type: "user",
        },
      ])
    );
    let state = store.getState().users;
    let user = state.users.find((u) => u.id === "1");
    expect(user.username).toBe("user1");
  });
});
