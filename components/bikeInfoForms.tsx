import { useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { bikeDataBenzin, bikeDataElekro } from '@/models/bikeData';

interface BikeInfoFormsProps {
    bikeID: string;
    onSave: (data: bikeDataBenzin | bikeDataElekro) => void;
    startingData?: bikeDataBenzin | bikeDataElekro;
    buttonText?: string;
}

export default function BikeInfoForms({ bikeID, onSave, startingData, buttonText = 'Speichern' }: BikeInfoFormsProps) {
    const [typ, setTyp] = useState<'benzin' | 'elektro'>(
        startingData && 'Hubraum' in startingData ? 'benzin' : 'elektro'
    );

    const [kmStand, setKmStand] = useState(startingData?.kmStand.toString() ?? '');
    const [reifenVorne, setReifenVorne] = useState(startingData?.reifenVorne ?? '');
    const [reifenHinten, setReifenHinten] = useState(startingData?.reifenHinten ?? '');
    const [felgenVorne, setFelgenVorne] = useState(startingData?.FelgenVorne ?? '');
    const [felgenHinten, setFelgenHinten] = useState(startingData?.FelgenHinten ?? '');
    const [bremsenVorne, setBremsenVorne] = useState(startingData?.BremsenVorne ?? '');
    const [bremsenHinten, setBremsenHinten] = useState(startingData?.BremsenHinten ?? '');
    const [gewicht, setGewicht] = useState(startingData?.Gewicht.toString() ?? '');
    const [leistungKW, setLeistungKW] = useState(startingData?.LeistungKW.toString() ?? '');
    const [leistungPS, setLeistungPS] = useState(startingData?.LeistungPS.toString() ?? '');
    const [bremsflüssigkeit, setBremsflüssigkeit] = useState(startingData?.bremsflüssigkeit ?? '');
    const [kühlflüssigkeit, setKühlflüssigkeit] = useState(startingData?.kühlflüssigkeit ?? '');
    const [öl, setÖl] = useState(startingData?.öl ?? '');

    const [auspuff, setAuspuff] = useState(startingData && 'auspuff' in startingData ? startingData.auspuff : '');
    const [tankvolumen, setTankvolumen] = useState(startingData && 'tankvolumen' in startingData ? startingData.tankvolumen.toString() : '');
    const [hubraum, setHubraum] = useState(startingData && 'Hubraum' in startingData ? startingData.Hubraum.toString() : '');


    const [batterieKapazität, setBatterieKapazität] = useState(startingData && 'BatterieKapazität' in startingData ? startingData.BatterieKapazität.toString() : '');

    const speichern = () => {
        const base = {
            id: startingData?.id ?? Date.now().toString(),
            bikeID,
            kmStand: parseInt(kmStand),
            reifenVorne,
            reifenHinten,
            FelgenVorne: felgenVorne,
            FelgenHinten: felgenHinten,
            BremsenVorne: bremsenVorne,
            BremsenHinten: bremsenHinten,
            Gewicht: parseFloat(gewicht),
            LeistungKW: parseFloat(leistungKW),
            LeistungPS: parseFloat(leistungPS),
            bremsflüssigkeit,
            kühlflüssigkeit,
        };

        if (typ === 'benzin') {
            onSave({ ...base, auspuff, tankvolumen: parseFloat(tankvolumen), Hubraum: parseInt(hubraum), öl } as bikeDataBenzin);
        } else {
            onSave({ ...base, BatterieKapazität: parseFloat(batterieKapazität), öl: öl || undefined } as bikeDataElekro);
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>

            {/* Typ-Auswahl */}
            <View style={styles.typRow}>
                <TouchableOpacity
                    style={[styles.typButton, typ === 'benzin' && styles.typButtonActive]}
                    onPress={() => setTyp('benzin')}
                >
                    <Text style={[styles.typText, typ === 'benzin' && styles.typTextActive]}>Benzin</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.typButton, typ === 'elektro' && styles.typButtonActive]}
                    onPress={() => setTyp('elektro')}
                >
                    <Text style={[styles.typText, typ === 'elektro' && styles.typTextActive]}>Elektro</Text>
                </TouchableOpacity>
            </View>

            <Text style={styles.section}>Allgemein</Text>
            <Field label="KM-Stand" value={kmStand} onChange={setKmStand} numeric />
            <Field label="Gewicht (kg)" value={gewicht} onChange={setGewicht} numeric />
            <Field label="Leistung KW" value={leistungKW} onChange={setLeistungKW} numeric />
            <Field label="Leistung PS" value={leistungPS} onChange={setLeistungPS} numeric />

            <Text style={styles.section}>Reifen & Felgen</Text>
            <Field label="Reifen Vorne" value={reifenVorne} onChange={setReifenVorne} />
            <Field label="Reifen Hinten" value={reifenHinten} onChange={setReifenHinten} />
            <Field label="Felgen Vorne" value={felgenVorne} onChange={setFelgenVorne} />
            <Field label="Felgen Hinten" value={felgenHinten} onChange={setFelgenHinten} />

            <Text style={styles.section}>Bremsen & Flüssigkeiten</Text>
            <Field label="Bremsen Vorne" value={bremsenVorne} onChange={setBremsenVorne} />
            <Field label="Bremsen Hinten" value={bremsenHinten} onChange={setBremsenHinten} />
            <Field label="Bremsflüssigkeit" value={bremsflüssigkeit} onChange={setBremsflüssigkeit} />
            <Field label="Kühlflüssigkeit" value={kühlflüssigkeit} onChange={setKühlflüssigkeit} />

            {typ === 'benzin' ? (
                <>
                    <Text style={styles.section}>Benzin-spezifisch</Text>
                    <Field label="Auspuff" value={auspuff} onChange={setAuspuff} />
                    <Field label="Tankvolumen (L)" value={tankvolumen} onChange={setTankvolumen} numeric />
                    <Field label="Hubraum (ccm)" value={hubraum} onChange={setHubraum} numeric />
                    <Field label="Öl" value={öl} onChange={setÖl} />
                </>
            ) : (
                <>
                    <Text style={styles.section}>Elektro-spezifisch</Text>
                    <Field label="Batteriekapazität (kWh)" value={batterieKapazität} onChange={setBatterieKapazität} numeric />
                    <Field label="Öl (optional)" value={öl} onChange={setÖl} />
                </>
            )}

            <TouchableOpacity style={styles.button} onPress={speichern}>
                <Text style={styles.buttonText}>{buttonText}</Text>
            </TouchableOpacity>
        </ScrollView>
    );
}

function Field({ label, value, onChange, numeric = false }: {
    label: string;
    value: string;
    onChange: (v: string) => void;
    numeric?: boolean;
}) {
    return (
        <View style={styles.fieldContainer}>
            <Text style={styles.label}>{label}</Text>
            <TextInput
                style={styles.input}
                value={value}
                onChangeText={onChange}
                keyboardType={numeric ? 'numeric' : 'default'}
                placeholderTextColor="#999"
                placeholder={label}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 20,
        paddingBottom: 60,
    },
    typRow: {
        flexDirection: 'row',
        marginBottom: 20,
        gap: 10,
    },
    typButton: {
        flex: 1,
        paddingVertical: 10,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#ddd',
        alignItems: 'center',
    },
    typButtonActive: {
        backgroundColor: '#111',
        borderColor: '#111',
    },
    typText: {
        fontWeight: '600',
        color: '#555',
    },
    typTextActive: {
        color: '#fff',
    },
    section: {
        fontSize: 13,
        fontWeight: '700',
        color: '#999',
        textTransform: 'uppercase',
        letterSpacing: 1,
        marginTop: 20,
        marginBottom: 8,
    },
    fieldContainer: {
        marginBottom: 10,
    },
    label: {
        fontSize: 12,
        fontWeight: '600',
        color: '#555',
        marginBottom: 4,
    },
    input: {
        backgroundColor: '#f5f5f5',
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 10,
        paddingHorizontal: 14,
        paddingVertical: 11,
        fontSize: 15,
        color: '#111',
    },
    button: {
        marginTop: 28,
        backgroundColor: '#111',
        borderRadius: 10,
        paddingVertical: 14,
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '700',
    },
});
