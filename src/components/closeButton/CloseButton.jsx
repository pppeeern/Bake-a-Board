import { useNavigate } from "react-router-dom";
import "./CloseButton.css";

function CloseButton({ target }) {
  const navigate = useNavigate();

  const handleClose = () => {
    if (!target) {
      window.history.back(); // Go back if no target
    } else {
      navigate(target); // Go to specific path
    }
  };

  return (
    <div id="close_button" onClick={handleClose}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={42}
        height={42}
        viewBox="0 0 820 756.59"
      >
        <ellipse
          className="cls-1"
          cx="404.53"
          cy="378.29"
          rx="404.53"
          ry="378.29"
        />
        <path
          fill="white"
          className="cls-2"
          d="M335.53,325.56c11.68,5.56,22.77,11.74,33.7,18.1s21.58,13,32.07,19.84,20.81,13.84,31,21,20.21,14.49,30.09,22c19.8,14.92,39,30.45,57.85,46.41s37.2,32.4,55.17,49.27,35.56,34.17,52.7,51.92S662,590,678.16,608.8s31.87,38.1,46.9,58.13q11.25,15,21.92,30.69c7.07,10.48,14,21.13,20.33,32.4a17.28,17.28,0,0,1-22.5,24.06c-11.67-5.57-22.76-11.76-33.69-18.11S689.54,723,679,716.14q-31.49-20.46-61.13-42.9t-58-46.29q-28.29-23.88-55.32-49.1T451.75,526.1c-17.18-17.72-34-35.86-50.18-54.62q-12.18-14-23.93-28.54t-23-29.51q-11.26-15-21.94-30.67c-7.08-10.48-14-21.13-20.32-32.41a17.81,17.81,0,0,1,23.18-24.79Z"
          transform="translate(-135.47 -161.71)"
        />
        <path
          fill="white"
          className="cls-2"
          d="M312.35,729.65c6.33-11.28,13.24-21.93,20.32-32.41s14.43-20.66,21.94-30.67,15.2-19.84,23-29.51,15.81-19.19,23.93-28.54c16.21-18.76,33-36.9,50.18-54.62s34.82-34.95,52.86-51.75,36.46-33.18,55.32-49.1,38.15-31.4,58-46.29S658,377.5,679,363.86Q694.8,353.63,711.12,344c10.93-6.35,22-12.54,33.69-18.11A17.28,17.28,0,0,1,767.31,350C761,361.25,754.05,371.9,747,382.38s-14.42,20.67-21.92,30.69q-22.54,30-46.9,58.13t-50.07,54.73q-25.71,26.63-52.7,51.92t-55.17,49.27c-18.83,16-38.05,31.49-57.85,46.41q-14.82,11.22-30.09,22t-31,21q-15.74,10.23-32.07,19.84c-10.93,6.36-22,12.54-33.7,18.1a17.81,17.81,0,0,1-23.18-24.79Z"
          transform="translate(-135.47 -161.71)"
        />
      </svg>
    </div>
  );
}

export default CloseButton;
