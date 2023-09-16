import React, { useEffect } from 'react'
import { Card, Text } from 'react-native-paper'
import Carousel from 'react-native-reanimated-carousel'
import { EmployeeFull } from '../../types/Employee'
import { api } from '../../tools/api'

const BirthdayWidget = () => {
  const [birthdayUsers, setBirthdayUsers] = React.useState<EmployeeFull[]>([])

  const forEachSeries = async (iterable: EmployeeFull[]) => {
    let result: EmployeeFull[] = []
    for (const x of iterable) {
      const response = await api.get<EmployeeFull>(`/api/employees/${x.id}`)
      result.push(response.data)
    }
    return result
  }

  const getAllUsers = async () => {
    try {
      const tmp = await api.get<EmployeeFull[]>(`/api/employees`)
      const result: EmployeeFull[] = await forEachSeries(tmp.data)
      getBirthdayUsers(result)
    } catch (error) {
      console.log(error)
    }
  }

  const getBirthdayUsers = (usersData: EmployeeFull[]) => {
    const date = new Date()
    const todayMonth = date.getMonth() + 1
    const todayDay = date.getDate()

    if (usersData.length > 0) {
      const birthdayUsers = usersData.filter((user) => {
        const userBirthDate = new Date(user.birth_date)
        const userBirthMonth = userBirthDate.getMonth() + 1
        const userBirthDay = userBirthDate.getDate()
        if (userBirthMonth === todayMonth && userBirthDay === todayDay) {
          return true
        }
        return false
      })
      setBirthdayUsers(birthdayUsers)
    }
  }

  useEffect(() => {
    getAllUsers()
  }, [])

  console.log('length = ' + birthdayUsers.length)
  console.log('list user = ' + birthdayUsers)
  if (birthdayUsers.length === 0)
    return (
      <Card className='p-2'>
        <Text className='text-2xl font-bold'>Birthday</Text>
        <Text>No birthday today</Text>
      </Card>
    )

  return (
    <Card className='p-2'>
      <Text className='text-2xl font-bold px-2'>Birthday</Text>
      {birthdayUsers.length > 1 ? (
        <Carousel
          loop
          autoPlay={true}
          autoPlayInterval={5000}
          width={200}
          height={65}
          data={birthdayUsers}
          renderItem={({ item }) => (
            <Card className='p-2'>
              <Text className='text-xl font-bold'>{item.name + ' ' + item.surname}</Text>
              <Text className='text-xl font-bold'>{item.birth_date}</Text>
            </Card>
          )}
        />
      ) : (
        <Carousel
          width={200}
          height={65}
          data={birthdayUsers}
          renderItem={({ item }) => (
            <Card className='p-2'>
              <Text className='text-xl font-bold'>{item.name + ' ' + item.surname}</Text>
              <Text className='text-xl font-bold'>{item.birth_date}</Text>
            </Card>
          )}
        />
      )}
    </Card>
  )
}

export default BirthdayWidget
