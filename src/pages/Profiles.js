import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { uiActions } from "../store/ui-slice";
import { useParams } from "react-router";
import { userActions } from "../store/user-slice";
import Card from "../components/Card/Card";
import styles from "./Profiles.module.scss";
import create from "../imgs/create.svg";
import useHttp from "../hooks/use-http";

const Profiles = (props) => {
  const { isLoading, error, sendRequest } = useHttp();
  const user = useSelector((state) => state.user.user);
  const profiles = useSelector((state) => state.user.profiles);
  const isAdmin = useSelector((state) => state.ui.isAdmin);
  const auth = useSelector((state) => state.user.auth);
  const user_Id = useSelector((state) => state.user.userId);
  const [serverError, setServerError] = useState(null);
  const dispatch = useDispatch();
  const { id: userId } = useParams();

  const createProfileHandler = () => {
    dispatch(uiActions.addNewProfilePress(true));
    dispatch(uiActions.modalOpen("profile"));
  };
  useEffect(() => {
    let cleanupFunction = false;
    const getProfilesData = async (userId) => {
      const url = userId
        ? `http://localhost:5000/api/profiles/${userId}`
        : user_Id !== "" && !isAdmin
        ? `http://localhost:5000/api/profiles/${user_Id}`
        : isAdmin && `http://localhost:5000/api/profiles/`;
      const profiles = await sendRequest({
        url,
        headers: {
          authorization: `Bearer ${auth}`,
          "Content-Type": "application/json",
        },
      });
      if (!cleanupFunction && !profiles.errors) {
        dispatch(userActions.addProfiles(profiles));
      } else if(!cleanupFunction && profiles.errors) {
        setServerError(profiles.errors.message);
      }
    };
    getProfilesData(userId);

    return () => (cleanupFunction = true);
  }, [auth, sendRequest, userId, isAdmin, profiles, user_Id]);

  const msToBirthdate = (ms) =>
    new Date(ms).toLocaleDateString().replaceAll(`/`, `.`);

  return (
    <section className={styles.profiles}>
      <h2 className="headline">Profiles:</h2>
      {error || serverError !== null && <div className="error">Something went wrong</div>}
      <div className={styles.cards} data-testid="cards">
        {profiles.map((el) => (
          <Card
            key={el._id}
            name={el.name}
            input={[el.gender, msToBirthdate(+new Date(el.birthdate)), el.city]}
            buttonsShow={true}
            data-testid="card"
          />
        ))}
        <button
          className={styles["create-btn"]}
          onClick={createProfileHandler}
          data-testid="create-profile"
        >
          <div className={styles.creation}>
            <img src={create} alt="Create" />
            <div className={styles.text}>Create new profile</div>
          </div>
        </button>
      </div>
    </section>
  );
};

export default Profiles;
