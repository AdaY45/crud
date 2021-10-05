import {useSelector} from 'react-redux';
import EditUser from "../Edit/EditUser";
import EditProfile from "../Edit/EditProfile";
import Header from "../Header/Header";

import styles from "./MainLayout.module.scss";

const Layout = (props) => {
    const isEditProfileOpen = useSelector(state => state.ui.isEditProfileOpen);
    const isEditUserOpen = useSelector(state => state.ui.isEditUserOpen);
    const isAuth = useSelector((state) => state.ui.isAuth);
    const isAddNewProfile = useSelector(state => state.ui.isAddNewProfile);
    return (
        <div className={styles.container}>
          {isEditProfileOpen && <EditProfile />}
          {isEditUserOpen && <EditUser />}
          {isAuth && <Header />}
          <main className={props.auth ? styles.auth : styles.main}>{props.children}</main>
        </div>
      );
};

export default Layout;