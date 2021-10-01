import { Fragment } from "react";
import styles from "./Checkbox.module.scss";

const Checkbox = (props) => {
  return (
      <div className={styles["form-control"]}>
        <label htmlFor={props.input}>{props.label}</label>
        <div className={styles.options}>
          {props.input.map((el) => (
            <Fragment key={el}>
              <input type="radio" name={props.label} value={props.label} className={styles.radio}/>
              <label htmlFor={el} className={styles.gender}>
                {el}
              </label>
            </Fragment>
          ))}
        </div>
      </div>
  );
};

export default Checkbox;
