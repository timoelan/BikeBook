import { useBike } from '@/context/BikeContext';
import { useTheme } from '@/context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function BikesTab() {
    const { bikeList } = useBike();
    const { theme } = useTheme();
    const s = styles(theme);

    return (
        <View style={s.container}>
            <View style={s.header}>
                <Text style={s.title}>Meine Bikes</Text>
                <TouchableOpacity style={s.addBtn} onPress={() => router.push('/addBike')}>
                    <Ionicons name="add" size={22} color={theme.accentText} />
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={s.list} showsVerticalScrollIndicator={false}>
                {bikeList.length === 0 && (
                    <View style={s.empty}>
                        <Ionicons name="bicycle-outline" size={64} color={theme.subtext} />
                        <Text style={s.emptyText}>Noch keine Bikes</Text>
                        <Text style={s.emptySubtext}>Tippe auf + um dein erstes Bike hinzuzufügen</Text>
                    </View>
                )}
                {bikeList.map(bike => (
                    <TouchableOpacity
                        key={bike.id}
                        style={s.card}
                        onPress={() => router.push(`/bike/${bike.id}`)}
                        activeOpacity={0.85}
                    >
                        {bike.imageUris?.[0] ? (
                            <Image source={{ uri: bike.imageUris[0] }} style={s.thumb} />
                        ) : (
                            <View style={[s.thumb, s.thumbPlaceholder]}>
                                <Ionicons name="bicycle" size={28} color={theme.subtext} />
                            </View>
                        )}
                        <View style={s.info}>
                            <Text style={s.bikeMarke}>{bike.marke}</Text>
                            <Text style={s.bikeModell}>{bike.modell}</Text>
                            <View style={s.tags}>
                                <View style={s.tag}>
                                    <Text style={s.tagText}>{bike.baujahr}</Text>
                                </View>
                                <View style={s.tag}>
                                    <Text style={s.tagText}>{bike.farbe}</Text>
                                </View>
                            </View>
                        </View>
                        <Ionicons name="chevron-forward" size={18} color={theme.subtext} />
                    </TouchableOpacity>
                ))}
            </ScrollView>
        </View>
    );
}

const styles = (theme: ReturnType<typeof import('@/context/ThemeContext').useTheme>['theme']) => StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.bg },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingTop: 60,
        paddingBottom: 16,
    },
    title: { fontSize: 28, fontWeight: '800', color: theme.text },
    addBtn: {
        width: 36, height: 36, borderRadius: 18,
        backgroundColor: theme.accent,
        alignItems: 'center', justifyContent: 'center',
    },
    list: { padding: 16, paddingBottom: 32 },
    card: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: theme.card,
        borderRadius: 14,
        marginBottom: 12,
        padding: 12,
        borderWidth: 1,
        borderColor: theme.border,
        gap: 12,
    },
    thumb: { width: 70, height: 70, borderRadius: 10 },
    thumbPlaceholder: {
        backgroundColor: theme.input,
        alignItems: 'center', justifyContent: 'center',
    },
    info: { flex: 1 },
    bikeMarke: { fontSize: 12, fontWeight: '600', color: theme.subtext, textTransform: 'uppercase', letterSpacing: 0.8 },
    bikeModell: { fontSize: 18, fontWeight: '700', color: theme.text, marginTop: 2, marginBottom: 6 },
    tags: { flexDirection: 'row', gap: 6 },
    tag: {
        backgroundColor: theme.input,
        borderRadius: 6, paddingHorizontal: 8, paddingVertical: 3,
    },
    tagText: { fontSize: 12, color: theme.subtext, fontWeight: '500' },
    empty: { alignItems: 'center', marginTop: 80, gap: 10 },
    emptyText: { fontSize: 18, fontWeight: '700', color: theme.text },
    emptySubtext: { fontSize: 14, color: theme.subtext, textAlign: 'center', paddingHorizontal: 40 },
});
