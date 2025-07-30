import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { useState } from "react";

import SideBar from "./components/sidebar/SideBar";
import { AuthProvider, useAuth } from "./pages/Account/AuthContext";
import UserDataProvider from "./services/UserDataContext";

import Account from "./pages/Account/Account";

import Learn from "./pages/Learn/Learn";
import Breadex from "./pages/Breadex/Breadex";
import Bakery from "./pages/Bakery/Bakery";
import Profile from "./pages/Profile/Profile";
import Settings from "./pages/Settings/Setting";

import Quiz from "./pages/Quiz/Quiz";
import HostRoom from "./pages/QuizRoom/HostRoom";
import JoinRoom from "./pages/QuizRoom/JoinRoom";
import PlayQuiz from "./pages/QuizRoom/PlayQuiz";

import Chapters from "./pages/Learn/chaptersMenu/ChaptersMenu";
import BreadexInfo from "./pages/Breadex/breadexInfo/BreadexInfo";
import BreadexScanner from "./pages/Breadex/breadexScanner/BreadexScanner";

import { chapterData } from "./pages/Learn/data/chapterData";

import "./MainLayout.css";
import LoadingSpinner from "./components/loadingSpinner/LoadingSpinner";

function ProtectedLayout({ children }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          width: "100%",
          height: "100vh",
        }}
      >
        <LoadingSpinner />
      </div>
    );
  }

  if (!user) {
    return <Account />;
  }

  const path = location.pathname;
  const fullscreen =
    path === "/bakery/" ||
    path.startsWith("/quiz/") ||
    path.endsWith("scanner");

  if (fullscreen) return <div id="content">{children}</div>;
  return (
    <section className="mainLayout">
      <SideBar />
      <div id="content">{children}</div>
    </section>
  );
}

function App() {
  const [chapter, setChapter] = useState(() => {
    const lastUnlocked = [...chapterData].reverse().find((c) => c.isUnlocked);
    return lastUnlocked ? lastUnlocked : chapterData[0];
  });

  return (
    <AuthProvider>
      <UserDataProvider>
        <Router>
          <Routes>
            <Route path="/welcome/" element={<Account />} />
            <Route
              path="/"
              element={
                <ProtectedLayout>
                  <Learn chapter={chapter} />
                </ProtectedLayout>
              }
            />

            <Route
              path="/breadex/"
              element={
                <ProtectedLayout>
                  <Breadex />
                </ProtectedLayout>
              }
            />

            <Route
              path="/bakery/"
              element={
                <ProtectedLayout>
                  <Bakery />
                </ProtectedLayout>
              }
            />

            <Route
              path="/profile/"
              element={
                <ProtectedLayout>
                  <Profile />
                </ProtectedLayout>
              }
            />

            <Route
              path="/settings/"
              element={
                <ProtectedLayout>
                  <Settings />
                </ProtectedLayout>
              }
            />

            <Route
              path="/quiz/:chapterId/:lessonId"
              element={
                <ProtectedLayout>
                  <Quiz />
                </ProtectedLayout>
              }
            />

            <Route
              path="/chapters/"
              element={
                <ProtectedLayout>
                  <Chapters setChapter={setChapter} selectedChapter={chapter} />
                </ProtectedLayout>
              }
            />

            <Route
              path="/breadex/i/:id"
              element={
                <ProtectedLayout>
                  <BreadexInfo />
                </ProtectedLayout>
              }
            />

            <Route
              path="/breadex/scanner"
              element={
                <ProtectedLayout>
                  <BreadexScanner />
                </ProtectedLayout>
              }
            />

            <Route path="/host-room/:roomId" element={<HostRoom />} />
            <Route path="/join-room/:roomId" element={<JoinRoom />} />
            <Route path="/play-quiz/:roomId" element={<PlayQuiz />} />
          </Routes>
        </Router>
      </UserDataProvider>
    </AuthProvider>
  );
}

export default App;
