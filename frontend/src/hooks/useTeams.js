import { useState, useEffect } from 'react';
import { apiGet, apiPost } from '../utils/api';

export function useTeams() {
  const [team, setTeam] = useState(null);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchMyTeam = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await apiGet('/teams/my');
      const nextTeam = data?.team || null;
      if (nextTeam) {
        setTeam(nextTeam);
        setMembers(nextTeam.members || []);
      } else {
        setTeam(null);
        setMembers([]);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyTeam();
  }, []);

  return { team, members, loading, error, refetch: fetchMyTeam };
}

export function useCreateTeam() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [teamCode, setTeamCode] = useState('');

  const createTeam = async (form) => {
    try {
      setLoading(true);
      setError('');
      const data = await apiPost('/teams', { 
        team_name: form.name, 
        event_id: parseInt(form.hackathon, 10) 
      });
      setTeamCode(data?.team_code || data?.team?.team_code || 'HACK-NEW');
      setSuccess(true);
      return true;
    } catch (err) {
      setError(err.message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { createTeam, loading, error, success, teamCode };
}

export function useJoinTeam() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const joinTeam = async (code) => {
    try {
      setError('');
      setLoading(true);
      await apiPost('/teams/join', { team_code: code });
      setSuccess(true);
      return true;
    } catch (err) {
      setError(err.message || 'Squad not found. Verify the decryption key.');
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { joinTeam, loading, error, success };
}
