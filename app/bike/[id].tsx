import { useBike } from '@/context/BikeContext';
import { useTheme } from '@/context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { router, useLocalSearchParams } from 'expo-router';
import { Alert, Dimensions, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const { width } = Dimensions.get('window');

export default function BikeDetailScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const { bikeList, updateBike, removeBike } = useBike();
    const { theme } = useTheme();
    const bike = bikeList.find(b => b.id === id);
    const s = styles(theme);

    if (!bike) return (
        <View style={s.container}>
            <Text style={{ color: theme.text }}>Bike nicht gefunden</Text>
        </View>
    );

    const addImage = async () => {
        Alert.alert('Bild hinzufügen', '', [
            { text: 'Kamera', onPress: () => pickImage('camera') },
            { text: 'Galerie', onPress: () => pickImage('gallery') },
            { text: 'Abbrechen', style: 'cancel' },
        ]);
    };

    const pickImage = async (source: 'camera' | 'gallery') => {
        const { status } = source === 'camera'
            ? await ImagePicker.requestCameraPermissionsAsync()
            : await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') return;

        const result = source === 'camera'
            ? await ImagePicker.launchCameraAsync({ quality: 0.8 })
            : await ImagePicker.launchImageLibraryAsync({ allowsMultipleSelection: true, quality: 0.8 });

        if (!result.canceled) {
            const newUris = result.assets.map(a => a.uri);
            updateBike(bike.id, { ...bike, imageUris: [...(bike.imageUris ?? []), ...newUris] });
        }
    };

    const removeImage = (uri: string) => {
        Alert.alert('Bild löschen', 'Dieses Bild wirklich entfernen?', [
            { text: 'Abbrechen', style: 'cancel' },
            { text: 'Löschen', style: 'destructive', onPress: () => {
                updateBike(bike.id, { ...bike, imageUris: bike.imageUris?.filter(u => u !== uri) });
            }},
        ]);
    };

    const confirmDelete = () => {
        Alert.alert('Bike löschen', `${bike.marke} ${bike.modell} wirklich löschen?`, [
            { text: 'Abbrechen', style: 'cancel' },
            { text: 'Löschen', style: 'destructive', onPress: () => {
                removeBike(bike.id);
                router.back();
            }},
        ]);
    };

    return (
        <View style={s.container}>
            <ScrollView showsVerticalScrollIndicator={false}>
                {/* Bild-Galerie */}
                <ScrollView horizontal pagingEnabled showsHorizontalScrollIndicator={false} style={s.gallery}>
                    {(bike.imageUris ?? []).map(uri => (
                        <TouchableOpacity key={uri} onLongPress={() => removeImage(uri)}>
                            <Image source={{ uri }} style={s.galleryImage} />
                        </TouchableOpacity>
                    ))}
                    <TouchableOpacity style={s.addImageBtn} onPress={addImage}>
                        <Ionicons name="camera-outline" size={32} color={theme.subtext} />
                        <Text style={s.addImageText}>Bild hinzufügen</Text>
                    </TouchableOpacity>
                </ScrollView>

                {/* Dot-Indikator */}
                {(bike.imageUris?.length ?? 0) > 0 && (
                    <View style={s.dots}>
                        {bike.imageUris?.map((_, i) => (
                            <View key={i} style={[s.dot, { backgroundColor: theme.accent }]} />
                        ))}
                    </View>
                )}

                <View style={s.content}>
                    <View style={s.nameRow}>
                        <View>
                            <Text style={s.marke}>{bike.marke}</Text>
                            <Text style={s.modell}>{bike.modell}</Text>
                        </View>
                        <View style={s.actions}>
                            <TouchableOpacity style={[s.actionBtn, { backgroundColor: theme.input }]}
                                onPress={() => router.push(`/editBike?id=${bike.id}`)}>
                                <Ionicons name="pencil" size={18} color={theme.accent} />
                            </TouchableOpacity>
                            <TouchableOpacity style={[s.actionBtn, { backgroundColor: theme.input }]} onPress={confirmDelete}>
                                <Ionicons name="trash-outline" size={18} color={theme.danger} />
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Eckdaten */}
                    <View style={s.specs}>
                        <View style={s.specItem}>
                            <Text style={s.specLabel}>Baujahr</Text>
                            <Text style={s.specValue}>{bike.baujahr}</Text>
                        </View>
                        <View style={[s.specDivider, { backgroundColor: theme.border }]} />
                        <View style={s.specItem}>
                            <Text style={s.specLabel}>Farbe</Text>
                            <Text style={s.specValue}>{bike.farbe}</Text>
                        </View>
                    </View>

                    {/* Buttons */}
                    <TouchableOpacity style={[s.bigBtn, { backgroundColor: theme.accent }]}
                        onPress={() => router.push(`/info?bikeID=${bike.id}`)}>
                        <Ionicons name="list" size={18} color="#fff" />
                        <Text style={s.bigBtnText}>Technische Daten</Text>
                    </TouchableOpacity>

                    <Text style={s.hintText}>Bild gedrückt halten zum Löschen</Text>
                </View>
            </ScrollView>

            {/* Zurück */}
            <TouchableOpacity style={[s.backBtn, { backgroundColor: theme.card, borderColor: theme.border }]} onPress={() => router.back()}>
                <Ionicons name="chevron-down" size={22} color={theme.text} />
            </TouchableOpacity>
        </View>
    );
}

const styles = (theme: ReturnType<typeof import('@/context/ThemeContext').useTheme>['theme']) => StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.bg },
    gallery: { height: 320 },
    galleryImage: { width, height: 320, resizeMode: 'cover' },
    addImageBtn: {
        width, height: 320, backgroundColor: theme.input,
        alignItems: 'center', justifyContent: 'center', gap: 8,
    },
    addImageText: { color: theme.subtext, fontSize: 14, fontWeight: '600' },
    dots: { flexDirection: 'row', justifyContent: 'center', gap: 6, marginTop: 10 },
    dot: { width: 6, height: 6, borderRadius: 3 },
    content: { padding: 20 },
    nameRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 },
    marke: { fontSize: 13, fontWeight: '600', color: theme.subtext, textTransform: 'uppercase', letterSpacing: 0.8 },
    modell: { fontSize: 28, fontWeight: '800', color: theme.text, marginTop: 2 },
    actions: { flexDirection: 'row', gap: 10, marginTop: 4 },
    actionBtn: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
    specs: {
        flexDirection: 'row', backgroundColor: theme.card,
        borderRadius: 14, padding: 16, marginBottom: 16,
        borderWidth: 1, borderColor: theme.border,
    },
    specItem: { flex: 1, alignItems: 'center' },
    specLabel: { fontSize: 12, color: theme.subtext, marginBottom: 4, fontWeight: '500' },
    specValue: { fontSize: 16, fontWeight: '700', color: theme.text },
    specDivider: { width: 1, marginHorizontal: 12 },
    bigBtn: {
        flexDirection: 'row', gap: 8,
        borderRadius: 14, paddingVertical: 14,
        alignItems: 'center', justifyContent: 'center', marginBottom: 12,
    },
    bigBtnText: { color: '#fff', fontSize: 15, fontWeight: '700' },
    hintText: { fontSize: 12, color: theme.subtext, textAlign: 'center', marginTop: 8 },
    backBtn: {
        position: 'absolute', top: 14, left: 20,
        width: 40, height: 40, borderRadius: 20,
        alignItems: 'center', justifyContent: 'center',
        borderWidth: 1,
    },
});
