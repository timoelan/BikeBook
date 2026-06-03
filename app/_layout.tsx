import { BikeDataProvider } from '@/context/BikeDataContext';
import { BikeProvider } from '@/context/BikeContext';
import { LogProvider } from '@/context/LogContext';
import { SpotProvider } from '@/context/SpotContext';
import { ThemeProvider } from '@/context/ThemeContext';
import { Stack } from 'expo-router';

export default function RootLayout() {
    return (
        <ThemeProvider>
            <BikeProvider>
                <BikeDataProvider>
                    <SpotProvider>
                        <LogProvider>
                            <Stack screenOptions={{ headerShown: false }}>
                                <Stack.Screen name="(tabs)" />
                                <Stack.Screen name="bike/[id]" options={{ presentation: 'modal' }} />
                                <Stack.Screen name="addBike" options={{ presentation: 'modal', headerShown: true, title: 'Bike hinzufügen' }} />
                                <Stack.Screen name="editBike" options={{ presentation: 'modal', headerShown: true, title: 'Bike bearbeiten' }} />
                                <Stack.Screen name="info" options={{ presentation: 'modal', headerShown: true, title: 'Bike Infos' }} />
                            </Stack>
                        </LogProvider>
                    </SpotProvider>
                </BikeDataProvider>
            </BikeProvider>
        </ThemeProvider>
    );
}
