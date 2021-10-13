import React from "react";
import { render, cleanup, waitFor, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Users from "./Users";
import * as reactRedux from "react-redux";
import "@testing-library/jest-dom/extend-expect";
import store from "../store";
import { usersActions } from "../store/users-slice";
import { Router, useLocation } from "react-router";
import { createMemoryHistory } from "history";
import { fireEvent } from "@testing-library/dom";

const data = {
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
  profiles: [
    {
      _id: "615af658fa576c5c6ce74fb4",
      name: "AdrianaY",
      gender: "female",
      birthdate: 1628726400000,
      city: "Rivne",
      owner: "615af575fa576c5c6ce74fa8",
    },
    {
      _id: "615afcedfa576c5c6ce74fdc",
      name: "Pypok Volodymyr",
      gender: "male",
      birthdate: 1607472000000,
      city: "Kyiv",
      owner: "615af575fa576c5c6ce74fa8",
    },
  ],
};

const mockStore = {
  user: {
    auth: "",
  },
  users: {
    users: [],
  },
  profiles: [],
};

const LocationDisplay = () => {
  const location = useLocation();
  return <div data-testid="location-display">{location.pathname}</div>;
};

jest.mock("react-redux", () => ({
  useSelector: jest.fn(),
  useDispatch: jest.fn(),
}));

const useSelectorMock = reactRedux.useSelector;
const useDispatchMock = reactRedux.useDispatch;

afterEach(cleanup);

describe("Users", () => {
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

  it("should fetch users from API and switching link", async () => {
    const history = createMemoryHistory();
    jest.spyOn(global, "fetch").mockImplementation((url) => {
      switch (url) {
        case "http://localhost:5000/api/users/":
          return Promise.resolve(data.users);
        case "http://localhost:5000/api/profiles/":
          return Promise.resolve(data.profiles);
        default:
          break;
      }
    });

    const { queryByTestId } = render(
      <Router history={history}>
        <Users />
        <LocationDisplay />
      </Router>
    );
    
    await waitFor(() => {
      expect(queryByTestId("loading")).not.toBeInTheDocument();
    });
  });
});
