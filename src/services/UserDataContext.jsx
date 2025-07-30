import React, { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "../pages/Account/AuthContext";
import { userDataService } from "./userDataService";
import { lessonData } from "../pages/Learn/data/lessonData";
import { chapterData } from "../pages/Learn/data/chapterData";
import {
  doc,
  setDoc,
  getDoc,
  updateDoc,
  increment,
  serverTimestamp,
  onSnapshot,
} from "firebase/firestore";
import { db } from "../config/firebase";

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

  // Unified level calculation function
  const calculateLevel = (exp) => {
    if (exp < 100) return 1; // Level 1: 0-99 XP
    if (exp < 250) return 2; // Level 2: 100-249 XP
    if (exp < 450) return 3; // Level 3: 250-449 XP
    if (exp < 700) return 4; // Level 4: 450-699 XP
    if (exp < 1000) return 5; // Level 5: 700-999 XP
    if (exp < 1350) return 6; // Level 6: 1000-1349 XP
    if (exp < 1750) return 7; // Level 7: 1350-1749 XP
    if (exp < 2200) return 8; // Level 8: 1750-2199 XP
    if (exp < 2700) return 9; // Level 9: 2200-2699 XP
    return Math.floor((exp - 2700) / 500) + 10; // Level 10+: Every 500 XP
  };

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

  const completeQuizWithRewards = async (lessonId, score, totalQuestions) => {
    if (!user) return { success: false, error: "User not authenticated" };

    try {
      const scorePercentage = (score / totalQuestions) * 100;

      if (scorePercentage >= 50) {
        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
          const userData = userSnap.data();
          const lessonProgress = userData.lessonProgress || {};
          const quizRewards = userData.quizRewards || {};

          const currentLesson = processedLessons.find(
            (lesson) => lesson.id === lessonId
          );
          if (currentLesson) {
            const currentProgress = lessonProgress[lessonId] || 0;
            const newProgress = Math.min(
              currentProgress + 1,
              currentLesson.progress.total
            );

            const isLessonCompleted =
              currentLesson.isCompleted ||
              currentProgress >= currentLesson.progress.total;

            let rewards = {
              cookies: 0,
              exp: 0,
              newReward: false,
              isReplay: false,
            };

            if (isLessonCompleted) {
              // Replay of completed lesson
              rewards.exp = Math.round(scorePercentage * 0.5);
              rewards.cookies = 0;
              rewards.isReplay = true;

              console.log(
                `Replay detected for ${lessonId}, giving ${rewards.exp} XP`
              );

              const newExp = userData.exp + rewards.exp;
              const newLevel = calculateLevel(newExp); // Use unified function

              await updateDoc(userRef, {
                exp: newExp,
                level: newLevel,
                updatedAt: serverTimestamp(),
              });

              setUserData((prev) => ({
                ...prev,
                exp: newExp,
                level: newLevel,
              }));

              await loadUserData();

              return {
                success: true,
                progressIncremented: true,
                newProgress: currentProgress,
                lessonCompleted: true,
                rewards,
                alreadyRewarded: false,
                isReplay: true,
              };
            }

            const quizKey = `${lessonId}_${newProgress}`;
            const hasReceivedRewards = quizRewards[quizKey] || false;

            if (!hasReceivedRewards) {
              // First time completing this quiz
              rewards.cookies = 5;
              rewards.exp = Math.round(scorePercentage);
              rewards.newReward = true;
              rewards.isReplay = false;

              if (scorePercentage === 100) {
                rewards.cookies += 5;
                rewards.exp += 25;
              }

              const newExp = userData.exp + rewards.exp;
              const newLevel = calculateLevel(newExp); // Use unified function

              quizRewards[quizKey] = true;

              await updateDoc(userRef, {
                lessonProgress: { ...lessonProgress, [lessonId]: newProgress },
                quizRewards,
                cookies: increment(rewards.cookies),
                exp: newExp,
                level: newLevel,
                updatedAt: serverTimestamp(),
              });

              setUserData((prev) => ({
                ...prev,
                cookies: prev.cookies + rewards.cookies,
                exp: newExp,
                level: newLevel,
              }));
            } else {
              rewards.cookies = 0;
              rewards.exp = Math.round(scorePercentage * 0.5);
              rewards.newReward = false;
              rewards.isReplay = true;

              console.log(
                `Quiz repeat detected for ${lessonId}_${newProgress}, giving ${rewards.exp} XP`
              );

              const newExp = userData.exp + rewards.exp;
              const newLevel = calculateLevel(newExp);

              await updateDoc(userRef, {
                lessonProgress: { ...lessonProgress, [lessonId]: newProgress },
                exp: newExp,
                level: newLevel,
                updatedAt: serverTimestamp(),
              });

              setUserData((prev) => ({
                ...prev,
                exp: newExp,
                level: newLevel,
              }));
            }

            let unlockResult = null;
            if (
              newProgress >= currentLesson.progress.total &&
              !isLessonCompleted
            ) {
              unlockResult = await userDataService.completeQuiz(
                user.uid,
                lessonId,
                lessonData,
                chapterData
              );

              const lessonCompleteKey = `${lessonId}_complete`;
              if (!quizRewards[lessonCompleteKey] && unlockResult.success) {
                const lessonBonus = {
                  cookies: 20,
                  exp: 100,
                };

                const currentUserSnap = await getDoc(userRef);
                const currentUserData = currentUserSnap.data();
                const finalExp = currentUserData.exp + lessonBonus.exp;
                const finalLevel = calculateLevel(finalExp);

                quizRewards[lessonCompleteKey] = true;

                await updateDoc(userRef, {
                  quizRewards,
                  cookies: increment(lessonBonus.cookies),
                  exp: finalExp,
                  level: finalLevel,
                  updatedAt: serverTimestamp(),
                });

                setUserData((prev) => ({
                  ...prev,
                  cookies: prev.cookies + lessonBonus.cookies,
                  exp: finalExp,
                  level: finalLevel,
                }));

                rewards.cookies += lessonBonus.cookies;
                rewards.exp += lessonBonus.exp;
                rewards.lessonCompleteBonus = true;
              }
            }

            await loadUserData();

            return {
              success: true,
              progressIncremented: true,
              newProgress,
              lessonCompleted: newProgress >= currentLesson.progress.total,
              rewards,
              unlockResult,
              alreadyRewarded: !rewards.newReward && !rewards.isReplay,
              nextLessonUnlocked: unlockResult?.nextLessonUnlocked,
              nextChapterUnlocked: unlockResult?.nextChapterUnlocked,
              isReplay: rewards.isReplay,
            };
          }
        }
      }

      return {
        success: true,
        progressIncremented: false,
        message: "Score too low to count as progress (need ≥50%)",
      };
    } catch (error) {
      console.error("Error completing quiz with rewards:", error);
      return { success: false, error: error.message };
    }
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
    completeQuizWithRewards,

    updateLessonProgress,

    getLessonsForChapter,
    getLessonById,
    getChapterById,
    canAccessLesson,
    canAccessChapter,

    refreshUserData: loadUserData,
    calculateLevel,
  };

  return (
    <UserDataContext.Provider value={value}>
      {children}
    </UserDataContext.Provider>
  );
}
