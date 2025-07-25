import React, { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "../pages/Account/AuthContext";
import { userDataService } from "./userDataService";
import { lessonData } from "../pages/Learn/data/lessonData";
import { chapterData } from "../pages/Learn/data/chapterData";

const UserDataContext = createContext();

export function useUserData() {
  const context = useContext(UserDataContext);
  if (!context) {
    throw new Error("useUserData must be used within a UserDataProvider");
  }
  return context;
}

export default function UserDataProvider({ children }) {
  const { user } = useAuth();
  const [userData, setUserData] = useState(null);
  const [processedLessons, setProcessedLessons] = useState([]);
  const [processedChapters, setProcessedChapters] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadUserData();
    } else {
      setUserData(null);
      setProcessedLessons([]);
      setProcessedChapters([]);
      setLoading(false);
    }
  }, [user]);

  const loadUserData = async () => {
    if (!user) return;

    setLoading(true);

    const result = await userDataService.getProgressData(
      user.uid,
      lessonData,
      chapterData
    );

    if (result.success) {
      setUserData(result.userData);
      setProcessedLessons(result.lessons);
      setProcessedChapters(result.chapters);
    } else {
      console.error("Failed to load user data:", result.error);
    }

    setLoading(false);
  };

  const updateCookies = async (amount) => {
    if (!user) return;

    const result = await userDataService.updateCookies(user.uid, amount);
    if (result.success) {
      setUserData((prev) => ({
        ...prev,
        cookies: prev.cookies + amount,
      }));
    }
    return result;
  };

  const updateExp = async (amount) => {
    if (!user) return;

    const result = await userDataService.updateExp(user.uid, amount);
    if (result.success) {
      setUserData((prev) => ({
        ...prev,
        exp: result.newExp,
        level: result.newLevel,
      }));
    }
    return result;
  };

  const giveRewards = async (rewards) => {
    if (!user) return;

    const result = await userDataService.giveRewards(user.uid, rewards);
    if (result.success) {
      setUserData((prev) => ({
        ...prev,
        exp: result.newExp,
        level: result.newLevel,
        cookies: result.newCookies,
      }));
    }
    return result;
  };

  const completeQuiz = async (lessonId) => {
    if (!user) return { success: false, error: "User not authenticated" };

    const result = await userDataService.completeQuiz(
      user.uid,
      lessonId,
      lessonData,
      chapterData
    );

    if (result.success) {
      await loadUserData();

      return {
        success: true,
        nextLessonUnlocked: result.nextLessonUnlocked,
        nextChapterUnlocked: result.nextChapterUnlocked,
      };
    }

    return result;
  };

  const updateLessonProgress = async (lessonId, completedCount) => {
    if (!user) return { success: false, error: "User not authenticated" };

    const result = await userDataService.updateLessonProgress(
      user.uid,
      lessonId,
      completedCount
    );

    if (result.success) {
      setProcessedLessons((prev) =>
        prev.map((lesson) =>
          lesson.id === lessonId
            ? {
                ...lesson,
                progress: { ...lesson.progress, completed: completedCount },
              }
            : lesson
        )
      );
    }

    return result;
  };

  const getLessonsForChapter = (chapterId) => {
    return processedLessons.filter((lesson) => lesson.id.startsWith(chapterId));
  };

  const getLessonById = (lessonId) => {
    return processedLessons.find((lesson) => lesson.id === lessonId) || null;
  };

  const getChapterById = (chapterId) => {
    return (
      processedChapters.find((chapter) => chapter.id === chapterId) || null
    );
  };

  const canAccessLesson = (lessonId) => {
    const lesson = getLessonById(lessonId);
    return lesson ? lesson.isUnlocked : false;
  };

  const canAccessChapter = (chapterId) => {
    const chapter = getChapterById(chapterId);
    return chapter ? chapter.isUnlocked : false;
  };

  const value = {
    userData,
    loading,

    lessons: processedLessons,
    chapters: processedChapters,

    updateCookies,
    updateExp,
    giveRewards,
    completeQuiz,
    updateLessonProgress,

    getLessonsForChapter,
    getLessonById,
    getChapterById,
    canAccessLesson,
    canAccessChapter,

    refreshUserData: loadUserData,
  };

  return (
    <UserDataContext.Provider value={value}>
      {children}
    </UserDataContext.Provider>
  );
}
