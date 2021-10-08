import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Auth from "./components/Auth/Auth";
import { usersActions } from "./store/users-slice";
import styles from "./App.module.scss";

function AppMain(props) {
  const isAuth = useSelector((state) => state.ui.isAuth);
  const dispatch = useDispatch();
  dispatch(usersActions.addUsers(props.users));
  
  return (
    <div className={styles.container}>
      <main>
        <Auth
          head="Sign in"
          isSignUp={false}
          users={props.users}
          btn="Sign up"
        />
      </main>
    </div>
  );
}

export default AppMain;
