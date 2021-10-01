import styles from "./Dashboard.module.scss";
import Layout from "./Layouts/Layout";

const Dashboard = () => {
    const users = 0;
    const profiles = 0;
    const profiles18 = 0;
    return <section className={styles.dashboard}>
    <h2 className="headline">Dashboard:</h2>

    <div className={styles.cards}>
        <Layout>
            <div className={styles.head}>Users:</div>
            <div className={styles.number}>{users}</div>
        </Layout>
        <Layout>
            <div className={styles.head}>Profiles:</div>
            <div className={styles.number}>{profiles}</div>
        </Layout>
        <Layout>
            <div className={styles.head}>Profiles over 18 years old:</div>
            <div className={styles.number}>{profiles18}</div>
        </Layout>
    </div>
</section>
};

export default Dashboard;