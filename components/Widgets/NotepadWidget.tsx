import { View, useColorScheme } from 'react-native'
import { Card, Text } from 'react-native-paper'
import { LinearGradient } from 'expo-linear-gradient'
import { NavigationProp } from '@react-navigation/native'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import { useTranslation } from 'react-i18next'

export default function NotepadWidget({ navigation }: { navigation: NavigationProp<any> }) {
  const { t } = useTranslation()
  const theme = useColorScheme()

  return (
    <Card
      className='pb-4 flex flex-row items-center w-[120px] rounded-2xl'
      mode='elevated'
    >
      <View className='flex flex-row space-x-2 rounded-2xl'>
        <MaterialCommunityIcons
          name='notebook-edit'
          color={theme === 'dark' ? 'white' : 'grey'}
          size={120}
        />
        <View className='absolute -bottom-4 right-0 w-full rounded-2xl'>
          <LinearGradient
            colors={theme === 'dark'
            ? ['rgba(30, 30, 30, 0)', 'rgba(30, 30, 30, 1)']
            : ['rgba(225, 225, 225, 0)', 'rgba(225, 225, 225, 1)']}
            className='h-[80px] w-[120px] flex-row items-end justify-center rounded-2xl'
          >
            <Text className='truncate opacity-80 font-light italic'>{t('notepad.title')}</Text>
          </LinearGradient>
        </View>
      </View>
    </Card>
  )
}
