import { useNavigate } from 'react-router-dom';
import './CareerView.css';

const CareerView = () => {
  const navigate = useNavigate();

  const handleBackToHome = () => {
    navigate('/');
  };

  return (
    <div className="career-container">
      <div className="career-header">
        <button onClick={handleBackToHome} className="back-button">
          ← Back to Home
        </button>
        <h1>Career Mode</h1>
      </div>
      
      <div className="career-content">
        {/* Empty content area for future development */}
      </div>
    </div>
  );
};

export default CareerView; 