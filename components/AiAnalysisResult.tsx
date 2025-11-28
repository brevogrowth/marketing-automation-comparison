'use client';

import React from 'react';
import ReactMarkdown from 'react-markdown';
import { useLanguage } from '@/contexts/LanguageContext';

interface AiAnalysisResultProps {
    analysis: string;
}

export const AiAnalysisResult = ({ analysis }: AiAnalysisResultProps) => {
    const { t } = useLanguage();

    const handleExportPDF = () => {
        // Use browser print dialog for PDF export
        window.print();
    };

    return (
        <div className="animate-fade-in-up space-y-8">
            <div className="bg-white rounded-xl shadow-lg border border-brevo-green/20 overflow-hidden print:shadow-none print:border-0">
                <div className="bg-brevo-dark-green px-8 py-6 text-white flex justify-between items-center print:bg-white print:text-brevo-dark-green print:border-b print:border-gray-200">
                    <div>
                        <h2 className="text-2xl font-bold flex items-center gap-3">
                            <span className="text-3xl">🤖</span>
                            {t.analysis.resultTitle}
                        </h2>
                        <p className="text-brevo-light/80 mt-1 print:text-gray-600">
                            {t.analysis.resultSubtitle}
                        </p>
                    </div>
                    <button
                        onClick={handleExportPDF}
                        className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg transition-colors print:hidden"
                        aria-label="Export as PDF"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V7.414A2 2 0 0015.414 6L12 2.586A2 2 0 0010.586 2H6zm5 6a1 1 0 10-2 0v3.586l-1.293-1.293a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 11.586V8z" clipRule="evenodd" />
                        </svg>
                        {t.analysis.exportPdf}
                    </button>
                </div>

                <div className="p-8">
                    <div className="prose prose-lg max-w-none prose-headings:text-brevo-dark-green prose-a:text-brevo-green hover:prose-a:text-brevo-dark-green prose-strong:text-brevo-dark-green">
                        <ReactMarkdown>{analysis}</ReactMarkdown>
                    </div>
                </div>
            </div>
        </div>
    );
};
