import { logger } from './logger';

/**
 * StateManager
 * Handles optimistic UI updates and ensures data consistency with rollbacks.
 */
export class StateManager {
  private static instance: StateManager;

  private constructor() {}

  static getInstance(): StateManager {
    if (!StateManager.instance) {
      StateManager.instance = new StateManager();
    }
    return StateManager.instance;
  }

  /**
   * Executes an operation with optimistic UI update and automatic rollback on failure.
   * 
   * @param localUpdate Function to update the local state immediately.
   * @param remoteOperation Function to perform the remote operation (e.g., Firebase call).
   * @param rollback Function to revert the local state if the remote operation fails.
   * @param context Description of the operation for logging.
   */
  async executeOptimistic<T>(
    localUpdate: () => void,
    remoteOperation: () => Promise<T>,
    rollback: () => void,
    context: string
  ): Promise<T | null> {
    const startTime = Date.now();
    
    try {
      // 1. Apply local change immediately (Optimistic UI)
      logger.info(`[State] Starting optimistic operation: ${context}`);
      localUpdate();
      
      // 2. Perform remote operation
      const result = await remoteOperation();
      
      // 3. Confirm success
      const duration = Date.now() - startTime;
      logger.info(`[State] Operation '${context}' synced successfully in ${duration}ms`);
      
      return result;
    } catch (error) {
      // 4. Rollback on failure
      logger.error(`[State] Operation '${context}' failed, rolling back. Error:`, error as Error);
      rollback();
      throw error; // Re-throw so the UI can display an error notification
    }
  }
}

export const stateManager = StateManager.getInstance();
