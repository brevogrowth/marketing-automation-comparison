import React from 'react';
import ReactMarkdown from 'react-markdown';

interface AiAnalysisResultProps {
    analysis: string;
}

export const AiAnalysisResult = ({ analysis }: AiAnalysisResultProps) => {
    console.log('Rendering AiAnalysisResult with analysis:', analysis);
    return (
        <div className="animate-fade-in-up space-y-8">
            <div className="bg-white rounded-xl shadow-lg border border-brevo-green/20 overflow-hidden">
                <div className="bg-brevo-dark-green px-8 py-6 text-white flex justify-between items-center">
                    <div>
                        <h2 className="text-2xl font-bold flex items-center gap-3">
                            <span className="text-3xl">🤖</span>
                            AI Performance Analysis
                        </h2>
                        <p className="text-brevo-light/80 mt-1">
                            Personalized insights based on your data
                        </p>
                    </div>
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
