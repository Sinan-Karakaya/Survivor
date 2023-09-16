import { Button, Text, useTheme } from 'react-native-paper'
import { SafeAreaView } from 'react-native-safe-area-context'
import * as ScreenOrientation from 'expo-screen-orientation'
import { useEffect, useState } from 'react'
import { AppState, BackHandler, Image, View } from 'react-native'
import { NavigationProp } from '@react-navigation/native'
import QRCode from 'react-native-qrcode-svg'
import { EmployeeFull } from '../types/employee'

export default function CardProfileScreen({ route, navigation }: { route: any; navigation: NavigationProp<any> }) {
  const { employee, image }: { employee: EmployeeFull; image: string } = route.params
  const colorScheme = useTheme()
  const [previousBrightness, setPreviousBrightness] = useState<number>(-1)

  const vCardData = `BEGIN:VCARD
VERSION:3.0
FN:${employee.name + ' ' + employee.surname.toLocaleUpperCase()}
BDAY:${employee.birth_date.replace(/-/g, '')}
EMAIL:${employee.email}
GENDER:${employee.gender[0]}
TITLE:${employee.work}
END:VCARD`

  async function changeScreenOrientation() {
    await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE_RIGHT)
  }

  useEffect(() => {
    changeScreenOrientation()
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP)
      navigation.goBack()
      return true
    })

    return () => backHandler.remove()
  }, [])

  return (
    <SafeAreaView
      className='w-full h-full flex flex-row'
      style={{ backgroundColor: colorScheme.colors.background }}
    >
      <View className='flex w-1/2 h-full'>
        <Image
          className='h-[65%] w-full rounded-br-3xl'
          source={{
            uri: image,
          }}
        />
        <View className='flex flex-col pl-2 items-start justify-center h-[35%] '>
          <Button
            icon='account'
            mode='text'
            textColor='white'
          >
            {employee.name + ' ' + employee.surname.toLocaleUpperCase()}
          </Button>
          <Button
            icon='email'
            textColor='white'
            mode='text'
          >
            {employee.email}
          </Button>
          <Button
            icon='briefcase'
            textColor='white'
            mode='text'
          >
            {employee.work}
          </Button>
        </View>
      </View>
      <View className='flex flex-row w-1/2 justify-center items-center h-full p-10'>
        <View className='bg-white p-5 rounded-2xl'>
          <QRCode
            value={vCardData}
            size={250}
          />
        </View>
      </View>
    </SafeAreaView>
  )
}
