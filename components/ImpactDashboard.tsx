import React from 'react';
import { KpiRowV4 } from './KpiRowV4';

export const ImpactDashboard = () => {
    return (
        <div className="space-y-8">
            {/* Top Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gradient-to-br from-brevo-dark-green to-brevo-green p-6 rounded-xl text-white shadow-lg">
                    <h3 className="text-brevo-light/80 text-sm font-medium mb-1">Potential Revenue Uplift</h3>
                    <div className="text-3xl font-bold mb-2">+$1.2M</div>
                    <div className="text-xs bg-white/20 inline-block px-2 py-1 rounded text-white">
                        Based on top quartile performance
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                    <h3 className="text-gray-500 text-sm font-medium mb-1">Efficiency Score</h3>
                    <div className="text-3xl font-bold text-gray-900 mb-2">72<span className="text-lg text-gray-400 font-normal">/100</span></div>
                    <div className="text-xs text-yellow-600 font-medium">
                        ⚠️ 3 Critical bottlenecks detected
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                    <h3 className="text-gray-500 text-sm font-medium mb-1">Budget Optimization</h3>
                    <div className="text-3xl font-bold text-gray-900 mb-2">$145k</div>
                    <div className="text-xs text-green-600 font-medium">
                        Potential savings identified
                    </div>
                </div>
            </div>

            {/* Detailed KPI Sections */}
            <div className="space-y-6">
                <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <span className="w-8 h-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center text-sm">01</span>
                        Acquisition Efficiency
                    </h3>
                    <div className="space-y-3">
                        <KpiRowV4
                            name="CAC Payback Period"
                            value="14 months"
                            benchmark="< 12 months"
                            status="bad"
                            impact="High Cashflow Impact"
                        />
                        <KpiRowV4
                            name="Marketing Spend / Revenue"
                            value="22%"
                            benchmark="15-25%"
                            status="good"
                            impact="Sustainable"
                        />
                    </div>
                </div>

                <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <span className="w-8 h-8 rounded-lg bg-purple-100 text-purple-600 flex items-center justify-center text-sm">02</span>
                        Pipeline Velocity
                    </h3>
                    <div className="space-y-3">
                        <KpiRowV4
                            name="Lead to Opportunity"
                            value="8.5%"
                            benchmark="12%"
                            status="warning"
                            impact="+ $450k Revenue"
                        />
                        <KpiRowV4
                            name="Sales Cycle Length"
                            value="45 days"
                            benchmark="60 days"
                            status="good"
                            impact="High Velocity"
                        />
                    </div>
                </div>

                <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <span className="w-8 h-8 rounded-lg bg-orange-100 text-orange-600 flex items-center justify-center text-sm">03</span>
                        Retention & Growth
                    </h3>
                    <div className="space-y-3">
                        <KpiRowV4
                            name="Net Revenue Retention"
                            value="95%"
                            benchmark="> 110%"
                            status="bad"
                            impact="+ $800k Revenue"
                        />
                        <KpiRowV4
                            name="Logo Churn (Annual)"
                            value="12%"
                            benchmark="10-15%"
                            status="warning"
                            impact="Monitor Closely"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};
