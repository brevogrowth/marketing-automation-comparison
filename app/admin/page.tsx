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

// Password for admin access
const ADMIN_PASSWORD = 'growth';

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<'plans' | 'api-docs'>('plans');

  // Check if already authenticated
  useEffect(() => {
    const stored = sessionStorage.getItem('admin_auth');
    if (stored === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      sessionStorage.setItem('admin_auth', 'true');
      setError('');
    } else {
      setError('Invalid password');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('admin_auth');
  };

  if (!isAuthenticated) {
    return <LoginForm password={password} setPassword={setPassword} error={error} onSubmit={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex gap-8">
            <TabButton active={activeTab === 'plans'} onClick={() => setActiveTab('plans')} icon="📋">
              Plans List
            </TabButton>
            <TabButton active={activeTab === 'api-docs'} onClick={() => setActiveTab('api-docs')} icon="📖">
              API Docs
            </TabButton>
          </nav>
        </div>
      </div>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'plans' && <PlansListTab />}
        {activeTab === 'api-docs' && <ApiDocsTab />}
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
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
  onSubmit,
}: {
  password: string;
  setPassword: (p: string) => void;
  error: string;
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
            />
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">{error}</div>
          )}

          <button
            type="submit"
            className="w-full py-3 bg-[#0B996E] text-white font-medium rounded-lg hover:bg-[#098a62] transition-colors"
          >
            Login
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

// Plans List Tab
function PlansListTab() {
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
        headers: { 'x-admin-password': ADMIN_PASSWORD },
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
  }, [search]);

  useEffect(() => {
    fetchPlans();
  }, [fetchPlans]);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this plan?')) return;

    setDeleting(id);
    try {
      const response = await fetch(`/api/admin/plans?id=${id}`, {
        method: 'DELETE',
        headers: { 'x-admin-password': ADMIN_PASSWORD },
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const getLanguageFlag = (lang: string) => {
    const flags: Record<string, string> = {
      en: '🇬🇧',
      fr: '🇫🇷',
      de: '🇩🇪',
      es: '🇪🇸',
    };
    return flags[lang] || '🌐';
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Marketing Plans</h2>
          <p className="text-sm text-gray-500">Manage generated marketing plans</p>
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

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="text-sm text-gray-500 uppercase tracking-wide">Total Plans</div>
          <div className="text-3xl font-bold text-gray-900 mt-1">{total}</div>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="text-sm text-gray-500 uppercase tracking-wide">English</div>
          <div className="text-3xl font-bold text-blue-600 mt-1">
            {plans.filter((p) => p.user_language === 'en').length}
          </div>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="text-sm text-gray-500 uppercase tracking-wide">French</div>
          <div className="text-3xl font-bold text-blue-600 mt-1">
            {plans.filter((p) => p.user_language === 'fr').length}
          </div>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="text-sm text-gray-500 uppercase tracking-wide">Other</div>
          <div className="text-3xl font-bold text-blue-600 mt-1">
            {plans.filter((p) => !['en', 'fr'].includes(p.user_language)).length}
          </div>
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
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">
                  Domain
                </th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">Email</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">Lang</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">
                  Created
                </th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">
                  Actions
                </th>
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
      <section className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Authentication</h3>
        <p className="text-gray-600 mb-4">All API requests require an API key passed in the header:</p>
        <div className="bg-gray-900 text-gray-100 rounded-lg p-4 font-mono text-sm overflow-x-auto">
          <pre>x-api-key: mp-api-key-2024</pre>
        </div>
        <p className="text-sm text-amber-600 mt-3">
          Note: Contact the admin to get a production API key. The default key is for testing only.
        </p>
      </section>

      {/* Create Plan Endpoint */}
      <section className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex items-center gap-3 mb-4">
          <span className="px-2 py-1 bg-green-100 text-green-800 font-mono text-sm rounded">POST</span>
          <code className="text-gray-900 font-mono">/api/v1/marketing-plan</code>
        </div>
        <p className="text-gray-600 mb-4">Create a marketing plan for a company domain.</p>

        <h4 className="font-medium text-gray-900 mb-2">Request Body</h4>
        <div className="bg-gray-900 text-gray-100 rounded-lg p-4 font-mono text-sm overflow-x-auto mb-4">
          <pre>{`{
  "domain": "example.com",      // Required: Company website domain
  "language": "en",             // Optional: en, fr, de, es (default: en)
  "industry": "SaaS",           // Optional: Industry type (auto-detected if not provided)
  "force": false                // Optional: Force regeneration (default: false)
}`}</pre>
        </div>

        <h4 className="font-medium text-gray-900 mb-2">Response (Existing Plan Found)</h4>
        <div className="bg-gray-900 text-gray-100 rounded-lg p-4 font-mono text-sm overflow-x-auto mb-4">
          <pre>{`{
  "status": "complete",
  "message": "Existing plan found",
  "domain": "example.com",
  "language": "en",
  "plan_url": "${baseUrl}/?domain=example.com&lang=en",
  "plan": { /* Full marketing plan object */ }
}`}</pre>
        </div>

        <h4 className="font-medium text-gray-900 mb-2">Response (New Plan Started)</h4>
        <div className="bg-gray-900 text-gray-100 rounded-lg p-4 font-mono text-sm overflow-x-auto mb-4">
          <pre>{`{
  "status": "processing",
  "message": "Plan generation started. Poll the status URL to get results.",
  "job_id": "job_abc123",
  "domain": "example.com",
  "language": "en",
  "poll_url": "/api/marketing-plan/job_abc123",
  "plan_url": "${baseUrl}/?domain=example.com&lang=en",
  "estimated_time": "2-3 minutes"
}`}</pre>
        </div>

        <h4 className="font-medium text-gray-900 mb-2">Example cURL</h4>
        <div className="bg-gray-900 text-gray-100 rounded-lg p-4 font-mono text-sm overflow-x-auto">
          <pre>{`curl -X POST ${baseUrl}/api/v1/marketing-plan \\
  -H "Content-Type: application/json" \\
  -H "x-api-key: mp-api-key-2024" \\
  -d '{"domain": "brevo.com", "language": "en"}'`}</pre>
        </div>
      </section>

      {/* Poll Status Endpoint */}
      <section className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex items-center gap-3 mb-4">
          <span className="px-2 py-1 bg-blue-100 text-blue-800 font-mono text-sm rounded">GET</span>
          <code className="text-gray-900 font-mono">/api/marketing-plan/&#123;job_id&#125;</code>
        </div>
        <p className="text-gray-600 mb-4">Poll for plan generation status and results.</p>

        <h4 className="font-medium text-gray-900 mb-2">Response (Processing)</h4>
        <div className="bg-gray-900 text-gray-100 rounded-lg p-4 font-mono text-sm overflow-x-auto mb-4">
          <pre>{`{
  "status": "processing",
  "message": "Plan is being generated..."
}`}</pre>
        </div>

        <h4 className="font-medium text-gray-900 mb-2">Response (Complete)</h4>
        <div className="bg-gray-900 text-gray-100 rounded-lg p-4 font-mono text-sm overflow-x-auto">
          <pre>{`{
  "status": "complete",
  "plan": { /* Full marketing plan object */ }
}`}</pre>
        </div>
      </section>

      {/* Industries */}
      <section className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Available Industries</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <h4 className="font-medium text-gray-700 mb-2">B2C Industries</h4>
            <ul className="space-y-1 text-gray-600">
              <li>• Fashion</li>
              <li>• Beauty</li>
              <li>• Home</li>
              <li>• Electronics</li>
              <li>• Food</li>
              <li>• Sports</li>
              <li>• Luxury</li>
              <li>• Family</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-gray-700 mb-2">B2B Industries</h4>
            <ul className="space-y-1 text-gray-600">
              <li>• SaaS</li>
              <li>• Services</li>
              <li>• Manufacturing</li>
              <li>• Wholesale</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Error Codes */}
      <section className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Error Codes</h3>
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-2 text-gray-600">Code</th>
              <th className="text-left py-2 text-gray-600">Description</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            <tr>
              <td className="py-2 font-mono text-red-600">400</td>
              <td className="py-2 text-gray-600">Invalid request parameters</td>
            </tr>
            <tr>
              <td className="py-2 font-mono text-red-600">401</td>
              <td className="py-2 text-gray-600">Missing or invalid API key</td>
            </tr>
            <tr>
              <td className="py-2 font-mono text-red-600">502</td>
              <td className="py-2 text-gray-600">AI service error</td>
            </tr>
            <tr>
              <td className="py-2 font-mono text-red-600">503</td>
              <td className="py-2 text-gray-600">Service unavailable</td>
            </tr>
            <tr>
              <td className="py-2 font-mono text-red-600">504</td>
              <td className="py-2 text-gray-600">Request timeout</td>
            </tr>
          </tbody>
        </table>
      </section>

      {/* Rate Limits */}
      <section className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Rate Limits</h3>
        <p className="text-gray-600">
          The API is rate-limited to <strong>10 requests per minute</strong> per IP address. If you exceed this limit,
          you will receive a <code className="bg-gray-100 px-1 rounded">429 Too Many Requests</code> response.
        </p>
      </section>
    </div>
  );
}
