import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router";
import styles from "./Card.module.scss";
import edit from "../../imgs/edit.svg";
import garbage from "../../imgs/delete.svg";
import { uiActions } from "../../store/ui-slice";
import { userActions } from "../../store/user-slice";
import useHttp from "../../hooks/use-http";
import Layout from "../Layouts/Layout";

const Card = (props) => {
  const [isHovered, setIsHovered] = useState(false);
  const profiles = useSelector((state) => state.user.profiles);
  const auth = useSelector((state) => state.user.auth);
  const { isLoading, error, sendRequest } = useHttp();
  const history = useHistory();
  const dispatch = useDispatch();
  const toggleHover = () => {
    setIsHovered(!isHovered);
  };

  const msToBirthdate = (ms) =>
    new Date(ms).toLocaleDateString().replaceAll(`/`, `.`);

  const editHandler = () => {
    dispatch(uiActions.addNewProfilePress(false));

    const profile = profiles.find(
      (el) =>
        el.name === props.name &&
        el.gender === props.input[0] &&
        msToBirthdate(el.birthdate) === props.input[1] &&
        el.city === props.input[2]
    );

    dispatch(userActions.addProfile(profile));

    dispatch(uiActions.modalOpen("profile"));
  };

  const deleteHandler = async () => {
    const confirmation = window.confirm(
      "Are you sure you want to delete the profile?"
    );

    const profile = profiles.find(
      (el) =>
        el.name === props.name &&
        el.gender === props.input[0] &&
        msToBirthdate(el.birthdate) === props.input[1] &&
        el.city === props.input[2]
    );

    if (confirmation) {
      const response = await sendRequest({
        url: `http://localhost:5000/api/profiles/delete`,
        method: "DELETE",
        headers: {
          authorization: `Bearer ${auth}`,
          "Content-Type": "application/json",
        },
        body: {
          _id: profile._id,
          owner: profile.owner,
        },
      });
      const url = profile.owner
        ? `http://localhost:5000/api/profiles/${profile.owner}`
        : `http://localhost:5000/api/profiles/`;
      const profiles = await sendRequest({
        url,
        headers: {
          authorization: `Bearer ${auth}`,
        },
      });
      dispatch(userActions.addProfiles(profiles));
    }
  };

  return (
    <Layout>
      <div className={styles.card} onMouseEnter={toggleHover}>
        <div className={styles["card-info"]}>
          <div className={styles.name}>{props.name}</div>
          {props.input.map((el) => (
            <div key={el} className={styles.info}>
              {el}
            </div>
          ))}
        </div>
        {props.buttonsShow && (
          <div className={styles.change}>
            <button className={styles.edit} onClick={editHandler}>
              <img src={edit} alt="Edit" />
            </button>
            <button className={styles.delete} onClick={deleteHandler}>
              <img src={garbage} alt="Delete" />
            </button>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Card;
