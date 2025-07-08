import "./Learn.css";
import ProfileIcon from "../../components/profileIcon/profileIcon";
import { Link } from "react-router-dom";

function Learn() {
  return (
    <div className="wrapper">
      <ProfileIcon />
      <div className="wrapper learn_container">
        <div id="chapter_container">
          <Link to={`/chapters`} id="chapter_button">
            <span id="chapter_label">Chapter</span>
          </Link>
        </div>
        <div id="lessons_container">
          <div>
            <img src="https://placehold.co/75x75" />
          </div>
          <div>
            <img src="https://placehold.co/75x75" />
          </div>
          <div>
            <img src="https://placehold.co/75x75" />
          </div>
          <div>
            <img src="https://placehold.co/75x75" />
          </div>
          <div>
            <img src="https://placehold.co/75x75" />
          </div>
          <div>
            <img src="https://placehold.co/75x75" />
          </div>
          <div>
            <img src="https://placehold.co/75x75" />
          </div>
          <div>
            <img src="https://placehold.co/75x75" />
          </div>
          <div>
            <img src="https://placehold.co/75x75" />
          </div>
          <div>
            <img src="https://placehold.co/75x75" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Learn;
