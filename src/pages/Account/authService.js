import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  updateProfile,
  signOut,
} from "firebase/auth";
import { auth } from "../../config/firebase";

class AuthService {
  constructor() {
    this.googleProvider = new GoogleAuthProvider();
  }

  async registerWithEmail(email, password, username) {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      await updateProfile(userCredential.user, {
        displayName: username,
      });

      return {
        success: true,
        user: userCredential.user,
        message: "Registration successful!",
      };
    } catch (error) {
      return {
        success: false,
        error: error.code,
        message: error.message,
      };
    }
  }

  async signInWithEmail(email, password) {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      return {
        success: true,
        user: userCredential.user,
        message: "Login successful!",
      };
    } catch (error) {
      return {
        success: false,
        error: error.code,
        message: error.message,
      };
    }
  }

  async signInWithGoogle() {
    try {
      const userCredential = await signInWithPopup(auth, this.googleProvider);

      return {
        success: true,
        user: userCredential.user,
        message: "Google sign-in successful!",
      };
    } catch (error) {
      return {
        success: false,
        error: error.code,
        message: error.message,
      };
    }
  }

  async signOut() {
    try {
      await signOut(auth);
      return {
        success: true,
        message: "Signed out successfully!",
      };
    } catch (error) {
      return {
        success: false,
        error: error.code,
        message: error.message,
      };
    }
  }

  getCurrentUser() {
    return auth.currentUser;
  }

  onAuthStateChanged(callback) {
    return auth.onAuthStateChanged(callback);
  }
}

export const authService = new AuthService();
