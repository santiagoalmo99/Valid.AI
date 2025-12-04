// services/apiQueue.ts - API Request Queue with Rate Limiting
// Prevents API saturation by queuing requests with delays

type QueuedRequest<T> = {
  fn: () => Promise<T>;
  resolve: (value: T) => void;
  reject: (error: any) => void;
};

export class APIQueue {
  private static instance: APIQueue;
  private queue: QueuedRequest<any>[] = [];
  private processing = false;
  private minDelay = 2000; // 2s between requests
  private lastRequestTime = 0;

  private constructor() {}

  static getInstance(): APIQueue {
    if (!APIQueue.instance) {
      APIQueue.instance = new APIQueue();
    }
    return APIQueue.instance;
  }

  /**
   * Add a request to the queue
   * @param fn The async function to execute
   * @returns Promise that resolves with the function's result
   */
  async add<T>(fn: () => Promise<T>): Promise<T> {
    return new Promise((resolve, reject) => {
      this.queue.push({ fn, resolve, reject });
      console.log(`📋 [APIQueue] Added request. Queue size: ${this.queue.length}`);
      this.process();
    });
  }

  /**
   * Process the queue
   */
  private async process(): Promise<void> {
    if (this.processing || this.queue.length === 0) return;
    
    this.processing = true;
    
    while (this.queue.length > 0) {
      const request = this.queue.shift()!;
      
      // Enforce minimum delay between requests
      const timeSinceLastRequest = Date.now() - this.lastRequestTime;
      if (timeSinceLastRequest < this.minDelay) {
        const waitTime = this.minDelay - timeSinceLastRequest;
        console.log(`⏳ [APIQueue] Waiting ${waitTime}ms before next request...`);
        await new Promise(r => setTimeout(r, waitTime));
      }
      
      try {
        console.log(`🚀 [APIQueue] Executing request. Remaining: ${this.queue.length}`);
        const result = await request.fn();
        this.lastRequestTime = Date.now();
        request.resolve(result);
      } catch (err) {
        request.reject(err);
      }
    }
    
    this.processing = false;
    console.log('✅ [APIQueue] Queue empty');
  }

  /**
   * Get current queue size
   */
  getQueueSize(): number {
    return this.queue.length;
  }

  /**
   * Clear all pending requests
   */
  clear(): void {
    this.queue.forEach(req => {
      req.reject(new Error('Queue cleared'));
    });
    this.queue = [];
    console.log('🗑️ [APIQueue] Cleared all pending requests');
  }

  /**
   * Set minimum delay between requests
   */
  setMinDelay(ms: number): void {
    this.minDelay = ms;
    console.log(`⚙️ [APIQueue] Min delay set to ${ms}ms`);
  }
}

export const apiQueue = APIQueue.getInstance();
