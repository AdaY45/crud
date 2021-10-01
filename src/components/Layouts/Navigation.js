import { useSelector } from 'react-redux';
import styles from "./Navigation.module.scss";
import profiles from "../../imgs/profiles.svg";
import dashboard from "../../imgs/dashboard.svg";
import users from "../../imgs/users.svg";
import { NavLink } from 'react-router-dom';
import { Fragment } from "react";

const Navigation = () => {
  const isAdmin = useSelector(state => state.ui.isAdmin);

  return (
    <nav className={styles.nav}>
      <div className={styles["main-nav"]}>
        <a href="/#" className={styles["header-btn"]}>
          <div>Profiles</div>
          <img src={profiles} alt="Profiles" />
        </a>
        {isAdmin && (
          <Fragment>
            <a href="/#" className={styles["header-btn"]}>
              <div>Dashboard</div>
              <img src={dashboard} alt="Dashboard" />
            </a>
            <a href="/#" className={styles["header-btn"]}>
              <div>Users</div>
              <img src={users} alt="Users" />
            </a>
          </Fragment>
        )}
      </div>

      <NavLink to="/" className={styles["header-btn"]}>Log out</NavLink>
    </nav>
  );
};

export default Navigation;
