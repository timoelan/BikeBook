import { bikeDataBenzin, bikeDataElekro } from "@/models/bikeData";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, useContext, useEffect, useState } from "react";




interface BikeDataContextType {
    bikeDataList: (bikeDataBenzin | bikeDataElekro)[],
    addBikeData: (bikeData: bikeDataBenzin | bikeDataElekro) => void;
    updateBikeData: (id: string, updated: bikeDataBenzin | bikeDataElekro) => void;
    removeBikeData: (id: string) => void;
}



const STORAGE_KEY = 'bikeData';
const BikeDataContext = createContext<BikeDataContextType | undefined>(undefined);

export function BikeDataProvider({children}: {children: React.ReactNode}) {
    const [bikeDataList, setBikeDataList] = useState<(bikeDataBenzin | bikeDataElekro)[]>([]);
    const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const laden = async () => {
      try {
        const gespeichert = await AsyncStorage.getItem(STORAGE_KEY);
        if (gespeichert) {
          setBikeDataList(JSON.parse(gespeichert) as (bikeDataBenzin | bikeDataElekro)[]);
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
    AsyncStorage.setItem(STORAGE_KEY,JSON.stringify(bikeDataList));
  }, [bikeDataList, isLoaded]);


  const addBikeData = (bikeData : bikeDataBenzin | bikeDataElekro) => {
        setBikeDataList((prev) => [...prev, bikeData]);
    }

    const updateBikeData = (id: string, updated: bikeDataBenzin | bikeDataElekro) => {
        setBikeDataList((prev) => prev.map(x => x.id == id ? updated : x));
    }

    const removeBikeData = (id: string) => {
        setBikeDataList((prev) => prev.filter(x => x.id != id));
    }
     return (
    <BikeDataContext.Provider value={{ bikeDataList, addBikeData, updateBikeData, removeBikeData }}>
      {children}
    </BikeDataContext.Provider>
  );
}

export function useBikeData() {
  const context = useContext(BikeDataContext);
  if (!context) {
    throw new Error('useBikeData muss innerhalb von BikeDataProvider verwendet werden');
  }
  return context;
}
export default BikeDataContext; 