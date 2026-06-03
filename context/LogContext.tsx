import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { LogEntry } from '@/models/logEntry';

interface LogContextType {
    logs: LogEntry[];
    addLog: (log: LogEntry) => void;
    removeLog: (id: string) => void;
    logsForBike: (bikeID: string) => LogEntry[];
}

const LogContext = createContext<LogContextType | undefined>(undefined);
const KEY = 'logs';

export function LogProvider({ children }: { children: React.ReactNode }) {
    const [logs, setLogs] = useState<LogEntry[]>([]);
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        AsyncStorage.getItem(KEY).then(v => {
            if (v) setLogs(JSON.parse(v));
        }).finally(() => setLoaded(true));
    }, []);

    useEffect(() => {
        if (!loaded) return;
        AsyncStorage.setItem(KEY, JSON.stringify(logs));
    }, [logs, loaded]);

    const addLog = (log: LogEntry) => setLogs(p => [...p, log]);
    const removeLog = (id: string) => setLogs(p => p.filter(l => l.id !== id));
    const logsForBike = (bikeID: string) => logs.filter(l => l.bikeID === bikeID);

    return (
        <LogContext.Provider value={{ logs, addLog, removeLog, logsForBike }}>
            {children}
        </LogContext.Provider>
    );
}

export function useLogs() {
    const ctx = useContext(LogContext);
    if (!ctx) throw new Error('useLogs must be inside LogProvider');
    return ctx;
}
