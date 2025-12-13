import { useState, useEffect, useCallback } from 'react';
import { UserCredits } from '../types';
import { getUserCredits, spendCredits } from '../services/creditsService';

export const useCredits = (userId: string | undefined) => {
  const [credits, setCredits] = useState<UserCredits | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCredits = useCallback(async () => {
    if (!userId) return;
    
    setLoading(true);
    setError(null);
    try {
      const data = await getUserCredits(userId);
      setCredits(data);
    } catch (e: any) {
      console.error("[useCredits] Failed to load:", e);
      setError("Error cargando créditos");
    } finally {
      setLoading(false);
    }
  }, [userId]);

  const spend = useCallback(async (amount: number, reason: string): Promise<boolean> => {
    if (!userId) return false;
    
    // Optimistic check
    if (credits && credits.available < amount) {
       setError("Créditos insuficientes");
       return false;
    }

    try {
      const success = await spendCredits(userId, amount, reason);
      if (success) {
         // Refresh to be safe
         await fetchCredits();
      }
      return success;
    } catch (e) {
      console.error("[useCredits] Spend failed:", e);
      return false;
    }
  }, [userId, credits, fetchCredits]);

  // Initial load
  useEffect(() => {
    fetchCredits();
  }, [fetchCredits]);

  return { credits, loading, error, refreshCredits: fetchCredits, spend };
};
