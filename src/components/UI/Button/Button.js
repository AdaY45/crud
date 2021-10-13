import styles from "./Button.module.scss";

const Button = (props) => {
    return <button type="submit" data-testid={props["data-testid"] ? props["data-testid"] : ""} className={styles.button} onClick={props.onClick}>{props.children}</button>
};

export default Button;