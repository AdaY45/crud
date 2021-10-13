import React from "react";
import {
  render,
  cleanup,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Dashboard from "./Dashboard";
import * as reactRedux from "react-redux";
import "@testing-library/jest-dom/extend-expect";

const data = { usersCount: 20, profileCount: 17, profiles: [] };

const mockStore = {
  user: {
    auth: "",
  },
};

jest.mock("react-redux", () => ({
  useSelector: jest.fn(),
  useDispatch: jest.fn(),
}));

const useSelectorMock = reactRedux.useSelector;
const useDispatchMock = reactRedux.useDispatch;

afterEach(cleanup);

describe("Dashboard", () => {
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

  it("should fetch dashboard data from API", async () => {
    const fakeResponse = data;
    const mRes = { json: jest.fn().mockResolvedValueOnce(fakeResponse) };
    const mockedFetch = jest.fn().mockResolvedValueOnce(mRes);
    global.fetch = mockedFetch;
    const { findByTestId } = render(<Dashboard />);
    
    const users = await findByTestId("users");
    const profiles = await findByTestId("profiles");

    expect(users).toHaveTextContent(20);
    expect(profiles).toHaveTextContent(17);
    expect(mockedFetch).toBeCalledTimes(1);
    expect(mRes.json).toBeCalledTimes(1);
  });

  it("should fetch dashboard data from API and reject", async () => {
    const fakeResponse = { errors: [{ message: "Server error" }] };
    const mRes = { json: jest.fn().mockResolvedValueOnce(fakeResponse) };
    const mockedFetch = jest.fn().mockResolvedValueOnce(mRes);
    global.fetch = mockedFetch;
    const { findByText } = render(<Dashboard />);
    const message = await findByText("Something went wrong");
    expect(message).toBeInTheDocument();
  });
});
