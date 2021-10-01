import { useDispatch } from "react-redux";
import { ReactDOM } from "react-dom";
import Edit from "./Edit";
import Input from "../UI/Input/Input";
import Checkbox from "../UI/Checkbox/Checkbox";
import Button from "../UI/Button/Button";
import { uiActions } from "../../store/ui-slice";
import check from '../../imgs/check.svg';
import close from '../../imgs/close.svg';
import styles from "./EditUser.module.scss";

const EditUser = (props) => {
  const dispatch = useDispatch();
  const closeHandler = () => {
    dispatch(uiActions.modalClose());
  };

    return ReactDOM.createPortal(
        <Edit>
          <Input
            label="user name"
            input={{ id: "user-name", type: "text", value: "new-username", value: props.value ? props.value : "" }}
            className={styles.input}
          />
          <Input
            label="email"
            input={{ id: "email", type: "text", value: "some-email", value: props.value ? props.value : ""}}
            className={styles.input}
          />
          <Checkbox input={["user", "admin"]} label="role"/>
          <div className={styles["submit-btn"]}>
            <Button>
              <img src={check} alt="Check" />
            </Button>
            <Button onClick={closeHandler}>
              <img src={close} alt="Close" />
            </Button>
          </div>
        </Edit>,
        document.getElementById("modal")
      );
};

export default EditUser;