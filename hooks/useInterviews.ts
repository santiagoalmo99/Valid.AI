import { useState, useEffect } from 'react';
import { Interview } from '../types';
import { subscribeToInterviews } from '../services/firebase';

export const useInterviews = (activeProjectId: string | undefined) => {
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!activeProjectId) {
       setInterviews([]);
       return;
    }

    setLoading(true);
    const unsubscribe = subscribeToInterviews(activeProjectId, (data) => {
       setInterviews(data);
       setLoading(false);
    });

    return () => unsubscribe();
  }, [activeProjectId]);

  return { interviews, loading };
};
