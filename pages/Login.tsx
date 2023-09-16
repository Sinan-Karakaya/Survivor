import { useEffect, useRef, useState } from 'react'
import { StyleSheet, Image, useColorScheme, View, KeyboardAvoidingView, Platform } from 'react-native'
import { Button, Text, TextInput, useTheme } from 'react-native-paper'
import { SafeAreaView } from 'react-native-safe-area-context'
import { NavigationProp } from '@react-navigation/native'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import { api } from '../tools/api'
import * as SecureStore from 'expo-secure-store'

export default function LoginScreen({ route, navigation }: { route: any; navigation: NavigationProp<any> }) {
  const colorScheme = useColorScheme()
  const theme = useTheme()
  const logo =
    colorScheme === 'dark' ? require('../assets/images/logo-dark.png') : require('../assets/images/logo-light.png')

  const { isConnected } = route.params

  const passwordRef = useRef<any>(null)
  const [email, setEmail] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [showPassword, setShowPassword] = useState<boolean>(false)
  const [error, setError] = useState<string>('')

  const login = async () => {
    try {
      const res = await api.post('/api/employees/login', { email, password })

      await SecureStore.setItemAsync('access_token', res.data.access_token)
      api.defaults.headers.common.Authorization = `Bearer ${res.data.access_token}`
      navigation.navigate('Router')
    } catch (error) {
      console.log(error)
      setError('Invalid credentials')
      setPassword('')
    }
  }

  useEffect(() => {
    if (isConnected) navigation.navigate('SplashScreen')
  }, [])

  return (
    <SafeAreaView
      className='flex h-full items-center space-y-16'
      style={{ backgroundColor: theme.colors.background }}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className='flex-col space-y-12 mb-28 w-[90%]'
      >
        <View style={{ flex: 0, alignItems: 'center', marginTop: 40 }}>
          <Image
            source={logo}
            resizeMode='contain'
            style={{ width: 150, height: 150 }}
          />
        </View>
        <View className='space-y-6'>
          <TextInput
            placeholder='Your email'
            keyboardType='email-address'
            returnKeyType='next'
            onSubmitEditing={() => passwordRef?.current?.focus()}
            value={email}
            error={error !== ''}
            onChangeText={(e) => setEmail(e.trim())}
          />
          <View>
            <TextInput
              placeholder='Password'
              ref={passwordRef}
              onSubmitEditing={login}
              value={password}
              error={error !== ''}
              onChangeText={(e) => setPassword(e.trim())}
              secureTextEntry={!showPassword}
              right={
                showPassword ? (
                  <TextInput.Icon
                    icon='eye-off'
                    onPress={() => setShowPassword(!showPassword)}
                  />
                ) : (
                  <TextInput.Icon
                    icon='eye'
                    onPress={() => setShowPassword(!showPassword)}
                  />
                )
              }
            />
            <Text
              variant='labelMedium'
              style={{ color: theme.colors.error }}
            >
              {error}
            </Text>
          </View>
        </View>
        <Button
          mode='contained-tonal'
          onPress={async () => await login()}
        >
          Login
        </Button>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    margin: 20,
    gap: 20,
  },
  form: {
    flex: 0,
    gap: 30,
    marginBottom: 120,
  },
})
