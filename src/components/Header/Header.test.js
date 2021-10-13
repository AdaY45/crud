import React from "react";
import { render, cleanup, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Header from "./Header";
import * as reactRedux from "react-redux";
import "@testing-library/jest-dom/extend-expect";
import { createMemoryHistory } from "history";
import { Router } from "react-router-dom";

const mockStore = {
  user: {
    auth: "",
    userId: "",
    profiles: [],
    username: "admin",
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

beforeEach(() => {
  useDispatchMock.mockImplementation(() => () => {});
  useSelectorMock.mockImplementation((selector) => selector(mockStore));
});

afterEach(() => {
  useDispatchMock.mockClear();
  useSelectorMock.mockClear();
});

afterEach(cleanup);

describe("Header component", () => {
  it("should show header", () => {
    const history = createMemoryHistory();
    const { getByText } = render(
      <Router history={history}>
        <Header />
      </Router>
    );
    expect(getByText("admin")).toBeInTheDocument();
  });
});
