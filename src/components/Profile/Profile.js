import { useSelector, useDispatch } from "react-redux";
import { NavLink } from "react-router-dom";
import styles from "./Profile.module.scss";
import edit from "../../imgs/edit.svg";
import garbage from "../../imgs/delete.svg";
import Profiles from "../Profiles";
import useHttp from "../../hooks/use-http";
import { uiActions } from "../../store/ui-slice";
import { userActions } from "../../store/user-slice";
import { useParams } from "react-router";

const User = (props) => {
  const { id: userId } = useParams();
  const profiles = useSelector((state) => state.user.profiles);
  const users = useSelector((state) => state.users.users);
  const user = users.find((user) => user._id === userId);  
  const auth = useSelector((state) => state.user.auth);
  const dispatch = useDispatch();
  const { isLoading, error, sendRequest } = useHttp();

  const msToBirthdate = (ms) =>
  new Date(ms).toLocaleDateString().replaceAll(`/`, `.`);

  const editHandler = () => {
    dispatch(uiActions.addNewProfilePress(false));

    const user = users.find(user => user._id === userId);

    dispatch(userActions.addUser(user));
    console.log(user)

    dispatch(uiActions.modalOpen("user"));
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
      await sendRequest({
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
    <section className={styles.user}>
      <div className={styles["users-info"]}>
        <div className={styles.text}>{user.username}</div>
        <div className={styles.text}>{user.email}</div>
        <div className={styles.type}>{user.type}</div>
        <div className={styles.change}>
          <button onClick={editHandler}>
            <img src={edit} alt="Edit" />
          </button>
          <button onClick={deleteHandler}>
            <img src={garbage} alt="Delete" />
          </button>
        </div>
      </div>

      <Profiles id={userId} />
    </section>
  );
};

export default User;
