import LogoutButton from "../../components/logoutButton/LogoutButton";
import { useAuth } from "../Account/AuthContext";
import { useUserData } from "../../services/UserDataContext";
import "./Profile.css";
import LoadingSpinner from "../../components/loadingSpinner/LoadingSpinner";
import { User, Star, Cookie, Calendar, Award, Zap } from 'lucide-react';

function Profile() {
  const { user } = useAuth();
  const { userData, loading } = useUserData();

  const displayName = user?.displayName || user?.email?.split("@")[0] || "User";

  return (
    <div className="wrapper-m profile-wrapper">
      <div className="profile-dashboard">
        <div className="profile-hero-panel">
          <div className="avatar-pedestal">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="100%"
              height="100%"
              viewBox="0 0 680 860"
              className="avatar-svg"
            >
              <path
                className="cls-1"
                d="M858.46,421.33A75.12,75.12,0,0,0,805.83,400H663.69c-4.77,0-6.74-4.23-4.54-6.63a163.25,163.25,0,0,0,50.21-114.77C711,186.9,635.05,110.79,541.22,110.14c-147.86-6.09-228.15,185.54-120.32,283.3,2.13,2.41.15,6.58-4.59,6.58H274.17c-64.44-2.18-99.48,81.25-52.63,124.22,27.25,34.63,128.88,17.55,167,21.3a10.18,10.18,0,0,1,10,12.06L337.42,885c-15.84,94.35,127.15,120,146.44,26.14l30.7-141.49c1.67-8.93,6.21-30.21,25.44-30.21s23.77,21.28,25.44,30.21l30.64,141.49c15.26,85.6,148.28,73.85,147.66-13A72.16,72.16,0,0,0,742.52,885L681.35,557.6a10.18,10.18,0,0,1,10-12.06H805.83C870.25,547.83,905.32,464.21,858.46,421.33ZM562.41,641.59c-3.18,29.22-47.65,24.8-44.82-4.59C520.77,607.78,565.23,612.21,562.41,641.59Zm0-87.9c-3.18,29.22-47.65,24.79-44.82-4.6C520.77,519.88,565.23,524.3,562.41,553.69Zm0-87.91c-3.18,29.22-47.65,24.8-44.82-4.59C520.77,432,565.23,436.4,562.41,465.78Z"
                transform="translate(-200 -110)"
                fill="var(--svg-color)"
              />
            </svg>
          </div>
        </div>

        <div className="profile-details-panel">
          
          <div className="details-header">
            <div className="user-identity">
               <div className="user-icon-bg">
                 <User size={24} color="var(--primary)" />
               </div>
               <h1>{displayName}</h1>
            </div>
            <LogoutButton />
          </div>
          <div className="stats-grid">
            
            <div className="stat-card level-card">
              <div className="card-top">
                 <div className="icon-wrapper">
                    <Award size={20} className="icon-gold" />
                 </div>
                 <span className="card-label">CURRENT LEVEL</span>
              </div>
              <div className="level-display">
                 <span className="big-number">{userData?.level || 1}</span>
                 <div className="level-progress-container">
                    <div className="progress-bar-bg">
                       <div 
                         className="progress-bar-fill"
                         style={{ width: `${(userData?.exp || 0) % 100}%` }}
                       ></div>
                    </div>
                    <div className="progress-text">
                       <span>{userData?.exp || 0} EXP</span>
                       <span>Next Level</span>
                    </div>
                 </div>
              </div>
            </div>

            <div className="stat-card cookie-card">
               <div className="card-top">
                  <div className="icon-wrapper">
                     <Cookie size={20} className="icon-brown" />
                  </div>
                  <span className="card-label">COOKIES BALANCE</span>
               </div>
               <div className="cookie-display">
                  <span className="big-number">{userData?.cookies || 0}</span>
                  <span className="currency-label">Cookies</span>
               </div>
            </div>

            <div className="stat-card info-card">
               <div className="card-top">
                  <div className="icon-wrapper">
                     <Calendar size={20} className="icon-blue" />
                  </div>
                  <span className="card-label">JOIN DATE</span>
               </div>
               <div className="info-display">
                  <span className="date-text">
                    {userData?.createdAt
                        ? new Date(userData.createdAt.seconds * 1000).toLocaleDateString()
                        : "Unknown"}
                  </span>
               </div>
            </div>

          </div>
          
        </div>
      </div>
    </div>
  );
}

export default Profile;

