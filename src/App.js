import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Auth from "./components/Auth/Auth";
import Profiles from "./pages/Profiles";
import Users from "./pages/Users";
import Profile from "./components/Profile/Profile";
import Dashboard from "./pages/Dashboard";
import { Redirect } from "react-router";
import { Route } from "react-router";
import { userActions } from "./store/user-slice";
import { uiActions } from "./store/ui-slice";
import MainLayout from "./components/Layouts/MainLayout";
import { Switch } from "react-router";
import useHttp from "./hooks/use-http";

function App(props) {
  const isAuth = useSelector((state) => state.ui.isAuth);
  const [isReady, setIsReady] = useState(false);
  const dispatch = useDispatch();
  const { isLoading, error, sendRequest } = useHttp();

  useEffect(() => {
    const getToken = async () => {
      setIsReady(false);
      try {
        const data = JSON.parse(
          localStorage.getItem("userData") ||
            '{"token":null,"userId":null, "username":null,"type":null}'
        );
        if (data && data.token) {
          if (Date.now() - data.createdAt >= 60 * 60 * 24 * 30) {
            localStorage.removeItem("userData");
          } else {
            const dataToken = await sendRequest({
              url: "http://localhost:5000/api/auth/newToken",
              headers: {
                authorization: `Bearer ${data.token}`,
                "Content-Type": "application/json",
              },
            });
            const dataToStore = {
              token: dataToken.token,
              userId: dataToken.userId,
              username: data.username,
              type: dataToken.type,
              createdAt: dataToken.createdAt,
            };

            localStorage.setItem("userData", JSON.stringify(dataToStore));
            dispatch(uiActions.authHandler(true));
            dispatch(userActions.addAuth(dataToken.token));
            dispatch(uiActions.adminHandler(dataToken.type === "admin"));
            dispatch(userActions.setUserId(dataToken.userId));
            dispatch(userActions.setUsername(data.username));
            setIsReady(true);
          }
        }
      } catch (e) {
        setIsReady(false);
      }
    };

    getToken();
  }, [sendRequest, dispatch]);

  if (isAuth) {
    return (
        <MainLayout>
          <Switch>
            <Route path={"/profiles/:id?"}>
              <Profiles />
            </Route>
            <Route path={"/dashboard"}>
              <Dashboard />
            </Route>
            <Route path={"/users"}>
              <Users />
            </Route>
            <Route path={"/profile/:id"}>
              <Profile />
            </Route>
            {isReady && <Redirect to={`/profiles/:id?`} />}
          </Switch>
        </MainLayout>
    );
  } else {
    return (
      <MainLayout auth={true}>
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
