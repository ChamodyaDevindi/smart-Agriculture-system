import React, { useState } from 'react';
import { StyleSheet, Pressable, View, ActivityIndicator } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export default function DiseaseDetectionScreen() {
  const safeAreaInsets = useSafeAreaInsets();
  const theme = useTheme();

  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  const handleAnalyze = () => {
    setAnalyzing(true);
    setResult(null);
    
    // Mimic processing delay
    setTimeout(() => {
      setAnalyzing(false);
      setResult('AI service is under development.');
    }, 1500);
  };

  const insets = {
    ...safeAreaInsets,
    bottom: safeAreaInsets.bottom + BottomTabInset + Spacing.three,
  };

  return (
    <ThemedView style={[styles.mainContainer, { backgroundColor: theme.background }]}>
      <ScrollView contentContainerStyle={[styles.container, { paddingTop: safeAreaInsets.top + Spacing.four }]}>
        <ThemedText type="subtitle" style={styles.title}>🍃 Plant Disease Scanner</ThemedText>
        <ThemedText type="small" themeColor="textSecondary" style={styles.subtitle}>
          Upload or capture a leaf photo to diagnose diseases
        </ThemedText>

        <ThemedView type="backgroundElement" style={styles.uploadArea}>
          <ThemedText style={styles.uploadEmoji}>📸</ThemedText>
          <ThemedText type="smallBold">Select Leaf Image</ThemedText>
          <ThemedText type="code" themeColor="textSecondary" style={styles.uploadSubText}>
            JPG or PNG formats supported
          </ThemedText>
        </ThemedView>

        <Pressable 
          style={({ pressed }) => [
            styles.actionButton, 
            { opacity: pressed || analyzing ? 0.8 : 1 }
          ]}
          onPress={handleAnalyze}
          disabled={analyzing}
        >
          {analyzing ? (
            <ActivityIndicator color="#ffffff" />
          ) : (
            <ThemedText style={styles.actionButtonText}>Analyze Leaf</ThemedText>
          )}
        </Pressable>

        {result ? (
          <ThemedView type="backgroundElement" style={styles.resultBox}>
            <ThemedText type="smallBold" style={styles.resultTitle}>⚠️ Status</ThemedText>
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
      </ScrollView>
    </ThemedView>
  );
}

// Inline wrapper helper for scroll view inside screen structure
import { ScrollView as NativeScrollView } from 'react-native';
const ScrollView = NativeScrollView;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
  },
  container: {
    paddingHorizontal: Spacing.four,
    maxWidth: MaxContentWidth,
    width: '100%',
    alignSelf: 'center',
    paddingBottom: Spacing.five,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
  },
  subtitle: {
    marginTop: 2,
    marginBottom: Spacing.four,
  },
  uploadArea: {
    borderRadius: Spacing.four,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: 'rgba(46, 125, 50, 0.3)',
    height: 220,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: Spacing.two,
  },
  uploadEmoji: {
    fontSize: 48,
    marginBottom: Spacing.two,
  },
  uploadSubText: {
    fontSize: 10,
    marginTop: 4,
  },
  actionButton: {
    backgroundColor: '#2e7d32',
    height: 48,
    borderRadius: Spacing.three,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: Spacing.three,
  },
  actionButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  resultBox: {
    borderRadius: Spacing.three,
    padding: Spacing.four,
    marginTop: Spacing.four,
    borderLeftWidth: 4,
    borderLeftColor: '#f57c00', // Status orange
  },
  resultTitle: {
    color: '#f57c00',
    marginBottom: Spacing.one,
  },
  resultBody: {
    fontSize: 15,
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
