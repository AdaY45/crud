import React, { useEffect } from "react";
import { Router } from "react-router-dom";
import { createMemoryHistory } from "history";
import { createPortal } from "react-dom";
import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import EditProfile from "./EditProfile";
import * as reactRedux from "react-redux";

jest.mock("react-redux", () => ({
  useSelector: jest.fn(),
  useDispatch: jest.fn(),
}));

const mockStore = {
  user: {
    selectedUserId: "",
    auth: "",
    profile: {},
    user: {},
  },
  ui: {
    isAdmin: true,
  },
};

const useSelectorMock = reactRedux.useSelector;
const useDispatchMock = reactRedux.useDispatch;

beforeEach(() => {
  useDispatchMock.mockImplementation(() => () => {});
  useSelectorMock.mockImplementation((selector) => selector(mockStore));
});

afterEach(() => {
  useDispatchMock.mockClear();
  useSelectorMock.mockClear();
});

const history = createMemoryHistory();

describe("EditProfile component", () => {
  it("close button closes the window", () => {
    const closeHandler = jest.fn();
    const { getByAltText } = render(
      <Router history={history}>
        <EditProfile />
      </Router>
    );

    userEvent.click(getByAltText(/close/i));

    expect(closeHandler).toHaveBeenCalledTimes(1);
  });
});
