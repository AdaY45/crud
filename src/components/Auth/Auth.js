import SignUp from "./SignUp";
import SignIn from "./SingIn";

const Auth = (props) => {
  return (
    <section className="login">
      {props.isSignUp ? <SignUp onAddUser={props.onAddUser} /> : <SignIn />}
    </section>
  );
};

export default Auth;
