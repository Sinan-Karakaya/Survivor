import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { View, useColorScheme, FlatList } from 'react-native'
import { Searchbar, ActivityIndicator, useTheme } from 'react-native-paper'
import { SafeAreaView } from 'react-native-safe-area-context'
import { api } from '../tools/api'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import { Employee } from '../types/employee'
import { NavigationProp } from '@react-navigation/native'
import EmployeeCard from '../components/EmployeeCard'

export default function TrombiScreen({ navigation }: { navigation: NavigationProp<any> }) {
  const colorSceme = useTheme()
  const theme = useColorScheme()
  const [searchQuery, setSearchQuery] = useState('')
  const [employees, setEmployees] = useState<Employee[]>([])
  const [currentEmployees, setCurrentEmployees] = useState<Employee[]>([])
  const { t } = useTranslation()

  const handleSearch = (query: string) => {
    setSearchQuery(query)
    setCurrentEmployees(
      employees.filter((employee) => {
        return employee.name.toLowerCase().includes(query.toLowerCase())
      })
    )
  }

  const getEmployees = async () => {
    try {
      const res = await api.get('/api/employees')
      const arrayEmployees = res.data
      setEmployees(arrayEmployees)
      setCurrentEmployees(arrayEmployees)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    getEmployees()
  }, [])

  return (
    <View style={{ backgroundColor: colorSceme.colors.background }}>
      <SafeAreaView style={{ backgroundColor: colorSceme.colors.background }}>
        <View className='flex-row items-center p-2'>
          <MaterialCommunityIcons
            name='chevron-left'
            size={48}
            color={theme === 'dark' ? 'white' : 'black'}
            onPress={() => navigation.goBack()}
          />
          <Searchbar
            value={searchQuery}
            onChangeText={handleSearch}
            placeholder={t('trombi.searchPlaceholder')}
            className='w-[85%]'
          />
        </View>
        {employees.length > 0 ? (
          <FlatList
            key={employees.length.toString()}
            data={currentEmployees}
            numColumns={2}
            removeClippedSubviews
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <View className='p-1'>
                <EmployeeCard
                  employee={item}
                  navigation={navigation}
                />
              </View>
            )}
            initialNumToRender={6}
            columnWrapperStyle={{ flex: 1, justifyContent: 'space-around' }}
          />
        ) : (
          <View className='w-full h-full flex-row justify-center items-center'>
            <ActivityIndicator size={'large'} />
          </View>
        )}
      </SafeAreaView>
    </View>
  )
}
