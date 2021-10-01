import { useState } from "react";
import styles from "./Card.module.scss";
import edit from "../imgs/edit.svg";
import garbage from "../imgs/delete.svg";
import Layout from "./Layouts/Layout";

const Card = (props) => {
  const [isHovered, setIsHovered] = useState(false);
  const toggleHover = () => {
    setIsHovered(!isHovered);
  };

  return (
    <Layout>
      <div className={styles.card} onMouseEnter={toggleHover}>
        <div className={styles.name}>{props.name}</div>
        {props.input.map((el) => (
          <div key={el} className={styles.info}>{el}</div>
        ))}
        {isHovered && (
          <div className={styles.change}>
            <button className={styles.edit}>
              <div className={styles.text}>Edit</div>
              <img src={edit} alt="Edit" />
            </button>
            <button className={styles.delete}>
              <div className={styles.text}>Delete</div>
              <img src={garbage} alt="Delete" />
            </button>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Card;
