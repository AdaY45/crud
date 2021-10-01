import styles from "./Edit.module.scss";

const Edit = (props) => {
  return <div className={styles.background}>{props.children}</div>;
};

export default Edit;
