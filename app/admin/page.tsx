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
  timestamp: string;
  endpoint: string;
  method: string;
  domain: string | null;
  api_key_hash: string | null;
  status_code: number;
  response_time_ms: number;
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

  const fetchStats = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/admin/stats', {
        headers: { 'x-admin-password': password },
      });
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (err) {
      console.error('Failed to fetch stats:', err);
    } finally {
      setLoading(false);
    }
  }, [password]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  if (loading) {
    return <div className="text-center py-8 text-gray-500">Loading statistics...</div>;
  }

  if (!stats) {
    return <div className="text-center py-8 text-gray-500">Failed to load statistics</div>;
  }

  const maxCount = Math.max(...stats.plans_per_day.map((d) => d.count), 1);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Dashboard</h2>
          <p className="text-sm text-gray-500">Overview of marketing plan generation</p>
        </div>
        <button
          onClick={fetchStats}
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

      {/* Main Stats */}
      <div className="grid grid-cols-4 gap-4">
        <StatCard label="Total Plans" value={stats.total_plans} color="gray" />
        <StatCard label="Unique Emails" value={stats.unique_emails} color="blue" />
        <StatCard label="Plans Today" value={stats.plans_today} color="green" />
        <StatCard
          label="API Calls"
          value={stats.api_stats?.total_calls || 0}
          subValue={stats.api_stats ? `${stats.api_stats.total_errors} errors` : 'No logs'}
          color="purple"
        />
      </div>

      {/* Chart */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="font-medium text-gray-900 mb-4">Plans Created (Last 30 Days)</h3>
        <div className="h-48 flex items-end gap-1">
          {stats.plans_per_day.map((day, i) => (
            <div key={i} className="flex-1 flex flex-col items-center">
              <div
                className="w-full bg-[#0B996E] rounded-t transition-all hover:bg-[#098a62]"
                style={{ height: `${(day.count / maxCount) * 100}%`, minHeight: day.count > 0 ? '4px' : '0' }}
                title={`${day.date}: ${day.count} plans`}
              />
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
        <div className="grid grid-cols-4 gap-4">
          {Object.entries(stats.by_language).map(([lang, count]) => (
            <div key={lang} className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl mb-1">{getLanguageFlag(lang)}</div>
              <div className="text-2xl font-bold text-gray-900">{count}</div>
              <div className="text-sm text-gray-500 uppercase">{lang}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  subValue,
  color,
}: {
  label: string;
  value: number;
  subValue?: string;
  color: 'gray' | 'blue' | 'green' | 'purple';
}) {
  const colorClasses = {
    gray: 'text-gray-900',
    blue: 'text-blue-600',
    green: 'text-green-600',
    purple: 'text-purple-600',
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4">
      <div className="text-sm text-gray-500 uppercase tracking-wide">{label}</div>
      <div className={`text-3xl font-bold mt-1 ${colorClasses[color]}`}>{value}</div>
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

  const fetchLogs = useCallback(async () => {
    setLoading(true);
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
      }
    } catch (err) {
      console.error('Failed to fetch logs:', err);
    } finally {
      setLoading(false);
    }
  }, [filter, password]);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">API Logs</h2>
          <p className="text-sm text-gray-500">{total} log entries</p>
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

      {message && (
        <div className="mb-4 p-4 bg-amber-50 border border-amber-200 rounded-lg text-amber-800">{message}</div>
      )}

      {/* Table */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-500">Loading logs...</div>
        ) : logs.length === 0 ? (
          <div className="p-8 text-center text-gray-500">No logs found</div>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Time</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Endpoint</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Domain</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">API Key</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {logs.map((log) => (
                <tr key={log.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm text-gray-600">{formatDate(log.timestamp)}</td>
                  <td className="px-4 py-3">
                    <span className="font-mono text-sm text-gray-900">{log.endpoint}</span>
                  </td>
                  <td className="px-4 py-3 text-gray-600">{log.domain || '-'}</td>
                  <td className="px-4 py-3">
                    <span className="font-mono text-xs text-gray-500">{log.api_key_hash || '-'}</span>
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge code={log.status_code} error={log.error_message} />
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">{log.response_time_ms}ms</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

function StatusBadge({ code, error }: { code: number; error: string | null }) {
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

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">API Documentation</h2>
        <p className="text-gray-600">Use the Marketing Plan API to programmatically generate marketing plans.</p>
      </div>

      {/* Authentication */}
      <DocSection title="Authentication">
        <p className="text-gray-600 mb-4">All API requests require an API key passed in the header:</p>
        <CodeBlock code="x-api-key: YOUR_API_KEY" />
        <p className="text-sm text-gray-500 mt-3">
          Configure via environment variable: <code className="bg-gray-100 px-1 rounded">EXTERNAL_API_KEY</code> or{' '}
          <code className="bg-gray-100 px-1 rounded">EXTERNAL_API_KEYS</code> (comma-separated for multiple keys)
        </p>
      </DocSection>

      {/* Create Plan Endpoint */}
      <DocSection title="Create Marketing Plan">
        <div className="flex items-center gap-3 mb-4">
          <span className="px-2 py-1 bg-green-100 text-green-800 font-mono text-sm rounded">POST</span>
          <code className="text-gray-900 font-mono">/api/v1/marketing-plan</code>
        </div>

        <h4 className="font-medium text-gray-900 mb-2">Request Body</h4>
        <CodeBlock
          code={`{
  "domain": "example.com",      // Required: Company website domain
  "language": "en",             // Optional: en, fr, de, es (default: en)
  "industry": "SaaS",           // Optional: Industry type (auto-detected)
  "force": false,               // Optional: Force regeneration (default: false)
  "webhook_url": "https://...", // Optional: Callback URL when plan is ready
  "webhook_secret": "secret"    // Optional: Secret for webhook signature
}`}
        />

        <h4 className="font-medium text-gray-900 mb-2 mt-4">Response (Existing Plan)</h4>
        <CodeBlock
          code={`{
  "status": "complete",
  "message": "Existing plan found",
  "domain": "example.com",
  "plan_url": "${baseUrl}/?domain=example.com&lang=en",
  "plan": { /* Full marketing plan */ }
}`}
        />

        <h4 className="font-medium text-gray-900 mb-2 mt-4">Response (New Plan Started)</h4>
        <CodeBlock
          code={`{
  "status": "processing",
  "job_id": "job_abc123",
  "poll_url": "/api/marketing-plan/job_abc123",
  "plan_url": "${baseUrl}/?domain=example.com&lang=en",
  "webhook_enabled": true,  // If webhook_url provided
  "estimated_time": "2-3 minutes"
}`}
        />

        <h4 className="font-medium text-gray-900 mb-2 mt-4">Example cURL</h4>
        <CodeBlock
          code={`curl -X POST ${baseUrl}/api/v1/marketing-plan \\
  -H "Content-Type: application/json" \\
  -H "x-api-key: YOUR_API_KEY" \\
  -d '{"domain": "brevo.com", "language": "en"}'`}
        />
      </DocSection>

      {/* Webhook */}
      <DocSection title="Webhook Callback">
        <p className="text-gray-600 mb-4">
          When you provide a <code className="bg-gray-100 px-1 rounded">webhook_url</code>, the API will send a POST
          request to that URL when the plan is ready.
        </p>

        <h4 className="font-medium text-gray-900 mb-2">Webhook Payload</h4>
        <CodeBlock
          code={`{
  "event": "plan.completed",
  "domain": "example.com",
  "language": "en",
  "plan_url": "${baseUrl}/?domain=example.com&lang=en",
  "plan": { /* Full marketing plan */ },
  "timestamp": "2024-01-15T10:30:00Z"
}`}
        />

        <p className="text-sm text-gray-500 mt-3">
          If <code className="bg-gray-100 px-1 rounded">webhook_secret</code> is provided, the payload will include an{' '}
          <code className="bg-gray-100 px-1 rounded">X-Signature</code> header with HMAC-SHA256 signature.
        </p>
      </DocSection>

      {/* Poll Status */}
      <DocSection title="Poll Status">
        <div className="flex items-center gap-3 mb-4">
          <span className="px-2 py-1 bg-blue-100 text-blue-800 font-mono text-sm rounded">GET</span>
          <code className="text-gray-900 font-mono">/api/marketing-plan/&#123;job_id&#125;</code>
        </div>
        <p className="text-gray-600 mb-4">Poll for plan generation status and results.</p>

        <CodeBlock
          code={`// Processing
{ "status": "processing", "message": "Plan is being generated..." }

// Complete
{ "status": "complete", "plan": { /* Full marketing plan */ } }`}
        />
      </DocSection>

      {/* Industries */}
      <DocSection title="Available Industries">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <h4 className="font-medium text-gray-700 mb-2">B2C Industries</h4>
            <ul className="space-y-1 text-gray-600 text-sm">
              {['Fashion', 'Beauty', 'Home', 'Electronics', 'Food', 'Sports', 'Luxury', 'Family'].map((i) => (
                <li key={i}>• {i}</li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-gray-700 mb-2">B2B Industries</h4>
            <ul className="space-y-1 text-gray-600 text-sm">
              {['SaaS', 'Services', 'Manufacturing', 'Wholesale'].map((i) => (
                <li key={i}>• {i}</li>
              ))}
            </ul>
          </div>
        </div>
      </DocSection>

      {/* Error Codes */}
      <DocSection title="Error Codes">
        <table className="w-full text-sm">
          <tbody className="divide-y divide-gray-100">
            {[
              ['400', 'Invalid request parameters'],
              ['401', 'Missing or invalid API key'],
              ['502', 'AI service error'],
              ['503', 'Service unavailable'],
              ['504', 'Request timeout'],
            ].map(([code, desc]) => (
              <tr key={code}>
                <td className="py-2 font-mono text-red-600 w-16">{code}</td>
                <td className="py-2 text-gray-600">{desc}</td>
              </tr>
            ))}
          </tbody>
        </table>
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
