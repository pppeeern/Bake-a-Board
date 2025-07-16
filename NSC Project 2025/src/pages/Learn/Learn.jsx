import { Link } from "react-router-dom";
import "./Learn.css";
import ProfileIcon from "../../components/profileIcon/ProfileIcon";
import LessonCard from "./lessonCard/LessonCard";
import { lessonData } from "./data/lessonData";

function Learn({ chapter }) {
  return (
    <div className="wrapper">
      <ProfileIcon />
      <div className="wrapper learn_container">
        <div id="chapter_container">
          <Link to={`/chapters/`} id="chapter_button">
            <span id="chapter_label">{chapter.name}</span>
          </Link>
        </div>
        <div id="lessons_container">
          {lessonData.map((lesson) => (
            <LessonCard key={lesson.id} lesson={lesson} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default Learn;
