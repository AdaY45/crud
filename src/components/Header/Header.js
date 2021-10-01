import styles from "./Header.module.scss";
import avatar from "../../imgs/avatar.svg";
import Navigation from "../Layouts/Navigation";

const Header = (props) => {
    return <header className={styles.header}>
        <div className={styles.info}>
            <img src={avatar} alt="Avatar" />
            <div className={styles.name}>{props.name}</div>
        </div>

        <Navigation/>
    </header>
};

export default Header;