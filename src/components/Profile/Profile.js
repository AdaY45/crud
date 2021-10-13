import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router";
import styles from "./Profile.module.scss";
import edit from "../../imgs/edit.svg";
import garbage from "../../imgs/delete.svg";
import Profiles from "../../pages/Profiles";
import useHttp from "../../hooks/use-http";
import { uiActions } from "../../store/ui-slice";
import { userActions } from "../../store/user-slice";
import { useParams } from "react-router";

const User = () => {
  const { id: userId } = useParams();
  const history = useHistory();
  const users = useSelector((state) => state.users.users);
  const user = users.find((user) => user._id === userId);
  const auth = useSelector((state) => state.user.auth);
  const dispatch = useDispatch();
  const { isLoading, error, sendRequest } = useHttp();

  useEffect(() => {
    dispatch(userActions.setSelectedUserId(userId));
  }, [dispatch, userId]);

  const editHandler = () => {
    dispatch(uiActions.addNewProfilePress(false));

    const user = users.find((user) => user._id === userId);

    dispatch(userActions.addUser(user));

    dispatch(uiActions.modalOpen("user"));
  };

  const deleteHandler = async () => {
    const confirmation = window.confirm(
      "Are you sure you want to delete the user?"
    );
    console.log(auth);

    if (confirmation) {
      await sendRequest({
        url: `http://localhost:5000/api/users/delete`,
        method: "DELETE",
        headers: {
          authorization: `Bearer ${auth}`,
          "Content-Type": "application/json",
        },
        body: {
          userId: user._id,
          owner: user.owner,
        },
      });
    }

    history.push("/users");
  };

  return (
    <section className={styles.user}>
      <div className={styles["users-info"]}>
        <div className={styles.text}>{user.username}</div>
        <div className={styles.text}>{user.email}</div>
        <div className={styles.type}>{user.type}</div>
        <div className={styles.change}>
          <button onClick={editHandler} data-testid="edit">
            <img src={edit} alt="Edit" />
          </button>
          <button onClick={deleteHandler} data-testid="delete">
            <img src={garbage} alt="Delete" />
          </button>
        </div>
      </div>

      <Profiles />
    </section>
  );
};

export default User;
