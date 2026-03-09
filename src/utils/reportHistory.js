/**
 * Utility to manage report generation history in localStorage
 */

const HISTORY_KEY = 'tutorias_report_history';
const MAX_ITEMS = 5;

export const saveReportEntry = (entry) => {
    try {
        const historyJson = localStorage.getItem(HISTORY_KEY);
        let history = historyJson ? JSON.parse(historyJson) : [];

        const newEntry = {
            id: Date.now(),
            timestamp: new Date().toISOString(),
            dateFormatted: new Date().toLocaleString(),
            ...entry // This will now include the full 'data' object from forms
        };

        // Add to beginning
        history.unshift(newEntry);

        // Limit to MAX_ITEMS
        if (history.length > MAX_ITEMS) {
            history = history.slice(0, MAX_ITEMS);
        }

        localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
        return history;
    } catch (error) {
        console.error('Error saving report history:', error);
        return [];
    }
};

export const deleteReportEntry = (id) => {
    try {
        const historyJson = localStorage.getItem(HISTORY_KEY);
        if (!historyJson) return [];

        let history = JSON.parse(historyJson);
        const filtered = history.filter(item => item.id !== id);

        localStorage.setItem(HISTORY_KEY, JSON.stringify(filtered));
        return filtered;
    } catch (error) {
        console.error('Error deleting report history:', error);
        return [];
    }
};

export const getReportHistory = () => {
    try {
        const historyJson = localStorage.getItem(HISTORY_KEY);
        return historyJson ? JSON.parse(historyJson) : [];
    } catch (error) {
        console.error('Error reading report history:', error);
        return [];
    }
};
