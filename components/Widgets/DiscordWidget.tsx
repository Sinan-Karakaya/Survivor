import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { TouchableOpacity, View, useColorScheme } from 'react-native'
import { Card, IconButton, Modal, Searchbar, Text, useTheme } from 'react-native-paper'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import { Employee } from '../../types/employee'
import { api } from '../../tools/api'
import { LinearGradient } from 'expo-linear-gradient'
import { NavigationProp } from '@react-navigation/native'

export default function DiscordWidget({ navigation }: { navigation: NavigationProp<any> }) {
  const { t } = useTranslation()
  const colorScheme = useTheme()
  const theme = useColorScheme()
  const [visible, setVisible] = useState<boolean>(false)

  return (
    <Card
      className='pb-3 rounded-2xl'
      mode='elevated'
    >
      <IconButton
        icon='discord'
        size={100}
        onPress={() => navigation.navigate('Discord')}
      />
      <View className='absolute -bottom-3 right-0 w-full'>
        <LinearGradient
          colors={theme === 'dark'
          ? ['rgba(30, 30, 30, 0)', 'rgba(30, 30, 30, 1)']
          : ['rgba(225, 225, 225, 0)', 'rgba(225, 225, 225, 1)']}
          className='flex-row items-end justify-center rounded-2xl h-10 w-[128px]'
        >
          <Text className='truncate opacity-80 font-light italic'>{t('discord.title')}</Text>
        </LinearGradient>
      </View>
    </Card>
  )
}
