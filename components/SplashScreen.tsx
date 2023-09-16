import { useEffect } from 'react'
import { SafeAreaView, useColorScheme, Image } from 'react-native'
import { NavigationProp } from '@react-navigation/native'

import * as LocalAuthentication from 'expo-local-authentication'
import { useTheme } from 'react-native-paper'

export default function SplashScreen({ navigation }: { navigation: NavigationProp<any> }) {
  const colorScheme = useColorScheme()
  const theme = useTheme()
  const logo =
    colorScheme === 'dark' ? require('../assets/images/logo-dark.png') : require('../assets/images/logo-light.png')

  const checkBiometrics = async () => {
    const res = await LocalAuthentication.authenticateAsync({
      promptMessage: 'Please authenticate to continue',
    })
    if (res.success) navigation.navigate('Router')
    else navigation.navigate('Login')
  }

  useEffect(() => {
    checkBiometrics()
  }, [])

  return (
    <SafeAreaView className='w-ful h-full flex justify-center items-center' style={{ backgroundColor: theme.colors.background }}>
      <Image source={logo} resizeMode='contain' style={{ width: 150, height: 150 }} />
    </SafeAreaView>
  )
}
