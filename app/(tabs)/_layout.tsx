import { useTheme } from '@/context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';

export default function TabLayout() {
    const { theme } = useTheme();

    return (
        <Tabs screenOptions={{
            headerShown: false,
            tabBarStyle: {
                backgroundColor: theme.tabBar,
                borderTopColor: theme.border,
                borderTopWidth: 1,
                height: 82,
                paddingBottom: 24,
                paddingTop: 10,
            },
            tabBarActiveTintColor: theme.accent,
            tabBarInactiveTintColor: theme.subtext,
            tabBarLabelStyle: {
                fontSize: 11,
                fontWeight: '600',
            },
        }}>
            <Tabs.Screen
                name="index"
                options={{
                    title: 'Bikes',
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="bicycle" size={size} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="map"
                options={{
                    title: 'Karte',
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="map" size={size} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="logbook"
                options={{
                    title: 'Logbuch',
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="document-text" size={size} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="settings"
                options={{
                    title: 'Design',
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="color-palette" size={size} color={color} />
                    ),
                }}
            />
        </Tabs>
    );
}
