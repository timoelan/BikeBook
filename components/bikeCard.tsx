import Bike from "@/models/bike";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function BikeCard({ bike, onDelete }: { bike: Bike, onDelete: () => void }) {
    return (
        <View style={styles.card}>
            {bike.imageUri ? (
                <Image source={{ uri: bike.imageUri }} style={styles.image} />
            ) : (
                <View style={styles.imagePlaceholder}>
                    <Ionicons name="bicycle" size={64} color="#ccc" />
                </View>
            )}

            <View style={styles.content}>
                <Text style={styles.marke}>{bike.marke}</Text>
                <Text style={styles.modell}>{bike.modell}</Text>

                <View style={styles.tags}>
                    <View style={styles.tag}>
                        <Text style={styles.tagText}>{bike.baujahr}</Text>
                    </View>
                    <View style={styles.tag}>
                        <Text style={styles.tagText}>{bike.farbe}</Text>
                    </View>
                </View>

                <View style={styles.buttons}>
                    <TouchableOpacity style={styles.editButton} onPress={() => router.push(`/editBike/${bike.id}`)}>
                        <Ionicons name="pencil" size={16} color="#fff" />
                        <Text style={styles.editButtonText}>Bearbeiten</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.deleteButton} onPress={onDelete}>
                        <Ionicons name="trash-outline" size={18} color="#cc0000" />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.bikeDetailButton} onPress={() => router.push(`/info?bikeID=${bike.id}`)}>
                        <Ionicons name="information-circle-outline" size={18} color="#0077cc" />
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#fff',
        borderRadius: 16,
        marginBottom: 20,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.12,
        shadowRadius: 8,
        elevation: 5,
    },
    image: {
        width: '100%',
        height: 200,
    },
    imagePlaceholder: {
        width: '100%',
        height: 200,
        backgroundColor: '#f5f5f5',
        alignItems: 'center',
        justifyContent: 'center',
    },
    content: {
        padding: 16,
    },
    marke: {
        fontSize: 13,
        fontWeight: '600',
        color: '#999',
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    modell: {
        fontSize: 22,
        fontWeight: '800',
        color: '#111',
        marginTop: 2,
        marginBottom: 12,
    },
    tags: {
        flexDirection: 'row',
        gap: 8,
        marginBottom: 16,
    },
    tag: {
        backgroundColor: '#f0f0f0',
        borderRadius: 20,
        paddingHorizontal: 12,
        paddingVertical: 4,
    },
    tagText: {
        fontSize: 13,
        color: '#555',
        fontWeight: '500',
    },
    buttons: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    editButton: {
        flex: 1,
        flexDirection: 'row',
        backgroundColor: '#111',
        borderRadius: 10,
        paddingVertical: 10,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
    },
    editButtonText: {
        color: '#fff',
        fontWeight: '700',
        fontSize: 14,
    },
    deleteButton: {
        width: 44,
        height: 44,
        borderRadius: 10,
        backgroundColor: '#fff0f0',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: '#ffcccc',
    },
    bikeDetailButton: {
        width: 44,
        height: 44,
        borderRadius: 10,
        backgroundColor: '#f0f8ff',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: '#cce7ff',
    },
});
