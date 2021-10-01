import Card from "./Card";
import styles from "./Users.module.scss";

const Users = () => {
    const users = [
        {
            name: "1White",
            email: "danilo.bilyi@gmail.com",
            quatityOfProfiles: 2
        },
        {
            name: "1White",
            email: "danilo.bilyi@gmail.com",
            quatityOfProfiles: 2
        },
        {
            name: "1White",
            email: "danilo.bilyi@gmail.com",
            quatityOfProfiles: 2
        },
    ]
    return <section className={styles.users}>
    <h2 className="headline">Users:</h2>

    <div className={styles.cards}>
        {users.map(el => (
            <Card key={el.name} name={el.name} input={[el.email, `${el.quatityOfProfiles} ${el.quatityOfProfiles === 1 ? "profile" : "profiles"}`]}/>
        ))}
    </div>
</section>
};

export default Users;