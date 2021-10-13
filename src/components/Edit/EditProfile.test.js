import React from "react";
import ReactRouter from "react-router";
import { render, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import EditProfile from "./EditProfile";
import * as reactRedux from "react-redux";

const profile = {
  _id: "615c34b19215cb7c1a02f7f0",
  name: "Bret",
  gender: "female",
  birthdate: "2021 09 09",
  city: "Rivne",
  owner: "615c33299215cb7c1a02f0d4",
};

const mockStore = {
  user: {
    selectedUserId: "",
    auth: "",
    profile: profile,
    user: {},
  },
  ui: {
    isAdmin: true,
    isEditProfileOpen: true,
    isAddNewProfile: true,
  },
};

jest.mock("react-redux", () => ({
  useSelector: jest.fn(),
  useDispatch: jest.fn(),
}));

const useSelectorMock = reactRedux.useSelector;
const useDispatchMock = reactRedux.useDispatch;

Object.defineProperty(ReactRouter, "useLocation", {
  value: jest.fn(),
  configurable: true,
  writable: true,
});

beforeEach(() => {
  useDispatchMock.mockImplementation(() => () => {});
  useSelectorMock.mockImplementation((selector) => selector(mockStore));
});

afterEach(() => {
  useDispatchMock.mockClear();
  useSelectorMock.mockClear();
});

describe("EditProfile component", () => {
  jest.spyOn(global, "fetch").mockImplementation((url) => {
    switch (url) {
      case "http://localhost:5000/api/profiles/create":
        return Promise.resolve({});
      case "http://localhost:5000/api/profiles/edit":
        return Promise.resolve({});
      case "http://localhost:5000/api/profiles/615c33299215cb7c1a02f0d4":
        return Promise.resolve([profile]);
      default:
        break;
    }
  });
  it("should add new profile", async () => {
    const useDispatchSpy = jest.spyOn(reactRedux, "useDispatch");
    useDispatchSpy.mockReturnValue(useDispatchMock);
    jest
      .spyOn(ReactRouter, "useParams")
      .mockReturnValue({ id: "615c33299215cb7c1a02f0d4" });
    jest.spyOn(global, "fetch").mockImplementation((url) => {
      switch (url) {
        case "http://localhost:5000/api/profiles/create":
          return Promise.resolve({});
        case "http://localhost:5000/api/profiles/615c33299215cb7c1a02f0d4":
          return Promise.resolve([profile]);
        default:
          break;
      }
    });
    const { getByTestId } = render(<EditProfile />);
    await waitFor(() => {
      const name = getByTestId("name");
      const genderM = getByTestId("gender-male");
      const genderF = getByTestId("gender-female");
      const city = getByTestId("city");
      const birthdate = getByTestId("birthdate");

      userEvent.type(name, profile.name);
      if (profile.gender === "female") {
        userEvent.click(genderF);
      } else if (profile.gender === "male") {
        userEvent.click(genderM);
      }
      userEvent.type(city, profile.city);
      userEvent.type(birthdate, profile.birthdate);
      userEvent.click(getByTestId("submit"));

      expect(useDispatchMock).toHaveBeenCalledWith({
        payload: null,
        type: "user/setSelectedUserId",
      });
    });
  });

  it("should close button closes the window", () => {
    const useDispatchSpy = jest.spyOn(reactRedux, "useDispatch");
    useDispatchSpy.mockReturnValue(useDispatchMock);
    jest
      .spyOn(ReactRouter, "useParams")
      .mockReturnValue({ id: "615c33299215cb7c1a02f0d4" });
    const { getByTestId } = render(<EditProfile />);

    userEvent.click(getByTestId("close"));

    expect(useDispatchMock).toHaveBeenCalledWith({
      payload: "profile",
      type: "ui/modalClose",
    });
  });
});
