import { DarkTheme, DefaultTheme, ThemeProvider } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useColorScheme, ActivityIndicator, StyleSheet } from 'react-native';
import React, { useState } from 'react';

import { AnimatedSplashOverlay } from '@/components/animated-icon';
import AppTabs from '@/components/app-tabs';
import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';

import { AuthProvider, useAuth } from '@/context/AuthContext';
import { LoginScreen } from '@/components/login-screen';
import { RegisterScreen } from '@/components/register-screen';

SplashScreen.preventAutoHideAsync();

export default function TabLayout() {
  const colorScheme = useColorScheme();
  
  return (
    <AuthProvider>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <AnimatedSplashOverlay />
        <MainLayout />
      </ThemeProvider>
    </AuthProvider>
  );
}

function MainLayout() {
  const { user, loading } = useAuth();
  const [showRegister, setShowRegister] = useState(false);

  if (loading) {
    return (
      <ThemedView style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#2e7d32" />
        <ThemedText style={styles.loadingText} themeColor="textSecondary">
          Loading smart agriculture system...
        </ThemedText>
      </ThemedView>
    );
  }

  if (!user) {
    return showRegister ? (
      <RegisterScreen onNavigateToLogin={() => setShowRegister(false)} />
    ) : (
      <LoginScreen onNavigateToRegister={() => setShowRegister(true)} />
    );
  }

  return <AppTabs />;
}

const styles = StyleSheet.create({
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
  },
  loadingText: {
    fontSize: 16,
  },
});
