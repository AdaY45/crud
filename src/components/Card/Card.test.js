import React from "react";
import { render, cleanup, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Card from "./Card";
import * as reactRedux from "react-redux";
import "@testing-library/jest-dom/extend-expect";

const profile = {
  _id: "615c34b19215cb7c1a02f7f0",
  name: "Bret",
  gender: "female",
  birthdate: "2021 09 09",
  city: "Rivne",
  owner: "615c33299215cb7c1a02f0d4",
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
      {
        _id: "615c34b19215cb7c1a02f7f0",
        name: "Bret",
        gender: "female",
        birthdate: "2021 09 09",
        city: "Rivne",
        owner: "615c33299215cb7c1a02f0d4",
      },
    ],
  },
  ui: {
    isAdmin: true,
  },
};

const useSelectorMock = reactRedux.useSelector;
const useDispatchMock = reactRedux.useDispatch;

afterEach(cleanup);

describe("Card component", () => {
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

  it("should delete card", async () => {
    const useDispatchSpy = jest.spyOn(reactRedux, "useDispatch");
    useDispatchSpy.mockReturnValue(useDispatchMock);
    jest.spyOn(global, "fetch").mockImplementation((url) => {
      switch (url) {
        case "http://localhost:5000/api/profiles/delete":
          return Promise.resolve({});
        case "http://localhost:5000/api/profiles/615c33299215cb7c1a02f0d4":
          return Promise.resolve([profile]);
        default:
          break;
      }
    });
    const { getByTestId } = render(
      <Card input={[profile.name, profile.gender]} />
    );

    userEvent.click(getByTestId("delete"));

    expect(window.confirm).toBeCalled();
  });

  it("should edit profile", () => {
    const useDispatchSpy = jest.spyOn(reactRedux, "useDispatch");
    useDispatchSpy.mockReturnValue(useDispatchMock);
    const { getByTestId } = render(
      <Card input={[profile.name, profile.gender]} />
    );

    userEvent.click(getByTestId("edit"));
    
    expect(useDispatchMock).toHaveBeenCalledWith({
      payload: false,
      type: "ui/addNewProfilePress",
    });
    expect(useDispatchMock).toHaveBeenCalledWith({
      payload: "profile",
      type: "ui/modalOpen",
    });
  });
});
