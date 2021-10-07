import { useEffect } from "react";
import { NavLink } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import useHttp from "../hooks/use-http";
import Card from "../components/Card/Card";
import { usersActions } from "../store/users-slice";
import styles from "./Users.module.scss";
import Loader from "../components/UI/Loader/Loader";

const Users = () => {
  const { isLoading, error, sendRequest } = useHttp();
  const auth = useSelector((state) => state.user.auth);
  const users = useSelector((state) => state.users.users);
  const profiles = useSelector((state) => state.users.profiles);
  const dispatch = useDispatch();
  useEffect(() => {
    const getUsersData = async () => {
      const users = await sendRequest({
        url: `http://localhost:5000/api/users/`,
        headers: {
          authorization: `Bearer ${auth}`,
          "Content-Type": "application/json",
        },
      });
      dispatch(usersActions.addUsers(users));
    };

    const getProfilesData = async (userId) => {
      const url = `http://localhost:5000/api/profiles/`;
      const profiles = await sendRequest({
        url,
        headers: {
          authorization: `Bearer ${auth}`,
        },
      });
      dispatch(usersActions.addProfiles(profiles));
    };

    getProfilesData();
    getUsersData();
  }, [dispatch, auth, sendRequest]);

  console.log(profiles);
  console.log(users);

  return (
    <section className={styles.users}>
      <h2 className="headline">Users:</h2>
      {isLoading && <Loader />}
      <div className={styles.cards}>
        {users.map((el) => (
          <NavLink to={`/profile/${el._id}`} className={styles.profile}>
            <Card
              key={el._id}
              id={el._id}
              name={el.username}
              input={[
                el.email,
                `${
                  profiles.filter((profile) => profile.owner === el._id).length
                } profiles`,
              ]}
              buttonsShow={false}
            />
          </NavLink>
        ))}
      </div>
    </section>
  );
};

export default Users;
