import Bike from '@/models/bike';
import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface BikeContextType {
    bikeList: Bike[],
    isLoaded: boolean,
    addBike: (bike: Bike) => void;
    updateBike: (id: string, updated: Bike) => void;
    removeBike: (id: string) => void;
}


const STORAGE_KEY = 'bikes';
const BikeContext = createContext<BikeContextType | undefined>(undefined);

export function BikeProvider({ children }: { children: React.ReactNode }) {
    const [bikeList, setBikeList] = useState<Bike[]>([]);
    const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const laden = async () => {
      try {
        const gespeichert = await AsyncStorage.getItem(STORAGE_KEY);
        if (gespeichert) {
          setBikeList(JSON.parse(gespeichert) as Bike[]);
        }
      } catch (error) {
        console.error('Fehler beim Laden der Bikes:', error);
      } finally {
        setIsLoaded(true);
      }
    };
    laden();
  }, []);


  useEffect(() => {
    if (!isLoaded) return;
    AsyncStorage.setItem(STORAGE_KEY,JSON.stringify(bikeList));
  }, [bikeList, isLoaded]);

    const addBike = (bike : Bike) => {
        setBikeList((prev) => [...prev, bike]);
    }
    
    const updateBike = (id: string, updated: Bike) => {
        setBikeList((prev) => prev.map(x => x.id == id ? updated : x));
    }

    const removeBike = (id: string) => {
        setBikeList((prev) => prev.filter(x => x.id != id));
    }
     return (
    <BikeContext.Provider value={{ bikeList, isLoaded, addBike, updateBike, removeBike }}>
      {children}
    </BikeContext.Provider>
  );

}
export function useBike() {
  const context = useContext(BikeContext);
  if (!context) {
    throw new Error('useBike muss innerhalb von BikeProvider verwendet werden');
  }
  return context;
}
export default BikeContext;