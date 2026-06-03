import BikeDetail from "@/components/bikeDetail";
import { useBike } from "@/context/BikeContext";
import { router, useLocalSearchParams } from "expo-router";

export default function EditBikeScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const { bikeList, updateBike } = useBike();
    const bike = bikeList.find(b => b.id === id);

    if (!bike) {
        router.back();
        return null;
    }

    return (
        <BikeDetail
            startingBike={bike}
            buttonText="Aktualisieren"
            onSave={(updated) => {
                updateBike(bike.id, { ...updated, id: bike.id, imageUris: bike.imageUris });
                router.back();
            }}
        />
    );
}
