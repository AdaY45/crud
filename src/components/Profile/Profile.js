import Image from "next/image";
import styles from "./User.module.scss";
import edit from "../../public/imgs/edit.svg";
import garbage from "../../public/imgs/delete.svg";
import Profiles from "../Profiles";

const User = (props) => {
    return <section className={styles.user}>
        <div className={styles["users-info"]}>
            <div className={styles.text}>{props.userName}</div>
            <div className={styles.text}>{props.email}</div>
            <div className={styles.type}>{props.type}</div>
            <div className={styles.change}>
                <img src={edit} alt="Edit" />
                <img src={garbage} alt="Delete" />
            </div>
        </div>

        <Profiles />
    </section>
};

export default User;