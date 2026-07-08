import React, { useState } from 'react';
import { StyleSheet, TextInput, Pressable, ActivityIndicator, View, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { ThemedText } from './themed-text';
import { ThemedView } from './themed-view';
import { useAuth } from '../context/AuthContext';
import { Spacing } from '../constants/theme';
import { useTheme } from '../hooks/use-theme';

interface RegisterScreenProps {
  onNavigateToLogin: () => void;
}

export function RegisterScreen({ onNavigateToLogin }: RegisterScreenProps) {
  const { register } = useAuth();
  const theme = useTheme();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'farmer' | 'admin'>('farmer');
  const [location, setLocation] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleRegister = async () => {
    if (!name.trim() || !email.trim() || !password.trim() || !location.trim()) {
      setError('All fields are required.');
      return;
    }
    setError('');
    setLoading(true);

    try {
      const result = await register(
        name.trim(),
        email.trim(),
        password,
        role,
        location.trim()
      );
      if (!result.success) {
        setError(result.message || 'Registration failed.');
      }
    } catch (err) {
      setError('Something went wrong. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={[styles.container, { backgroundColor: theme.background }]}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
        <ThemedView style={styles.card}>
          <View style={styles.header}>
            <ThemedText style={styles.emoji}>🌱</ThemedText>
            <ThemedText type="subtitle" style={styles.title}>Join SmartAgri</ThemedText>
            <ThemedText type="small" themeColor="textSecondary" style={styles.subtitle}>
              Register as a Farmer or Admin
            </ThemedText>
          </View>

          {error ? (
            <View style={styles.errorContainer}>
              <ThemedText style={styles.errorText}>{error}</ThemedText>
            </View>
          ) : null}

          <View style={styles.form}>
            <View style={styles.inputGroup}>
              <ThemedText type="smallBold" style={styles.label}>Full Name</ThemedText>
              <TextInput
                style={[styles.input, {
                  color: theme.text,
                  backgroundColor: theme.backgroundElement,
                  borderColor: theme.backgroundSelected
                }]}
                placeholder="Kamal Perera"
                placeholderTextColor={theme.textSecondary}
                value={name}
                onChangeText={setName}
              />
            </View>

            <View style={styles.inputGroup}>
              <ThemedText type="smallBold" style={styles.label}>Email Address</ThemedText>
              <TextInput
                style={[styles.input, {
                  color: theme.text,
                  backgroundColor: theme.backgroundElement,
                  borderColor: theme.backgroundSelected
                }]}
                placeholder="kamal@gmail.com"
                placeholderTextColor={theme.textSecondary}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>

            <View style={styles.inputGroup}>
              <ThemedText type="smallBold" style={styles.label}>Password</ThemedText>
              <TextInput
                style={[styles.input, {
                  color: theme.text,
                  backgroundColor: theme.backgroundElement,
                  borderColor: theme.backgroundSelected
                }]}
                placeholder="Minimum 6 characters"
                placeholderTextColor={theme.textSecondary}
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>

            <View style={styles.inputGroup}>
              <ThemedText type="smallBold" style={styles.label}>I am a...</ThemedText>
              <View style={styles.roleContainer}>
                <Pressable
                  style={[
                    styles.roleOption,
                    role === 'farmer' && styles.roleOptionActive,
                    { borderColor: theme.backgroundSelected }
                  ]}
                  onPress={() => setRole('farmer')}
                >
                  <ThemedText style={role === 'farmer' ? styles.roleTextActive : { color: theme.text }}>
                    🧑🌾 Farmer
                  </ThemedText>
                </Pressable>
                <Pressable
                  style={[
                    styles.roleOption,
                    role === 'admin' && styles.roleOptionActive,
                    { borderColor: theme.backgroundSelected }
                  ]}
                  onPress={() => setRole('admin')}
                >
                  <ThemedText style={role === 'admin' ? styles.roleTextActive : { color: theme.text }}>
                    💼 Admin
                  </ThemedText>
                </Pressable>
              </View>
            </View>

            <View style={styles.inputGroup}>
              <ThemedText type="smallBold" style={styles.label}>Location / District</ThemedText>
              <TextInput
                style={[styles.input, {
                  color: theme.text,
                  backgroundColor: theme.backgroundElement,
                  borderColor: theme.backgroundSelected
                }]}
                placeholder="e.g. Kandy, Gampaha"
                placeholderTextColor={theme.textSecondary}
                value={location}
                onChangeText={setLocation}
              />
            </View>

            <Pressable
              style={({ pressed }) => [
                styles.button,
                { opacity: pressed || loading ? 0.8 : 1 }
              ]}
              onPress={handleRegister}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#ffffff" />
              ) : (
                <ThemedText style={styles.buttonText}>Register</ThemedText>
              )}
            </Pressable>
          </View>

          <View style={styles.footer}>
            <ThemedText type="small" themeColor="textSecondary">Already registered? </ThemedText>
            <Pressable onPress={onNavigateToLogin}>
              <ThemedText type="smallBold" style={styles.linkText}>Login instead</ThemedText>
            </Pressable>
          </View>
        </ThemedView>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: Spacing.four,
  },
  card: {
    borderRadius: Spacing.five,
    padding: Spacing.five,
    width: '100%',
    maxWidth: 420,
    alignSelf: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 15,
    elevation: 5,
    borderWidth: 1,
    borderColor: 'rgba(0, 128, 0, 0.08)',
  },
  header: {
    alignItems: 'center',
    marginBottom: Spacing.four,
  },
  emoji: {
    fontSize: 48,
    marginBottom: Spacing.one,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2e7d32',
  },
  subtitle: {
    marginTop: Spacing.one,
    textAlign: 'center',
  },
  errorContainer: {
    backgroundColor: '#ffebee',
    borderRadius: Spacing.two,
    padding: Spacing.two,
    marginBottom: Spacing.four,
    borderWidth: 1,
    borderColor: '#ffcdd2',
  },
  errorText: {
    color: '#c62828',
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
    marginBottom: 2,
  },
  input: {
    height: 48,
    borderRadius: Spacing.three,
    paddingHorizontal: Spacing.three,
    fontSize: 16,
    borderWidth: 1,
  },
  roleContainer: {
    flexDirection: 'row',
    gap: Spacing.three,
    marginTop: 2,
  },
  roleOption: {
    flex: 1,
    height: 48,
    borderRadius: Spacing.three,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.02)',
  },
  roleOptionActive: {
    backgroundColor: 'rgba(46, 125, 50, 0.15)',
    borderColor: '#2e7d32',
  },
  roleTextActive: {
    color: '#2e7d32',
    fontWeight: 'bold',
  },
  button: {
    backgroundColor: '#2e7d32',
    height: 48,
    borderRadius: Spacing.three,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: Spacing.three,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: Spacing.five,
  },
  linkText: {
    color: '#2e7d32',
  },
});
