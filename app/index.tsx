import BikeCard from '@/components/bikeCard';
import { useBike } from '@/context/BikeContext';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function Index() {
  const { bikeList, removeBike } = useBike();

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.list} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>BikeBook</Text>
        {bikeList.map((bike) => (
          <BikeCard
            key={bike.id}
            bike={bike}
            onDelete={() =>
              Alert.alert(
                'Bike löschen',
                `${bike.marke} ${bike.modell} wirklich löschen?`,
                [
                  { text: 'Abbrechen', style: 'cancel' },
                  { text: 'Löschen', style: 'destructive', onPress: () => removeBike(bike.id) },
                ]
              )
            }
          />
        ))}
      </ScrollView>

      <TouchableOpacity style={styles.addButton} onPress={() => router.push('/addBike')}>
        <Ionicons name="add" size={32} color="#fff" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  list: {
    padding: 16,
    paddingBottom: 100,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    marginBottom: 20,
    color: '#111',
  },
  addButton: {
    position: 'absolute',
    bottom: 28,
    right: 24,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#111',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
  },
});
