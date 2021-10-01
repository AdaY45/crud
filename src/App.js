import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Auth from "./components/Auth/Auth";
import Profiles from "./components/Profiles";
import Users from "./components/Users";
import Header from "./components/Header/Header";
import Dashboard from "./components/Dashboard";
import { Redirect } from "react-router";
import { Route } from "react-router";
import { usersActions } from "./store/users-slice";
import { uiActions } from "./store/ui-slice";
import MainLayout from "./components/Layouts/MainLayout";
import styles from "./App.module.scss";
import { Switch } from "react-router";

function App(props) {
  const isAuth = useSelector((state) => state.ui.isAuth);

  if (isAuth) {
    return (
      <MainLayout>
        <Switch>
          <Route path={"/login"}>
            <Auth
              head="Sign in"
              isSignUp={false}
              users={props.users}
              btn="Sign up"
            />
          </Route>
          <Route path={"/signup"}>
            <Auth head="Sign up" isSignUp={true} btn="Sign up" />
          </Route>
          <Route path={"/profiles/:id?"}>
            <Profiles />
          </Route>
          <Route path={"/dashboard"}>
            <Dashboard />
          </Route>
          <Route path={"/users"}>
            <Users />
          </Route>
        </Switch>
      </MainLayout>
    );
  } else {
    return (
      <MainLayout>
        <Switch>
          <Route path={"/login"} exact>
            <Auth
              head="Sign in"
              isSignUp={false}
              users={props.users}
              btn="Sign up"
              exact
            />
          </Route>
          <Route path={"/register"} exact>
            <Auth head="Sign up" isSignUp={true} btn="Sign up" />
          </Route>
          <Redirect to={`/login`} />
        </Switch>
      </MainLayout>
    );
  }
}

export default App;
