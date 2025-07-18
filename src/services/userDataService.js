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

  // Simple reward function
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
}

export const userDataService = new UserDataService();
