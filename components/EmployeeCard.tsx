import { View, Image, useColorScheme } from 'react-native'
import { TouchableRipple, Text, ActivityIndicator } from 'react-native-paper'
import { LinearGradient } from 'expo-linear-gradient'
import { useEffect, useState } from 'react'
import { Employee } from '../types/employee'
import { getImage } from '../tools/image'
import { NavigationProp } from '@react-navigation/native'

export default function EmployeeCard({
  employee,
  navigation,
}: {
  employee: Employee
  navigation: NavigationProp<any>
}) {
  const [image, setImage] = useState<any>()
  const theme = useColorScheme()

  useEffect(() => {
    const fetchImage = async () => {
      const img = await getImage(employee.id.toString())
      setImage(img)
    }
    fetchImage()
  }, [])

  return (
    <View style={{ width: 170, height: 150 }}>
      {image ? (
        <TouchableRipple onPress={() => navigation.navigate('Profile', { employeeID: employee.id.toString() })}>
          <>
            <Image
              source={{ uri: image }}
              resizeMode='cover'
              style={{ width: 170, height: 150 }}
              className='rounded-xl'
            />
            <View className='absolute bottom-0 w-full'>
              <LinearGradient
                colors={theme === 'dark'
                ? ['rgba(30, 30, 30, 0)', 'rgba(30, 30, 30, 1)']
                : ['rgba(225, 225, 225, 0)', 'rgba(225, 225, 225, 1)']}
                className='h-24 w-full flex-row items-end'
              >
                <Text
                  className='pl-2 pb-[2px] truncate w-full'
                  variant='titleMedium'
                >
                  {employee.name + ' ' + employee.surname.toLocaleUpperCase()}
                </Text>
              </LinearGradient>
            </View>
          </>
        </TouchableRipple>
      ) : (
        <View className='flex h-full justify-center items-center'>
          <ActivityIndicator size='large' />
        </View>
      )}
    </View>
  )
}
