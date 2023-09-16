import { ActivityIndicator, Text, TouchableRipple } from 'react-native-paper'
import { LinearGradient } from 'expo-linear-gradient'
import { View, Image, useColorScheme } from 'react-native'
import { useEffect, useState } from 'react'
import { getImage } from '../tools/image'
import { EmployeeFull } from '../types/employee'
import { api } from '../tools/api'

export default function ProfileComponent({ id }: { id: number }) {
  const theme = useColorScheme()
  const [image, setImage] = useState<string>('')
  const [employeeProfile, setEmployeeProfile] = useState<EmployeeFull>({} as EmployeeFull)

  useEffect(() => {
    const fetchImage = async () => {
      const img = await getImage(id.toString())
      setImage(img)
    }
    fetchImage()
  }, [])

  useEffect(() => {
    const fetchImage = async () => {
      try {
        const img = await getImage(id.toString())
        setImage(img)
        const employee = await api.get<EmployeeFull>(`/api/employees/${id}`)
        setEmployeeProfile(employee.data)
      } catch (error) {
        console.log(error)
      }
    }
    fetchImage()
  }, [])

  if (!image || !employeeProfile)
    return (
      <View className='flex flex-col items-center justify-center w-full h-full'>
        <ActivityIndicator />
      </View>
    )
  return (
    <TouchableRipple>
      <>
        <Image
          source={{
            uri: image,
          }}
          resizeMode='cover'
          style={{ width: 140, height: 140 }}
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
              {employeeProfile.name + ' ' + employeeProfile.surname}
            </Text>
          </LinearGradient>
        </View>
      </>
    </TouchableRipple>
  )
}
