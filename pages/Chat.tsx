import { useEffect, useState } from 'react'
import { NavigationProp } from '@react-navigation/native'
import { useTranslation } from 'react-i18next'
import { Divider, Searchbar, Text } from 'react-native-paper'
import { SafeAreaView } from 'react-native-safe-area-context'
import { ScrollView, View } from 'react-native'
import ChatItem from '../components/Chat/ChatItem'
import { Feed } from '../types/feed'
import { api, backend } from '../tools/api'
import { Employee } from '../types/employee'

export default function ChatScreen({ navigation }: { navigation: NavigationProp<any> }) {
  const { t } = useTranslation()
  const [searchQuery, setSearchQuery] = useState('')
  const [feeds, setFeeds] = useState<Feed[]>([])
  const [me, setMe] = useState<Employee>({} as Employee)

  useEffect(() => {
    const fetchFeeds = async () => {
      try {
        const resMe = await api.get<Employee>('/api/employees/me')
        setMe(resMe.data)

        const res = await backend.post<Feed[]>('/api/feed/me', { receiverId: resMe.data.id })
        setFeeds(res.data)
      } catch (error) {
        console.log(JSON.stringify(error))
      }
    }

    fetchFeeds()
  }, [])

  return (
    <SafeAreaView className='h-full'>
      <View className='w-full px-2 py-1'>
        <Searchbar
          placeholder={t('chat.search')}
          value={searchQuery}
          onChangeText={(e) => setSearchQuery(e)}
        />
      </View>
      <ScrollView>
        <Divider />
        {feeds.length === 0 && (
          <View className='flex items-center justify-center w-full h-64'>
            <Text>{t('chat.noChat')}</Text>
          </View>
        )}
        {feeds.map((feed, idx) => (
          <View key={feed.senderId}>
            <ChatItem
              navigation={navigation}
              feed={feed}
            />
            <Divider key={idx + ' divider'} />
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  )
}
