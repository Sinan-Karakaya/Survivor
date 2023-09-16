import { useEffect, useState } from 'react'
import { View } from 'react-native'
import { Appbar, TextInput, useTheme, Button } from 'react-native-paper'
import { Employee } from '../types/employee'
import { api } from '../tools/api'
import { useTranslation } from 'react-i18next'
import { NavigationProp } from '@react-navigation/native'
import { SafeAreaView } from 'react-native-safe-area-context'

export default function ({ navigation }: { navigation: NavigationProp<any> }) {
  const { t } = useTranslation()
  const [message, setMessage] = useState<string>('')
  const [me, setMe] = useState<Employee>()
  const colorScheme = useTheme()

  const sendMessage = async () => {
    try {
      if (!process.env.EXPO_PUBLIC_DISCORD_WEBHOOK || !me) return

      const formatted = `${me.name} ${me.surname.toLocaleUpperCase()}:\n\`\`\`${message}\`\`\``
      await fetch(process.env.EXPO_PUBLIC_DISCORD_WEBHOOK, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: formatted,
        }),
      })
      setMessage('')
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    ;(async () => {
      try {
        const res = await api.get<Employee>('/api/employees/me')
        setMe(res.data)
      } catch (error) {
        console.log(error)
      }
    })()
  }, [])

  return (
    <>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title={t('discord.title')} />
      </Appbar.Header>
      <View
        style={{ backgroundColor: colorScheme.colors.background }}
        className='flex-col justify-center items-center'
      >
        <View
          style={{ backgroundColor: colorScheme.colors.background }}
          className='h-full w-[90%] flex-col gap-y-6 mt-16'
        >
          <TextInput
            multiline
            numberOfLines={7}
            placeholder={t('discord.placeholder')}
            value={message}
            onChangeText={(e: string) => setMessage(e)}
          />
          <Button
            mode='contained'
            onPress={sendMessage}
          >
            {t('discord.send')}
          </Button>
        </View>
      </View>
    </>
  )
}
