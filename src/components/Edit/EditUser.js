import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import reactDom from "react-dom";
import Edit from "./Edit";
import Input from "../UI/Input/Input";
import useInput from "../../hooks/use-input";
import Checkbox from "../UI/Checkbox/Checkbox";
import Button from "../UI/Button/Button";
import { uiActions } from "../../store/ui-slice";
import check from "../../imgs/check.svg";
import close from "../../imgs/close.svg";
import useHttp from "../../hooks/use-http";
import styles from "./EditUser.module.scss";

const EditUser = (props) => {
  const dispatch = useDispatch();
  const [isChecked, setIsChecked] = useState(false);
  const {isLoading,error,sendRequest} = useHttp();
  const auth = useSelector((state) => state.user.auth);
  const user = useSelector((state) => state.user.user);
  const closeHandler = () => {
    dispatch(uiActions.modalClose("user"));
  };

  const {
    value: username,
    isValid: usernameIsValid,
    hasErrors: usernameHasErrors,
    valueChangeHandler: usernameChangeHandler,
    inputBlurHandler: usernameBlurHandler,
  } = useInput((value) => value.trim() !== "");

  const {
    value: email,
    isValid: emailIsValid,
    hasErrors: emailHasErrors,
    valueChangeHandler: emailChangeHandler,
    inputBlurHandler: emailBlurHandler,
  } = useInput((value) => /\S+@\S+\.\S+/.test(value));

  const adminHandler = () => {
    setIsChecked(true);
  };

  const submitHandler = async (event) => {
    event.preventDefault();

    if (!usernameIsValid && !emailIsValid) {
      return;
    }
    const body = {
      _id: user._id,
      username: username,
      email: email,
    };

    const response = await sendRequest({
      url: `http://localhost:5000/api/profiles/edit`,
      method: "PATCH",
      headers: {
        authorization: `Bearer ${auth}`,
        "Content-Type": "application/json",
      },
      body: body,
    });
  };

  const emailInputStyles = emailHasErrors ? "invalid" : "";

  const usernameInputStyles = usernameHasErrors ? "invalid" : "";

  return reactDom.createPortal(
    <Edit>
      <form className={styles.form} onSubmit={submitHandler}>
        <Input
          label="user name"
          input={{
            id: "user-name",
            type: "text",
            defaultValue: user.username,
          }}
          onChange={usernameChangeHandler}
          onBlur={usernameBlurHandler}
          className={styles.input}
        />
        <Input
          label="email"
          input={{
            id: "email",
            type: "text",
            defaultValue: user.email,
          }}
          onChange={emailChangeHandler}
          onBlur={emailBlurHandler}
          className={styles.input}
        />
        <div className={styles["form-control"]}>
          <input
            onChange={adminHandler}
            type="checkbox"
            className={styles.checkbox}
            defaultChecked={user.type === 'admin'}
          />
          <label htmlFor="admin">is admin</label>
        </div>
        <div className={styles["submit-btn"]}>
          <Button>
            <img src={check} alt="Check" />
          </Button>
          <Button onClick={closeHandler}>
            <img src={close} alt="Close" />
          </Button>
        </div>
      </form>
    </Edit>,
    document.getElementById("modal")
  );
};

export default EditUser;
