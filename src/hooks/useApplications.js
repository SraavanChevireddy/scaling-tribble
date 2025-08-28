import { useState, useEffect } from 'react';

const useApplications = (baseUrl = 'http://localhost:5176') => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch(`${baseUrl}/waiver-filters`);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        setApplications(data.filters?.applications || ['app1', 'app2', 'app3']);
        
      } catch (err) {
        console.error('Failed to fetch applications:', err);
        setError(err.message);
        // Fallback data
        setApplications(['app1', 'app2', 'app3']);
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, [baseUrl]);

  return { applications, loading, error };
};

export default useApplications;