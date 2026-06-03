import React from 'react';
import { Stack } from 'expo-router';
import { BikeProvider } from '../context/BikeContext';
import { BikeDataProvider } from '../context/BikeDataContext';

export default function RootLayout() {
  return (
    <BikeProvider>
      <BikeDataProvider>
        <Stack>
          <Stack.Screen name="index" options={{ title: 'Meine Bikes' }} />
          <Stack.Screen name="addBike" options={{ title: 'Bike hinzufügen' }} />
          <Stack.Screen name="info" options={{ title: 'Bike Infos' }} />
        </Stack>
      </BikeDataProvider>
    </BikeProvider>
  );
}