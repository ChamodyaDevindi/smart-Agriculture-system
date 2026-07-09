import React, { useState } from 'react';
import { StyleSheet, TextInput, Pressable, View, ActivityIndicator, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export default function CropRecommendationScreen() {
  const safeAreaInsets = useSafeAreaInsets();
  const theme = useTheme();

  const [soilType, setSoilType] = useState('');
  const [temperature, setTemperature] = useState('');
  const [humidity, setHumidity] = useState('');
  const [rainfall, setRainfall] = useState('');
  
  const [recommending, setRecommending] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  const handleRecommend = () => {
    if (!soilType.trim() || !temperature.trim() || !humidity.trim() || !rainfall.trim()) {
      setResult('Please fill in all parameter fields to run calculations.');
      return;
    }
    
    setRecommending(true);
    setResult(null);

    // Mimic processing delay
    setTimeout(() => {
      setRecommending(false);
      setResult('Recommendation will appear here.');
    }, 1500);
  };

  return (
    <ThemedView style={[styles.mainContainer, { backgroundColor: theme.background }]}>
      <ScrollView contentContainerStyle={[styles.container, { paddingTop: safeAreaInsets.top + Spacing.four }]}>
        <ThemedView style={styles.card}>
          <ThemedText type="subtitle" style={styles.title}>💡 Crop Recommendation</ThemedText>
          <ThemedText type="small" themeColor="textSecondary" style={styles.subtitle}>
            Enter soil and weather conditions to get recommended crops
          </ThemedText>

          <View style={styles.form}>
            <View style={styles.inputGroup}>
              <ThemedText type="smallBold" style={styles.label}>Soil Type</ThemedText>
              <TextInput
                style={[styles.input, {
                  color: theme.text,
                  backgroundColor: theme.backgroundElement,
                  borderColor: theme.backgroundSelected
                }]}
                placeholder="e.g. Clay, Sandy, Silt"
                placeholderTextColor={theme.textSecondary}
                value={soilType}
                onChangeText={setSoilType}
              />
            </View>

            <View style={styles.inputGroup}>
              <ThemedText type="smallBold" style={styles.label}>Temperature (°C)</ThemedText>
              <TextInput
                style={[styles.input, {
                  color: theme.text,
                  backgroundColor: theme.backgroundElement,
                  borderColor: theme.backgroundSelected
                }]}
                placeholder="e.g. 30"
                placeholderTextColor={theme.textSecondary}
                value={temperature}
                onChangeText={setTemperature}
                keyboardType="numeric"
              />
            </View>

            <View style={styles.inputGroup}>
              <ThemedText type="smallBold" style={styles.label}>Humidity (%)</ThemedText>
              <TextInput
                style={[styles.input, {
                  color: theme.text,
                  backgroundColor: theme.backgroundElement,
                  borderColor: theme.backgroundSelected
                }]}
                placeholder="e.g. 75"
                placeholderTextColor={theme.textSecondary}
                value={humidity}
                onChangeText={setHumidity}
                keyboardType="numeric"
              />
            </View>

            <View style={styles.inputGroup}>
              <ThemedText type="smallBold" style={styles.label}>Rainfall (mm)</ThemedText>
              <TextInput
                style={[styles.input, {
                  color: theme.text,
                  backgroundColor: theme.backgroundElement,
                  borderColor: theme.backgroundSelected
                }]}
                placeholder="e.g. 150"
                placeholderTextColor={theme.textSecondary}
                value={rainfall}
                onChangeText={setRainfall}
                keyboardType="numeric"
              />
            </View>

            <Pressable
              style={({ pressed }) => [
                styles.recommendButton,
                { opacity: pressed || recommending ? 0.8 : 1 }
              ]}
              onPress={handleRecommend}
              disabled={recommending}
            >
              {recommending ? (
                <ActivityIndicator color="#ffffff" />
              ) : (
                <ThemedText style={styles.recommendText}>Recommend Crop</ThemedText>
              )}
            </Pressable>
          </View>

          {result ? (
            <ThemedView type="backgroundElement" style={styles.resultBox}>
              <ThemedText type="smallBold" style={styles.resultTitle}>📋 Result</ThemedText>
              <ThemedText type="default" style={styles.resultBody}>{result}</ThemedText>
            </ThemedView>
          ) : null}

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
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
  },
  container: {
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
  recommendButton: {
    backgroundColor: '#2e7d32',
    height: 48,
    borderRadius: Spacing.three,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: Spacing.three,
  },
  recommendText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  resultBox: {
    borderRadius: Spacing.three,
    padding: Spacing.four,
    marginTop: Spacing.four,
    borderLeftWidth: 4,
    borderLeftColor: '#2e7d32',
  },
  resultTitle: {
    color: '#2e7d32',
    marginBottom: Spacing.one,
  },
  resultBody: {
    fontSize: 15,
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
