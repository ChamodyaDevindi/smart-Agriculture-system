import React from 'react';
import { StyleSheet, Pressable, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export default function AdminDashboardScreen() {
  const safeAreaInsets = useSafeAreaInsets();
  const theme = useTheme();

  return (
    <ThemedView style={[styles.mainContainer, { backgroundColor: theme.background }]}>
      <ScrollView contentContainerStyle={[styles.container, { paddingTop: safeAreaInsets.top + Spacing.four }]}>
        <ThemedText type="subtitle" style={styles.title}>💼 Admin Dashboard</ThemedText>
        
        <ThemedView type="backgroundElement" style={styles.card}>
          <ThemedText style={styles.emoji}>🛡️</ThemedText>
          <ThemedText type="subtitle" style={styles.cardTitle}>Admin Control Center</ThemedText>
          <ThemedText type="default" themeColor="textSecondary" style={styles.cardBody}>
            The system administrative utilities (Manage Users, Price Feeds, Disease Log Analytics) are scheduled for integration in Phase 10.
          </ThemedText>
        </ThemedView>

        <Pressable 
          style={({ pressed }) => [
            styles.backButton, 
            { opacity: pressed ? 0.8 : 1 }
          ]} 
          onPress={() => router.push('/')}
        >
          <ThemedText type="small" themeColor="textSecondary" style={styles.backButtonText}>
            ← Back to Home
          </ThemedText>
        </Pressable>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
  },
  container: {
    paddingHorizontal: Spacing.four,
    maxWidth: MaxContentWidth,
    width: '100%',
    alignSelf: 'center',
    paddingBottom: Spacing.six,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
  },
  card: {
    borderRadius: Spacing.four,
    padding: Spacing.five,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: Spacing.three,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.04)',
  },
  emoji: {
    fontSize: 54,
    marginBottom: Spacing.two,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: Spacing.one,
  },
  cardBody: {
    textAlign: 'center',
    fontSize: 14,
    lineHeight: 20,
  },
  backButton: {
    alignItems: 'center',
    marginTop: Spacing.six,
    paddingVertical: Spacing.two,
  },
  backButtonText: {
    textAlign: 'center',
  },
});
