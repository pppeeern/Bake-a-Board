import { Link } from "react-router-dom";
import "./Learn.css";
import ProfileIcon from "../../components/profileIcon/ProfileIcon";
import LessonCard from "../../components/lessonCard/LessonCard";

function Learn() {
  return (
    <div className="wrapper">
      <ProfileIcon />
      <div className="wrapper learn_container">
        <div id="chapter_container">
          <Link to={`/chapters/`} id="chapter_button">
            <span id="chapter_label">Chapter</span>
          </Link>
        </div>
        <div id="lessons_container">
          <LessonCard />
          <LessonCard />
          <LessonCard />
          <LessonCard />
        </div>
      </div>
    </div>
  );
}

export default Learn;
