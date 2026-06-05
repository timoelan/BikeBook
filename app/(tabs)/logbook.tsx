import { useBike } from '@/context/BikeContext';
import { useLogs } from '@/context/LogContext';
import { useTheme } from '@/context/ThemeContext';
import { LogEntry } from '@/models/logEntry';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import {
    Alert, KeyboardAvoidingView, Modal, Platform, ScrollView, StyleSheet, Text,
    TextInput, TouchableOpacity, View
} from 'react-native';

export default function LogbookTab() {
    const { theme } = useTheme();
    const { bikeList } = useBike();
    const { logsForBike, addLog, updateLog, removeLog } = useLogs();

    const [selectedBikeId, setSelectedBikeId] = useState<string | null>(bikeList[0]?.id ?? null);
    const [showModal, setShowModal] = useState(false);
    const [editingLog, setEditingLog] = useState<LogEntry | null>(null);
    const [titel, setTitel] = useState('');
    const [beschreibung, setBeschreibung] = useState('');
    const [kmStand, setKmStand] = useState('');
    const [kosten, setKosten] = useState('');
    const s = styles(theme);

    const logs = selectedBikeId ? logsForBike(selectedBikeId).reverse() : [];

    const openAdd = () => {
        setEditingLog(null);
        setTitel(''); setBeschreibung(''); setKmStand(''); setKosten('');
        setShowModal(true);
    };

    const openEdit = (log: LogEntry) => {
        setEditingLog(log);
        setTitel(log.titel);
        setBeschreibung(log.beschreibung);
        setKmStand(log.kmStand.toString());
        setKosten(log.kosten?.toString() ?? '');
        setShowModal(true);
    };

    const save = () => {
        if (!titel.trim() || !kmStand || !selectedBikeId) return;
        const data: LogEntry = {
            id: editingLog?.id ?? Date.now().toString(),
            bikeID: selectedBikeId,
            datum: editingLog?.datum ?? new Date().toLocaleDateString('de-CH'),
            kmStand: parseInt(kmStand),
            titel: titel.trim(),
            beschreibung: beschreibung.trim(),
            kosten: kosten ? parseFloat(kosten) : undefined,
        };
        editingLog ? updateLog(editingLog.id, data) : addLog(data);
        setShowModal(false);
    };

    const confirmDelete = (log: LogEntry) => {
        Alert.alert('Eintrag löschen', `"${log.titel}" wirklich löschen?`, [
            { text: 'Abbrechen', style: 'cancel' },
            { text: 'Löschen', style: 'destructive', onPress: () => removeLog(log.id) },
        ]);
    };

    return (
        <View style={s.container}>
            <View style={s.header}>
                <Text style={s.title}>Logbuch</Text>
                {selectedBikeId && (
                    <TouchableOpacity style={s.addBtn} onPress={openAdd}>
                        <Ionicons name="add" size={22} color="#fff" />
                    </TouchableOpacity>
                )}
            </View>

            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={s.bikeScroll} contentContainerStyle={s.bikePills}>
                {bikeList.map(bike => (
                    <TouchableOpacity
                        key={bike.id}
                        style={[s.bikePill, selectedBikeId === bike.id && { backgroundColor: theme.accent }]}
                        onPress={() => setSelectedBikeId(bike.id)}
                    >
                        <Text style={[s.bikePillText, selectedBikeId === bike.id && { color: '#fff' }]}>
                            {bike.marke} {bike.modell}
                        </Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>

            <ScrollView contentContainerStyle={s.list}>
                {logs.length === 0 ? (
                    <View style={s.empty}>
                        <Ionicons name="document-text-outline" size={52} color={theme.subtext} />
                        <Text style={s.emptyText}>Noch keine Einträge</Text>
                    </View>
                ) : logs.map(log => (
                    <View key={log.id} style={s.logCard}>
                        <View style={[s.logStripe, { backgroundColor: theme.accent }]} />
                        <View style={s.logContent}>
                            <View style={s.logTop}>
                                <Text style={s.logTitel}>{log.titel}</Text>
                                <Text style={s.logDate}>{log.datum}</Text>
                            </View>
                            <Text style={s.logKm}>{log.kmStand.toLocaleString()} km</Text>
                            {log.beschreibung ? <Text style={s.logDesc}>{log.beschreibung}</Text> : null}
                            {log.kosten != null && (
                                <Text style={s.logKosten}>CHF {log.kosten.toFixed(2)}</Text>
                            )}
                            <View style={s.cardBtns}>
                                <TouchableOpacity style={[s.cardBtn, { backgroundColor: theme.input }]} onPress={() => openEdit(log)}>
                                    <Ionicons name="pencil" size={14} color={theme.accent} />
                                    <Text style={[s.cardBtnText, { color: theme.accent }]}>Bearbeiten</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={[s.cardBtn, { backgroundColor: theme.input }]} onPress={() => confirmDelete(log)}>
                                    <Ionicons name="trash-outline" size={14} color={theme.danger} />
                                    <Text style={[s.cardBtnText, { color: theme.danger }]}>Löschen</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                ))}
            </ScrollView>

            <Modal visible={showModal} transparent animationType="slide">
                <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
                <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={{ flex: 1, justifyContent: 'flex-end' }}>
                <View style={s.overlay}>
                    <View style={s.sheet}>
                        <Text style={s.modalTitle}>{editingLog ? 'Eintrag bearbeiten' : 'Neuer Eintrag'}</Text>

                        <Text style={s.label}>Titel</Text>
                        <TextInput style={s.input} value={titel} onChangeText={setTitel} placeholder="z.B. Ölwechsel" placeholderTextColor={theme.subtext} />

                        <Text style={s.label}>KM-Stand</Text>
                        <TextInput style={s.input} value={kmStand} onChangeText={setKmStand} keyboardType="numeric" placeholder="12000" placeholderTextColor={theme.subtext} />

                        <Text style={s.label}>Beschreibung</Text>
                        <TextInput style={[s.input, { height: 80 }]} value={beschreibung} onChangeText={setBeschreibung} multiline placeholder="Details..." placeholderTextColor={theme.subtext} />

                        <Text style={s.label}>Kosten (CHF, optional)</Text>
                        <TextInput style={s.input} value={kosten} onChangeText={setKosten} keyboardType="decimal-pad" placeholder="0.00" placeholderTextColor={theme.subtext} />

                        <View style={s.modalBtns}>
                            <TouchableOpacity style={s.cancelBtn} onPress={() => setShowModal(false)}>
                                <Text style={{ color: theme.subtext, fontWeight: '600' }}>Abbrechen</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={[s.saveBtn, { backgroundColor: theme.accent }]} onPress={save}>
                                <Text style={{ color: '#fff', fontWeight: '700' }}>
                                    {editingLog ? 'Aktualisieren' : 'Speichern'}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
                </ScrollView>
                </KeyboardAvoidingView>
            </Modal>
        </View>
    );
}

const styles = (theme: ReturnType<typeof import('@/context/ThemeContext').useTheme>['theme']) => StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.bg },
    header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingTop: 60, paddingBottom: 8 },
    title: { fontSize: 28, fontWeight: '800', color: theme.text },
    addBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: theme.accent, alignItems: 'center', justifyContent: 'center' },
    bikeScroll: { maxHeight: 52 },
    bikePills: { paddingHorizontal: 16, gap: 8, alignItems: 'center', paddingVertical: 8 },
    bikePill: { paddingHorizontal: 14, paddingVertical: 6, borderRadius: 20, backgroundColor: theme.input, borderWidth: 1, borderColor: theme.border },
    bikePillText: { fontSize: 13, fontWeight: '600', color: theme.subtext },
    list: { padding: 16, paddingBottom: 32 },
    logCard: { flexDirection: 'row', backgroundColor: theme.card, borderRadius: 14, marginBottom: 10, overflow: 'hidden', borderWidth: 1, borderColor: theme.border },
    logStripe: { width: 4 },
    logContent: { flex: 1, padding: 14 },
    logTop: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
    logTitel: { fontSize: 15, fontWeight: '700', color: theme.text, flex: 1, marginRight: 8 },
    logDate: { fontSize: 12, color: theme.subtext },
    logKm: { fontSize: 12, color: theme.accent, fontWeight: '600', marginBottom: 4 },
    logDesc: { fontSize: 13, color: theme.subtext, marginBottom: 4 },
    logKosten: { fontSize: 13, fontWeight: '700', color: theme.text, marginBottom: 8 },
    cardBtns: { flexDirection: 'row', gap: 8, marginTop: 8 },
    cardBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8 },
    cardBtnText: { fontSize: 12, fontWeight: '600' },
    empty: { alignItems: 'center', marginTop: 80, gap: 12 },
    emptyText: { fontSize: 16, color: theme.subtext },
    overlay: { flex: 1, justifyContent: 'flex-end', backgroundColor: '#00000066' },
    sheet: { backgroundColor: theme.card, borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24, paddingBottom: 40 },
    modalTitle: { fontSize: 20, fontWeight: '800', color: theme.text, marginBottom: 16 },
    label: { fontSize: 12, fontWeight: '600', color: theme.subtext, marginBottom: 6, marginTop: 12, textTransform: 'uppercase' },
    input: { backgroundColor: theme.input, borderRadius: 10, paddingHorizontal: 14, paddingVertical: 12, fontSize: 15, color: theme.text, borderWidth: 1, borderColor: theme.border },
    modalBtns: { flexDirection: 'row', gap: 10, marginTop: 24 },
    cancelBtn: { flex: 1, paddingVertical: 14, alignItems: 'center', borderRadius: 10, backgroundColor: theme.input },
    saveBtn: { flex: 2, paddingVertical: 14, alignItems: 'center', borderRadius: 10 },
    danger: { color: theme.danger },
});
