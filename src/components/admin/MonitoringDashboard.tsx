'use client';

import { useState, useEffect } from 'react';
import { 
  ChartBarIcon, 
  CpuChipIcon, 
  ServerIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  XCircleIcon
} from '@heroicons/react/24/outline';
import { useLanguage } from '@/contexts/LanguageContext';

interface HealthData {
  status: 'healthy' | 'degraded' | 'unhealthy';
  timestamp: string;
  checks: {
    database: boolean;
    external_apis: boolean;
    disk_space: boolean;
  };
  response_time: number;
  uptime: number;
  version: string;
}

interface MetricsData {
  avgResponseTime: number;
  maxResponseTime: number;
  minResponseTime: number;
  totalRequests: number;
  totalErrors: number;
  avgMemoryUsage: number;
  maxMemoryUsage: number;
}

interface UptimeData {
  status: string;
  uptime: {
    percentage: number;
    seconds: number;
    since: string;
  };
  lastChecked: string;
  responseTime: number;
}

export default function MonitoringDashboard() {
  const { t } = useLanguage();
  const [healthData, setHealthData] = useState<HealthData | null>(null);
  const [metricsData, setMetricsData] = useState<MetricsData | null>(null);
  const [uptimeData, setUptimeData] = useState<UptimeData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchMonitoringData();
    // Refresh every 30 seconds
    const interval = setInterval(fetchMonitoringData, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchMonitoringData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const [healthResponse, metricsResponse, uptimeResponse] = await Promise.all([
        fetch('/api/health'),
        fetch('/api/monitoring/metrics'),
        fetch('/api/monitoring/uptime')
      ]);

      if (healthResponse.ok) {
        const health = await healthResponse.json();
        setHealthData(health);
      }

      if (metricsResponse.ok) {
        const metrics = await metricsResponse.json();
        setMetricsData(metrics.data.aggregated);
      }

      if (uptimeResponse.ok) {
        const uptime = await uptimeResponse.json();
        setUptimeData(uptime.data);
      }
    } catch (error) {
      setError('Failed to fetch monitoring data');
      console.error('Monitoring error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy':
        return <CheckCircleIcon className="w-5 h-5 text-emerald-400" />;
      case 'degraded':
        return <ExclamationTriangleIcon className="w-5 h-5 text-yellow-400" />;
      case 'unhealthy':
        return <XCircleIcon className="w-5 h-5 text-red-400" />;
      default:
        return <ClockIcon className="w-5 h-5 text-slate-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy':
        return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
      case 'degraded':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'unhealthy':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      default:
        return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
    }
  };

  const formatUptime = (seconds: number) => {
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${days}d ${hours}h ${minutes}m`;
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-slate-300">Loading monitoring data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-400 mb-4">
          <XCircleIcon className="w-12 h-12 mx-auto" />
        </div>
        <p className="text-slate-300 mb-4">{error}</p>
        <button
          onClick={fetchMonitoringData}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-emerald-500 rounded-lg flex items-center justify-center">
            <ChartBarIcon className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">System Monitoring</h2>
            <p className="text-slate-400">Real-time system health and performance metrics</p>
          </div>
        </div>
        <button
          onClick={fetchMonitoringData}
          className="bg-slate-700 text-slate-300 px-4 py-2 rounded-lg hover:bg-slate-600 transition-colors"
        >
          Refresh
        </button>
      </div>

      {/* Health Status */}
      {healthData && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className={`rounded-xl border p-6 ${getStatusColor(healthData.status)}`}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">System Status</h3>
              {getStatusIcon(healthData.status)}
            </div>
            <p className="text-2xl font-bold">{healthData.status.toUpperCase()}</p>
            <p className="text-sm opacity-75">
              Response: {healthData.response_time}ms
            </p>
          </div>

          <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
            <div className="flex items-center gap-2 mb-4">
              <ServerIcon className="w-5 h-5 text-blue-400" />
              <h3 className="font-semibold text-white">Database</h3>
            </div>
            <div className="flex items-center gap-2">
              {healthData.checks.database ? (
                <CheckCircleIcon className="w-5 h-5 text-emerald-400" />
              ) : (
                <XCircleIcon className="w-5 h-5 text-red-400" />
              )}
              <span className={healthData.checks.database ? 'text-emerald-400' : 'text-red-400'}>
                {healthData.checks.database ? 'Connected' : 'Disconnected'}
              </span>
            </div>
          </div>

          <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
            <div className="flex items-center gap-2 mb-4">
              <CpuChipIcon className="w-5 h-5 text-purple-400" />
              <h3 className="font-semibold text-white">External APIs</h3>
            </div>
            <div className="flex items-center gap-2">
              {healthData.checks.external_apis ? (
                <CheckCircleIcon className="w-5 h-5 text-emerald-400" />
              ) : (
                <XCircleIcon className="w-5 h-5 text-red-400" />
              )}
              <span className={healthData.checks.external_apis ? 'text-emerald-400' : 'text-red-400'}>
                {healthData.checks.external_apis ? 'Available' : 'Unavailable'}
              </span>
            </div>
          </div>

          <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
            <div className="flex items-center gap-2 mb-4">
              <ClockIcon className="w-5 h-5 text-yellow-400" />
              <h3 className="font-semibold text-white">Version</h3>
            </div>
            <p className="text-2xl font-bold text-white">v{healthData.version}</p>
            <p className="text-sm text-slate-400">
              Uptime: {formatUptime(healthData.uptime / 1000)}
            </p>
          </div>
        </div>
      )}

      {/* Performance Metrics */}
      {metricsData && (
        <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
          <h3 className="text-lg font-semibold text-white mb-6">Performance Metrics (Last Hour)</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-400">{metricsData.avgResponseTime.toFixed(1)}ms</p>
              <p className="text-sm text-slate-400">Avg Response Time</p>
              <p className="text-xs text-slate-500">
                Min: {metricsData.minResponseTime.toFixed(1)}ms | Max: {metricsData.maxResponseTime.toFixed(1)}ms
              </p>
            </div>

            <div className="text-center">
              <p className="text-2xl font-bold text-emerald-400">{metricsData.totalRequests}</p>
              <p className="text-sm text-slate-400">Total Requests</p>
            </div>

            <div className="text-center">
              <p className="text-2xl font-bold text-red-400">{metricsData.totalErrors}</p>
              <p className="text-sm text-slate-400">Total Errors</p>
              <p className="text-xs text-slate-500">
                Error Rate: {metricsData.totalRequests > 0 ? ((metricsData.totalErrors / metricsData.totalRequests) * 100).toFixed(2) : 0}%
              </p>
            </div>

            <div className="text-center">
              <p className="text-2xl font-bold text-purple-400">{formatBytes(metricsData.avgMemoryUsage * 1024 * 1024)}</p>
              <p className="text-sm text-slate-400">Avg Memory Usage</p>
              <p className="text-xs text-slate-500">
                Peak: {formatBytes(metricsData.maxMemoryUsage * 1024 * 1024)}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Uptime Information */}
      {uptimeData && (
        <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
          <h3 className="text-lg font-semibold text-white mb-6">Uptime Information</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-emerald-400">{uptimeData.uptime.percentage}%</p>
              <p className="text-sm text-slate-400">Uptime</p>
            </div>

            <div className="text-center">
              <p className="text-2xl font-bold text-blue-400">{formatUptime(uptimeData.uptime.seconds)}</p>
              <p className="text-sm text-slate-400">Current Uptime</p>
              <p className="text-xs text-slate-500">
                Since: {new Date(uptimeData.uptime.since).toLocaleString()}
              </p>
            </div>

            <div className="text-center">
              <p className="text-2xl font-bold text-yellow-400">{uptimeData.responseTime}ms</p>
              <p className="text-sm text-slate-400">Last Check</p>
              <p className="text-xs text-slate-500">
                {new Date(uptimeData.lastChecked).toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Last Updated */}
      <div className="text-center text-slate-500 text-sm">
        Last updated: {new Date().toLocaleString()}
      </div>
    </div>
  );
}
