import { View, Text, useColorScheme, Image } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { useTranslation } from 'react-i18next'

export default function GrettingsWidget() {
    const colorScheme = useColorScheme()
    const getCurrentTime = new Date().getHours()
    const { t } = useTranslation()
    let gretting = ""
    let picture = ""

    if (getCurrentTime >= 5 && getCurrentTime < 12) {
        gretting = t('salute.morning')
        picture = 'https://cache.desktopnexus.com/thumbseg/1962/1962487-bigthumbnail.jpg'
    } else if (getCurrentTime >= 12 && getCurrentTime < 18) {
        gretting = t('salute.afternoon')
        picture = 'https://s7d2.scene7.com/is/image/TWCNews/img_3688_jpg-2'
    } else {
        gretting = t('salute.evening')
        picture = 'https://cdn.pixabay.com/photo/2021/11/01/22/10/night-6761907_640.jpg'
    }

  return (
    <View className='pb-4 flex flex-row items-center w-full rounded-2xl'>
      <View className='flex flex-row space-x-2 rounded-2xl'>
        <Image
          source={{ uri: picture }}
          style={{ width: 100, height: 100 }}
          className='rounded-2xl'
        />
        <View className='absolute -bottom-4 right-0 w-full rounded-2xl'>
          <LinearGradient
            colors={['rgba(30, 30, 30, 0)', 'rgba(30, 30, 30, 1)']}
            className='h-[80px] w-[100px] flex-row items-end justify-center rounded-2xl'
          >
            <Text className='truncate text-white opacity-90 font-light italic text-sm'>{gretting}</Text>
          </LinearGradient>
        </View>
      </View>
    </View>
  )
}