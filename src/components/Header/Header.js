import {useSelector} from "react-redux";
import styles from "./Header.module.scss";
import avatar from "../../imgs/avatar.svg";
import Navigation from "../Layouts/Navigation";

const Header = (props) => {
    const username = useSelector(state => state.user.username);
    return <header className={styles.header}>
        <div className={styles.info}>
            <div className={styles.img}><img src={avatar} alt="Avatar" /></div>
            <div className={styles.name}>{username}</div>
        </div>

        <Navigation/>
    </header>
};

export default Header;