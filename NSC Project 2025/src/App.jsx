import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import SideBar from "./components/sidebar/SideBar";
import Learn from './pages/Learn/Learn';
import Breadex from './pages/Breadex/Breadex';
import Bakery from './pages/Bakery/Bakery';
import Profile from './pages/Profile/Profile';

import "./MainLayout.css";
import "./App.css";

function App() {
  return (
    <Router>
      <section className="mainLayout">
        <SideBar />
        <div id="content">
          <Routes>
            <Route path="/" element={<Learn />} />
            <Route path="/breadex/" element={<Breadex />} />
            <Route path="/bakery/" element={<Bakery />} />
            <Route path="/profile/" element={<Profile />} />
          </Routes>
        </div>
      </section>
    </Router>
  );
}

export default App;