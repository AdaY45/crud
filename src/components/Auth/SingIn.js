import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router";
import useHttp from "../../hooks/use-http";
import Input from "../UI/Input/Input";
import Button from "../UI/Button/Button";
import { Fragment } from "react";
import useInput from "../../hooks/use-input";
import { uiActions } from "../../store/ui-slice";
import { userActions } from "../../store/user-slice";
import { NavLink } from "react-router-dom";
import styles from "./SignIn.module.scss";

const SignIn = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const [error, setError] = useState(false);
  const isAdmin = useSelector(state => state.ui.isAdmin);
  const [user, setUser] = useState(null);
  const { isLoading, errorMessage, sendRequest } = useHttp();
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

  const onSubmit = async (event) => {
    event.preventDefault();

    if (!emailIsValid && !passwordIsValid) {
      return;
    }
    const response = await sendRequest({
      url: "http://localhost:5000/api/auth/login",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: {
        email: email,
        password: password,
      },
    });
    console.log(response)

    localStorage.setItem(
      "userData",
      JSON.stringify({ token: response.token, userId: response.user._id, type: response.user.type, createdAt: response.createdAt })
    );

    dispatch(uiActions.authHandler(true));
    dispatch(uiActions.adminHandler(response.user.type === "admin"));
    dispatch(userActions.addUser(response.user));
    dispatch(userActions.addAuth(response.token));

    // router.push(`/${response.user._id}`);
    if(response.user.type === "admin") {
      history.push(`/profiles/`);
    } else {
      history.push(`/profiles/${response.user._id}`);
    }
    
  };

  const emailInputStyles = emailHasErrors ? "invalid" : "";

  const passwordInputStyles = passwordHasErrors ? "invalid" : "";

  return (
    <Fragment>
      <h2 className={styles.head}>Sign in</h2>
      <form className={styles.form} onSubmit={onSubmit}>
        {error && (
          <div className="error">Email or password is not valid</div>
        )}
        {emailHasErrors && <p className="error">Email is not valid</p>}
        <Input
          label="Email"
          input={{ id: "email", type: "text" }}
          className={emailInputStyles}
          onChange={emailChangeHandler}
          onBlur={emailBlurHandler}
        />
        {passwordHasErrors && (
          <p className="error">
            Password should be between 7 to 15 characters and contain at least
            one numeric digit and a special character.
          </p>
        )}
        <Input
          label="Password"
          input={{ id: "username", type: "password" }}
          className={passwordInputStyles}
          onChange={passwordChangeHandler}
          onBlur={passwordBlurHandler}
        />

        <Button>Sign In</Button>

        <div className={styles.switch}>
          <p className={styles.text}>Don&apos;t have an account?</p>
          <NavLink to="/register" className="switch-btn">
            Sign up
          </NavLink>
        </div>
      </form>
    </Fragment>
  );
};

export default SignIn;
