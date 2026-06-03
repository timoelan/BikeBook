import { ColorScheme, useTheme } from '@/context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import { ScrollView, StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native';

const COLORS: { scheme: ColorScheme; label: string; hex: string }[] = [
    { scheme: 'blue',   label: 'Blau',   hex: '#0A84FF' },
    { scheme: 'red',    label: 'Rot',    hex: '#FF3B30' },
    { scheme: 'orange', label: 'Orange', hex: '#FF9500' },
    { scheme: 'green',  label: 'Grün',   hex: '#30D158' },
    { scheme: 'purple', label: 'Lila',   hex: '#BF5AF2' },
];

export default function SettingsTab() {
    const { theme, isDark, colorScheme, toggleDark, setColorScheme } = useTheme();
    const s = styles(theme);

    return (
        <ScrollView style={s.container} contentContainerStyle={s.content}>
            <Text style={s.title}>Design</Text>

            {/* Dark Mode */}
            <View style={s.section}>
                <Text style={s.sectionTitle}>Erscheinungsbild</Text>
                <View style={s.row}>
                    <View style={s.rowLeft}>
                        <Ionicons name={isDark ? 'moon' : 'sunny'} size={20} color={theme.accent} />
                        <Text style={s.rowLabel}>{isDark ? 'Dark Mode' : 'Light Mode'}</Text>
                    </View>
                    <Switch
                        value={isDark}
                        onValueChange={toggleDark}
                        trackColor={{ false: theme.border, true: theme.accent }}
                        thumbColor="#fff"
                    />
                </View>
            </View>

            {/* Farbthemen */}
            <View style={s.section}>
                <Text style={s.sectionTitle}>Akzentfarbe</Text>
                <View style={s.colorGrid}>
                    {COLORS.map(c => (
                        <TouchableOpacity
                            key={c.scheme}
                            style={[s.colorBtn, { backgroundColor: c.hex }, colorScheme === c.scheme && s.colorBtnActive]}
                            onPress={() => setColorScheme(c.scheme)}
                        >
                            {colorScheme === c.scheme && (
                                <Ionicons name="checkmark" size={20} color="#fff" />
                            )}
                        </TouchableOpacity>
                    ))}
                </View>
                <View style={s.colorLabels}>
                    {COLORS.map(c => (
                        <Text key={c.scheme} style={[s.colorLabel, colorScheme === c.scheme && { color: theme.accent, fontWeight: '700' }]}>
                            {c.label}
                        </Text>
                    ))}
                </View>
            </View>

            {/* Vorschau */}
            <View style={s.section}>
                <Text style={s.sectionTitle}>Vorschau</Text>
                <View style={s.preview}>
                    <View style={[s.previewCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
                        <View style={[s.previewThumb, { backgroundColor: theme.accent + '33' }]}>
                            <Ionicons name="bicycle" size={24} color={theme.accent} />
                        </View>
                        <View style={{ flex: 1, gap: 4 }}>
                            <Text style={[s.previewMarke, { color: theme.subtext }]}>YAMAHA</Text>
                            <Text style={[s.previewModell, { color: theme.text }]}>MT-07</Text>
                            <View style={{ flexDirection: 'row', gap: 6 }}>
                                <View style={[s.previewTag, { backgroundColor: theme.input }]}>
                                    <Text style={{ fontSize: 11, color: theme.subtext }}>2021</Text>
                                </View>
                                <View style={[s.previewTag, { backgroundColor: theme.input }]}>
                                    <Text style={{ fontSize: 11, color: theme.subtext }}>Schwarz</Text>
                                </View>
                            </View>
                        </View>
                    </View>
                    <TouchableOpacity style={[s.previewBtn, { backgroundColor: theme.accent }]}>
                        <Text style={s.previewBtnText}>Beispiel Button</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </ScrollView>
    );
}

const styles = (theme: ReturnType<typeof import('@/context/ThemeContext').useTheme>['theme']) => StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.bg },
    content: { padding: 20, paddingTop: 60, paddingBottom: 40 },
    title: { fontSize: 28, fontWeight: '800', color: theme.text, marginBottom: 28 },
    section: { marginBottom: 28 },
    sectionTitle: { fontSize: 13, fontWeight: '700', color: theme.subtext, textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 12 },
    row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: theme.card, borderRadius: 14, padding: 16, borderWidth: 1, borderColor: theme.border },
    rowLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
    rowLabel: { fontSize: 16, fontWeight: '600', color: theme.text },
    colorGrid: { flexDirection: 'row', gap: 12, marginBottom: 8 },
    colorBtn: { width: 52, height: 52, borderRadius: 26, alignItems: 'center', justifyContent: 'center' },
    colorBtnActive: { borderWidth: 3, borderColor: theme.text },
    colorLabels: { flexDirection: 'row', gap: 12 },
    colorLabel: { width: 52, fontSize: 11, color: theme.subtext, textAlign: 'center' },
    preview: { gap: 10 },
    previewCard: { flexDirection: 'row', alignItems: 'center', borderRadius: 14, padding: 12, borderWidth: 1, gap: 12 },
    previewThumb: { width: 56, height: 56, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
    previewMarke: { fontSize: 11, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.8 },
    previewModell: { fontSize: 16, fontWeight: '700' },
    previewTag: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 },
    previewBtn: { borderRadius: 10, paddingVertical: 14, alignItems: 'center' },
    previewBtnText: { color: '#fff', fontWeight: '700', fontSize: 15 },
});
