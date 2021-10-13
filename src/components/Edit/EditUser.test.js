import React from "react";
import ReactRouter from "react-router";
import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import EditUser from "./EditUser";
import * as reactRedux from "react-redux";

const mockStore = {
  user: {
    auth: "",
    user: {},
  },
  ui: {
    isAdmin: true,
  },
};

jest.mock("react-redux", () => ({
  useSelector: jest.fn(),
  useDispatch: jest.fn(),
}));

const useSelectorMock = reactRedux.useSelector;
const useDispatchMock = reactRedux.useDispatch;

describe("EditProfile component", () => {
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

  it("should close button closes the window", () => {
    const useDispatchSpy = jest.spyOn(reactRedux, "useDispatch");
    useDispatchSpy.mockReturnValue(useDispatchMock);
    jest
      .spyOn(ReactRouter, "useParams")
      .mockReturnValue({ id: "615c33299215cb7c1a02f0d4" });
    const { getByTestId } = render(<EditUser />);

    userEvent.click(getByTestId("close"));

    expect(useDispatchMock).toHaveBeenCalledWith({
      payload: "user",
      type: "ui/modalClose",
    });
  });
});
