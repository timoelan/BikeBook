import { useBike } from '@/context/BikeContext';
import { useBikeData } from '@/context/BikeDataContext';
import { useTheme } from '@/context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { router, useLocalSearchParams } from 'expo-router';
import { Alert, Dimensions, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const { width } = Dimensions.get('window');

export default function BikeDetailScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const { bikeList, updateBike, removeBike } = useBike();
    const { bikeDataList } = useBikeData();
    const { theme } = useTheme();

    const bike = bikeList.find(b => b.id === id);
    const techData = bikeDataList.find(d => d.bikeID === id);
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
        Alert.alert('Bild löschen', '', [
            { text: 'Abbrechen', style: 'cancel' },
            { text: 'Löschen', style: 'destructive', onPress: () =>
                updateBike(bike.id, { ...bike, imageUris: bike.imageUris?.filter(u => u !== uri) })
            },
        ]);
    };

    const confirmDelete = () => {
        Alert.alert('Bike löschen', `${bike.marke} ${bike.modell} wirklich löschen?`, [
            { text: 'Abbrechen', style: 'cancel' },
            { text: 'Löschen', style: 'destructive', onPress: () => { removeBike(bike.id); router.back(); } },
        ]);
    };

    return (
        <View style={s.container}>
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>

                {/* Galerie */}
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
                {(bike.imageUris?.length ?? 0) > 1 && (
                    <View style={s.dots}>
                        {bike.imageUris?.map((_, i) => <View key={i} style={[s.dot, { backgroundColor: theme.accent }]} />)}
                    </View>
                )}

                <View style={s.content}>
                    {/* Name + Buttons */}
                    <View style={s.nameRow}>
                        <View style={{ flex: 1 }}>
                            <Text style={s.marke}>{bike.marke}</Text>
                            <Text style={s.modell}>{bike.modell}</Text>
                        </View>
                        <View style={s.actions}>
                            <TouchableOpacity style={[s.actionBtn, { backgroundColor: theme.input }]}
                                onPress={() => router.push(`/editBike?id=${bike.id}`)}>
                                <Ionicons name="pencil" size={17} color={theme.accent} />
                            </TouchableOpacity>
                            <TouchableOpacity style={[s.actionBtn, { backgroundColor: theme.input }]} onPress={confirmDelete}>
                                <Ionicons name="trash-outline" size={17} color={theme.danger} />
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Basis-Eckdaten */}
                    <View style={s.specRow}>
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

                    {/* Technische Daten */}
                    {techData ? (
                        <View style={s.techSection}>
                            <View style={s.techHeader}>
                                <Text style={s.sectionTitle}>Technische Daten</Text>
                                <TouchableOpacity onPress={() => router.push(`/info?bikeID=${bike.id}`)}>
                                    <Text style={[s.editLink, { color: theme.accent }]}>Bearbeiten</Text>
                                </TouchableOpacity>
                            </View>
                            <View style={s.techGrid}>
                                <TechRow label="KM-Stand" value={`${techData.kmStand.toLocaleString()} km`} theme={theme} />
                                <TechRow label="Gewicht" value={`${techData.Gewicht} kg`} theme={theme} />
                                <TechRow label="Leistung" value={`${techData.LeistungKW} kW / ${techData.LeistungPS} PS`} theme={theme} />
                                <TechRow label="Reifen V." value={techData.reifenVorne} theme={theme} />
                                <TechRow label="Reifen H." value={techData.reifenHinten} theme={theme} />
                                <TechRow label="Bremsen V." value={techData.BremsenVorne} theme={theme} />
                                <TechRow label="Bremsen H." value={techData.BremsenHinten} theme={theme} />
                                <TechRow label="Bremsfl." value={techData.bremsflüssigkeit} theme={theme} />
                                {'Hubraum' in techData && (
                                    <>
                                        <TechRow label="Hubraum" value={`${techData.Hubraum} ccm`} theme={theme} />
                                        <TechRow label="Tankvolumen" value={`${techData.tankvolumen} L`} theme={theme} />
                                        <TechRow label="Öl" value={techData.öl} theme={theme} />
                                    </>
                                )}
                                {'BatterieKapazität' in techData && (
                                    <TechRow label="Batterie" value={`${techData.BatterieKapazität} kWh`} theme={theme} />
                                )}
                            </View>
                        </View>
                    ) : (
                        <TouchableOpacity style={[s.addTechBtn, { borderColor: theme.border }]}
                            onPress={() => router.push(`/info?bikeID=${bike.id}`)}>
                            <Ionicons name="add-circle-outline" size={20} color={theme.accent} />
                            <Text style={[s.addTechText, { color: theme.accent }]}>Technische Daten erfassen</Text>
                        </TouchableOpacity>
                    )}
                </View>
            </ScrollView>

            <TouchableOpacity style={[s.backBtn, { backgroundColor: theme.card, borderColor: theme.border }]} onPress={() => router.back()}>
                <Ionicons name="chevron-down" size={22} color={theme.text} />
            </TouchableOpacity>
        </View>
    );
}

function TechRow({ label, value, theme }: { label: string; value: string | undefined; theme: any }) {
    if (!value) return null;
    return (
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: theme.border }}>
            <Text style={{ fontSize: 13, color: theme.subtext, fontWeight: '500' }}>{label}</Text>
            <Text style={{ fontSize: 13, color: theme.text, fontWeight: '600', maxWidth: '60%', textAlign: 'right' }}>{value}</Text>
        </View>
    );
}

const styles = (theme: any) => StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.bg },
    gallery: { height: 300 },
    galleryImage: { width, height: 300, resizeMode: 'cover' },
    addImageBtn: { width, height: 300, backgroundColor: theme.input, alignItems: 'center', justifyContent: 'center', gap: 8 },
    addImageText: { color: theme.subtext, fontSize: 14, fontWeight: '600' },
    dots: { flexDirection: 'row', justifyContent: 'center', gap: 6, marginTop: 10 },
    dot: { width: 5, height: 5, borderRadius: 3 },
    content: { padding: 20 },
    nameRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 },
    marke: { fontSize: 12, fontWeight: '600', color: theme.subtext, textTransform: 'uppercase', letterSpacing: 0.8 },
    modell: { fontSize: 26, fontWeight: '800', color: theme.text, marginTop: 2 },
    actions: { flexDirection: 'row', gap: 8, marginTop: 4 },
    actionBtn: { width: 38, height: 38, borderRadius: 19, alignItems: 'center', justifyContent: 'center' },
    specRow: { flexDirection: 'row', backgroundColor: theme.card, borderRadius: 14, padding: 16, marginBottom: 16, borderWidth: 1, borderColor: theme.border },
    specItem: { flex: 1, alignItems: 'center' },
    specLabel: { fontSize: 11, color: theme.subtext, marginBottom: 4, fontWeight: '500' },
    specValue: { fontSize: 16, fontWeight: '700', color: theme.text },
    specDivider: { width: 1, marginHorizontal: 12 },
    techSection: { backgroundColor: theme.card, borderRadius: 14, padding: 16, borderWidth: 1, borderColor: theme.border },
    techHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
    sectionTitle: { fontSize: 14, fontWeight: '700', color: theme.text },
    editLink: { fontSize: 13, fontWeight: '600' },
    techGrid: {},
    addTechBtn: { flexDirection: 'row', gap: 10, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderStyle: 'dashed', borderRadius: 14, paddingVertical: 18 },
    addTechText: { fontSize: 15, fontWeight: '600' },
    backBtn: { position: 'absolute', top: 14, left: 20, width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center', borderWidth: 1 },
});
