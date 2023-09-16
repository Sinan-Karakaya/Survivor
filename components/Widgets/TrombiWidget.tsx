import { ActivityIndicator, TouchableRipple, IconButton, Card, Text } from 'react-native-paper'
import { Image, View, useColorScheme } from 'react-native'
import { api } from '../../tools/api'
import { useEffect, useState } from 'react'
import { getImage } from '../../tools/image'
import { NavigationProp } from '@react-navigation/native'
import { LinearGradient } from 'expo-linear-gradient'
import { useTranslation } from 'react-i18next'

interface EmployeeID {
  id: number
}

async function arrayOfEmployee() {
  try {
    const res = await api.get('/api/employees')
    const array: Array<EmployeeID> = res.data.map((employee: any) => {
      return { id: employee.id }
    })
    array.length = 12
    return array
  } catch (error) {
    console.log(error)
  }
}

function EmployeeCard({ id, navigation }: { id: number; navigation: NavigationProp<any> }) {
  const [image, setImage] = useState<any>()

  useEffect(() => {
    const fetchImage = async () => {
      const img = await getImage(id.toString())
      setImage(img)
    }
    fetchImage()
  }, [])

  return (
    <TouchableRipple>
      {image ? (
        <Image
          source={{ uri: image }}
          resizeMode='cover'
          style={{ width: 100, height: 100 }}
          className='m-1 rounded-xl'
        />
      ) : (
        <View className='w-[100px] h-[100px] flex-col justify-center items-center m-1'>
          <ActivityIndicator />
        </View>
      )}
    </TouchableRipple>
  )
}

export default function TrombiWidget({ navigation }: { navigation: NavigationProp<any> }) {
  const [arrayIds, setArrayIds] = useState<Array<EmployeeID>>([])
  const [numColumns, setNumColumns] = useState<number>(3)
  const { t } = useTranslation()
  const theme = useColorScheme()

  useEffect(() => {
    const fetchArr = async () => {
      const arr = await arrayOfEmployee()
      if (!arr) return console.log('error fetching ids of employees')
      setArrayIds(arr)
    }
    fetchArr()
  }, [])

  useEffect(() => {
    setNumColumns(Math.ceil(arrayIds.length / 3))
  }, [arrayIds])

  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 3

  const totalPages = Math.ceil(arrayIds.length / itemsPerPage)

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1)
    }
  }

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1)
    }
  }

  const startIdx = (currentPage - 1) * itemsPerPage
  const endIdx = startIdx + itemsPerPage

  return (
    <Card
      className='pb-3 rounded-2xl'
      mode='elevated'
    >
      <View className='flex-row'>
        {arrayIds.slice(startIdx, endIdx).map((item) => (
          <EmployeeCard
            key={item.id}
            id={item.id}
            navigation={navigation}
          />
        ))}
      </View>
      <View className='flex flex-row absolute z-10'>
        <View className='top-[35%]'>
          <IconButton
            icon='arrow-left'
            size={20}
            iconColor='white'
            containerColor='rgba(0,0,0,0.5)'
            onPress={handlePrevPage}
          />
        </View>
        <View className='top-[35%] left-[230px]'>
          <IconButton
            icon='arrow-right'
            size={20}
            iconColor='white'
            containerColor='rgba(0,0,0,0.5)'
            onPress={handleNextPage}
          />
        </View>
      </View>
      <View className='absolute -bottom-3 right-0 w-full'>
        <LinearGradient
          colors={theme === 'dark'
          ? ['rgba(30, 30, 30, 0)', 'rgba(30, 30, 30, 1)']
          : ['rgba(225, 225, 225, 0)', 'rgba(225, 225, 225, 1)']}
          className='flex-row items-end justify-center rounded-2xl h-10'
        >
          <Text className='truncate opacity-80 font-light italic'>{t('trombi.title')}</Text>
        </LinearGradient>
      </View>
    </Card>
  )
}
