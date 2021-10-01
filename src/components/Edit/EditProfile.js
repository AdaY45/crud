import { useDispatch, useSelector } from "react-redux";
import reactDom from "react-dom";
import styles from "./EditProfile.module.scss";
import Input from "../UI/Input/Input";
import check from "../../imgs/check.svg";
import close from "../../imgs/close.svg";
import Button from "../UI/Button/Button";
import Edit from "./Edit";
import useHttp from "../../hooks/use-http";
import Checkbox from "../UI/Checkbox/Checkbox";
import useInput from "../../hooks/use-input";
import { useParams } from "react-router";
import { uiActions } from "../../store/ui-slice";
import { userActions } from "../../store/user-slice";

const EditProfile = (props) => {
  const dispatch = useDispatch();
  const auth = useSelector((state) => state.user.auth);
  const { isLoading, error, sendRequest } = useHttp();
  const { id: userId } = useParams();
  const {
    value: name,
    isValid: nameIsValid,
    hasErrors: nameHasErrors,
    valueChangeHandler: nameChangeHandler,
    inputBlurHandler: nameBlurHandler,
  } = useInput((value) => value.trim() !== "");

  const {
    value: gender,
    isValid: genderIsValid,
    hasErrors: genderHasErrors,
  } = useInput((value) => value.trim() !== "");

  const {
    value: city,
    isValid: cityIsValid,
    hasErrors: cityHasErrors,
    valueChangeHandler: cityChangeHandler,
    inputBlurHandler: cityBlurHandler,
  } = useInput((value) => value.trim() !== "");

  const {
    value: birthdate,
    isValid: birthdateIsValid,
    hasErrors: birthdateHasErrors,
    valueChangeHandler: birthdateChangeHandler,
    inputBlurHandler: birthdateBlurHandler,
  } = useInput((value) => value.trim() !== "");

  const closeHandler = () => {
    dispatch(uiActions.modalClose("profile"));
  };

  const submitHandler = async (event) => {
    event.preventDefault();

    if (!nameIsValid && !genderIsValid && !cityIsValid && !birthdateIsValid) {
      return;
    }

    const response = await sendRequest({
      url: `http://localhost:5000/api/profiles/create`,
      method: "POST",
      headers: {
        authorization: `Bearer ${auth}`,
        "Content-Type": "application/json",
      },
      body: {
        name,
        gender,
        birthdate,
        city,
      },
    });

    console.log(response);

    //dispatch(userActions.addProfiles(response));
    dispatch(uiActions.modalClose('profile'));
  };

  const nameInputStyles = nameHasErrors ? "invalid" : "";

  const genderInputStyles = genderHasErrors ? "invalid" : "";

  const cityInputStyles = cityHasErrors ? "invalid" : "";

  const birthdateInputStyles = birthdateHasErrors ? "invalid" : "";

  return reactDom.createPortal(
    <Edit>
      <form className={styles.form} onSubmit={submitHandler}>
        {nameHasErrors && (
          <div className={styles.error}>The field should not be empty</div>
        )}
        <Input
          label="name"
          input={{
            id: "name",
            type: "text",
          }}
          onChange={nameChangeHandler}
          onBlur={nameBlurHandler}
          className={styles.input}
        />
        {genderHasErrors && (
          <div className={styles.error}>The field should not be empty</div>
        )}
        <Checkbox input={["male", "female"]} label="gender" />
        {cityHasErrors && (
          <div className={styles.error}>The field should not be empty</div>
        )}
        <Input
          label="city"
          input={{
            id: "city",
            type: "text",
          }}
          onChange={cityChangeHandler}
          onBlur={cityBlurHandler}
          className={styles.input}
        />
        {birthdateHasErrors && (
          <div className={styles.error}>The field should not be empty</div>
        )}
        <Input
          label="birthdate"
          input={{
            id: "birthdate",
            type: "text",
          }}
          onChange={birthdateChangeHandler}
          onBlur={birthdateBlurHandler}
          className={styles.input}
        />
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

export default EditProfile;
