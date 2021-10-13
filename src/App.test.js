import React from "react";
import { Router } from "react-router-dom";
import { render, cleanup, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "./App";
import ReactRouter from "react-router";
import { createMemoryHistory } from "history";
import * as reactRedux from "react-redux";
import "@testing-library/jest-dom/extend-expect";

const token = {
  token:
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYxN…M4OX0.ntOZxDOnfh35bxPhPC7MMG9fzTwVvhzN605A6pyr_Bw",
  userId: "615af575fa576c5c6ce74fa8",
  username: "admin",
  type: "admin",
  createdAt: new Date(2021, 10, 12),
};

jest.mock("react-redux", () => ({
  useSelector: jest.fn(),
  useDispatch: jest.fn(),
}));

const mockStore = {
  user: {
    username: "admin",
  },
  ui: {
    isAuth: true,
  },
};

const localStorageMock = (function () {
  let store = {};

  return {
    getItem(key) {
      return store[key];
    },

    setItem(key, value) {
      store[key] = value;
    },

    clear() {
      store = {};
    },

    removeItem(key) {
      delete store[key];
    },

    getAll() {
      console.log(store);
    },
  };
})();

Object.defineProperty(window, "localStorage", { value: localStorageMock });

const useSelectorMock = reactRedux.useSelector;
const useDispatchMock = reactRedux.useDispatch;
afterEach(cleanup);

describe("App", () => {
  let originFetch;
  const history = createMemoryHistory();

  beforeEach(() => {
    originFetch = global.fetch;
    useDispatchMock.mockImplementation(() => () => {});
    useSelectorMock.mockImplementation((selector) => selector(mockStore));
  });
  afterEach(() => {
    global.fetch = originFetch;
    useDispatchMock.mockClear();
    useSelectorMock.mockClear();
    window.localStorage.clear();
  });

  it("should set localStorage", async () => {
    const fakeResponse = token;
    const mRes = { json: jest.fn().mockResolvedValueOnce(fakeResponse) };
    const mockedFetch = jest.fn().mockResolvedValueOnce(mRes);
    global.fetch = mockedFetch;
    const useDispatchSpy = jest.spyOn(reactRedux, "useDispatch");
    window.localStorage.setItem("userData", JSON.stringify(token));

    useDispatchSpy.mockReturnValue(useDispatchMock);

    expect(localStorage.getItem("userData")).toEqual(JSON.stringify(token));

    render(
      <Router history={history}>
        <App />
      </Router>
    );

    await waitFor(() => {
      expect(useDispatchMock).toHaveBeenCalledWith({
        payload: token.token,
        type: "user/addAuth",
      });
    });
  });
});
