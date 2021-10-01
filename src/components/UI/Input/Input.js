import styles from "./Input.module.scss";

const Input = (props) => {
    return (
        <div className={styles["form-control"]}>
          <label htmlFor={props.input.id}>{props.label}</label>
          <input {...props.input}  onChange={props.onChange} onBlur={props.onBlur} className={props.className ? styles[props.className] : ''}/>
        </div>
    );
};

export default Input;