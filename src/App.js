import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Auth from "./components/Auth/Auth";
import Profiles from "./components/Profiles";
import Users from "./components/Users";
import Profile from "./components/Profile/Profile";
import Header from "./components/Header/Header";
import Dashboard from "./components/Dashboard";
import { Redirect } from "react-router";
import { Route } from "react-router";
import { userActions } from "./store/user-slice";
import { uiActions } from "./store/ui-slice";
import MainLayout from "./components/Layouts/MainLayout";
import styles from "./App.module.scss";
import { Switch } from "react-router";
import useHttp from "./hooks/use-http";

function App(props) {
  const isAuth = useSelector((state) => state.ui.isAuth);
  const [isReady, setIsReady] = useState(false);
  const dispatch = useDispatch();
  const { isLoading, error, sendRequest } = useHttp();

  // useEffect(() => {
  //   const getToken = async () => {
  //     setIsReady(false);
  //     try {
  //       const data = JSON.parse(
  //         localStorage.getItem("userData") ||
  //           '{"token":null,"userId":null,"type":null}'
  //       );
  //       console.log(data);
  //       if (data && data.token) {
  //         if (Date.now() - data.createdAt >= 60 * 60 * 24 * 30) {
  //           localStorage.removeItem("userData");
  //         } else {
  //           const dataToken = await sendRequest({
  //             url: "http://localhost:5000/api/auth/newToken",
  //             headers: {
  //               authorization: `Bearer ${data.token}`,
  //               "Content-Type": "application/json",
  //             },
  //           });
  //           const dataToStore = {
  //             token: dataToken.token,
  //             userId: dataToken.userId,
  //             type: dataToken.type,
  //             createdAt: dataToken.createdAt,
  //           };
  //           console.log("dataToken: " + dataToken);

  //           localStorage.setItem("userData", JSON.stringify(dataToStore));
  //           dispatch(uiActions.authHandler(true));
  //           dispatch(userActions.addAuth(dataToken.token));
  //           console.log(dataToken.type);
  //           dispatch(uiActions.adminHandler(dataToken.type === "admin"));
  //           dispatch(userActions.setUserId(dataToken.userId));
  //           setIsReady(true);
  //         }
  //       }
  //     } catch (e) {
  //       console.error(e);

  //       setIsReady(false);
  //     }
  //   };

  //   getToken();
  // }, [sendRequest, dispatch]);

  console.log(isAuth);

  //add Loading so when we upload user than load profiles
  if (isAuth) {
    return (
      <MainLayout>
        {isReady && <p>Loading....</p>}
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
        {isLoading && <p>Loading...</p>}
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
