import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

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

import "./MainLayout.css";
import "./App.css";

function App() {
  return (
    <Router>
      <section className="mainLayout">
        <SideBar />
        <div id="content">
          <Routes>
            <Route path="/welcome/" element={<Account />} />

            {/* Navigation */}
            <Route path="/" element={<Learn />} />
            <Route path="/breadex/" element={<Breadex />} />
            <Route path="/bakery/" element={<Bakery />} />
            <Route path="/profile/" element={<Profile />} />
            <Route path="/settings/" element={<Settings />} />

            <Route path="/quiz/" element={<Quiz />} />
            <Route path="/chapters/" element={<Chapters />} />
            <Route path="/breadex/i/:id" element={<BreadexInfo />} />
          </Routes>
        </div>
      </section>
    </Router>
  );
}

export default App;
