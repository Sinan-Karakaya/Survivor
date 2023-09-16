import { useEffect, useState } from 'react'
import { View, Image, useColorScheme } from 'react-native'
import { ActivityIndicator, Text } from 'react-native-paper'
import { getImage } from '../../tools/image'
import { LinearGradient } from 'expo-linear-gradient'
import { NavigationProp } from '@react-navigation/native'
import { Employee } from '../../types/employee'
import { api } from '../../tools/api'
import { useTranslation } from 'react-i18next'

export default function ProfileWidget() {
  const [image, setImage] = useState<string>('')
  const { t } = useTranslation()
  const theme = useColorScheme()

  const fetchProfileImage = async () => {
    try {
      const res = await api.get('/api/employees/me')
      const employee = res.data as Employee
      const image = await getImage(employee.id.toString())
      setImage(image)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    fetchProfileImage()
  }, [])

  return (
    <View className='pb-4 flex flex-row  items-center w-full rounded-2xl'>
      <View className='flex flex-row space-x-2 rounded-2xl'>
        {image ? (
          <>
            <Image
              source={{ uri: image }}
              style={{ width: 120, height: 120 }}
              className='rounded-2xl'
            />
            <View className='absolute -bottom-4 right-0 w-full rounded-2xl'>
              <LinearGradient
                colors={
                  theme === 'dark'
                    ? ['rgba(30, 30, 30, 0)', 'rgba(30, 30, 30, 1)']
                    : ['rgba(225, 225, 225, 0)', 'rgba(225, 225, 225, 1)']
                }
                className='h-[80px] w-[120px] flex-row items-end justify-center rounded-2xl'
              >
                <Text className='truncate opacity-80 font-light italic'>{t('profile.title')}</Text>
              </LinearGradient>
            </View>
          </>
        ) : (
          <ActivityIndicator
            size='large'
            style={{ width: 100 }}
          />
        )}
      </View>
    </View>
  )
}
