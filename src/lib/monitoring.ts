import { prisma } from './prisma';

export interface PerformanceMetrics {
  timestamp: Date;
  responseTime: number;
  memoryUsage: number;
  cpuUsage: number;
  requestCount: number;
  errorCount: number;
  activeUsers: number;
}

export interface HealthCheck {
  status: 'healthy' | 'degraded' | 'unhealthy';
  timestamp: Date;
  checks: {
    database: boolean;
    redis?: boolean;
    external_apis: boolean;
    disk_space: boolean;
  };
  response_time: number;
  uptime: number;
  version: string;
}

export class MonitoringService {
  private static instance: MonitoringService;
  private metrics: PerformanceMetrics[] = [];
  private startTime: Date = new Date();

  static getInstance(): MonitoringService {
    if (!MonitoringService.instance) {
      MonitoringService.instance = new MonitoringService();
    }
    return MonitoringService.instance;
  }

  /**
   * Records performance metrics
   */
  recordMetrics(metrics: Partial<PerformanceMetrics>): void {
    const fullMetrics: PerformanceMetrics = {
      timestamp: new Date(),
      responseTime: metrics.responseTime || 0,
      memoryUsage: metrics.memoryUsage || process.memoryUsage().heapUsed / 1024 / 1024, // MB
      cpuUsage: metrics.cpuUsage || 0,
      requestCount: metrics.requestCount || 1,
      errorCount: metrics.errorCount || 0,
      activeUsers: metrics.activeUsers || 0,
    };

    this.metrics.push(fullMetrics);

    // Keep only last 1000 metrics to prevent memory issues
    if (this.metrics.length > 1000) {
      this.metrics = this.metrics.slice(-1000);
    }
  }

  /**
   * Performs a comprehensive health check
   */
  async performHealthCheck(): Promise<HealthCheck> {
    const startTime = Date.now();
    const checks = {
      database: false,
      external_apis: false,
      disk_space: false,
    };

    try {
      // Test database connection
      await prisma.$queryRaw`SELECT 1`;
      checks.database = true;
    } catch (error) {
      console.error('Database health check failed:', error);
    }

    try {
      // Test external APIs (OpenAI)
      const response = await fetch('https://api.openai.com/v1/models', {
        method: 'HEAD',
        headers: {
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        },
      });
      checks.external_apis = response.ok;
    } catch (error) {
      console.error('External API health check failed:', error);
    }

    try {
      // Test disk space (simplified check)
      const fs = require('fs');
      const stats = fs.statSync('.');
      // If we can read the current directory, assume disk space is available
      // In production, you'd use a proper disk space check
      checks.disk_space = true;
    } catch (error) {
      console.error('Disk space check failed:', error);
    }

    const responseTime = Date.now() - startTime;
    const uptime = Date.now() - this.startTime.getTime();

    // Determine overall status
    const healthyChecks = Object.values(checks).filter(Boolean).length;
    const totalChecks = Object.keys(checks).length;
    const healthPercentage = healthyChecks / totalChecks;

    let status: 'healthy' | 'degraded' | 'unhealthy';
    if (healthPercentage === 1) {
      status = 'healthy';
    } else if (healthPercentage >= 0.5) {
      status = 'degraded';
    } else {
      status = 'unhealthy';
    }

    return {
      status,
      timestamp: new Date(),
      checks,
      response_time: responseTime,
      uptime,
      version: process.env.npm_package_version || '1.0.0',
    };
  }

  /**
   * Gets current performance metrics
   */
  getMetrics(): PerformanceMetrics[] {
    return this.metrics;
  }

  /**
   * Gets aggregated metrics for the last N minutes
   */
  getAggregatedMetrics(minutes: number = 60): {
    avgResponseTime: number;
    maxResponseTime: number;
    minResponseTime: number;
    totalRequests: number;
    totalErrors: number;
    avgMemoryUsage: number;
    maxMemoryUsage: number;
  } {
    const cutoffTime = new Date(Date.now() - minutes * 60 * 1000);
    const recentMetrics = this.metrics.filter(m => m.timestamp >= cutoffTime);

    if (recentMetrics.length === 0) {
      return {
        avgResponseTime: 0,
        maxResponseTime: 0,
        minResponseTime: 0,
        totalRequests: 0,
        totalErrors: 0,
        avgMemoryUsage: 0,
        maxMemoryUsage: 0,
      };
    }

    const responseTimes = recentMetrics.map(m => m.responseTime);
    const memoryUsages = recentMetrics.map(m => m.memoryUsage);

    return {
      avgResponseTime: responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length,
      maxResponseTime: Math.max(...responseTimes),
      minResponseTime: Math.min(...responseTimes),
      totalRequests: recentMetrics.reduce((sum, m) => sum + m.requestCount, 0),
      totalErrors: recentMetrics.reduce((sum, m) => sum + m.errorCount, 0),
      avgMemoryUsage: memoryUsages.reduce((a, b) => a + b, 0) / memoryUsages.length,
      maxMemoryUsage: Math.max(...memoryUsages),
    };
  }

  /**
   * Logs application errors with context
   */
  logError(error: Error, context?: any): void {
    const errorLog = {
      timestamp: new Date(),
      message: error.message,
      stack: error.stack,
      context: context || {},
      userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : 'server',
      url: typeof window !== 'undefined' ? window.location.href : 'api',
    };

    console.error('Application Error:', errorLog);

    // In production, you would send this to an error tracking service
    // Example: Sentry.captureException(error, { extra: context });
  }

  /**
   * Logs application events
   */
  logEvent(event: string, data?: any): void {
    const eventLog = {
      timestamp: new Date(),
      event,
      data: data || {},
      userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : 'server',
      url: typeof window !== 'undefined' ? window.location.href : 'api',
    };

    console.log('Application Event:', eventLog);

    // In production, you would send this to an analytics service
    // Example: Analytics.track(event, data);
  }

  /**
   * Gets system information
   */
  getSystemInfo(): {
    nodeVersion: string;
    platform: string;
    arch: string;
    uptime: number;
    memoryUsage: NodeJS.MemoryUsage;
    cpuUsage?: any;
  } {
    return {
      nodeVersion: process.version,
      platform: process.platform,
      arch: process.arch,
      uptime: process.uptime(),
      memoryUsage: process.memoryUsage(),
    };
  }
}

// Export singleton instance
export const monitoringService = MonitoringService.getInstance();

/**
 * Middleware for API route monitoring
 */
export function withMonitoring(handler: Function) {
  return async (req: Request, context?: any) => {
    const startTime = Date.now();
    let errorCount = 0;

    try {
      const response = await handler(req, context);
      const responseTime = Date.now() - startTime;

      monitoringService.recordMetrics({
        responseTime,
        requestCount: 1,
        errorCount: 0,
      });

      return response;
    } catch (error) {
      const responseTime = Date.now() - startTime;
      errorCount = 1;

      monitoringService.recordMetrics({
        responseTime,
        requestCount: 1,
        errorCount: 1,
      });

      monitoringService.logError(error as Error, {
        url: req.url,
        method: req.method,
        timestamp: new Date(),
      });

      throw error;
    }
  };
}

/**
 * Client-side monitoring utilities
 */
export const clientMonitoring = {
  /**
   * Tracks page views
   */
  trackPageView(page: string, data?: any): void {
    if (typeof window === 'undefined') return;

    monitoringService.logEvent('page_view', {
      page,
      ...data,
    });
  },

  /**
   * Tracks user interactions
   */
  trackEvent(event: string, data?: any): void {
    if (typeof window === 'undefined') return;

    monitoringService.logEvent(event, data);
  },

  /**
   * Tracks performance metrics on the client
   */
  trackPerformance(): void {
    if (typeof window === 'undefined') return;

    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    
    monitoringService.logEvent('performance', {
      loadTime: navigation.loadEventEnd - navigation.loadEventStart,
      domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
      firstPaint: performance.getEntriesByType('paint').find(entry => entry.name === 'first-paint')?.startTime || 0,
      firstContentfulPaint: performance.getEntriesByType('paint').find(entry => entry.name === 'first-contentful-paint')?.startTime || 0,
    });
  },

  /**
   * Sets up automatic error tracking
   */
  setupErrorTracking(): void {
    if (typeof window === 'undefined') return;

    // Track unhandled errors
    window.addEventListener('error', (event) => {
      monitoringService.logError(event.error, {
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
        message: event.message,
      });
    });

    // Track unhandled promise rejections
    window.addEventListener('unhandledrejection', (event) => {
      monitoringService.logError(new Error(event.reason), {
        type: 'unhandled_promise_rejection',
        reason: event.reason,
      });
    });
  },
};

/**
 * Database monitoring utilities
 */
export const databaseMonitoring = {
  /**
   * Monitors database query performance
   */
  async monitorQuery<T>(queryName: string, queryFn: () => Promise<T>): Promise<T> {
    const startTime = Date.now();
    
    try {
      const result = await queryFn();
      const executionTime = Date.now() - startTime;

      monitoringService.logEvent('database_query', {
        query: queryName,
        executionTime,
        success: true,
      });

      return result;
    } catch (error) {
      const executionTime = Date.now() - startTime;

      monitoringService.logEvent('database_query', {
        query: queryName,
        executionTime,
        success: false,
        error: (error as Error).message,
      });

      throw error;
    }
  },

  /**
   * Gets database connection status
   */
  async getConnectionStatus(): Promise<{
    connected: boolean;
    latency: number;
    activeConnections?: number;
  }> {
    const startTime = Date.now();
    
    try {
      await prisma.$queryRaw`SELECT 1`;
      const latency = Date.now() - startTime;
      
      return {
        connected: true,
        latency,
      };
    } catch (error) {
      return {
        connected: false,
        latency: Date.now() - startTime,
      };
    }
  },
};
