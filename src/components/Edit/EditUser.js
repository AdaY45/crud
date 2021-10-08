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
import { useParams } from "react-router";
import { useHistory } from "react-router";
import { userActions } from "../../store/user-slice";
import { usersActions } from "../../store/users-slice";
import styles from "./EditUser.module.scss";

const EditUser = (props) => {
  const dispatch = useDispatch();
  const [isChecked, setIsChecked] = useState(false);
  const { isLoading, error, sendRequest } = useHttp();
  const history = useHistory()
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

    console.log(email, username);
    console.log(usernameIsValid, emailIsValid);

    const body = {
      _id: user._id,
      username: username !== '' ? username : user.username,
      email: email !== '' ? email : user.email,
      type: isChecked ? "admin" : "user",
    };

    console.log(body);

    const response = await sendRequest({
      url: `http://localhost:5000/api/users/edit`,
      method: "PATCH",
      headers: {
        authorization: `Bearer ${auth}`,
        "Content-Type": "application/json",
      },
      body: body,
    });

    console.log(body);

    dispatch(userActions.addUser(response));
    dispatch(usersActions.addUser(response));
    dispatch(uiActions.modalClose("user"));
    history.push(`/profile/${user._id}`)
  };

  const emailInputStyles = emailHasErrors ? "invalid" : "";

  const usernameInputStyles = usernameHasErrors ? "invalid" : "";

  return reactDom.createPortal(
    <Edit>
      <form className={styles.form} onSubmit={submitHandler}>
        {usernameHasErrors && (
          <div className="error">This field should not be empty</div>
        )}
        <Input
          label="user name"
          input={{
            id: "user-name",
            type: "text",
            defaultValue: user.username,
          }}
          onChange={usernameChangeHandler}
          className={styles.input}
        />
        {usernameHasErrors && (
          <div className="error">This field should not be empty</div>
        )}
        <Input
          label="email"
          input={{
            id: "email",
            type: "text",
            defaultValue: user.email,
          }}
          onChange={emailChangeHandler}
          className={styles.input}
        />
        <div className={styles["form-control"]}>
          <input
            onChange={adminHandler}
            type="checkbox"
            className={styles.checkbox}
            defaultChecked={user.type === "admin"}
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
