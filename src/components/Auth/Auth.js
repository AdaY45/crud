import styles from "./Auth.module.scss";
import SignUp from "./SignUp";
import SignIn from "./SingIn";

const Auth = (props) => {
  return (
    <section className={styles.login}>
      {props.isSignUp ? <SignUp onAddUser={props.onAddUser} /> : <SignIn />}
    </section>
  );
};

export default Auth;
