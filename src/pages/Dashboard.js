import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import styles from "./Dashboard.module.scss";
import Layout from "../components/Layouts/Layout";
import Loader from "../components/UI/Loader/Loader";
import useHttp from "../hooks/use-http";

const Dashboard = () => {
  const { isLoading, error, sendRequest } = useHttp();
  const [dashboardData, setDashboardData] = useState({});
  const [isReady, setIsReady] = useState(false);
  const auth = useSelector((state) => state.user.auth);

  useEffect(() => {
    const getDashboardData = async () => {
      setIsReady(false);
      const response = await sendRequest({
        url: `http://localhost:5000/api/dashboard/`,
        headers: {
          authorization: `Bearer ${auth}`,
        },
      });

      setDashboardData(response);
      setIsReady(true);
    };

    getDashboardData();
  }, [auth, sendRequest]);

  return (
    <section className={styles.dashboard}>
      <h2 className={styles.headline}>Dashboard:</h2>
      {error || dashboardData.errors && <div className="error">Something went wrong</div>}
      {isLoading && <Loader />}
      {isReady && !error && !dashboardData.errors && (
        <div className={styles.cards}>
          <Layout>
            <div className={styles.head}>Users:</div>
            <div className={styles.number} data-testid="users">{dashboardData.usersCount}</div>
          </Layout>
          <Layout>
            <div className={styles.head}>Profiles:</div>
            <div className={styles.number} data-testid="profiles">{dashboardData.profileCount}</div>
          </Layout>
          <Layout>
            <div className={styles.head}>Profiles over 18 years old:</div>
            <div className={styles.number} data-testid="profilesOver18">
              {
                dashboardData.profiles.filter(
                  (profile) => profile.birthdate > 568080000000
                ).length
              }
            </div>
          </Layout>
        </div>
      )}
    </section>
  );
};

export default Dashboard;
