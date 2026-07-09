import React, { useState, useEffect } from 'react';
import { StyleSheet, Pressable, ScrollView, View, ActivityIndicator, RefreshControl } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { useAuth, API_URL } from '@/context/AuthContext';

interface FarmData {
  crop: string;
  soilType: string;
  area: string;
  location: string;
}

interface WeatherForecast {
  day: string;
  temp: number;
  condition: string;
  icon: string;
}

interface WeatherData {
  location: string;
  temperature: number;
  condition: string;
  emoji: string;
  humidity: number;
  windSpeed: number;
  rainChance: number;
  forecast: WeatherForecast[];
}

export default function HomeScreen() {
  const safeAreaInsets = useSafeAreaInsets();
  const theme = useTheme();
  const { user, token } = useAuth();
  
  const [farm, setFarm] = useState<FarmData | null>(null);
  const [loadingFarm, setLoadingFarm] = useState(true);
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loadingWeather, setLoadingWeather] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchFarmDetails = async () => {
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
      if (data.success) {
        setFarm(data.data);
      } else {
        setFarm(null);
      }
    } catch (err) {
      console.warn('Error fetching farm details:', err);
    } finally {
      setLoadingFarm(false);
    }
  };

  const fetchWeather = async () => {
    try {
      const locationQuery = user?.location || 'Kandy';
      const response = await fetch(`${API_URL}/weather?location=${encodeURIComponent(locationQuery)}`);
      const data = await response.json();
      if (data.success) {
        setWeather(data.data);
      }
    } catch (err) {
      console.warn('Error fetching weather:', err);
    } finally {
      setLoadingWeather(false);
    }
  };

  const loadData = async () => {
    setLoadingFarm(true);
    setLoadingWeather(true);
    await Promise.all([fetchFarmDetails(), fetchWeather()]);
    setRefreshing(false);
  };

  useEffect(() => {
    loadData();
  }, [token, user?.location]);

  const onRefresh = () => {
    setRefreshing(true);
    loadData();
  };

  const insets = {
    ...safeAreaInsets,
    bottom: safeAreaInsets.bottom + BottomTabInset + Spacing.three,
  };

  return (
    <ScrollView
      style={[styles.scrollView, { backgroundColor: theme.background }]}
      contentInset={insets}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#2e7d32']} />
      }
      contentContainerStyle={[styles.contentContainer, { paddingBottom: insets.bottom + Spacing.six }]}
    >
      <ThemedView style={styles.container}>
        {/* Header Greeting */}
        <View style={styles.header}>
          <View>
            <ThemedText type="subtitle" style={styles.greeting}>
              Hello {user?.name || 'Farmer'} 👋
            </ThemedText>
            <ThemedText type="small" themeColor="textSecondary">
              Welcome back to your farming assistant
            </ThemedText>
          </View>
          <ThemedText style={styles.roleTag}>
            {user?.role === 'admin' ? '💼 Admin' : '👨🌾 Farmer'}
          </ThemedText>
        </View>

        {/* Weather Widget */}
        <ThemedView type="backgroundElement" style={styles.weatherCard}>
          {loadingWeather ? (
            <ActivityIndicator size="small" color="#2e7d32" style={{ marginVertical: Spacing.four }} />
          ) : weather ? (
            <View>
              <View style={styles.weatherHeaderRow}>
                <ThemedText type="smallBold" style={styles.weatherLocation}>
                  📍 {weather.location}
                </ThemedText>
              </View>
              
              <View style={styles.weatherMain}>
                <ThemedText style={styles.weatherIcon}>{weather.emoji}</ThemedText>
                <View>
                  <ThemedText type="subtitle" style={styles.weatherTemp}>{weather.temperature}°C</ThemedText>
                  <ThemedText type="smallBold" themeColor="textSecondary">{weather.condition}</ThemedText>
                </View>
              </View>
              
              <View style={styles.weatherDivider} />
              
              <View style={styles.weatherDetails}>
                <View style={styles.weatherDetailItem}>
                  <ThemedText type="small" themeColor="textSecondary">Humidity</ThemedText>
                  <ThemedText type="smallBold">{weather.humidity}%</ThemedText>
                </View>
                <VisualDivider />
                <View style={styles.weatherDetailItem}>
                  <ThemedText type="small" themeColor="textSecondary">Wind Speed</ThemedText>
                  <ThemedText type="smallBold">{weather.windSpeed} km/h</ThemedText>
                </View>
                <VisualDivider />
                <View style={styles.weatherDetailItem}>
                  <ThemedText type="small" themeColor="textSecondary">Rain Chance</ThemedText>
                  <ThemedText type="smallBold">{weather.rainChance}%</ThemedText>
                </View>
              </View>

              <View style={styles.weatherDivider} />

              {/* 3-day forecast row */}
              <ThemedText type="code" style={styles.forecastHeading}>3-Day Forecast</ThemedText>
              <View style={styles.forecastRow}>
                {weather.forecast.map((f, i) => (
                  <View key={i} style={styles.forecastCard}>
                    <ThemedText type="small" themeColor="textSecondary">{f.day}</ThemedText>
                    <ThemedText style={styles.forecastIcon}>{f.icon}</ThemedText>
                    <ThemedText type="smallBold">{f.temp}°C</ThemedText>
                  </View>
                ))}
              </View>
            </View>
          ) : (
            <ThemedText type="small" themeColor="textSecondary">Failed to load weather data.</ThemedText>
          )}
        </ThemedView>

        {/* Farm Details Card */}
        <ThemedView type="backgroundElement" style={styles.farmCard}>
          <ThemedText type="smallBold" style={styles.sectionTitle}>🌾 Primary Farm Details</ThemedText>
          
          {loadingFarm ? (
            <ActivityIndicator size="small" color="#2e7d32" style={{ marginVertical: Spacing.three }} />
          ) : farm ? (
            <View style={styles.farmGrid}>
              <View style={styles.farmInfoBlock}>
                <ThemedText type="small" themeColor="textSecondary">Location</ThemedText>
                <ThemedText type="default" style={styles.farmVal}>{farm.location || user?.location || 'Not Specified'}</ThemedText>
              </View>
              <View style={styles.farmInfoBlock}>
                <ThemedText type="small" themeColor="textSecondary">Current Crop</ThemedText>
                <ThemedText type="default" style={styles.farmVal}>{farm.crop}</ThemedText>
              </View>
              <View style={styles.farmInfoBlock}>
                <ThemedText type="small" themeColor="textSecondary">Soil Type</ThemedText>
                <ThemedText type="default" style={styles.farmVal}>{farm.soilType}</ThemedText>
              </View>
              <View style={styles.farmInfoBlock}>
                <ThemedText type="small" themeColor="textSecondary">Land Area</ThemedText>
                <ThemedText type="default" style={styles.farmVal}>{farm.area}</ThemedText>
              </View>
            </View>
          ) : (
            <View style={styles.emptyFarm}>
              <ThemedText type="small" themeColor="textSecondary" style={{ marginBottom: Spacing.two }}>
                You haven't added your farm details yet.
              </ThemedText>
              <Pressable style={styles.smallButton} onPress={() => router.push('/farm-details')}>
                <ThemedText style={styles.smallButtonText}>+ Add Farm Details</ThemedText>
              </Pressable>
            </View>
          )}
        </ThemedView>

        {/* Quick Actions Grid */}
        <ThemedText type="smallBold" style={styles.sectionHeading}>⚡ Quick Actions</ThemedText>
        <View style={styles.grid}>
          <Pressable style={styles.gridItem} onPress={() => router.push('/farm-details')}>
            <ThemedView type="backgroundElement" style={styles.gridCard}>
              <ThemedText style={styles.gridEmoji}>🚜</ThemedText>
              <ThemedText type="smallBold" style={styles.gridLabel}>My Farm</ThemedText>
              <ThemedText type="code" style={styles.gridSubText}>Details</ThemedText>
            </ThemedView>
          </Pressable>

          <Pressable style={styles.gridItem} onPress={() => router.push('/disease-detection')}>
            <ThemedView type="backgroundElement" style={styles.gridCard}>
              <ThemedText style={styles.gridEmoji}>🔍</ThemedText>
              <ThemedText type="smallBold" style={styles.gridLabel}>Disease Scan</ThemedText>
              <ThemedText type="code" style={styles.gridSubText}>AI Detect</ThemedText>
            </ThemedView>
          </Pressable>

          <Pressable style={styles.gridItem} onPress={() => router.push('/crop-recommendation')}>
            <ThemedView type="backgroundElement" style={styles.gridCard}>
              <ThemedText style={styles.gridEmoji}>💡</ThemedText>
              <ThemedText type="smallBold" style={styles.gridLabel}>Crop Advice</ThemedText>
              <ThemedText type="code" style={styles.gridSubText}>ML Recommend</ThemedText>
            </ThemedView>
          </Pressable>

          <Pressable style={styles.gridItem} onPress={() => router.push('/marketplace')}>
            <ThemedView type="backgroundElement" style={styles.gridCard}>
              <ThemedText style={styles.gridEmoji}>🛒</ThemedText>
              <ThemedText type="smallBold" style={styles.gridLabel}>Marketplace</ThemedText>
              <ThemedText type="code" style={styles.gridSubText}>Sell Crop</ThemedText>
            </ThemedView>
          </Pressable>

          <Pressable style={styles.gridItem} onPress={() => router.push('/profile')}>
            <ThemedView type="backgroundElement" style={styles.gridCard}>
              <ThemedText style={styles.gridEmoji}>👤</ThemedText>
              <ThemedText type="smallBold" style={styles.gridLabel}>My Profile</ThemedText>
              <ThemedText type="code" style={styles.gridSubText}>Account</ThemedText>
            </ThemedView>
          </Pressable>

          {user?.role === 'admin' ? (
            <Pressable style={styles.gridItem} onPress={() => router.push('/admin-dashboard')}>
              <ThemedView type="backgroundElement" style={styles.gridCard}>
                <ThemedText style={styles.gridEmoji}>🔑</ThemedText>
                <ThemedText type="smallBold" style={styles.gridLabel}>Admin Dashboard</ThemedText>
                <ThemedText type="code" style={styles.gridSubText}>Control</ThemedText>
              </ThemedView>
            </Pressable>
          ) : null}
        </View>
      </ThemedView>
    </ScrollView>
  );
}

function VisualDivider() {
  const theme = useTheme();
  return <View style={{ width: 1, height: 24, backgroundColor: theme.backgroundSelected }} />;
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    padding: Spacing.four,
    alignItems: 'center',
  },
  container: {
    maxWidth: MaxContentWidth,
    width: '100%',
    gap: Spacing.four,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: Spacing.three,
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  roleTag: {
    paddingHorizontal: Spacing.two,
    paddingVertical: 4,
    borderRadius: Spacing.one,
    backgroundColor: 'rgba(46, 125, 50, 0.15)',
    color: '#2e7d32',
    fontWeight: 'bold',
    fontSize: 12,
  },
  weatherCard: {
    borderRadius: Spacing.four,
    padding: Spacing.four,
    borderWidth: 1,
    borderColor: 'rgba(0, 128, 0, 0.05)',
  },
  weatherHeaderRow: {
    marginBottom: Spacing.two,
  },
  weatherMain: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
  },
  weatherIcon: {
    fontSize: 38,
  },
  weatherTemp: {
    fontSize: 32,
    fontWeight: 'bold',
    lineHeight: 36,
  },
  weatherDivider: {
    height: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.06)',
    marginVertical: Spacing.three,
  },
  weatherDetails: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  weatherDetailItem: {
    flex: 1,
    alignItems: 'center',
  },
  weatherLocation: {
    fontSize: 13,
    color: '#2e7d32',
  },
  forecastHeading: {
    fontSize: 10,
    textTransform: 'uppercase',
    marginBottom: Spacing.two,
  },
  forecastRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: Spacing.two,
  },
  forecastCard: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: Spacing.two,
    backgroundColor: 'rgba(0,0,0,0.02)',
    borderRadius: Spacing.two,
  },
  forecastIcon: {
    fontSize: 20,
    marginVertical: 4,
  },
  farmCard: {
    borderRadius: Spacing.four,
    padding: Spacing.four,
    borderWidth: 1,
    borderColor: 'rgba(0, 128, 0, 0.05)',
  },
  sectionTitle: {
    color: '#2e7d32',
    marginBottom: Spacing.three,
  },
  farmGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.three,
  },
  farmInfoBlock: {
    width: '47%',
    padding: Spacing.two,
    borderRadius: Spacing.two,
    backgroundColor: 'rgba(0, 0, 0, 0.02)',
  },
  farmVal: {
    fontWeight: 'bold',
    marginTop: 2,
    fontSize: 15,
  },
  emptyFarm: {
    alignItems: 'center',
    paddingVertical: Spacing.two,
  },
  smallButton: {
    backgroundColor: '#2e7d32',
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    borderRadius: Spacing.two,
  },
  smallButtonText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  sectionHeading: {
    fontSize: 16,
    marginTop: Spacing.two,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.three,
    justifyContent: 'space-between',
  },
  gridItem: {
    width: '47%',
  },
  gridCard: {
    borderRadius: Spacing.three,
    padding: Spacing.four,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.04)',
    height: 120,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.02,
    shadowRadius: 4,
    elevation: 1,
  },
  gridEmoji: {
    fontSize: 28,
    marginBottom: Spacing.one,
  },
  gridLabel: {
    fontSize: 14,
    textAlign: 'center',
  },
  gridSubText: {
    fontSize: 9,
    marginTop: 2,
    textTransform: 'uppercase',
  },
});
