import Bike from "@/models/bike";
import { useState } from "react";
import { Text, TextInput, TouchableOpacity, View, StyleSheet } from "react-native";
import ImagePickerButton from "./imagePickerButton";

interface BikeDetailProps{
    onSave : (bike: Bike) => void,
    startingBike?: Bike,
    buttonText: string
    startingImageUri?: string
}

export default function BikeDetail({ onSave, startingBike, buttonText, startingImageUri }: BikeDetailProps){
    const [marke, setMarke] = useState(startingBike ? startingBike.marke : '');
    const [modell, setModell] = useState(startingBike ? startingBike.modell : '');
    const [baujahr, setBaujahr] = useState(startingBike ? startingBike.baujahr.toString() : '');
    const [farbe, setFarbe] = useState(startingBike ? startingBike.farbe : '');
    const [imageUri, setImageUri] = useState(startingImageUri || startingBike?.imageUri || '');

    const speichern = () => {
        if (!marke || !modell || !baujahr || !farbe) {
            alert('Bitte alle Felder ausfüllen');
            return;
        }
        const newBike: Bike = {
            id: startingBike ? startingBike.id : Date.now().toString(),
            marke,
            modell,
            baujahr: parseInt(baujahr),
            farbe,
            imageUri
        };
        onSave(newBike);
    }

    return (
        <View style={styles.container}>
            <Text style={styles.label}>Marke</Text>
            <TextInput
                style={styles.input}
                placeholder="z.B. Trek"
                placeholderTextColor="#999"
                value={marke}
                onChangeText={setMarke}
            />

            <Text style={styles.label}>Modell</Text>
            <TextInput
                style={styles.input}
                placeholder="z.B. Marlin 7"
                placeholderTextColor="#999"
                value={modell}
                onChangeText={setModell}
            />

            <Text style={styles.label}>Baujahr</Text>
            <TextInput
                style={styles.input}
                placeholder="z.B. 2022"
                placeholderTextColor="#999"
                value={baujahr}
                onChangeText={setBaujahr}
                keyboardType="numeric"
            />

            <Text style={styles.label}>Farbe</Text>
            <TextInput
                style={styles.input}
                placeholder="z.B. Blau"
                placeholderTextColor="#999"
                value={farbe}
                onChangeText={setFarbe}
            />

            <ImagePickerButton imageUri={imageUri} onImageSelected={setImageUri} />


            <TouchableOpacity style={styles.button} onPress={speichern}>
                <Text style={styles.buttonText}>{buttonText}</Text>
            </TouchableOpacity>
        </View>
    );
}


const styles = StyleSheet.create({
    container: {
        padding: 20,
        gap: 4,
    },
    label: {
        fontSize: 13,
        fontWeight: '600',
        color: '#555',
        marginBottom: 4,
        marginTop: 12,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    input: {
        backgroundColor: '#f5f5f5',
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 10,
        paddingHorizontal: 14,
        paddingVertical: 12,
        fontSize: 16,
        color: '#111',
    },
    button: {
        marginTop: 24,
        backgroundColor: '#111',
        borderRadius: 10,
        paddingVertical: 14,
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '700',
        letterSpacing: 0.5,
    },
})