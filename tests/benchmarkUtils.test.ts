import { describe, it, expect } from 'vitest';
import { getBenchmarkStatus, getBenchmarkLevel, getHumorousMessage } from '../utils/benchmarkUtils';
import { BenchmarkData } from '../data/benchmarks';

// Mock Benchmark Data
const mockKpiHigherBetter: BenchmarkData = {
    id: 'roas',
    category: 'Acquisition',
    name: 'ROAS',
    unit: 'x',
    description: 'Return on Ad Spend',
    ranges: {
        'Mid-Range': { low: 3.0, median: 4.0, high: 5.5, insight: 'Test Insight' },
        'Budget': { low: 0, median: 0, high: 0, insight: '' },
        'Luxury': { low: 0, median: 0, high: 0, insight: '' }
    }
};

const mockKpiLowerBetter: BenchmarkData = {
    id: 'cac',
    category: 'Acquisition',
    name: 'CAC',
    unit: '€',
    description: 'Customer Acquisition Cost',
    ranges: {
        'Mid-Range': { low: 30, median: 45, high: 70, insight: 'Test Insight' },
        'Budget': { low: 0, median: 0, high: 0, insight: '' },
        'Luxury': { low: 0, median: 0, high: 0, insight: '' }
    }
};

describe('Benchmark Utils', () => {

    describe('getBenchmarkStatus', () => {
        it('should return neutral for empty input', () => {
            expect(getBenchmarkStatus(mockKpiHigherBetter, '', 'Mid-Range')).toBe('neutral');
        });

        it('should handle Higher is Better correctly', () => {
            // Low < 3.0
            expect(getBenchmarkStatus(mockKpiHigherBetter, '2.0', 'Mid-Range')).toBe('bad');
            // High >= 5.5
            expect(getBenchmarkStatus(mockKpiHigherBetter, '6.0', 'Mid-Range')).toBe('good');
            // Middle
            expect(getBenchmarkStatus(mockKpiHigherBetter, '4.0', 'Mid-Range')).toBe('neutral');
        });

        it('should handle Lower is Better correctly', () => {
            // Low <= 30 (Good)
            expect(getBenchmarkStatus(mockKpiLowerBetter, '25', 'Mid-Range')).toBe('good');
            // High >= 70 (Bad)
            expect(getBenchmarkStatus(mockKpiLowerBetter, '80', 'Mid-Range')).toBe('bad');
            // Middle
            expect(getBenchmarkStatus(mockKpiLowerBetter, '50', 'Mid-Range')).toBe('neutral');
        });
    });

    describe('getBenchmarkLevel', () => {
        it('should return 2 (average) for invalid input', () => {
            expect(getBenchmarkLevel(mockKpiHigherBetter, 'abc', 'Mid-Range')).toBe(2);
        });

        it('should calculate levels for Higher is Better', () => {
            // Disaster < 1.5 (Low * 0.5)
            expect(getBenchmarkLevel(mockKpiHigherBetter, '1.0', 'Mid-Range')).toBe(0);
            // Amazing >= 6.6 (High * 1.2)
            expect(getBenchmarkLevel(mockKpiHigherBetter, '7.0', 'Mid-Range')).toBe(4);
        });
    });

    describe('getHumorousMessage', () => {
        it('should return a string', () => {
            const msg = getHumorousMessage('cac', 2);
            expect(typeof msg).toBe('string');
            expect(msg.length).toBeGreaterThan(0);
        });

        it('should be deterministic', () => {
            const msg1 = getHumorousMessage('cac', 0);
            const msg2 = getHumorousMessage('cac', 0);
            expect(msg1).toBe(msg2);
        });

        it('should vary by level', () => {
            const msgLevel0 = getHumorousMessage('cac', 0);
            const msgLevel4 = getHumorousMessage('cac', 4);
            expect(msgLevel0).not.toBe(msgLevel4);
        });
    });
});
