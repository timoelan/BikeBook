import BikeDetail from "@/components/bikeDetail";
import { useBike } from "@/context/BikeContext";
import { router } from "expo-router/build/exports";


type Props = {
  navigation: { navigate: (screen: string) => void };
};


export default function AddBikeScreen() {
  const { addBike} = useBike();

  return (
    <BikeDetail onSave={(bike)=> {
      addBike(bike);
      router.push('/');
    }} buttonText="Save" />
  );
}

