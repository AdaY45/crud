import React from "react";
import { Router } from "react-router-dom";
import { render, cleanup } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Profile from "../Profile/Profile";
import ReactRouter from "react-router";
import * as reactRedux from "react-redux";
import { createMemoryHistory } from "history";
import "@testing-library/jest-dom/extend-expect";

const user = {
  _id: "615559cf21d8c861693cf3f4",
  username: "admin",
  email: "admin@gmail.com",
  password: "admin1*",
};

jest.mock("react-redux", () => ({
  useSelector: jest.fn(),
  useDispatch: jest.fn(),
}));

const mockStore = {
  users: {
    users: [
      {
        _id: "615559cf21d8c861693cf3f4",
        username: "admin",
        email: "admin@gmail.com",
        password: "admin1*",
      },
      {
        _id: "615c33299215cb7c1a02f0d4",
        username: "user100",
        email: "user100@gmail.com",
        password: "user100*",
      },
    ],
  },
  user: {
    auth: "",
    userId: "",
    profiles: [],
  },
  ui: {
    isAdmin: true,
  },
};

const useSelectorMock = reactRedux.useSelector;
const useDispatchMock = reactRedux.useDispatch;

afterEach(cleanup);

describe("Profile", () => {
  let originFetch;
  beforeEach(() => {
    originFetch = global.fetch;
    useDispatchMock.mockImplementation(() => () => {});
    useSelectorMock.mockImplementation((selector) => selector(mockStore));
  });
  afterEach(() => {
    global.fetch = originFetch;
    useDispatchMock.mockClear();
    useSelectorMock.mockClear();
  });

  window.confirm = jest.fn(() => true);

  it("should delete profile", () => {
    const history = createMemoryHistory();
    jest
      .spyOn(ReactRouter, "useParams")
      .mockReturnValue({ id: "615559cf21d8c861693cf3f4" });
    const { getByTestId } = render(
      <Router history={history}>
        <Profile />
      </Router>
    );

    userEvent.click(getByTestId("delete"));

    expect(window.confirm).toBeCalled();
    expect(history.location.pathname).toBe("/users");
  });

  it("edit profile", () => {
    const useDispatchSpy = jest.spyOn(reactRedux, "useDispatch");
    useDispatchSpy.mockReturnValue(useDispatchMock);
    jest
      .spyOn(ReactRouter, "useParams")
      .mockReturnValue({ id: "615559cf21d8c861693cf3f4" });
    const { getByTestId } = render(<Profile />);

    userEvent.click(getByTestId("edit"));

    expect(useDispatchMock).toHaveBeenCalledWith({
      payload: false,
      type: "ui/addNewProfilePress",
    });
    expect(useDispatchMock).toHaveBeenCalledWith({
      payload: user,
      type: "user/addUser",
    });
    expect(useDispatchMock).toHaveBeenCalledWith({
      payload: "user",
      type: "ui/modalOpen",
    });
  });
});
