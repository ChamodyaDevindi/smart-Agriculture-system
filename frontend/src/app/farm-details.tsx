import React, { useState, useEffect } from 'react';
import { StyleSheet, TextInput, Pressable, ActivityIndicator, View, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { useAuth, API_URL } from '@/context/AuthContext';

export default function FarmDetailsScreen() {
  const safeAreaInsets = useSafeAreaInsets();
  const theme = useTheme();
  const { token } = useAuth();

  const [crop, setCrop] = useState('');
  const [soilType, setSoilType] = useState('');
  const [area, setArea] = useState('');
  const [location, setLocation] = useState('');
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ text: '', type: 'success' }); // type: 'success' | 'error'

  useEffect(() => {
    const fetchFarm = async () => {
      if (!token) return;
      try {
        const response = await fetch(`${API_URL}/farm`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        const data = await response.json();
        if (data.success && data.data) {
          setCrop(data.data.crop || '');
          setSoilType(data.data.soilType || '');
          setArea(data.data.area || '');
          setLocation(data.data.location || '');
        }
      } catch (err) {
        console.warn('Could not fetch farm details:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchFarm();
  }, [token]);

  const handleSave = async () => {
    if (!crop.trim() || !soilType.trim() || !area.trim()) {
      setMessage({ text: 'Please fill in Crop, Soil Type, and Area fields.', type: 'error' });
      return;
    }
    
    setSaving(true);
    setMessage({ text: '', type: 'success' });

    try {
      const response = await fetch(`${API_URL}/farm`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          crop: crop.trim(),
          soilType: soilType.trim(),
          area: area.trim(),
          location: location.trim(),
        }),
      });

      const data = await response.json();

      if (data.success) {
        setMessage({ text: 'Farm details updated successfully!', type: 'success' });
      } else {
        setMessage({ text: data.message || 'Failed to save farm details.', type: 'error' });
      }
    } catch (err) {
      setMessage({ text: 'Network connection failed. Try again.', type: 'error' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <ThemedView style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#2e7d32" />
        <ThemedText themeColor="textSecondary">Loading farm profile...</ThemedText>
      </ThemedView>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={[styles.mainContainer, { backgroundColor: theme.background }]}
    >
      <ScrollView contentContainerStyle={[styles.scrollContainer, { paddingTop: safeAreaInsets.top + Spacing.four }]}>
        <ThemedView style={styles.card}>
          <ThemedText type="subtitle" style={styles.title}>🌾 My Farm Details</ThemedText>
          <ThemedText type="small" themeColor="textSecondary" style={styles.subtitle}>
            Manage and update your primary farm specs
          </ThemedText>

          {message.text ? (
            <View style={[
              styles.msgContainer,
              message.type === 'error' ? styles.errContainer : styles.successContainer
            ]}>
              <ThemedText style={message.type === 'error' ? styles.errText : styles.successText}>
                {message.text}
              </ThemedText>
            </View>
          ) : null}

          <View style={styles.form}>
            <View style={styles.inputGroup}>
              <ThemedText type="smallBold" style={styles.label}>Cultivated Crop Name</ThemedText>
              <TextInput
                style={[styles.input, {
                  color: theme.text,
                  backgroundColor: theme.backgroundElement,
                  borderColor: theme.backgroundSelected
                }]}
                placeholder="e.g. Rice, Carrot, Tomato"
                placeholderTextColor={theme.textSecondary}
                value={crop}
                onChangeText={setCrop}
              />
            </View>

            <View style={styles.inputGroup}>
              <ThemedText type="smallBold" style={styles.label}>Soil Classification Type</ThemedText>
              <TextInput
                style={[styles.input, {
                  color: theme.text,
                  backgroundColor: theme.backgroundElement,
                  borderColor: theme.backgroundSelected
                }]}
                placeholder="e.g. Clay, Sandy Loam, Clay Loam"
                placeholderTextColor={theme.textSecondary}
                value={soilType}
                onChangeText={setSoilType}
              />
            </View>

            <View style={styles.inputGroup}>
              <ThemedText type="smallBold" style={styles.label}>Cultivated Land Area</ThemedText>
              <TextInput
                style={[styles.input, {
                  color: theme.text,
                  backgroundColor: theme.backgroundElement,
                  borderColor: theme.backgroundSelected
                }]}
                placeholder="e.g. 2.5 acres, 1 hectare"
                placeholderTextColor={theme.textSecondary}
                value={area}
                onChangeText={setArea}
              />
            </View>

            <View style={styles.inputGroup}>
              <ThemedText type="smallBold" style={styles.label}>Farm Specific Location / Division</ThemedText>
              <TextInput
                style={[styles.input, {
                  color: theme.text,
                  backgroundColor: theme.backgroundElement,
                  borderColor: theme.backgroundSelected
                }]}
                placeholder="e.g. Kandy East, Gampaha Block A"
                placeholderTextColor={theme.textSecondary}
                value={location}
                onChangeText={setLocation}
              />
            </View>

            <Pressable
              style={({ pressed }) => [
                styles.saveButton,
                { opacity: pressed || saving ? 0.8 : 1 }
              ]}
              onPress={handleSave}
              disabled={saving}
            >
              {saving ? (
                <ActivityIndicator color="#ffffff" />
              ) : (
                <ThemedText style={styles.saveText}>Save details</ThemedText>
              )}
            </Pressable>
          </View>

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
        </ThemedView>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: Spacing.three,
  },
  mainContainer: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: Spacing.four,
    justifyContent: 'center',
    paddingBottom: Spacing.six,
  },
  card: {
    borderRadius: Spacing.five,
    padding: Spacing.five,
    width: '100%',
    maxWidth: 460,
    alignSelf: 'center',
    borderWidth: 1,
    borderColor: 'rgba(0,128,0,0.05)',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  subtitle: {
    marginTop: 2,
    marginBottom: Spacing.four,
  },
  msgContainer: {
    borderRadius: Spacing.two,
    padding: Spacing.two,
    marginBottom: Spacing.four,
    borderWidth: 1,
  },
  errContainer: {
    backgroundColor: '#ffebee',
    borderColor: '#ffcdd2',
  },
  successContainer: {
    backgroundColor: '#e8f5e9',
    borderColor: '#c8e6c9',
  },
  errText: {
    color: '#c62828',
    fontSize: 14,
    textAlign: 'center',
  },
  successText: {
    color: '#2e7d32',
    fontSize: 14,
    textAlign: 'center',
  },
  form: {
    gap: Spacing.three,
  },
  inputGroup: {
    gap: Spacing.one,
  },
  label: {
    fontSize: 14,
  },
  input: {
    height: 48,
    borderRadius: Spacing.three,
    paddingHorizontal: Spacing.three,
    fontSize: 16,
    borderWidth: 1,
  },
  saveButton: {
    backgroundColor: '#2e7d32',
    height: 48,
    borderRadius: Spacing.three,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: Spacing.three,
  },
  saveText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  backButton: {
    alignItems: 'center',
    marginTop: Spacing.four,
    paddingVertical: Spacing.two,
  },
  backButtonText: {
    textAlign: 'center',
  },
});
