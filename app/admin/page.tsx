'use client';

import { useState, useEffect, useCallback } from 'react';

// Types
interface MarketingPlanSummary {
  id: string;
  company_domain: string;
  email: string;
  user_language: string;
  created_at: string;
}

interface PlansResponse {
  plans: MarketingPlanSummary[];
  total: number;
  limit: number;
  offset: number;
}

interface StatsResponse {
  total_plans: number;
  unique_emails: number;
  plans_today: number;
  by_language: Record<string, number>;
  plans_per_day: { date: string; count: number }[];
  api_stats: {
    total_calls: number;
    calls_today: number;
    total_errors: number;
  } | null;
}

interface ApiLog {
  id: string;
  timestamp: string | null;
  endpoint: string | null;
  method: string | null;
  domain: string | null;
  api_key_hash: string | null;
  status_code: number | null;
  response_time_ms: number | null;
  error_message: string | null;
}

interface LogsResponse {
  logs: ApiLog[];
  total: number;
  message?: string;
}

type TabType = 'stats' | 'plans' | 'logs' | 'api-docs';

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>('stats');
  const [storedPassword, setStoredPassword] = useState('');

  // Check if already authenticated
  useEffect(() => {
    const stored = sessionStorage.getItem('admin_auth');
    const pwd = sessionStorage.getItem('admin_pwd');
    if (stored === 'true' && pwd) {
      setIsAuthenticated(true);
      setStoredPassword(pwd);
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });

      if (response.ok) {
        setIsAuthenticated(true);
        setStoredPassword(password);
        sessionStorage.setItem('admin_auth', 'true');
        sessionStorage.setItem('admin_pwd', password);
      } else {
        setError('Invalid password');
      }
    } catch {
      setError('Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setStoredPassword('');
    sessionStorage.removeItem('admin_auth');
    sessionStorage.removeItem('admin_pwd');
  };

  if (!isAuthenticated) {
    return (
      <LoginForm
        password={password}
        setPassword={setPassword}
        error={error}
        loading={loading}
        onSubmit={handleLogin}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#0B996E] rounded-lg flex items-center justify-center text-white font-bold text-lg">
                B
              </div>
              <span className="font-semibold text-gray-900 text-lg">Marketing Plan Generator</span>
              <span className="px-2 py-1 bg-[#0B996E] text-white text-xs font-medium rounded">ADMIN</span>
            </div>
            <button
              onClick={handleLogout}
              className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Tabs */}
      <div className="bg-white border-b border-gray-200">
        <div className="px-6 lg:px-8">
          <nav className="flex gap-8">
            <TabButton active={activeTab === 'stats'} onClick={() => setActiveTab('stats')} icon="📊">
              Stats
            </TabButton>
            <TabButton active={activeTab === 'plans'} onClick={() => setActiveTab('plans')} icon="📋">
              Plans
            </TabButton>
            <TabButton active={activeTab === 'logs'} onClick={() => setActiveTab('logs')} icon="📝">
              API Logs
            </TabButton>
            <TabButton active={activeTab === 'api-docs'} onClick={() => setActiveTab('api-docs')} icon="📖">
              API Docs
            </TabButton>
          </nav>
        </div>
      </div>

      {/* Content */}
      <main className="px-6 lg:px-8 py-8 flex-1">
        {activeTab === 'stats' && <StatsTab password={storedPassword} />}
        {activeTab === 'plans' && <PlansListTab password={storedPassword} />}
        {activeTab === 'logs' && <LogsTab password={storedPassword} />}
        {activeTab === 'api-docs' && <ApiDocsTab />}
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white mt-auto">
        <div className="px-6 lg:px-8 py-4">
          <div className="flex justify-between text-sm text-gray-500">
            <span>Marketing Plan Generator Admin</span>
            <span>{new Date().toLocaleString()}</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

// Login Form Component
function LoginForm({
  password,
  setPassword,
  error,
  loading,
  onSubmit,
}: {
  password: string;
  setPassword: (p: string) => void;
  error: string;
  loading: boolean;
  onSubmit: (e: React.FormEvent) => void;
}) {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-[#0B996E] rounded-lg flex items-center justify-center text-white font-bold text-xl">
            B
          </div>
          <div>
            <h1 className="font-semibold text-gray-900 text-xl">Admin Access</h1>
            <p className="text-sm text-gray-500">Marketing Plan Generator</p>
          </div>
        </div>

        <form onSubmit={onSubmit}>
          <div className="mb-4">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0B996E] focus:border-transparent outline-none transition-all"
              placeholder="Enter admin password"
              autoFocus
              disabled={loading}
            />
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">{error}</div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-[#0B996E] text-white font-medium rounded-lg hover:bg-[#098a62] transition-colors disabled:opacity-50"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
}

// Tab Button Component
function TabButton({
  active,
  onClick,
  icon,
  children,
}: {
  active: boolean;
  onClick: () => void;
  icon: string;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 py-4 border-b-2 transition-colors ${
        active ? 'border-[#0B996E] text-[#0B996E]' : 'border-transparent text-gray-500 hover:text-gray-700'
      }`}
    >
      <span>{icon}</span>
      <span className="font-medium">{children}</span>
    </button>
  );
}

// Stats Tab
function StatsTab({ password }: { password: string }) {
  const [stats, setStats] = useState<StatsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchStats = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/admin/stats', {
        headers: { 'x-admin-password': password },
      });
      if (response.ok) {
        const data = await response.json();
        setStats(data);
        setLastUpdated(new Date());
      } else {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        setError(errorData.error || 'Failed to fetch stats');
      }
    } catch (err) {
      console.error('Failed to fetch stats:', err);
      setError('Network error - failed to fetch stats');
    } finally {
      setLoading(false);
    }
  }, [password]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  if (loading && !stats) {
    return (
      <div className="text-center py-16">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#0B996E] mb-4"></div>
        <p className="text-gray-500">Loading statistics...</p>
      </div>
    );
  }

  if (error && !stats) {
    return (
      <div className="text-center py-16">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
          <p className="text-red-700 mb-4">{error}</p>
          <button
            onClick={fetchStats}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!stats) {
    return <div className="text-center py-8 text-gray-500">No data available</div>;
  }

  const maxCount = Math.max(...stats.plans_per_day.map((d) => d.count), 1);
  const totalLast30Days = stats.plans_per_day.reduce((acc, d) => acc + d.count, 0);
  const avgPerDay = totalLast30Days > 0 ? (totalLast30Days / 30).toFixed(1) : '0';

  // Calculate success rate for API
  const apiSuccessRate =
    stats.api_stats && stats.api_stats.total_calls > 0
      ? (((stats.api_stats.total_calls - stats.api_stats.total_errors) / stats.api_stats.total_calls) * 100).toFixed(1)
      : null;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Dashboard</h2>
          <p className="text-sm text-gray-500">
            Overview of marketing plan generation
            {lastUpdated && (
              <span className="ml-2 text-gray-400">
                • Updated {lastUpdated.toLocaleTimeString()}
              </span>
            )}
          </p>
        </div>
        <button
          onClick={fetchStats}
          disabled={loading}
          className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2 disabled:opacity-50"
        >
          <svg
            className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
          Refresh
        </button>
      </div>

      {error && (
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg text-amber-800">
          {error} - Showing cached data
        </div>
      )}

      {/* Main Stats - Plans */}
      <div>
        <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-3">Marketing Plans</h3>
        <div className="grid grid-cols-4 gap-4">
          <StatCard label="Total Plans" value={stats.total_plans} color="gray" />
          <StatCard label="Unique Emails" value={stats.unique_emails} color="blue" />
          <StatCard label="Plans Today" value={stats.plans_today} color="green" />
          <StatCard
            label="Last 30 Days"
            value={totalLast30Days}
            subValue={`~${avgPerDay}/day avg`}
            color="purple"
          />
        </div>
      </div>

      {/* API Stats */}
      <div>
        <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-3">API Usage</h3>
        <div className="grid grid-cols-4 gap-4">
          <StatCard
            label="Total API Calls"
            value={stats.api_stats?.total_calls || 0}
            color="gray"
          />
          <StatCard
            label="API Calls Today"
            value={stats.api_stats?.calls_today || 0}
            color="blue"
          />
          <StatCard
            label="Total Errors"
            value={stats.api_stats?.total_errors || 0}
            color="red"
          />
          <StatCard
            label="Success Rate"
            value={apiSuccessRate ? `${apiSuccessRate}%` : 'N/A'}
            subValue={stats.api_stats ? 'all time' : 'No API logs'}
            color="green"
            isPercentage
          />
        </div>
      </div>

      {/* Chart */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-medium text-gray-900">Plans Created (Last 30 Days)</h3>
          <span className="text-sm text-gray-500">{totalLast30Days} total</span>
        </div>
        <div className="h-48 flex items-end gap-1">
          {stats.plans_per_day.map((day, i) => (
            <div key={i} className="flex-1 flex flex-col items-center group relative">
              <div
                className="w-full bg-[#0B996E] rounded-t transition-all hover:bg-[#098a62] cursor-pointer"
                style={{ height: `${(day.count / maxCount) * 100}%`, minHeight: day.count > 0 ? '4px' : '0' }}
              />
              {/* Tooltip */}
              <div className="absolute bottom-full mb-2 hidden group-hover:block bg-gray-900 text-white text-xs rounded px-2 py-1 whitespace-nowrap z-10">
                {day.date}: {day.count} plan{day.count !== 1 ? 's' : ''}
              </div>
            </div>
          ))}
        </div>
        <div className="flex justify-between mt-2 text-xs text-gray-400">
          <span>{stats.plans_per_day[0]?.date}</span>
          <span>{stats.plans_per_day[stats.plans_per_day.length - 1]?.date}</span>
        </div>
      </div>

      {/* Language Distribution */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="font-medium text-gray-900 mb-4">Plans by Language</h3>
        {Object.keys(stats.by_language).length === 0 ? (
          <p className="text-gray-500 text-center py-4">No plans generated yet</p>
        ) : (
          <div className="grid grid-cols-4 gap-4">
            {['en', 'fr', 'de', 'es'].map((lang) => (
              <div key={lang} className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-2xl mb-1">{getLanguageFlag(lang)}</div>
                <div className="text-2xl font-bold text-gray-900">{stats.by_language[lang] || 0}</div>
                <div className="text-sm text-gray-500 uppercase">{lang}</div>
                {stats.total_plans > 0 && (
                  <div className="text-xs text-gray-400 mt-1">
                    {(((stats.by_language[lang] || 0) / stats.total_plans) * 100).toFixed(0)}%
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  subValue,
  color,
  isPercentage,
}: {
  label: string;
  value: number | string;
  subValue?: string;
  color: 'gray' | 'blue' | 'green' | 'purple' | 'red';
  isPercentage?: boolean;
}) {
  const colorClasses = {
    gray: 'text-gray-900',
    blue: 'text-blue-600',
    green: 'text-green-600',
    purple: 'text-purple-600',
    red: 'text-red-600',
  };

  const displayValue = typeof value === 'number' ? value.toLocaleString() : value;

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4">
      <div className="text-sm text-gray-500 uppercase tracking-wide">{label}</div>
      <div className={`text-3xl font-bold mt-1 ${colorClasses[color]}`}>{displayValue}</div>
      {subValue && <div className="text-xs text-gray-400 mt-1">{subValue}</div>}
    </div>
  );
}

// Plans List Tab
function PlansListTab({ password }: { password: string }) {
  const [plans, setPlans] = useState<MarketingPlanSummary[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [deleting, setDeleting] = useState<string | null>(null);

  const fetchPlans = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.set('search', search);

      const response = await fetch(`/api/admin/plans?${params.toString()}`, {
        headers: { 'x-admin-password': password },
      });

      if (response.ok) {
        const data: PlansResponse = await response.json();
        setPlans(data.plans);
        setTotal(data.total);
      }
    } catch (err) {
      console.error('Failed to fetch plans:', err);
    } finally {
      setLoading(false);
    }
  }, [search, password]);

  useEffect(() => {
    fetchPlans();
  }, [fetchPlans]);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this plan?')) return;

    setDeleting(id);
    try {
      const response = await fetch(`/api/admin/plans?id=${id}`, {
        method: 'DELETE',
        headers: { 'x-admin-password': password },
      });

      if (response.ok) {
        fetchPlans();
      }
    } catch (err) {
      console.error('Failed to delete plan:', err);
    } finally {
      setDeleting(null);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Marketing Plans</h2>
          <p className="text-sm text-gray-500">{total} plans in database</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search by domain or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-80 focus:ring-2 focus:ring-[#0B996E] focus:border-transparent outline-none"
            />
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
          <button
            onClick={fetchPlans}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            Refresh
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-500">Loading plans...</div>
        ) : plans.length === 0 ? (
          <div className="p-8 text-center text-gray-500">No plans found</div>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Domain</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Email</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Lang</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Created</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {plans.map((plan) => (
                <tr key={plan.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <span className="font-medium text-gray-900">{plan.company_domain}</span>
                  </td>
                  <td className="px-4 py-3 text-gray-600">{plan.email}</td>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center gap-1">
                      <span>{getLanguageFlag(plan.user_language)}</span>
                      <span className="text-gray-600 uppercase text-sm">{plan.user_language}</span>
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-600 text-sm">{formatDate(plan.created_at)}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <a
                        href={`/?domain=${encodeURIComponent(plan.company_domain)}&lang=${plan.user_language}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1.5 text-sm text-[#0B996E] border border-[#0B996E] rounded-lg hover:bg-[#0B996E] hover:text-white transition-colors"
                      >
                        View
                      </a>
                      <button
                        onClick={() => handleDelete(plan.id)}
                        disabled={deleting === plan.id}
                        className="px-3 py-1.5 text-sm text-red-600 border border-red-300 rounded-lg hover:bg-red-50 transition-colors disabled:opacity-50"
                      >
                        {deleting === plan.id ? '...' : 'Delete'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

// Logs Tab
function LogsTab({ password }: { password: string }) {
  const [logs, setLogs] = useState<ApiLog[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'success' | 'error'>('all');
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchLogs = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      params.set('status', filter);
      params.set('limit', '100');

      const response = await fetch(`/api/admin/logs?${params.toString()}`, {
        headers: { 'x-admin-password': password },
      });

      if (response.ok) {
        const data: LogsResponse = await response.json();
        setLogs(data.logs);
        setTotal(data.total);
        setMessage(data.message || null);
      } else {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        setError(errorData.error || 'Failed to fetch logs');
      }
    } catch (err) {
      console.error('Failed to fetch logs:', err);
      setError('Network error - failed to fetch logs');
    } finally {
      setLoading(false);
    }
  }, [filter, password]);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  // Calculate stats from current logs
  const successCount = logs.filter((l) => l.status_code && l.status_code < 400).length;
  const errorCount = logs.filter((l) => l.status_code && l.status_code >= 400).length;
  const avgResponseTime =
    logs.filter((l) => l.response_time_ms).length > 0
      ? Math.round(
          logs.filter((l) => l.response_time_ms).reduce((acc, l) => acc + (l.response_time_ms || 0), 0) /
            logs.filter((l) => l.response_time_ms).length
        )
      : 0;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">API Logs</h2>
          <p className="text-sm text-gray-500">{total.toLocaleString()} total entries</p>
        </div>
        <div className="flex items-center gap-4">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as 'all' | 'success' | 'error')}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0B996E] focus:border-transparent outline-none"
          >
            <option value="all">All Requests</option>
            <option value="success">Success Only</option>
            <option value="error">Errors Only</option>
          </select>
          <button
            onClick={fetchLogs}
            disabled={loading}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2 disabled:opacity-50"
          >
            <svg
              className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            Refresh
          </button>
        </div>
      </div>

      {/* Quick Stats */}
      {!loading && logs.length > 0 && (
        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="text-sm text-gray-500">Showing</div>
            <div className="text-2xl font-bold text-gray-900">{logs.length}</div>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="text-sm text-gray-500">Success</div>
            <div className="text-2xl font-bold text-green-600">{successCount}</div>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="text-sm text-gray-500">Errors</div>
            <div className="text-2xl font-bold text-red-600">{errorCount}</div>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="text-sm text-gray-500">Avg Response</div>
            <div className="text-2xl font-bold text-blue-600">{avgResponseTime > 0 ? `${avgResponseTime}ms` : 'N/A'}</div>
          </div>
        </div>
      )}

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-800">{error}</div>
      )}

      {message && (
        <div className="mb-4 p-4 bg-amber-50 border border-amber-200 rounded-lg text-amber-800">{message}</div>
      )}

      {/* Table */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-500">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#0B996E] mb-2"></div>
            <p>Loading logs...</p>
          </div>
        ) : logs.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <p className="text-lg mb-2">No logs found</p>
            <p className="text-sm">API calls will appear here once the external API is used.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase whitespace-nowrap">
                    Timestamp
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase whitespace-nowrap">
                    Method
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase whitespace-nowrap">
                    Endpoint
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase whitespace-nowrap">
                    Domain
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase whitespace-nowrap">
                    API Key
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase whitespace-nowrap">
                    Status
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase whitespace-nowrap">
                    Duration
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {logs.map((log) => (
                  <tr key={log.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm text-gray-600 whitespace-nowrap">
                      {log.timestamp ? formatDate(log.timestamp) : '-'}
                    </td>
                    <td className="px-4 py-3">
                      <MethodBadge method={log.method} />
                    </td>
                    <td className="px-4 py-3">
                      <span className="font-mono text-sm text-gray-900">
                        {log.endpoint || <span className="text-gray-400 italic">unknown</span>}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      {log.domain || <span className="text-gray-400">-</span>}
                    </td>
                    <td className="px-4 py-3">
                      <span className="font-mono text-xs text-gray-500">
                        {log.api_key_hash || <span className="text-gray-400">-</span>}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge code={log.status_code} error={log.error_message} />
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600 whitespace-nowrap">
                      {log.response_time_ms != null ? `${log.response_time_ms}ms` : <span className="text-gray-400">-</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination info */}
      {!loading && logs.length > 0 && (
        <div className="mt-4 text-sm text-gray-500 text-center">
          Showing {logs.length} of {total.toLocaleString()} entries
        </div>
      )}
    </div>
  );
}

function MethodBadge({ method }: { method: string | null }) {
  if (!method) {
    return <span className="text-gray-400">-</span>;
  }

  const colors: Record<string, string> = {
    GET: 'bg-blue-100 text-blue-800',
    POST: 'bg-green-100 text-green-800',
    PUT: 'bg-yellow-100 text-yellow-800',
    PATCH: 'bg-orange-100 text-orange-800',
    DELETE: 'bg-red-100 text-red-800',
  };

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${colors[method.toUpperCase()] || 'bg-gray-100 text-gray-800'}`}>
      {method.toUpperCase()}
    </span>
  );
}

function StatusBadge({ code, error }: { code: number | null | undefined; error: string | null }) {
  if (code == null) {
    return <span className="text-gray-400">-</span>;
  }

  const isSuccess = code < 400;
  return (
    <span
      className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${
        isSuccess ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
      }`}
      title={error || undefined}
    >
      {code}
    </span>
  );
}

// API Docs Tab
function ApiDocsTab() {
  const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
  const [copied, setCopied] = useState<string | null>(null);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">API Documentation</h2>
        <p className="text-gray-600">
          Use the Marketing Plan API to programmatically generate AI-powered marketing relationship plans.
        </p>
      </div>

      {/* Quick Start */}
      <DocSection title="Quick Start">
        <p className="text-gray-600 mb-4">
          Generate a marketing plan with a single API call. The API will either return an existing plan or start
          generating a new one.
        </p>
        <div className="relative">
          <CodeBlock
            code={`curl -X POST ${baseUrl}/api/v1/marketing-plan \\
  -H "Content-Type: application/json" \\
  -H "x-api-key: YOUR_API_KEY" \\
  -d '{"domain": "example.com"}'`}
          />
          <button
            onClick={() =>
              copyToClipboard(
                `curl -X POST ${baseUrl}/api/v1/marketing-plan -H "Content-Type: application/json" -H "x-api-key: YOUR_API_KEY" -d '{"domain": "example.com"}'`,
                'quickstart'
              )
            }
            className="absolute top-2 right-2 px-2 py-1 bg-gray-700 hover:bg-gray-600 text-white text-xs rounded transition-colors"
          >
            {copied === 'quickstart' ? 'Copied!' : 'Copy'}
          </button>
        </div>
      </DocSection>

      {/* Authentication */}
      <DocSection title="Authentication">
        <p className="text-gray-600 mb-4">All API requests require an API key passed in the header:</p>
        <CodeBlock code="x-api-key: YOUR_API_KEY" />
        <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h5 className="font-medium text-blue-900 mb-2">Configuration</h5>
          <p className="text-sm text-blue-800">
            Set your API key via environment variable:
            <br />
            <code className="bg-blue-100 px-1 rounded">EXTERNAL_API_KEY=your-api-key</code>
            <br />
            <br />
            For multiple keys (comma-separated):
            <br />
            <code className="bg-blue-100 px-1 rounded">EXTERNAL_API_KEYS=key1,key2,key3</code>
          </p>
        </div>
      </DocSection>

      {/* Create Plan Endpoint */}
      <DocSection title="Create Marketing Plan">
        <div className="flex items-center gap-3 mb-4">
          <span className="px-2 py-1 bg-green-100 text-green-800 font-mono text-sm rounded font-bold">POST</span>
          <code className="text-gray-900 font-mono text-lg">/api/v1/marketing-plan</code>
        </div>

        <p className="text-gray-600 mb-4">
          Creates a new marketing plan or returns an existing one for the given domain. Plan generation takes 3-7
          minutes for new domains.
        </p>

        <h4 className="font-medium text-gray-900 mb-2">Request Body</h4>
        <div className="overflow-x-auto">
          <table className="w-full text-sm mb-4">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left px-3 py-2 font-medium text-gray-700">Parameter</th>
                <th className="text-left px-3 py-2 font-medium text-gray-700">Type</th>
                <th className="text-left px-3 py-2 font-medium text-gray-700">Required</th>
                <th className="text-left px-3 py-2 font-medium text-gray-700">Description</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              <tr>
                <td className="px-3 py-2 font-mono text-sm">domain</td>
                <td className="px-3 py-2 text-gray-600">string</td>
                <td className="px-3 py-2">
                  <span className="text-green-600 font-medium">Yes</span>
                </td>
                <td className="px-3 py-2 text-gray-600">Company website domain (e.g., "example.com")</td>
              </tr>
              <tr>
                <td className="px-3 py-2 font-mono text-sm">language</td>
                <td className="px-3 py-2 text-gray-600">string</td>
                <td className="px-3 py-2 text-gray-400">No</td>
                <td className="px-3 py-2 text-gray-600">
                  Language code: <code className="bg-gray-100 px-1 rounded">en</code>,{' '}
                  <code className="bg-gray-100 px-1 rounded">fr</code>,{' '}
                  <code className="bg-gray-100 px-1 rounded">de</code>,{' '}
                  <code className="bg-gray-100 px-1 rounded">es</code> (default: en)
                </td>
              </tr>
              <tr>
                <td className="px-3 py-2 font-mono text-sm">industry</td>
                <td className="px-3 py-2 text-gray-600">string</td>
                <td className="px-3 py-2 text-gray-400">No</td>
                <td className="px-3 py-2 text-gray-600">Industry type (auto-detected if not provided)</td>
              </tr>
              <tr>
                <td className="px-3 py-2 font-mono text-sm">force</td>
                <td className="px-3 py-2 text-gray-600">boolean</td>
                <td className="px-3 py-2 text-gray-400">No</td>
                <td className="px-3 py-2 text-gray-600">Force regeneration even if plan exists (default: false)</td>
              </tr>
              <tr>
                <td className="px-3 py-2 font-mono text-sm">webhook_url</td>
                <td className="px-3 py-2 text-gray-600">string</td>
                <td className="px-3 py-2 text-gray-400">No</td>
                <td className="px-3 py-2 text-gray-600">URL to receive callback when plan is ready</td>
              </tr>
              <tr>
                <td className="px-3 py-2 font-mono text-sm">webhook_secret</td>
                <td className="px-3 py-2 text-gray-600">string</td>
                <td className="px-3 py-2 text-gray-400">No</td>
                <td className="px-3 py-2 text-gray-600">Secret for HMAC-SHA256 webhook signature</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h4 className="font-medium text-gray-900 mb-2 mt-4">Response: Existing Plan Found</h4>
        <CodeBlock
          code={`{
  "status": "complete",
  "message": "Existing plan found",
  "domain": "example.com",
  "language": "en",
  "plan_url": "${baseUrl}/example.com?lang=en",
  "timestamp": "2024-01-15T10:30:00Z",
  "plan": {
    "introduction": "...",
    "company_summary": { ... },
    "programs_list": [ ... ],
    "how_brevo_helps_you": [ ... ],
    "conclusion": "..."
  }
}`}
        />

        <h4 className="font-medium text-gray-900 mb-2 mt-4">Response: New Plan Started</h4>
        <CodeBlock
          code={`{
  "status": "processing",
  "message": "Plan generation started. Poll the status URL to get results.",
  "job_id": "conv_abc123xyz",
  "domain": "example.com",
  "language": "en",
  "poll_url": "/api/marketing-plan/conv_abc123xyz",
  "plan_url": "${baseUrl}/example.com?lang=en",
  "timestamp": "2024-01-15T10:30:00Z",
  "estimated_time": "3-7 minutes",
  "webhook_url": "https://your-server.com/webhook",
  "webhook_enabled": true
}`}
        />
      </DocSection>

      {/* Check API Status */}
      <DocSection title="Check API Status">
        <div className="flex items-center gap-3 mb-4">
          <span className="px-2 py-1 bg-blue-100 text-blue-800 font-mono text-sm rounded font-bold">GET</span>
          <code className="text-gray-900 font-mono text-lg">/api/v1/marketing-plan</code>
        </div>
        <p className="text-gray-600 mb-4">Check API availability and get endpoint documentation.</p>
        <CodeBlock
          code={`{
  "status": "ok",
  "version": "1.1",
  "features": ["webhook_callback", "api_logging"],
  "endpoints": {
    "create_plan": { ... },
    "poll_status": { ... }
  }
}`}
        />
      </DocSection>

      {/* Poll Status */}
      <DocSection title="Poll Generation Status">
        <div className="flex items-center gap-3 mb-4">
          <span className="px-2 py-1 bg-blue-100 text-blue-800 font-mono text-sm rounded font-bold">GET</span>
          <code className="text-gray-900 font-mono text-lg">/api/marketing-plan/&#123;job_id&#125;</code>
        </div>
        <p className="text-gray-600 mb-4">
          Poll for plan generation status. Continue polling every 10-30 seconds until status is "complete" or "failed".
        </p>

        <h4 className="font-medium text-gray-900 mb-2">Response: Still Processing</h4>
        <CodeBlock
          code={`{
  "status": "processing",
  "message": "Plan is being generated..."
}`}
        />

        <h4 className="font-medium text-gray-900 mb-2 mt-4">Response: Complete</h4>
        <CodeBlock
          code={`{
  "status": "complete",
  "plan": { /* Full marketing plan object */ }
}`}
        />

        <h4 className="font-medium text-gray-900 mb-2 mt-4">Response: Failed</h4>
        <CodeBlock
          code={`{
  "status": "failed",
  "error": "Generation timed out. Please try again."
}`}
        />
      </DocSection>

      {/* Webhook */}
      <DocSection title="Webhook Callback">
        <p className="text-gray-600 mb-4">
          Instead of polling, you can provide a <code className="bg-gray-100 px-1 rounded">webhook_url</code> to receive
          a POST request when the plan is ready. This is the recommended approach for production integrations.
        </p>

        <h4 className="font-medium text-gray-900 mb-2">Webhook Payload</h4>
        <CodeBlock
          code={`{
  "event": "plan.completed",
  "domain": "example.com",
  "language": "en",
  "plan_url": "${baseUrl}/example.com?lang=en",
  "plan": { /* Full marketing plan object */ },
  "timestamp": "2024-01-15T10:30:00Z"
}`}
        />

        <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-lg">
          <h5 className="font-medium text-amber-900 mb-2">Webhook Security</h5>
          <p className="text-sm text-amber-800">
            If you provide a <code className="bg-amber-100 px-1 rounded">webhook_secret</code>, the request will include
            an <code className="bg-amber-100 px-1 rounded">X-Signature</code> header with an HMAC-SHA256 signature of
            the payload. Verify this signature to ensure the request is authentic.
          </p>
        </div>
      </DocSection>

      {/* Plan Structure */}
      <DocSection title="Marketing Plan Structure">
        <p className="text-gray-600 mb-4">The generated marketing plan includes the following sections:</p>
        <CodeBlock
          code={`{
  "introduction": "Welcome message and plan overview",
  "company_summary": {
    "name": "Company Name",
    "website": "example.com",
    "activities": "Main business activities",
    "target": "Target audience description",
    "industry": "Detected or specified industry",
    "nb_employees": "Company size estimate",
    "business_model": "B2B or B2C"
  },
  "programs_list": [
    {
      "program_name": "Welcome Program",
      "target": "New subscribers",
      "objective": "Convert to first purchase",
      "kpi": "First purchase rate",
      "description": "Program description",
      "scenarios": [
        {
          "scenario_target": "Day 0-7 subscribers",
          "scenario_objective": "Welcome and educate",
          "main_messages_ideas": "Key messages",
          "message_sequence": [...]
        }
      ]
    }
  ],
  "how_brevo_helps_you": [
    {
      "scenario_name": "Welcome Program",
      "why_brevo_is_better": "Brevo advantages",
      "omnichannel_channels": "Email, SMS, Push",
      "setup_efficiency": "Easy setup process"
    }
  ],
  "conclusion": "Summary and next steps"
}`}
        />
      </DocSection>

      {/* Industries */}
      <DocSection title="Available Industries">
        <p className="text-gray-600 mb-4">
          Industry is auto-detected from the domain, but you can specify it explicitly for better results.
        </p>
        <div className="grid grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium text-gray-700 mb-3 flex items-center gap-2">
              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
              B2C Industries
            </h4>
            <div className="grid grid-cols-2 gap-2">
              {['Fashion', 'Beauty', 'Home', 'Electronics', 'Food', 'Sports', 'Luxury', 'Family'].map((i) => (
                <div key={i} className="px-3 py-2 bg-gray-50 rounded text-sm text-gray-700">
                  {i}
                </div>
              ))}
            </div>
          </div>
          <div>
            <h4 className="font-medium text-gray-700 mb-3 flex items-center gap-2">
              <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
              B2B Industries
            </h4>
            <div className="grid grid-cols-2 gap-2">
              {['SaaS', 'Services', 'Manufacturing', 'Wholesale'].map((i) => (
                <div key={i} className="px-3 py-2 bg-gray-50 rounded text-sm text-gray-700">
                  {i}
                </div>
              ))}
            </div>
          </div>
        </div>
      </DocSection>

      {/* Error Codes */}
      <DocSection title="Error Codes">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left px-3 py-2 font-medium text-gray-700">Code</th>
                <th className="text-left px-3 py-2 font-medium text-gray-700">Error</th>
                <th className="text-left px-3 py-2 font-medium text-gray-700">Description</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {[
                ['400', 'Bad Request', 'Invalid request parameters or missing required fields'],
                ['401', 'Unauthorized', 'Missing or invalid API key in x-api-key header'],
                ['404', 'Not Found', 'Job ID not found (for polling endpoint)'],
                ['429', 'Too Many Requests', 'Rate limit exceeded'],
                ['502', 'Bad Gateway', 'AI service returned an error'],
                ['503', 'Service Unavailable', 'AI service or database not configured'],
                ['504', 'Gateway Timeout', 'Request to AI service timed out'],
              ].map(([code, error, desc]) => (
                <tr key={code}>
                  <td className="px-3 py-2">
                    <span
                      className={`font-mono px-2 py-0.5 rounded text-sm ${
                        code.startsWith('4') ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {code}
                    </span>
                  </td>
                  <td className="px-3 py-2 font-medium text-gray-900">{error}</td>
                  <td className="px-3 py-2 text-gray-600">{desc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </DocSection>

      {/* Rate Limits */}
      <DocSection title="Rate Limits">
        <p className="text-gray-600 mb-4">
          The API has rate limiting to ensure fair usage and system stability:
        </p>
        <ul className="list-disc list-inside space-y-2 text-gray-600">
          <li>
            <strong>10 requests per minute</strong> per API key for plan creation
          </li>
          <li>
            <strong>60 requests per minute</strong> per API key for status polling
          </li>
          <li>
            Plan generation is cached - requesting the same domain/language combination returns the cached result
          </li>
        </ul>
        <div className="mt-4 p-4 bg-gray-50 border border-gray-200 rounded-lg">
          <p className="text-sm text-gray-600">
            Need higher limits? Contact us to discuss enterprise options.
          </p>
        </div>
      </DocSection>

      {/* Code Examples */}
      <DocSection title="Code Examples">
        <div className="space-y-4">
          <div>
            <h4 className="font-medium text-gray-900 mb-2">JavaScript / Node.js</h4>
            <CodeBlock
              code={`const response = await fetch('${baseUrl}/api/v1/marketing-plan', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'x-api-key': process.env.API_KEY
  },
  body: JSON.stringify({
    domain: 'example.com',
    language: 'en',
    webhook_url: 'https://your-server.com/webhook'
  })
});

const data = await response.json();

if (data.status === 'complete') {
  console.log('Plan ready:', data.plan);
} else if (data.status === 'processing') {
  console.log('Plan generating, poll:', data.poll_url);
}`}
            />
          </div>
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Python</h4>
            <CodeBlock
              code={`import requests
import os

response = requests.post(
    '${baseUrl}/api/v1/marketing-plan',
    headers={
        'Content-Type': 'application/json',
        'x-api-key': os.environ['API_KEY']
    },
    json={
        'domain': 'example.com',
        'language': 'en'
    }
)

data = response.json()

if data['status'] == 'complete':
    print('Plan ready:', data['plan'])
elif data['status'] == 'processing':
    print('Plan generating, poll:', data['poll_url'])`}
            />
          </div>
        </div>
      </DocSection>
    </div>
  );
}

function DocSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="bg-white border border-gray-200 rounded-lg p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
      {children}
    </section>
  );
}

function CodeBlock({ code }: { code: string }) {
  return (
    <div className="bg-gray-900 text-gray-100 rounded-lg p-4 font-mono text-sm overflow-x-auto">
      <pre>{code}</pre>
    </div>
  );
}

// Helper functions
function getLanguageFlag(lang: string): string {
  const flags: Record<string, string> = { en: '🇬🇧', fr: '🇫🇷', de: '🇩🇪', es: '🇪🇸' };
  return flags[lang] || '🌐';
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleString();
}
