import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { uiActions } from "../store/ui-slice";
import { useParams } from "react-router";
import { userActions } from "../store/user-slice";
import { NavLink } from "react-router-dom";
import Card from "./Card";
import Edit from "./Edit/Edit";
import styles from "./Profiles.module.scss";
import create from "../imgs/create.svg";
import useHttp from "../hooks/use-http";

const Profiles = (props) => {
  const { isLoading, error, sendRequest } = useHttp();
  const user = useSelector((state) => state.user.user);
  const profiles = useSelector((state) => state.user.profiles);
  const auth = useSelector((state) => state.user.auth);
  const dispatch = useDispatch();
  const { id: userId } = useParams();
  const createProfileHandler = () => {
    dispatch(uiActions.modalOpen("profile"));
  };

  useEffect(() => {
    // if(userId) {
    //   getUserData();
    // }
    const getProfilesData = async (userId) => {
      const url = userId
        ? `http://localhost:5000/api/profiles/${userId}`
        : `http://localhost:5000/api/profiles/`;
      const profiles = await sendRequest({
        url,
        headers: {
          authorization: `Bearer ${auth}`,
        },
      });
      dispatch(userActions.addProfiles(profiles));
    };

    getProfilesData(userId);
  }, [auth, sendRequest, dispatch, userId]);

  return (
    <section className={styles.profiles}>
      <h2 className="headline">Profiles:</h2>
      <div className={styles.cards}>
        {profiles.map((el) => (
          <Card
            key={el._id}
            name={el.name}
            input={[el.gender, el.birthdate, el.city]}
          />
        ))}
      </div>
      <button className={styles["header-btn"]} onClick={createProfileHandler}>
        <div className={styles.creation}>
          <img src={create} alt="Create" />
          <div className={styles.text}>Create new profile</div>
        </div>
      </button>
    </section>
  );
};

export default Profiles;
