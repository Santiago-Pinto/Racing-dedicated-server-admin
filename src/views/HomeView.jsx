import { useNavigate } from 'react-router-dom';
import './HomeView.css';

const HomeView = () => {
  const navigate = useNavigate();

  const handleCareerClick = () => {
    navigate('/career');
  };

  const handleServerSetupClick = () => {
    navigate('/dedicated-server-settings');
  };

  return (
    <div className="home-container">
      <div className="home-header">
        <h1>AMS2 Server Manager</h1>
        <p>Choose your racing experience</p>
      </div>
      
      <div className="cards-container">
        <div 
          className="card career-card"
          onClick={handleCareerClick}
        >
          <div className="card-icon">🏆</div>
          <div className="card-content">
            <h2>Career Mode</h2>
            <p>Experience the thrill of a racing career with progression, championships, and driver development.</p>
            <div className="card-features">
              <span>• Championship Seasons</span>
              <span>• Driver Progression</span>
              <span>• Team Management</span>
            </div>
          </div>
          <div className="card-arrow">→</div>
        </div>

        <div 
          className="card server-card"
          onClick={handleServerSetupClick}
        >
          <div className="card-icon">🖥️</div>
          <div className="card-content">
            <h2>Dedicated Server Setup</h2>
            <p>Configure and manage your dedicated racing server with advanced settings and customization.</p>
            <div className="card-features">
              <span>• Server Configuration</span>
              <span>• Track Rotation</span>
              <span>• Advanced Settings</span>
            </div>
          </div>
          <div className="card-arrow">→</div>
        </div>
      </div>
    </div>
  );
};

export default HomeView; 