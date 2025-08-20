import { Link } from "react-router-dom";
import "./Learn.css";
import ProfileIcon from "../../components/profileIcon/ProfileIcon";
import LessonCard from "./lessonCard/LessonCard";
import LoadingSpinner from "../../components/loadingSpinner/LoadingSpinner";
import { useUserData } from "../../services/UserDataContext";

function Learn({ chapter }) {
  const { getLessonsForChapter, loading } = useUserData();

  const lessons = getLessonsForChapter(chapter.id);

  if (loading) {
    return (
      <div className="wrapper">
        <ProfileIcon />
        <div className="wrapper learn_container">
          <LoadingSpinner />
        </div>
      </div>
    );
  }

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
          {lessons.map((lesson, i) => (
            <LessonCard key={lesson.id} index={i} lesson={lesson} />
          ))}
        </div>
        <div className="help_container">
          <img src="assets/kookai/kookai.svg" />
        </div>
      </div>
    </div>
  );
}

export default Learn;
