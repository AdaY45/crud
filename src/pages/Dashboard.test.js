import React from "react";
import axios from "axios";
import { render, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Dashboard from "./Dashboard";
import * as reactRedux from "react-redux";

jest.mock("axios");
const data = { usersCount: 20, profileCount: 17, profilesOver18: 6 };

jest.mock("react-redux", () => ({
    useSelector: jest.fn(),
    useDispatch: jest.fn(),
  }));
  
  const mockStore = {
    user: {
      auth: "",
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

describe("Dashboard", () => {
    it("fetches dashboard data from API", async () => {
        axios.get.mockImplementation(() => Promise.resolve({ data: data}));
        const { findByTestId } = render(<Dashboard />);
        const users = await findByTestId('users');
        expect(users).toBe(17);

        const profiles = await findByTestId('profiles');
        expect(profiles).toBe(20);

        const profilesOver18 = await findByTestId('profilesOver18');
        expect(profilesOver18).toBe(38);
    });

    it("fetches dashboard data from API and reject", async() => {
        axios.get.mockImplementation(() => Promise.reject([{message: "Server error"}]));
        const {findByTestId} = render(<Dashboard />);
        const message = await findByTestId(/Something went wrong/);
        expect(message).toBeInTheDocument();
    })
})