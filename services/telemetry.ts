// services/telemetry.ts - Analytics & Performance Tracking

import { logger } from './logger';

interface TelemetryEvent {
  category: string;
  action: string;
  label?: string;
  value?: number;
  metadata?: Record<string, any>;
}

class TelemetryService {
  private isDevelopment = import.meta.env.DEV;

  // Track user actions
  trackEvent(event: TelemetryEvent) {
    logger.debug('📊 Telemetry Event', event);

    // TODO: Send to Google Analytics, Mixpanel, Amplitude, etc.
    // if (window.gtag) {
    //   window.gtag('event', event.action, {
    //     event_category: event.category,
    //     event_label: event.label,
    //     value: event.value,
    //   });
    // }
  }

  // Track page views
  trackPageView(pageName: string, metadata?: Record<string, any>) {
    this.trackEvent({
      category: 'Navigation',
      action: 'page_view',
      label: pageName,
      metadata,
    });
  }

  // Track errors
  trackError(error: Error, context?: Record<string, any>) {
    this.trackEvent({
      category: 'Error',
      action: 'error_occurred',
      label: error.message,
      metadata: {
        ...context,
        stack: error.stack,
      },
    });
  }

  // Track performance metrics
  trackPerformance(metricName: string, durationMs: number, metadata?: Record<string, any>) {
    this.trackEvent({
      category: 'Performance',
      action: metricName,
      value: durationMs,
      metadata,
    });
  }

  // Track user flows
  trackFlowStart(flowName: string) {
    this.trackEvent({
      category: 'User Flow',
      action: `${flowName}_started`,
    });
  }

  trackFlowComplete(flowName: string, durationMs?: number) {
    this.trackEvent({
      category: 'User Flow',
      action: `${flowName}_completed`,
      value: durationMs,
    });
  }

  trackFlowDropOff(flowName: string, step: string) {
    this.trackEvent({
      category: 'User Flow',
      action: `${flowName}_dropped_off`,
      label: step,
    });
  }
}

export const telemetry = new TelemetryService();
