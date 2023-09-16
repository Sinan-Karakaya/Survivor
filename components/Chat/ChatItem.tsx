import { useEffect, useState } from 'react'
import { View, Image, TouchableOpacity } from 'react-native'
import { ActivityIndicator, Text, TouchableRipple } from 'react-native-paper'
import { Employee } from '../../types/employee'
import { api } from '../../tools/api'
import { getImage } from '../../tools/image'
import { NavigationProp } from '@react-navigation/native'
import { Feed } from '../../types/feed'

export default function ChatItem({ navigation, feed }: { navigation: NavigationProp<any>; feed: Feed }) {
  // employee is the sender
  const [employee, setEmployee] = useState<Employee>()
  const [image, setImage] = useState<string>()

  useEffect(() => {
    const fetchSender = async () => {
      try {
        const resEmployee = await api.get<Employee>(`/api/employees/${feed.senderId}`)
        setEmployee(resEmployee.data)

        const resImage = await getImage(feed.senderId.toString())
        setImage(resImage)
      } catch (error) {
        console.log(error)
      }
    }

    fetchSender()
  }, [])

  if (!employee || !image)
    return (
      <View className='w-full px-1 py-2 flex-row justify-center items-center'>
        <ActivityIndicator />
      </View>
    )

  return (
    <TouchableOpacity
      className='w-full px-1 py-2 flex-row gap-x-1'
      onPress={() => navigation.navigate('ChatView', { employee, feed })}
    >
      <View className='flex-row gap-x-2 items-center'>
        <Image
          source={{ uri: image }}
          style={{ width: 50, height: 50 }}
          className='rounded-full'
        />
        <Text variant='titleLarge'>{employee.name + ' ' + employee?.surname.toLocaleUpperCase()}</Text>
      </View>
    </TouchableOpacity>
  )
}
