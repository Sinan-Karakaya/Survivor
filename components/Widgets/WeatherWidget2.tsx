import React, { useEffect, useState } from 'react'
import { View, Image } from 'react-native'
import axios from 'axios'
import * as Location from 'expo-location'
import { Card, Text } from 'react-native-paper'
import { format, parseISO } from 'date-fns'
import { fr } from 'date-fns/locale'
import { Line, Svg } from 'react-native-svg'

interface Condition {
  code: number
  icon: string
  text: string
}

interface CurrentWeather {
  cloud: number
  condition: Condition
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

interface ForecastDay {
  astro: {
    moonrise: string
    moonset: string
    sunrise: string
    sunset: string

    moon_illumination: string
    moon_phase: string
    moon_phase_lunation: string
    moonrise_ts: number
    moonset_ts: number
    sunrise_ts: number
    sunset_ts: number
  }
  date: string
  date_epoch: number
  day: {
    avghumidity: number
    avgtemp_c: number
    avgtemp_f: number
    avgvis_km: number
    avgvis_miles: number
    condition: Condition
    daily_chance_of_rain: string
    daily_chance_of_snow: string
    daily_will_it_rain: number
    daily_will_it_snow: number
    maxtemp_c: number
    maxtemp_f: number
    maxwind_kph: number
    maxwind_mph: number
    mintemp_c: number
    mintemp_f: number
    totalprecip_in: number
    totalprecip_mm: number
    uv: number
  }
  hour: {
    chance_of_rain: string
    chance_of_snow: string
    cloud: number
    condition: Condition
    dewpoint_c: number
    dewpoint_f: number
    feelslike_c: number
    feelslike_f: number
    heatindex_c: number
    heatindex_f: number
    humidity: number
    is_day: number
    precip_in: number
    precip_mm: number
    pressure_in: number
    pressure_mb: number
    temp_c: number
    temp_f: number
    time: string
    time_epoch: number
    uv: number
    vis_km: number
    vis_miles: number
    will_it_rain: number
    will_it_snow: number
    wind_degree: number
    wind_dir: string
    wind_kph: number
    wind_mph: number
    windchill_c: number
    windchill_f: number
  }[]
}

interface Forecast {
  forecastday: ForecastDay[]
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
  forecast: Forecast
  location: Location
}

const WeatherNextDays = (day: string | undefined, link: string | undefined, temperature: number | undefined) => {
  const parsedDate = parseISO(day || '')
  const formattedDate = format(parsedDate, 'EEEE', { locale: fr })
  return (
    <View className='flex flex-col items-center'>
      <Text variant='bodySmall'>{formattedDate[0].toLocaleUpperCase() + formattedDate.slice(1, 3)}</Text>
      <Image
        source={{
          uri: `http:${link}`,
        }}
        style={{ width: 32, height: 32 }}
      />
      <Text variant='bodySmall'>{temperature} °C</Text>
    </View>
  )
}

interface nextDays {
  day: string | undefined
  link: string | undefined
  temperature: number | undefined
}

const WeatherWidget2 = () => {
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
    const apiUrl = `http://api.weatherapi.com/v1/forecast.json?key=c9114b86d64046f598293349231209&q=Rennes&days=5&aqi=no&alerts=no`
    const response = await axios.get(apiUrl)
    setWeatherData(response.data)
    setNextDays(addNextDays(response.data.forecast.forecastday))
  }

  const [nextDays, setNextDays] = useState<nextDays[]>([])

  const addNextDays = (array: any) => {
    const nextDays: nextDays[] = []
    if (weatherData) {
      array.map((day: any) => {
        nextDays.push({
          day: day.date,
          link: day.day.condition.icon,
          temperature: day.day.avgtemp_c,
        })
      })
    }
    return nextDays
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
      <View className='flex flex-col items-center justify-center p-2'>
        <View className='flex flex-row'>
          <Text className='font-bold'>{weatherData.location.name}, </Text>
          <Text className='font-bold'>{weatherData.location.region}, </Text>
          <Text className='font-bold'>{weatherData.location.country}</Text>
        </View>
        <View className='flex flex-col space-y-3'>
          <View className='flex flex-row justify-between items-center space-x-5'>
            <View className='flex flex-col items-center'>
              <Image
                source={{
                  uri: `http:${weatherData.current.condition.icon}`,
                }}
                style={{ width: 64, height: 64 }}
              />
              <Text
                variant='bodySmall'
                className='font-bold'
              >
                {weatherData.current.condition.text}
              </Text>
            </View>
            <Text variant='displaySmall'>{weatherData.current.temp_c}°C</Text>
            <View className='flex flex-col'>
              <Text variant='bodySmall'>Wind: {weatherData.current.wind_kph} km/h</Text>
              <Text variant='bodySmall'>Humidity: {weatherData.current.humidity}%</Text>
              <Text variant='bodySmall'>Precip: {weatherData.current.precip_mm} mm</Text>
            </View>
          </View>
          <View className='flex flex-row space-x-4'>
            {nextDays.map((day) => WeatherNextDays(day.day, day.link, day.temperature))}
          </View>
        </View>
      </View>
    </Card>
  )
}

export default WeatherWidget2
