/**
 * Credits Service - Manages user credits for premium features
 * Uses Firebase Firestore for storage, localStorage as fallback
 */

import { doc, getDoc, setDoc, updateDoc, increment } from 'firebase/firestore';
import { db } from './firebase';
import { UserCredits, INITIAL_CREDITS } from '../types';

const CREDITS_COLLECTION = 'user_credits';
const LOCAL_STORAGE_KEY = 'validai_credits';

// ============ CORE FUNCTIONS ============

/**
 * Get or create user credits
 * New users receive INITIAL_CREDITS (100) automatically
 */
export async function getUserCredits(userId: string): Promise<UserCredits> {
  try {
    const docRef = doc(db, CREDITS_COLLECTION, userId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      const credits = docSnap.data() as UserCredits;
      // Also cache locally
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(credits));
      return credits;
    }
    
    // New user - create with initial credits
    const newCredits: UserCredits = {
      userId,
      available: INITIAL_CREDITS,
      lifetime: INITIAL_CREDITS,
      used: 0,
      createdAt: new Date().toISOString(),
      lastUpdated: new Date().toISOString(),
    };
    
    await setDoc(docRef, newCredits);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newCredits));
    
    console.log('🎁 [Credits] New user initialized with', INITIAL_CREDITS, 'credits');
    return newCredits;
    
  } catch (error: any) {
    // Handle Permission denied specifically
    if (error.code === 'permission-denied') {
        console.warn('⚠️ [Credits] Permission denied (Firebase Rules). Returning 0 credits.');
        return {
            userId,
            available: 0,
            lifetime: 0,
            used: 0,
            createdAt: new Date().toISOString(),
            lastUpdated: new Date().toISOString(),
        };
    }

    console.error('❌ [Credits] Error fetching credits:', error);
    
    // Fallback to localStorage
    const cached = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (cached) {
      return JSON.parse(cached);
    }
    
    // Return default for offline/error scenarios
    return {
      userId,
      available: INITIAL_CREDITS, // Assume default for connectivity errors? Or 0? Let's assume INITIAL if error is unknown.
      lifetime: INITIAL_CREDITS,
      used: 0,
      createdAt: new Date().toISOString(),
      lastUpdated: new Date().toISOString(),
    };
  }
}

/**
 * Spend credits for a feature (like generating a report)
 * Returns true if successful, false if insufficient credits
 */
export async function spendCredits(userId: string, amount: number, reason: string): Promise<boolean> {
  try {
    const credits = await getUserCredits(userId);
    
    if (credits.available < amount) {
      console.warn('⚠️ [Credits] Insufficient credits:', credits.available, 'needed:', amount);
      return false;
    }
    
    const docRef = doc(db, CREDITS_COLLECTION, userId);
    await updateDoc(docRef, {
      available: increment(-amount),
      used: increment(amount),
      lastUpdated: new Date().toISOString(),
    });
    
    // Update local cache
    const updated = {
      ...credits,
      available: credits.available - amount,
      used: credits.used + amount,
      lastUpdated: new Date().toISOString(),
    };
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
    
    console.log('💳 [Credits] Spent', amount, 'credits for:', reason);
    console.log('💰 [Credits] Remaining:', updated.available);
    
    return true;
    
  } catch (error) {
    console.error('❌ [Credits] Error spending credits:', error);
    
    // Optimistic update for offline scenarios
    const cached = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (cached) {
      const credits = JSON.parse(cached) as UserCredits;
      if (credits.available >= amount) {
        credits.available -= amount;
        credits.used += amount;
        credits.lastUpdated = new Date().toISOString();
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(credits));
        return true;
      }
    }
    
    return false;
  }
}

/**
 * Add credits to a user (for admin use or future purchases)
 */
export async function addCredits(userId: string, amount: number, reason: string): Promise<boolean> {
  try {
    const docRef = doc(db, CREDITS_COLLECTION, userId);
    await updateDoc(docRef, {
      available: increment(amount),
      lifetime: increment(amount),
      lastUpdated: new Date().toISOString(),
    });
    
    // Update local cache
    const cached = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (cached) {
      const credits = JSON.parse(cached) as UserCredits;
      credits.available += amount;
      credits.lifetime += amount;
      credits.lastUpdated = new Date().toISOString();
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(credits));
    }
    
    console.log('➕ [Credits] Added', amount, 'credits for:', reason);
    return true;
    
  } catch (error) {
    console.error('❌ [Credits] Error adding credits:', error);
    return false;
  }
}

/**
 * Check if user has enough credits
 */
export async function hasEnoughCredits(userId: string, amount: number): Promise<boolean> {
  const credits = await getUserCredits(userId);
  return credits.available >= amount;
}

/**
 * Get credits from local cache (for quick UI display)
 */
export function getCachedCredits(): UserCredits | null {
  const cached = localStorage.getItem(LOCAL_STORAGE_KEY);
  return cached ? JSON.parse(cached) : null;
}

/**
 * Clear local credits cache (for logout)
 */
export function clearCreditsCache(): void {
  localStorage.removeItem(LOCAL_STORAGE_KEY);
}
