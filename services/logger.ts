// services/logger.ts - Structured Logging Service

export enum LogLevel {
  DEBUG = 'DEBUG',
  INFO = 'INFO',
  WARN = 'WARN',
  ERROR = 'ERROR',
}

interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  correlationId?: string;
  userId?: string;
  context?: Record<string, any>;
  error?: Error;
}

class Logger {
  private correlationId: string | null = null;
  private userId: string | null = null;
  private isDevelopment = import.meta.env.DEV;

  setCorrelationId(id: string) {
    this.correlationId = id;
  }

  setUserId(userId: string) {
    this.userId = userId;
  }

  private log(level: LogLevel, message: string, context?: Record<string, any>, error?: Error) {
    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      correlationId: this.correlationId || undefined,
      userId: this.userId || undefined,
      context,
      error,
    };

    // Console output (development)
    if (this.isDevelopment) {
      const emoji = {
        [LogLevel.DEBUG]: '🐛',
        [LogLevel.INFO]: 'ℹ️',
        [LogLevel.WARN]: '⚠️',
        [LogLevel.ERROR]: '❌',
      }[level];

      console.log(
        `${emoji} [${level}] ${message}`,
        context ? context : '',
        error ? error : ''
      );
    }

    // TODO: Send to analytics service (Google Analytics, LogRocket, Sentry)
    // if (level === LogLevel.ERROR) {
    //   sendToErrorTracking(entry);
    // }
  }

  debug(message: string, context?: Record<string, any>) {
    this.log(LogLevel.DEBUG, message, context);
  }

  info(message: string, context?: Record<string, any>) {
    this.log(LogLevel.INFO, message, context);
  }

  warn(message: string, context?: Record<string, any>) {
    this.log(LogLevel.WARN, message, context);
  }

  error(message: string, error?: Error, context?: Record<string, any>) {
    this.log(LogLevel.ERROR, message, context, error);
  }

  // Performance logging
  startTimer(label: string) {
    const start = performance.now();
    return () => {
      const duration = performance.now() - start;
      this.info(`⏱️ ${label}`, { durationMs: duration.toFixed(2) });
    };
  }
}

export const logger = new Logger();
