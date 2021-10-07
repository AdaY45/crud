import { cleanup, render, screen } from "@testing-library/react";
import Navigation from "./Navigation";
import { Provider } from "react-redux";
import configureMockStrore from "redux-mock-store";
import { Router, useLocation } from "react-router";
import userEvent from "@testing-library/user-event";
import { createMemoryHistory } from "history";
import configureStore from "redux-mock-store";
import renderer from "react-test-renderer";

// const middlewares = [];
// const mockStore = configureStore(middlewares);

const LocationDisplay = () => {
  const location = useLocation();
  return <div data-testid="location-display">{location.pathname}</div>;
};

afterEach(cleanup);

describe("Navigation component", () => {
  //   let store;

  //   beforeEach(() => {
  //     store = mockStore({
  //       isAuth: true,
  //     });
  //   });

  const history = createMemoryHistory();

  test("switching between links", () => {
    const store = configureMockStrore()({
      ui: {
        isAuth: true,
      },
    });

    const { getByTestId } = renderer.create(
      <Provider store={store}>
        <Router history={history}>
          <Navigation />
          <LocationDisplay />
        </Router>
      </Provider>
    );

    const path = getByTestId("location-display");

    const toProfiles = getByTestId("toProfiles");
    userEvent.click(toProfiles);
    expect(path.textContent).toBe("/profiles");

    const toDashboard = getByTestId("toDashboard");
    userEvent.click(toDashboard);
    expect(path.textContent).toBe("/dashboard");

    const toUsers = getByTestId("toUsers");
    userEvent.click(toUsers);
    expect(path.textContent).toBe("/users");
  });
});
