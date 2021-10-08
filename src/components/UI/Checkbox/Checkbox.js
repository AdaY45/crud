import { Fragment } from "react";

const Checkbox = (props) => {
  return (
      <div className="form-control">
        <label htmlFor={props.input}>{props.label}</label>
        <div className="options">
          {props.input.map((el) => (
            <Fragment key={el}>
              <input type="radio" name={props.label} value={props.label} className="radio"/>
              <label htmlFor={el} className="gender">
                {el}
              </label>
            </Fragment>
          ))}
        </div>
      </div>
  );
};

export default Checkbox;
