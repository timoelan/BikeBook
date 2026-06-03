import { useSpots } from '@/context/SpotContext';
import { useTheme } from '@/context/ThemeContext';
import { Spot, SpotType } from '@/models/spot';
import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import { useEffect, useRef, useState } from 'react';
import {
    Alert, Modal, ScrollView, StyleSheet, Text,
    TextInput, TouchableOpacity, View
} from 'react-native';
import MapView, { Callout, Marker, Region } from 'react-native-maps';

const SPOT_ICONS: Record<SpotType, { icon: string; color: string }> = {
    stunt: { icon: '🤸', color: '#FF9500' },
    foto:  { icon: '📸', color: '#0A84FF' },
    kurve: { icon: '🏍️', color: '#30D158' },
    sonstig: { icon: '📍', color: '#BF5AF2' },
};

export default function MapTab() {
    const { theme, isDark } = useTheme();
    const { spots, addSpot, removeSpot } = useSpots();
    const mapRef = useRef<MapView>(null);
    const [region, setRegion] = useState<Region>({
        latitude: 47.376887,
        longitude: 8.541694,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
    });
    const [showModal, setShowModal] = useState(false);
    const [pendingCoord, setPendingCoord] = useState<{ latitude: number; longitude: number } | null>(null);
    const [newTitle, setNewTitle] = useState('');
    const [newDesc, setNewDesc] = useState('');
    const [newType, setNewType] = useState<SpotType>('kurve');
    const s = styles(theme);

    useEffect(() => {
        (async () => {
            const { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') return;
            const loc = await Location.getCurrentPositionAsync({});
            const r = {
                latitude: loc.coords.latitude,
                longitude: loc.coords.longitude,
                latitudeDelta: 0.05,
                longitudeDelta: 0.05,
            };
            setRegion(r);
            mapRef.current?.animateToRegion(r, 800);
        })();
    }, []);

    const goToMyLocation = async () => {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') return;
        const loc = await Location.getCurrentPositionAsync({});
        const r = {
            latitude: loc.coords.latitude,
            longitude: loc.coords.longitude,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
        };
        mapRef.current?.animateToRegion(r, 600);
    };

    const handleLongPress = (e: any) => {
        setPendingCoord(e.nativeEvent.coordinate);
        setNewTitle('');
        setNewDesc('');
        setNewType('kurve');
        setShowModal(true);
    };

    const saveSpot = () => {
        if (!newTitle.trim() || !pendingCoord) return;
        addSpot({
            id: Date.now().toString(),
            title: newTitle.trim(),
            description: newDesc.trim() || undefined,
            type: newType,
            latitude: pendingCoord.latitude,
            longitude: pendingCoord.longitude,
            createdAt: new Date().toISOString(),
        });
        setShowModal(false);
    };

    return (
        <View style={s.container}>
            <MapView
                ref={mapRef}
                style={StyleSheet.absoluteFillObject}
                initialRegion={region}
                onLongPress={handleLongPress}
                userInterfaceStyle={isDark ? 'dark' : 'light'}
                showsUserLocation
                showsCompass={false}
            >
                {spots.map(spot => (
                    <Marker
                        key={spot.id}
                        coordinate={{ latitude: spot.latitude, longitude: spot.longitude }}
                    >
                        <View style={s.markerBubble}>
                            <Text style={s.markerIcon}>{SPOT_ICONS[spot.type].icon}</Text>
                        </View>
                        <Callout onPress={() =>
                            Alert.alert(spot.title, spot.description || '', [
                                { text: 'Schliessen', style: 'cancel' },
                                { text: 'Löschen', style: 'destructive', onPress: () => removeSpot(spot.id) },
                            ])
                        }>
                            <View style={s.callout}>
                                <Text style={s.calloutTitle}>{spot.title}</Text>
                                <Text style={s.calloutType}>{spot.type.toUpperCase()}</Text>
                                {spot.description ? <Text style={s.calloutDesc}>{spot.description}</Text> : null}
                            </View>
                        </Callout>
                    </Marker>
                ))}
            </MapView>

            {/* Header */}
            <View style={s.header}>
                <Text style={s.title}>Spots</Text>
                <View style={s.legend}>
                    {(Object.keys(SPOT_ICONS) as SpotType[]).map(t => (
                        <View key={t} style={s.legendItem}>
                            <Text style={s.legendIcon}>{SPOT_ICONS[t].icon}</Text>
                            <Text style={s.legendLabel}>{t}</Text>
                        </View>
                    ))}
                </View>
            </View>

            {/* Location button */}
            <TouchableOpacity style={[s.fab, { backgroundColor: theme.card, borderColor: theme.border }]} onPress={goToMyLocation}>
                <Ionicons name="locate" size={22} color={theme.accent} />
            </TouchableOpacity>

            <View style={s.hint}>
                <Text style={s.hintText}>Gedrückt halten um einen Spot zu setzen</Text>
            </View>

            {/* Add spot modal */}
            <Modal visible={showModal} transparent animationType="slide">
                <View style={s.modalOverlay}>
                    <View style={s.modalSheet}>
                        <Text style={s.modalTitle}>Neuer Spot</Text>

                        <Text style={s.label}>Typ</Text>
                        <View style={s.typeRow}>
                            {(Object.keys(SPOT_ICONS) as SpotType[]).map(t => (
                                <TouchableOpacity
                                    key={t}
                                    style={[s.typeBtn, newType === t && { backgroundColor: theme.accent }]}
                                    onPress={() => setNewType(t)}
                                >
                                    <Text style={s.typeBtnIcon}>{SPOT_ICONS[t].icon}</Text>
                                    <Text style={[s.typeBtnLabel, newType === t && { color: '#fff' }]}>{t}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>

                        <Text style={s.label}>Name</Text>
                        <TextInput
                            style={s.input}
                            value={newTitle}
                            onChangeText={setNewTitle}
                            placeholder="z.B. Geissberg Kurve"
                            placeholderTextColor={theme.subtext}
                        />

                        <Text style={s.label}>Beschreibung (optional)</Text>
                        <TextInput
                            style={[s.input, { height: 70 }]}
                            value={newDesc}
                            onChangeText={setNewDesc}
                            placeholder="Details..."
                            placeholderTextColor={theme.subtext}
                            multiline
                        />

                        <View style={s.modalButtons}>
                            <TouchableOpacity style={s.cancelBtn} onPress={() => setShowModal(false)}>
                                <Text style={[s.cancelBtnText, { color: theme.subtext }]}>Abbrechen</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={[s.saveBtn, { backgroundColor: theme.accent }]} onPress={saveSpot}>
                                <Text style={s.saveBtnText}>Speichern</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
}

const styles = (theme: ReturnType<typeof import('@/context/ThemeContext').useTheme>['theme']) => StyleSheet.create({
    container: { flex: 1 },
    header: {
        position: 'absolute', top: 0, left: 0, right: 0,
        paddingTop: 60, paddingHorizontal: 20, paddingBottom: 12,
        backgroundColor: theme.bg + 'EE',
    },
    title: { fontSize: 28, fontWeight: '800', color: theme.text, marginBottom: 8 },
    legend: { flexDirection: 'row', gap: 12 },
    legendItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
    legendIcon: { fontSize: 14 },
    legendLabel: { fontSize: 12, color: theme.subtext, fontWeight: '500', textTransform: 'capitalize' },
    markerBubble: {
        width: 36, height: 36, borderRadius: 18,
        backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center',
        shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3, shadowRadius: 3, elevation: 4,
    },
    markerIcon: { fontSize: 20 },
    callout: { padding: 8, minWidth: 120 },
    calloutTitle: { fontWeight: '700', fontSize: 14, marginBottom: 2 },
    calloutType: { fontSize: 10, color: '#888', fontWeight: '600' },
    calloutDesc: { fontSize: 12, color: '#555', marginTop: 4 },
    fab: {
        position: 'absolute', bottom: 110, right: 20,
        width: 48, height: 48, borderRadius: 24,
        alignItems: 'center', justifyContent: 'center',
        borderWidth: 1,
        shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2, shadowRadius: 4, elevation: 4,
    },
    hint: {
        position: 'absolute', bottom: 100, left: 0, right: 0,
        alignItems: 'center',
    },
    hintText: {
        backgroundColor: theme.card + 'CC',
        color: theme.subtext, fontSize: 12,
        paddingHorizontal: 12, paddingVertical: 6,
        borderRadius: 20,
    },
    modalOverlay: { flex: 1, justifyContent: 'flex-end', backgroundColor: '#00000066' },
    modalSheet: {
        backgroundColor: theme.card,
        borderTopLeftRadius: 24, borderTopRightRadius: 24,
        padding: 24, paddingBottom: 40,
    },
    modalTitle: { fontSize: 20, fontWeight: '800', color: theme.text, marginBottom: 20 },
    label: { fontSize: 12, fontWeight: '600', color: theme.subtext, marginBottom: 6, marginTop: 14, textTransform: 'uppercase' },
    typeRow: { flexDirection: 'row', gap: 8 },
    typeBtn: {
        flex: 1, alignItems: 'center', paddingVertical: 10,
        borderRadius: 10, backgroundColor: theme.input,
        borderWidth: 1, borderColor: theme.border,
    },
    typeBtnIcon: { fontSize: 20, marginBottom: 2 },
    typeBtnLabel: { fontSize: 11, color: theme.subtext, fontWeight: '600', textTransform: 'capitalize' },
    input: {
        backgroundColor: theme.input, borderRadius: 10,
        paddingHorizontal: 14, paddingVertical: 12,
        fontSize: 15, color: theme.text,
        borderWidth: 1, borderColor: theme.border,
    },
    modalButtons: { flexDirection: 'row', gap: 10, marginTop: 24 },
    cancelBtn: { flex: 1, paddingVertical: 14, alignItems: 'center', borderRadius: 10, backgroundColor: theme.input },
    cancelBtnText: { fontWeight: '600', fontSize: 15 },
    saveBtn: { flex: 2, paddingVertical: 14, alignItems: 'center', borderRadius: 10 },
    saveBtnText: { color: '#fff', fontWeight: '700', fontSize: 15 },
});
