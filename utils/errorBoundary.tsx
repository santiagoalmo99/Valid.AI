// utils/errorBoundary.tsx - Smart Error Boundary with Recovery

import React, { Component, ReactNode } from 'react';
import { logger } from '../services/logger';
import { telemetry } from '../services/telemetry';
import { RefreshCw, Home, AlertTriangle } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: (error: Error, reset: () => void) => ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorCount: number;
}

class ErrorBoundary extends Component<Props, State> {
  private errorCountLimit = 3;

  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorCount: 0,
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
      errorCount: 0, // Will be incremented in componentDidCatch
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    logger.error('Error Boundary Caught Error', error, {
      componentStack: errorInfo.componentStack,
    });

    telemetry.trackError(error, {
      componentStack: errorInfo.componentStack,
    });

    this.setState((prev) => ({
      errorCount: prev.errorCount + 1,
    }));
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
    });
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError && this.state.error) {
      // Custom fallback from props
      if (this.props.fallback) {
        return this.props.fallback(this.state.error, this.handleReset);
      }

      // Too many errors → show critical failure UI
      if (this.state.errorCount >= this.errorCountLimit) {
        return (
          <div className="min-h-screen bg-gradient-to-br from-red-900 to-black flex items-center justify-center p-6">
            <div className="max-w-md w-full bg-red-900/20 backdrop-blur-xl border border-red-500/30 rounded-3xl p-8 text-center">
              <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <AlertTriangle size={40} className="text-red-400" />
              </div>
              <h1 className="text-2xl font-bold text-white mb-2">
                Critical Error
              </h1>
              <p className="text-red-200 mb-6">
                La aplicación ha encontrado múltiples errores. Por favor, recarga la página o contacta a soporte.
              </p>
              <button
                onClick={this.handleGoHome}
                className="bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-6 rounded-xl transition-all flex items-center gap-2 mx-auto"
              >
                <Home size={20} />
                Volver al Inicio
              </button>
            </div>
          </div>
        );
      }

      // Default error UI with retry
      return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 to-black flex items-center justify-center p-6">
          <div className="max-w-md w-full bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 text-center">
            <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertTriangle size={40} className="text-red-400" />
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">
              Algo salió mal
            </h1>
            <p className="text-slate-300 mb-4">
              {this.state.error.message || 'Error desconocido'}
            </p>
            <details className="text-left mb-6">
              <summary className="text-slate-400 cursor-pointer hover:text-white">
                Detalles técnicos
              </summary>
              <pre className="text-xs text-red-300 mt-2 p-4 bg-black/30 rounded-lg overflow-auto max-h-40">
                {this.state.error.stack}
              </pre>
            </details>
            <div className="flex gap-3">
              <button
                onClick={this.handleReset}
                className="flex-1 bg-neon hover:bg-neon/80 text-black font-bold py-3 px-6 rounded-xl transition-all flex items-center justify-center gap-2"
              >
                <RefreshCw size={18} />
                Reintentar
              </button>
              <button
                onClick={this.handleGoHome}
                className="flex-1 bg-white/10 hover:bg-white/20 text-white font-bold py-3 px-6 rounded-xl transition-all flex items-center justify-center gap-2"
              >
                <Home size={18} />
                Inicio
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
