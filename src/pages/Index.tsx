
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Index = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // This page is now handled by the App component
    // Redirect to root if somehow accessed
    navigate('/');
  }, [navigate]);

  return null;
};

export default Index;
