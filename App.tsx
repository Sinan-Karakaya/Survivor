import { useState, useEffect, Suspense, useRef } from 'react'
import { PaperProvider, MD3DarkTheme, MD3LightTheme } from 'react-native-paper'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { Linking, LogBox, Platform, StatusBar } from 'react-native'
import { useColorScheme } from 'react-native'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { api } from './tools/api'

import * as SecureStore from 'expo-secure-store'
import * as Notifications from 'expo-notifications'
import * as Device from 'expo-device'
import './tools/i18n'

import Router from './components/Router'
import LoginScreen from './pages/Login'
import SplashScreen from './components/SplashScreen'
import ProfileScreen from './pages/Profile'
import TrombiScreen from './pages/Trombi'
import NotepadScreen from './pages/Notepad'
import TodoListScreen from './pages/TodoList'
import CardProfileScreen from './pages/CardProfile'
import ChatView from './pages/ChatView'
import Discord from './pages/Discord'
import { GestureHandlerRootView } from 'react-native-gesture-handler'

LogBox.ignoreAllLogs(true)

async function checkIsConnected(): Promise<boolean> {
  const result = await SecureStore.getItemAsync('access_token')

  if (!result) return false

  try {
    const res = await api.get('/api/employees/me', {
      headers: {
        Authorization: `Bearer ${result}`,
      },
    })
    if (res.status !== 200) return false
  } catch (e) {
    await SecureStore.deleteItemAsync('access_token')
    return false
  }

  api.defaults.headers.common.Authorization = `Bearer ${result}`
  return true
}

const Stack = createNativeStackNavigator()

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
})

export default function App() {
  const colorScheme = useColorScheme()
  const paperTheme = colorScheme === 'dark' ? MD3DarkTheme : MD3LightTheme

  const [isConnected, setIsConnected] = useState<boolean | undefined>(undefined)

  const [expoPushToken, setExpoPushToken] = useState('')
  const [notification, setNotification] = useState<boolean | Notifications.Notification>(false)
  const notificationListener = useRef<any>()
  const responseListener = useRef<any>()

  useEffect(() => {
    const checkConnection = async () => {
      const result = await checkIsConnected()
      setIsConnected(result)
    }
    checkConnection()
  }, [])

  useEffect(() => {
    registerForPushNotificationsAsync().then((token) => setExpoPushToken(token ?? ''))

    notificationListener.current = Notifications.addNotificationReceivedListener(
      (notification: Notifications.Notification) => {
        setNotification(notification)
      }
    )

    responseListener.current = Notifications.addNotificationResponseReceivedListener((response: any) => {
      console.log(response)
    })

    return () => {
      Notifications.removeNotificationSubscription(notificationListener.current)
      Notifications.removeNotificationSubscription(responseListener.current)
    }
  }, [])

  if (isConnected === undefined) return <></>

  return (
    <Suspense fallback='loading'>
      <SafeAreaProvider>
        <PaperProvider theme={paperTheme}>
          <GestureHandlerRootView style={{ flex: 1 }}>
            <StatusBar barStyle={colorScheme === 'dark' ? 'light-content' : 'dark-content'} />
            <NavigationContainer>
              <Stack.Navigator
                screenOptions={{ headerShown: false }}
                initialRouteName={isConnected ? 'SplashScreen' : 'Login'}
              >
                <Stack.Screen
                  name='Login'
                  component={LoginScreen}
                  initialParams={{ isConnected: isConnected }}
                />
                <Stack.Screen
                  name='Router'
                  component={Router}
                />
                <Stack.Screen
                  name='Profile'
                  component={ProfileScreen}
                />
                <Stack.Screen
                  name='SplashScreen'
                  component={SplashScreen}
                />
                <Stack.Screen
                  name='Trombi'
                  component={TrombiScreen}
                />
                <Stack.Screen
                  name='CardProfileScreen'
                  component={CardProfileScreen}
                />
                <Stack.Screen
                  name='ChatView'
                  component={ChatView}
                />
                <Stack.Screen
                  name='Notepad'
                  component={NotepadScreen}
                />
                <Stack.Screen
                  name='TodoList'
                  component={TodoListScreen}
                />
                <Stack.Screen
                  name='Discord'
                  component={Discord}
                />
              </Stack.Navigator>
            </NavigationContainer>
          </GestureHandlerRootView>
        </PaperProvider>
      </SafeAreaProvider>
    </Suspense>
  )
}

async function registerForPushNotificationsAsync() {
  let token

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    })
  }

  if (Device.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync()
    let finalStatus = existingStatus
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync()
      finalStatus = status
    }
    if (finalStatus !== 'granted') {
      alert('Failed to get push token for push notification!')
      return
    }
    token = (await Notifications.getExpoPushTokenAsync({ projectId: process.env.EXPO_PUBLIC_PROJECT_ID })).data
  } else {
    alert('Must use physical device for Push Notifications')
  }

  return token
}
