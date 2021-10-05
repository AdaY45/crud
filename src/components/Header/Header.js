import {useSelector} from "react-redux";
import styles from "./Header.module.scss";
import avatar from "../../imgs/avatar.svg";
import Navigation from "../Layouts/Navigation";

const Header = (props) => {
    const user = useSelector(state => state.user.user);
    return <header className={styles.header}>
        <div className={styles.info}>
            <div className={styles.img}><img src={avatar} alt="Avatar" /></div>
            <div className={styles.name}>{user.username}</div>
        </div>

        <Navigation/>
    </header>
};

export default Header;