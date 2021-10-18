import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Edit from "./Edit";
import Input from "../UI/Input/Input";
import useInput from "../../hooks/use-input";
import Button from "../UI/Button/Button";
import { uiActions } from "../../store/ui-slice";
import check from "../../imgs/check.svg";
import close from "../../imgs/close.svg";
import useHttp from "../../hooks/use-http";
import { useHistory } from "react-router";
import { userActions } from "../../store/user-slice";
import { usersActions } from "../../store/users-slice";
import styles from "./EditUser.module.scss";

const EditUser = () => {
  const dispatch = useDispatch();
  const [isChecked, setIsChecked] = useState(false);
  const { isLoading, error, sendRequest } = useHttp();
  const history = useHistory();
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
  } = useInput((value) => value.trim() !== "");

  const {
    value: email,
    valueChangeHandler: emailChangeHandler,
  } = useInput((value) => /\S+@\S+\.\S+/.test(value));

  const adminHandler = () => {
    setIsChecked(true);
  };

  const submitHandler = async (event) => {
    event.preventDefault();

    if(!usernameIsValid) {
      return;
    }

    const body = {
      _id: user._id,
      username: username !== "" ? username : user.username,
      email: email !== "" ? email : user.email,
      type: isChecked ? "admin" : "user",
    };

    const response = await sendRequest({
      url: `http://localhost:5000/api/users/edit`,
      method: "PATCH",
      headers: {
        authorization: `Bearer ${auth}`,
        "Content-Type": "application/json",
      },
      body: body,
    });

    dispatch(userActions.addUser(body));
    dispatch(usersActions.addUser(response));
    dispatch(uiActions.modalClose("user"));
    history.push(`/profile/${user._id}`);
  };

  return (
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
          data-testid="username"
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
          data-testid="email"
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
          <Button data-testid="submit">
            <img src={check} alt="Check" />
          </Button>
          <Button data-testid="close" onClick={closeHandler}>
            <img src={close} alt="Close" />
          </Button>
        </div>
      </form>
    </Edit>
  );
};

export default EditUser;
