import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router";
import styles from "./Navigation.module.scss";
import profiles from "../../imgs/profiles.svg";
import dashboard from "../../imgs/dashboard.svg";
import users from "../../imgs/users.svg";
import { NavLink } from "react-router-dom";
import { uiActions } from "../../store/ui-slice";
import { Fragment } from "react";

const Navigation = () => {
  const isAdmin = useSelector((state) => state.ui.isAdmin);
  const dispatch = useDispatch();
  const history = useHistory();

  const logoutHandler = () => {
    dispatch(uiActions.authHandler(false));
    localStorage.removeItem("userData");
    history.push("/login");
  };

  return (
    <nav className={styles.nav}>
      <div className={styles["main-nav"]}>
        {isAdmin && (
          <Fragment>
            <NavLink to="/profiles" className={styles["header-btn"]}>
              <div>Profiles</div>
              <div><img src={profiles} alt="Profiles" /></div>
            </NavLink>
            <NavLink to="/dashboard" className={styles["header-btn"]}>
              <div>Dashboard</div>
              <div><img src={dashboard} alt="Dashboard" /></div>
            </NavLink>
            <NavLink to="/users" className={styles["header-btn"]}>
              <div>Users</div>
              <div><img src={users} alt="Users" /></div>
            </NavLink>
          </Fragment>
        )}
      </div>

      <button onClick={logoutHandler} className={styles["logout-btn"]}>
        Log out
      </button>
    </nav>
  );
};

export default Navigation;
