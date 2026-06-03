import * as ImagePicker from 'expo-image-picker';
import { Alert, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface ImagePickerButtonProps {
    imageUri?: string;
    onImageSelected: (uri: string) => void;
}

export default function ImagePickerButton({ imageUri, onImageSelected }: ImagePickerButtonProps) {

    function handlePress() {
        Alert.alert('Bild wählen', '', [
            { text: 'Foto aufnehmen', onPress: openCamera },
            { text: 'Aus Galerie wählen', onPress: openGallery },
            { text: 'Abbrechen', style: 'cancel' },
        ]);
    }

    async function openCamera() {
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Kamera-Zugriff wurde verweigert');
            return;
        }
        const ergebnis = await ImagePicker.launchCameraAsync();
        if (!ergebnis.canceled) {
            onImageSelected(ergebnis.assets[0].uri);
        }
    }

    async function openGallery() {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Galerie-Zugriff verweigert');
            return;
        }
        const ergebnis = await ImagePicker.launchImageLibraryAsync();
        if (!ergebnis.canceled) {
            onImageSelected(ergebnis.assets[0].uri);
        }
    }

    return (
        <TouchableOpacity onPress={handlePress} style={styles.container}>
            {imageUri ? (
                <Image source={{ uri: imageUri }} style={styles.image} />
            ) : (
                <View style={styles.placeholder}>
                    <Text style={styles.placeholderText}>Bild hinzufügen</Text>
                </View>
            )}
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        width: 120,
        height: 120,
        borderRadius: 12,
        overflow: 'hidden',
        marginBottom: 8,
    },
    image: {
        width: '100%',
        height: '100%',
    },
    placeholder: {
        flex: 1,
        backgroundColor: '#f0f0f0',
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    placeholderText: {
        color: '#999',
        fontSize: 13,
        textAlign: 'center',
    },
});
