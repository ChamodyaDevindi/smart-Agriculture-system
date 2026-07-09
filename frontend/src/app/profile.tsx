import React from 'react';
import { StyleSheet, Pressable, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { useAuth } from '@/context/AuthContext';

export default function ProfileScreen() {
  const safeAreaInsets = useSafeAreaInsets();
  const theme = useTheme();
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    // No redirect needed as _layout automatically catches user=null and shows LoginScreen
  };

  const insets = {
    ...safeAreaInsets,
    bottom: safeAreaInsets.bottom + BottomTabInset + Spacing.three,
  };

  return (
    <ThemedView style={[styles.mainContainer, { backgroundColor: theme.background }]}>
      <View style={[styles.container, { paddingTop: safeAreaInsets.top + Spacing.four }]}>
        <ThemedText type="subtitle" style={styles.title}>My Account</ThemedText>
        
        <ThemedView type="backgroundElement" style={styles.profileCard}>
          <View style={styles.avatarContainer}>
            <ThemedText style={styles.avatarEmoji}>🧑🌾</ThemedText>
          </View>
          <ThemedText type="subtitle" style={styles.nameText}>{user?.name}</ThemedText>
          <ThemedText type="small" themeColor="textSecondary" style={styles.roleTag}>
            {user?.role?.toUpperCase()}
          </ThemedText>

          <View style={styles.detailsList}>
            <View style={styles.detailRow}>
              <ThemedText type="small" themeColor="textSecondary">Email Address</ThemedText>
              <ThemedText type="default" style={styles.detailVal}>{user?.email}</ThemedText>
            </View>
            <View style={styles.divider} />
            <View style={styles.detailRow}>
              <ThemedText type="small" themeColor="textSecondary">District / Location</ThemedText>
              <ThemedText type="default" style={styles.detailVal}>{user?.location || 'Not Specified'}</ThemedText>
            </View>
            <View style={styles.divider} />
            <View style={styles.detailRow}>
              <ThemedText type="small" themeColor="textSecondary">Account Status</ThemedText>
              <ThemedText type="default" style={[styles.detailVal, { color: '#2e7d32', fontWeight: 'bold' }]}>Active</ThemedText>
            </View>
          </View>
        </ThemedView>

        <Pressable 
          style={({ pressed }) => [
            styles.logoutButton, 
            { opacity: pressed ? 0.8 : 1 }
          ]} 
          onPress={handleLogout}
        >
          <ThemedText style={styles.logoutText}>Sign Out</ThemedText>
        </Pressable>

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
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
  },
  container: {
    flex: 1,
    paddingHorizontal: Spacing.four,
    maxWidth: MaxContentWidth,
    width: '100%',
    alignSelf: 'center',
    gap: Spacing.four,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: Spacing.one,
  },
  profileCard: {
    borderRadius: Spacing.four,
    padding: Spacing.five,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(46, 125, 50, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.three,
  },
  avatarEmoji: {
    fontSize: 42,
  },
  nameText: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  roleTag: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#2e7d32',
    backgroundColor: 'rgba(46, 125, 50, 0.1)',
    paddingHorizontal: Spacing.two,
    paddingVertical: 2,
    borderRadius: 4,
    marginTop: Spacing.one,
    letterSpacing: 1,
  },
  detailsList: {
    width: '100%',
    marginTop: Spacing.four,
    gap: Spacing.two,
  },
  detailRow: {
    paddingVertical: Spacing.two,
  },
  detailVal: {
    fontWeight: '600',
    marginTop: 2,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(0,0,0,0.05)',
  },
  logoutButton: {
    backgroundColor: '#d32f2f', // Premium red
    height: 48,
    borderRadius: Spacing.three,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: Spacing.two,
  },
  logoutText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  backButton: {
    alignItems: 'center',
    paddingVertical: Spacing.two,
  },
  backButtonText: {
    textAlign: 'center',
  },
});
