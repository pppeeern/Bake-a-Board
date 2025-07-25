import {
  doc,
  setDoc,
  getDoc,
  updateDoc,
  increment,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../config/firebase";

class UserDataService {
  async createUserData(userId, userData = {}) {
    const userRef = doc(db, "users", userId);

    const defaultData = {
      cookies: 0,
      exp: 0,
      level: 1,
      unlockedLessons: ["chapter1/lesson1"],
      unlockedChapters: ["chapter1"],
      completedQuizzes: [],
      lessonProgress: {},
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      ...userData,
    };

    try {
      await setDoc(userRef, defaultData);
      return { success: true, data: defaultData };
    } catch (error) {
      console.error("Error creating user data:", error);
      return { success: false, error: error.message };
    }
  }

  async getUserData(userId) {
    try {
      const userRef = doc(db, "users", userId);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        return { success: true, data: userSnap.data() };
      } else {
        return await this.createUserData(userId);
      }
    } catch (error) {
      console.error("Error getting user data:", error);
      return { success: false, error: error.message };
    }
  }

  async updateCookies(userId, amount) {
    try {
      const userRef = doc(db, "users", userId);
      await updateDoc(userRef, {
        cookies: increment(amount),
        updatedAt: serverTimestamp(),
      });
      return { success: true };
    } catch (error) {
      console.error("Error updating cookies:", error);
      return { success: false, error: error.message };
    }
  }

  async updateExp(userId, expAmount) {
    try {
      const userRef = doc(db, "users", userId);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        const userData = userSnap.data();
        const newExp = userData.exp + expAmount;
        const newLevel = this.calculateLevel(newExp);

        await updateDoc(userRef, {
          exp: newExp,
          level: newLevel,
          updatedAt: serverTimestamp(),
        });

        return { success: true, newExp, newLevel };
      }

      return { success: false, error: "User not found" };
    } catch (error) {
      console.error("Error updating exp:", error);
      return { success: false, error: error.message };
    }
  }

  calculateLevel(exp) {
    return Math.floor(exp / 100) + 1;
  }

  async giveRewards(userId, rewards = { exp: 50, cookies: 10 }) {
    try {
      const userRef = doc(db, "users", userId);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        const userData = userSnap.data();
        const newExp = userData.exp + rewards.exp;
        const newLevel = this.calculateLevel(newExp);

        await updateDoc(userRef, {
          exp: newExp,
          level: newLevel,
          cookies: increment(rewards.cookies),
          updatedAt: serverTimestamp(),
        });

        return {
          success: true,
          rewards,
          newExp,
          newLevel,
          newCookies: userData.cookies + rewards.cookies,
        };
      }

      return { success: false, error: "User not found" };
    } catch (error) {
      console.error("Error giving rewards:", error);
      return { success: false, error: error.message };
    }
  }

  async updateLessonProgress(userId, lessonId, completedCount) {
    try {
      const userRef = doc(db, "users", userId);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        const userData = userSnap.data();
        const lessonProgress = userData.lessonProgress || {};

        lessonProgress[lessonId] = completedCount;

        await updateDoc(userRef, {
          lessonProgress,
          updatedAt: serverTimestamp(),
        });

        return { success: true, lessonProgress };
      }

      return { success: false, error: "User not found" };
    } catch (error) {
      console.error("Error updating lesson progress:", error);
      return { success: false, error: error.message };
    }
  }

  async completeQuiz(userId, lessonId, allLessons, allChapters) {
    try {
      const userRef = doc(db, "users", userId);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        const userData = userSnap.data();
        const completedQuizzes = userData.completedQuizzes || [];
        const unlockedLessons = userData.unlockedLessons || [];
        const unlockedChapters = userData.unlockedChapters || [];
        const lessonProgress = userData.lessonProgress || {};

        if (!completedQuizzes.includes(lessonId)) {
          completedQuizzes.push(lessonId);
        }

        const currentLesson = allLessons.find(
          (lesson) => lesson.id === lessonId
        );
        if (currentLesson) {
          lessonProgress[lessonId] = currentLesson.progress.total;
        }

        const currentIndex = allLessons.findIndex(
          (lesson) => lesson.id === lessonId
        );
        let nextLessonUnlocked = null;

        if (currentIndex !== -1 && currentIndex < allLessons.length - 1) {
          const nextLesson = allLessons[currentIndex + 1];
          if (!unlockedLessons.includes(nextLesson.id)) {
            unlockedLessons.push(nextLesson.id);
            nextLessonUnlocked = nextLesson.id;
          }
        }

        const currentChapterId = lessonId.split("/")[0];
        const chapterLessons = allLessons.filter((lesson) =>
          lesson.id.startsWith(currentChapterId)
        );
        const allChapterLessonsCompleted = chapterLessons.every((lesson) =>
          completedQuizzes.includes(lesson.id)
        );

        let nextChapterUnlocked = null;
        if (allChapterLessonsCompleted) {
          const currentChapterIndex = allChapters.findIndex(
            (chapter) => chapter.id === currentChapterId
          );
          if (
            currentChapterIndex !== -1 &&
            currentChapterIndex < allChapters.length - 1
          ) {
            const nextChapter = allChapters[currentChapterIndex + 1];
            if (!unlockedChapters.includes(nextChapter.id)) {
              unlockedChapters.push(nextChapter.id);
              nextChapterUnlocked = nextChapter.id;

              const nextChapterFirstLesson = allLessons.find((lesson) =>
                lesson.id.startsWith(nextChapter.id)
              );
              if (
                nextChapterFirstLesson &&
                !unlockedLessons.includes(nextChapterFirstLesson.id)
              ) {
                unlockedLessons.push(nextChapterFirstLesson.id);
              }
            }
          }
        }

        await updateDoc(userRef, {
          completedQuizzes,
          unlockedLessons,
          unlockedChapters,
          lessonProgress,
          updatedAt: serverTimestamp(),
        });

        return {
          success: true,
          nextLessonUnlocked,
          nextChapterUnlocked,
          completedQuizzes,
          unlockedLessons,
          unlockedChapters,
        };
      }

      return { success: false, error: "User not found" };
    } catch (error) {
      console.error("Error completing quiz:", error);
      return { success: false, error: error.message };
    }
  }

  async getProgressData(userId, lessonsData, chaptersData) {
    try {
      const userData = await this.getUserData(userId);
      if (!userData.success) {
        return { success: false, error: "Failed to get user data" };
      }

      const {
        unlockedLessons = [],
        unlockedChapters = [],
        lessonProgress = {},
      } = userData.data;

      const processedLessons = lessonsData.map((lesson) => ({
        ...lesson,
        isUnlocked: unlockedLessons.includes(lesson.id),
        progress: {
          ...lesson.progress,
          completed: lessonProgress[lesson.id] || 0,
        },
      }));

      const processedChapters = chaptersData.map((chapter) => ({
        ...chapter,
        isUnlocked: unlockedChapters.includes(chapter.id),
      }));

      return {
        success: true,
        lessons: processedLessons,
        chapters: processedChapters,
        userData: userData.data,
      };
    } catch (error) {
      console.error("Error processing progress data:", error);
      return { success: false, error: error.message };
    }
  }
}

export const userDataService = new UserDataService();
