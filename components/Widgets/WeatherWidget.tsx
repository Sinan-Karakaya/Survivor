import React, { useEffect, useState } from 'react'
import { View, Image } from 'react-native'
import axios from 'axios'
import * as Location from 'expo-location'
import { Card, Text } from 'react-native-paper'

interface CurrentWeather {
  cloud: number
  condition: {
    code: number
    icon: string
    text: string
  }
  feelslike_c: number
  feelslike_f: number
  gust_kph: number
  gust_mph: number
  humidity: number
  is_day: number
  last_updated: string
  last_updated_epoch: number
  precip_in: number
  precip_mm: number
  pressure_in: number
  pressure_mb: number
  temp_c: number
  temp_f: number
  uv: number
  vis_km: number
  vis_miles: number
  wind_degree: number
  wind_dir: string
  wind_kph: number
  wind_mph: number
}

interface Location {
  country: string
  lat: number
  localtime: string
  localtime_epoch: number
  lon: number
  name: string
  region: string
  tz_id: string
}

interface WeatherData {
  current: CurrentWeather
  location: Location
}

const WeatherWidget = () => {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null)
  const [location, setLocation] = useState<Location.LocationObject | null>(null)
  const [city, setCity] = useState<string>('Paris')

  const fetchWeatherData = async () => {
    if (!process.env.EXPO_PUBLIC_WEATHER_API_KEY) {
      console.log('Aucune clé API météo')
      return
    }
    if (!city) {
      setCity('Paris')
      return
    }
    const apiUrl = `http://api.weatherapi.com/v1/current.json?key=${process.env.EXPO_PUBLIC_WEATHER_API_KEY}&query=${city}`
    const response = await axios.get(apiUrl)
    setWeatherData(response.data)
  }

  const getCity = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync()
      if (status !== 'granted') {
        fetchWeatherData()
        return
      } else {
        const currentLocation = await Location.getCurrentPositionAsync({})
        setLocation(currentLocation)
        if (!currentLocation || !currentLocation.coords) {
          console.log("Aucune coordonnée dans l'état de localisation")
          return
        }
        const currentCity = await Location.reverseGeocodeAsync(currentLocation.coords)
        setCity(currentCity[0].city ?? 'Paris')
      }
    } catch (error) {}
  }

  useEffect(() => {
    getCity()
    fetchWeatherData()
  }, [city])

  if (!weatherData) {
    return (
      <Card mode='elevated'>
        <Card.Content className='flex-row items-center space-x-5'>
          <Text variant='displaySmall'>Loading...</Text>
        </Card.Content>
      </Card>
    )
  }

  return (
    <Card>
      <View className='flex-row items-center justify-center space-x-2 p-2'>
        <Image
          source={{
            uri: `http:${weatherData.current.condition.icon}`,
          }}
          style={{ width: 64, height: 64 }}
        />
        <View className='flex items-end'>
          <Text variant='displaySmall'>{weatherData.current.temp_c}°C</Text>
          <Text variant='titleSmall'>{weatherData.location.name}</Text>
        </View>
      </View>
    </Card>
  )
}

export default WeatherWidget
