import { useState, useEffect } from 'react';
import { apiGet, apiPost } from '../utils/api';

export function useSubmissions() {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchSubmissions = async () => {
    try {
      setError('');
      setLoading(true);
      const data = await apiGet('/submissions');
      setSubmissions(Array.isArray(data) ? data : (Array.isArray(data?.submissions) ? data.submissions : []));
    } catch (err) {
      setError(err.message || 'Could not load submissions.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubmissions();
  }, []);

  return { submissions, loading, error, refetch: fetchSubmissions };
}

export function useSubmitProject() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const submitProject = async (payload) => {
    try {
      setLoading(true);
      setError('');
      await apiPost('/submissions', payload);
      setSuccess(true);
      return true;
    } catch (err) {
      setError(err.message || 'Submission failed. Please check your details and try again.');
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { submitProject, loading, error, success, setSuccess };
}
