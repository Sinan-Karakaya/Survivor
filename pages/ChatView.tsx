import { NavigationProp } from '@react-navigation/native'
import { Employee } from '../types/employee'
import { SafeAreaView } from 'react-native-safe-area-context'
import { ActivityIndicator, Appbar, Searchbar, useTheme } from 'react-native-paper'
import { FlatList, KeyboardAvoidingView, ScrollView, View } from 'react-native'
import { useTranslation } from 'react-i18next'
import { useEffect, useState } from 'react'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import ChatBubble from '../components/Chat/ChatBubble'
import { Feed } from '../types/feed'
import { backend } from '../tools/api'
import { Message, newChatRequest } from '../types/chat'
import * as Device from 'expo-device'
import * as Notifications from 'expo-notifications'

export default function ChatView({ route, navigation }: { route: any; navigation: NavigationProp<any> }) {
  // employee is the sender
  const { employee, feed }: { employee: Employee; feed: Feed } = route.params
  const { t } = useTranslation()
  const colorScheme = useTheme()

  const [inputMessage, setInputMessage] = useState<string>('')
  const [messages, setMessages] = useState<Message[]>([])

  useEffect(() => {
    ;(async () => {
      try {
        const res = await backend.post<Message[]>(`/api/chat/${feed.senderId}/${feed.receiverId}`, {
          senderId: feed.senderId,
          receiverId: feed.receiverId,
        })
        setMessages(res.data)
      } catch (error) {
        console.log(error)
      }
    })()
  }, [])

  const sendMessage = async () => {
    if (inputMessage === '') return
    try {
      const token = await getPushToken()
      const request: newChatRequest = {
        senderId: feed.receiverId, // oui je sais cherche pas je me suis embrouillé tout seul
        receiverId: feed.senderId,
        message: inputMessage,
        senderToken: token ?? '',
      }
      const res = await backend.post<Message>('/api/chat', request)
      setMessages([...messages, res.data])
      setInputMessage('')
    } catch (error) {
      console.log(JSON.stringify(error))
    }
  }

  return (
    <SafeAreaView style={{ backgroundColor: colorScheme.colors.background }}>
      <Appbar>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title={employee.name + ' ' + employee.surname.toLocaleUpperCase()} />
      </Appbar>
      <KeyboardAvoidingView
        behavior='padding'
        className='h-full'
        keyboardVerticalOffset={-300}
      >
        <View className='h-[75%]'>
          {messages.length !== 0 ? (
            <FlatList
              data={messages}
              renderItem={({ item }) => (
                <ChatBubble
                  key={item.id}
                  sender={item.senderId === employee.id}
                  message={item.message}
                  time={item.createdAt ?? new Date()}
                />
              )}
              className='h-[85%]'
            />
          ) : (
            <></>
          )}
        </View>
        <View className='w-full px-1 pb-2'>
          <Searchbar
            placeholder={t('chatView.input')}
            value={inputMessage}
            onChangeText={(e) => setInputMessage(e)}
            multiline
            icon={() => <></>}
            right={() => (
              <View className='pr-4'>
                <MaterialCommunityIcons
                  name='send'
                  color={colorScheme.colors.primary}
                  size={26}
                  onPress={sendMessage}
                />
              </View>
            )}
          />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

async function getPushToken() {
  let token

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
    console.log('Must use physical device for Push Notifications')
  }

  return token
}
