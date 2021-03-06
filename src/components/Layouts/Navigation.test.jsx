import { cleanup, render } from "@testing-library/react";
import Navigation from "./Navigation";
import { Router, useLocation } from "react-router";
import { createMemoryHistory } from "history";
import { fireEvent } from "@testing-library/dom";
import * as reactRedux from "react-redux";

const LocationDisplay = () => {
  const location = useLocation();
  return <div data-testid="location-display">{location.pathname}</div>;
};

const useSelectorMock = reactRedux.useSelector;
const useDispatchMock = reactRedux.useDispatch;

const mockStore = {
  ui: {
    isAdmin: true
  }
};

jest.mock("react-redux", () => ({
  useSelector: jest.fn(),
  useDispatch: jest.fn(),
}));

afterEach(cleanup);

describe("Navigation component", () => {
  const history = createMemoryHistory();

  beforeEach(() => {
    useDispatchMock.mockImplementation(() => () => {});
    useSelectorMock.mockImplementation((selector) => selector(mockStore));
  });

  afterEach(() => {
    useDispatchMock.mockClear();
    useSelectorMock.mockClear();
  });

  it("should render profiles page", () => {
    const { getByTestId } = render(
      <Router history={history}>
        <Navigation />
        <LocationDisplay />
      </Router>
    );
    const nav = getByTestId("nav");
    const profileLink = getByTestId("toProfiles");
    const dashboardLink = getByTestId("toDashboard");
    const usersLink = getByTestId("toUsers");

    expect(nav).toContainElement(profileLink);
    expect(nav).toContainElement(dashboardLink);
    expect(nav).toContainElement(usersLink);
  })

  it("should navigate to pages", () => {
    const { getByTestId } = render(
      <Router history={history}>
        <Navigation />
        <LocationDisplay />
      </Router>
    );
    fireEvent.click(getByTestId("toProfiles"));
    expect(history.location.pathname).toBe("/profiles");

    fireEvent.click(getByTestId("toDashboard"));
    expect(history.location.pathname).toBe("/dashboard");

    fireEvent.click(getByTestId("toUsers"));
    expect(history.location.pathname).toBe("/users");
  });

  it("should logout", () => {
    const useDispatchSpy = jest.spyOn(reactRedux, "useDispatch");
    useDispatchSpy.mockReturnValue(useDispatchMock);

    const { getByTestId } = render(
      <Router history={history}>
        <Navigation />
        <LocationDisplay />
      </Router>
    );

    fireEvent.click(getByTestId("logout"));

    expect(useDispatchMock).toHaveBeenCalledWith({
      payload: false,
      type: "ui/authHandler",
    });
    expect(history.location.pathname).toBe("/login");
  });
});
