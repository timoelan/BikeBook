import BikeInfoForms from "@/components/bikeInfoForms";
import { useBikeData } from "@/context/BikeDataContext";
import { router, useLocalSearchParams } from "expo-router";

export default function InfoScreen() {
  const { bikeID } = useLocalSearchParams<{ bikeID: string }>();
  const { addBikeData, bikeDataList } = useBikeData();

  const vorhandeneData = bikeDataList.find((d) => d.bikeID === bikeID);

  return (
    <BikeInfoForms
      bikeID={bikeID ?? ''}
      startingData={vorhandeneData}
      buttonText={vorhandeneData ? 'Aktualisieren' : 'Speichern'}
      onSave={(bikeData) => {
        addBikeData(bikeData);
        router.back();
      }}
    />
  );
}
