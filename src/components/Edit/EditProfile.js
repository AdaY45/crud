import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
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
  const [isGenderValid, setIsGenderValid] = useState(true);
  const selectedUserId = useSelector(state => state.user.selectedUserId);
  const auth = useSelector((state) => state.user.auth);
  const profile = useSelector((state) => state.user.profile);
  const user = useSelector((state) => state.user.user);
  const isAdmin = useSelector((state) => state.ui.isAdmin);
  const isAddNewProfile = useSelector((state) => state.ui.isAddNewProfile);
  const { isLoading, error, sendRequest } = useHttp();
  const [selectedGender, setSelectedGender] = useState(null);
  const { id: userId } = useParams();
  const {
    value: name,
    isValid: nameIsValid,
    hasErrors: nameHasErrors,
    valueChangeHandler: nameChangeHandler,
    inputBlurHandler: nameBlurHandler,
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

  const genderHandler = (event) => {
    setSelectedGender(event.target.value);
  };

  const submitHandler = async (event) => {
    event.preventDefault();

    if (selectedGender === null) {
      setIsGenderValid(false);
      return;
    }

    if (!nameIsValid && !cityIsValid && !birthdateIsValid) {
      return;
    }

    if (isAddNewProfile) {
      await sendRequest({
        url: `http://localhost:5000/api/profiles/create`,
        method: "POST",
        headers: {
          authorization: `Bearer ${auth}`,
          "Content-Type": "application/json",
        },
        body: {
          name,
          gender: selectedGender,
          birthdate,
          city,
          owner: selectedUserId
        },
      });
    } else {
      const body = {
        _id: profile._id,
        name: name ? name : profile.name,
        gender: selectedGender ? selectedGender : profile.gender,
        birthdate: birthdate ? birthdate : profile.birthdate,
        city: city ? city : profile.city,
      };

      await sendRequest({
        url: `http://localhost:5000/api/profiles/edit`,
        method: "PATCH",
        headers: {
          authorization: `Bearer ${auth}`,
          "Content-Type": "application/json",
        },
        body: body,
      });
    }

    const url = userId
      ? `http://localhost:5000/api/profiles/${userId}`
      : user._id
      ? `http://localhost:5000/api/profiles/${user._id}`
      : selectedUserId
      ? `http://localhost:5000/api/profiles/${selectedUserId}`
      : isAdmin && `http://localhost:5000/api/profiles/`;

    const profiles = await sendRequest({
      url,
      headers: {
        authorization: `Bearer ${auth}`,
      },
    });
    
    dispatch(userActions.setSelectedUserId(null));
    dispatch(userActions.addProfiles(profiles));
    dispatch(uiActions.modalClose("profile"));
  };

  const birthday = new Date(profile.birthdate);

  const nameInputStyles = nameHasErrors ? "invalid" : "";

  const cityInputStyles = cityHasErrors ? "invalid" : "";

  const birthdateInputStyles = birthdateHasErrors ? "invalid" : "";

  return reactDom.createPortal(
    <Edit>
      <form className={styles.form} onSubmit={submitHandler}>
        {nameHasErrors && (
          <div className="error">This field should not be empty</div>
        )}
        <Input
          label="name"
          input={{
            id: "name",
            type: "text",
            defaultValue: !isAddNewProfile ? profile.name : "",
          }}
          onChange={nameChangeHandler}
          onBlur={isAddNewProfile && nameBlurHandler}
          className={nameInputStyles}
        />
        {!isGenderValid && (
          <div className="error">This field should not be empty</div>
        )}
        <div className={styles["form-control"]}>
          <label htmlFor={props.input}>gender</label>
          <div className={styles.options}>
            <input
              type="radio"
              name="gender"
              value="male"
              className={styles.radio}
              onChange={genderHandler}
              defaultChecked={!isAddNewProfile && profile.gender === "male"}
            />
            <label htmlFor="male" className={styles["gender-label"]}>
              male
            </label>
            <input
              type="radio"
              name="gender"
              value="female"
              className={styles.radio}
              onChange={genderHandler}
              defaultChecked={!isAddNewProfile && profile.gender === "female"}
            />
            <label htmlFor="female" className={styles["gender-label"]}>
              female
            </label>
          </div>
        </div>
        {cityHasErrors && (
          <div className="error">The field should not be empty</div>
        )}
        <Input
          label="city"
          input={{
            id: "city",
            type: "text",
            defaultValue: !isAddNewProfile ? profile.city : "",
          }}
          onChange={cityChangeHandler}
          onBlur={isAddNewProfile && cityBlurHandler}
          className={cityInputStyles}
        />
        {birthdateHasErrors && (
          <div className="error">This field should not be empty</div>
        )}
        <Input
          label="birthdate"
          input={{
            id: "birthdate",
            type: "date",
            max: new Date().toISOString().slice(0, 10),
            defaultValue: !isAddNewProfile
              ? `${birthday.getFullYear()}-${String(
                  birthday.getMonth() + 1
                ).padStart(2, "0")}-${String(birthday.getDate()).padStart(
                  2,
                  "0"
                )}`
              : "",
          }}
          onChange={birthdateChangeHandler}
          onBlur={isAddNewProfile && birthdateBlurHandler}
          className={birthdateInputStyles}
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
