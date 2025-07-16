import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState } from "react";

import SideBar from "./components/sidebar/SideBar";

import Account from "./pages/Account/Account";

import Learn from "./pages/Learn/Learn";
import Breadex from "./pages/Breadex/Breadex";
import Bakery from "./pages/Bakery/Bakery";
import Profile from "./pages/Profile/Profile";
import Settings from "./pages/Settings/Setting";

import Quiz from "./pages/Quiz/Quiz";
import Chapters from "./pages/Learn/chaptersMenu/ChaptersMenu";
import BreadexInfo from "./pages/Breadex/breadexInfo/BreadexInfo";
import BreadexScanner from "./pages/Breadex/breadexScanner/BreadexScanner";

import { chapterData } from "./pages/Learn/data/chapterData";

import "./MainLayout.css";
import "./App.css";

function App() {
  const [chapter, setChapter] = useState(() => {
    const lastUnlocked = [...chapterData].reverse().find((c) => c.isUnlocked);
    return lastUnlocked ? lastUnlocked : chapterData[0];
  });

  return (
    <Router>
      <section className="mainLayout">
        <SideBar />
        <div id="content">
          <Routes>
            <Route path="/welcome/" element={<Account />} />

            {/* Navigation */}
            <Route path="/" element={<Learn chapter={chapter} />} />
            <Route path="/breadex/" element={<Breadex />} />
            <Route path="/bakery/" element={<Bakery />} />
            <Route path="/profile/" element={<Profile />} />
            <Route path="/settings/" element={<Settings />} />

            <Route path="/quiz/" element={<Quiz />} />
            <Route
              path="/chapters/"
              element={
                <Chapters setChapter={setChapter} selectedChapter={chapter} />
              }
            />
            <Route path="/breadex/i/:id" element={<BreadexInfo />} />
            <Route path="/breadex/scanner" element={<BreadexScanner />} />
          </Routes>
        </div>
      </section>
    </Router>
  );
}

export default App;
