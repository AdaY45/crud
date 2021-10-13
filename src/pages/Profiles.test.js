import React from "react";
import { render, cleanup, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Profiles from "./Profiles";
import ReactRouter from "react-router";
import * as reactRedux from "react-redux";
import "@testing-library/jest-dom/extend-expect";

const profiles = [
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
];

const mockStore = {
  user: {
    auth: "",
    userId: "",
    profiles: [],
  },
  ui: {
    isAdmin: false,
    isAddNewProfile: false,
    isEditProfileOpen: false,
  },
};

jest.mock("react-redux", () => ({
  useSelector: jest.fn(),
  useDispatch: jest.fn(),
}));

afterEach(cleanup);

const useSelectorMock = reactRedux.useSelector;
const useDispatchMock = reactRedux.useDispatch;

describe("Profiles", () => {
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

  it("should fetch profiles data from API with id and create profile button", async () => {
    jest
      .spyOn(ReactRouter, "useParams")
      .mockReturnValue({ id: "615af575fa576c5c6ce74fa8" });
    const fakeResponse = profiles;
    const mRes = { json: jest.fn().mockResolvedValueOnce(fakeResponse) };
    const mockedFetch = jest.fn().mockResolvedValueOnce(mRes);
    global.fetch = mockedFetch;
    const useDispatchSpy = jest.spyOn(reactRedux, "useDispatch");
    useDispatchSpy.mockReturnValue(useDispatchMock);

    const { queryByText, getByTestId } = render(<Profiles />);

    await waitFor(() => {
      expect(queryByText("Something went wrong")).not.toBeInTheDocument();

      userEvent.click(getByTestId("create-profile"));

      expect(useDispatchMock).toHaveBeenCalledWith({
        payload: true,
        type: "ui/addNewProfilePress",
      });
      expect(useDispatchMock).toHaveBeenCalledWith({
        payload: "profile",
        type: "ui/modalOpen",
      });
    });
    useDispatchSpy.mockClear();
  });

  it("should fetch profiles from API and reject", async () => {
    jest
      .spyOn(ReactRouter, "useParams")
      .mockReturnValue({ id: "615af575fa576c5c6ce74fa8" });
    const fakeResponse = { errors: { message: "Server error" } };
    const mRes = { json: jest.fn().mockResolvedValueOnce(fakeResponse) };
    const mockedFetch = jest.fn().mockResolvedValueOnce(mRes);
    global.fetch = mockedFetch;

    const { findByText } = render(<Profiles />);
    const message = await findByText("Something went wrong");
    
    expect(message).toBeInTheDocument();
  });
});
