import { useState } from "react";
import { useSelector } from "react-redux";
import { useHistory } from "react-router";
import Input from "../UI/Input/Input";
import Button from "../UI/Button/Button";
import { Fragment } from "react";
import useInput from "../../hooks/use-input";
import useHttp from "../../hooks/use-http";
import { NavLink } from "react-router-dom";
import styles from "./SignUp.module.scss";

const SignUp = () => {
  const history = useHistory();
  const [isChecked, setIsChecked] = useState(false);
  const auth = useSelector((state) => state.user.auth);
  const { isLoading, error, sendRequest: sendRequest } = useHttp();
  const [emailExists, setEmailExists] = useState(false);
  const [userExists, setUserExists] = useState(false);
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

  const {
    value: password,
    isValid: passwordIsValid,
    hasErrors: passwordHasErrors,
    valueChangeHandler: passwordChangeHandler,
    inputBlurHandler: passwordBlurHandler,
  } = useInput((value) =>
    /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{7,15}$/.test(value)
  );

  const adminHandler = () => {
    setIsChecked(true);
  };

  const onSubmit = async (event) => {
    event.preventDefault();

    if (!emailIsValid && !passwordIsValid && !usernameIsValid) {
      return;
    }

    const response = await sendRequest({
      url: "http://localhost:5000/api/auth/register",
      method: "POST",
      headers: {
        authorization: `Bearer ${auth}`,
        "Content-Type": "application/json",
      },
      body: {
        username: username,
        type: isChecked ? "admin" : "user",
        email: email,
        password: password,
      },
    });

    if (response.errors) {
      setUserExists(true);
    } else {
      localStorage.setItem(
        "userData",
        JSON.stringify({
          userId: response.user._id,
          username: response.user.username,
          type: response.user.type,
        })
      );

      history.push(`/login`);
    }
  };

  const emailInputStyles = emailHasErrors ? "invalid" : "";

  const passwordInputStyles = passwordHasErrors ? "invalid" : "";

  const usernameInputStyles = usernameHasErrors ? "invalid" : "";

  return (
    <Fragment>
      <h2 className={styles.head}>Create your account</h2>
      {userExists && <p className="error">User already exists</p>}
      <form className={styles.form} onSubmit={onSubmit}>
        {emailExists && (
          <div className="error">User with such email already exists.</div>
        )}
        {usernameHasErrors && (
          <p className="error">Username should not be empty</p>
        )}
        <Input
          label="Username"
          input={{ id: "username", type: "text" }}
          className={usernameInputStyles}
          onChange={usernameChangeHandler}
          onBlur={usernameBlurHandler}
          data-testid="username"
        />
        {emailHasErrors && <p className="error">Email is not valid</p>}
        <Input
          label="Email"
          input={{ id: "email", type: "text" }}
          className={emailInputStyles}
          onChange={emailChangeHandler}
          onBlur={emailBlurHandler}
          data-testid="email"
        />
        {passwordHasErrors && (
          <p className="error">
            Password should be between 7 to 15 characters and contain at least
            one numeric digit and a special character.
          </p>
        )}
        <Input
          label="Password"
          input={{ id: "password", type: "password" }}
          className={passwordInputStyles}
          onChange={passwordChangeHandler}
          onBlur={passwordBlurHandler}
          data-testid="password"
        />

        <div className={styles["form-control"]}>
          <input
            onChange={adminHandler}
            type="checkbox"
            className={styles.checkbox}
            data-testid="checkbox"
          />
          <label htmlFor="admin">is admin</label>
        </div>

        <Button data-testid="signup">Sign up</Button>

        <div className={styles.switch}>
          <p className={styles.text}>Already have an account?</p>
          <NavLink to="/" className="switch-btn">
            Sign in
          </NavLink>
        </div>
      </form>
    </Fragment>
  );
};

export default SignUp;
