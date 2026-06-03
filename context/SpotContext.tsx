import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { Spot } from '@/models/spot';

interface SpotContextType {
    spots: Spot[];
    addSpot: (spot: Spot) => void;
    removeSpot: (id: string) => void;
}

const SpotContext = createContext<SpotContextType | undefined>(undefined);
const KEY = 'spots';

export function SpotProvider({ children }: { children: React.ReactNode }) {
    const [spots, setSpots] = useState<Spot[]>([]);
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        AsyncStorage.getItem(KEY).then(v => {
            if (v) setSpots(JSON.parse(v));
        }).finally(() => setLoaded(true));
    }, []);

    useEffect(() => {
        if (!loaded) return;
        AsyncStorage.setItem(KEY, JSON.stringify(spots));
    }, [spots, loaded]);

    const addSpot = (spot: Spot) => setSpots(p => [...p, spot]);
    const removeSpot = (id: string) => setSpots(p => p.filter(s => s.id !== id));

    return (
        <SpotContext.Provider value={{ spots, addSpot, removeSpot }}>
            {children}
        </SpotContext.Provider>
    );
}

export function useSpots() {
    const ctx = useContext(SpotContext);
    if (!ctx) throw new Error('useSpots must be inside SpotProvider');
    return ctx;
}
