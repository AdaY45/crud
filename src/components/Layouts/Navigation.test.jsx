import { cleanup, render } from "@testing-library/react";
import Navigation from "./Navigation";
import { Router, useLocation } from "react-router";
import { createMemoryHistory } from "history";
import { fireEvent } from "@testing-library/dom";
import * as reactRedux from "react-redux";

jest.mock("react-redux", () => ({
  useSelector: jest.fn(),
  useDispatch: jest.fn(),
}));

const LocationDisplay = () => {
  const location = useLocation();
  return <div data-testid="location-display">{location.pathname}</div>;
};

describe("Navigation component", () => {

  beforeEach(() => {
    useDispatchMock.mockImplementation(() => () => {});
    useSelectorMock.mockImplementation((selector) => selector(mockStore));
  });

  afterEach(() => {
    useDispatchMock.mockClear();
    useSelectorMock.mockClear();
  });

  const useSelectorMock = reactRedux.useSelector;
  const useDispatchMock = reactRedux.useDispatch;

  const mockStore = {
    ui: {
      isAdmin: true
    }
  };

  const history = createMemoryHistory();

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
});
