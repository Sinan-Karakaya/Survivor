import { View, Image, SafeAreaView, ScrollView, Animated, useColorScheme } from 'react-native'
import { Card, useTheme, FAB, ActivityIndicator, Text, Button, TouchableRipple } from 'react-native-paper'
import TextTicker from 'react-native-text-ticker'
import * as Clipboard from 'expo-clipboard'
import { LinearGradient } from 'expo-linear-gradient'
import ProfileComponent from '../components/ProfileComponent'
import { NavigationProp } from '@react-navigation/native'
import { Employee, EmployeeFull } from '../types/employee'
import { useEffect, useRef, useState } from 'react'
import { api, backend } from '../tools/api'
import { getImage } from '../tools/image'
import { useTranslation } from 'react-i18next'

const maxHeaderHeight = 260
const minHeaderHeight = 60
const scrollDistance = maxHeaderHeight - minHeaderHeight

function Header({
  animHeaderValue,
  image,
  employeeProfile,
  copyToClipboard,
}: {
  animHeaderValue: Animated.Value
  image: string
  employeeProfile: EmployeeFull
  copyToClipboard: (str: string) => void
}) {
  const animatedHeaderHeight = animHeaderValue.interpolate({
    inputRange: [0, scrollDistance],
    outputRange: [maxHeaderHeight, minHeaderHeight],
    extrapolate: 'clamp',
  })
  const theme = useColorScheme()

  return (
    <Animated.View style={{ height: animatedHeaderHeight }}>
      <Image
        source={{ uri: image }}
        resizeMode='cover'
        className='w-full h-full'
      />
      <View className='absolute bottom-0 w-full'>
        <LinearGradient
          colors={
            theme === 'dark'
              ? ['rgba(30, 30, 30, 0)', 'rgba(30, 30, 30, 1)']
              : ['rgba(225, 225, 225, 0)', 'rgba(225, 225, 225, 1)']
          }
          className='h-48 w-full flex-row items-end'
        >
          <Text
            variant='displaySmall'
            className='pl-2 pb-1 truncate w-full'
            onPress={() => copyToClipboard(employeeProfile.name + ' ' + employeeProfile.surname.toLocaleUpperCase())}
          >
            {employeeProfile.name + ' ' + employeeProfile.surname.toLocaleUpperCase()}
          </Text>
        </LinearGradient>
      </View>
    </Animated.View>
  )
}

export default function ProfileScreen({ route, navigation }: { route: any; navigation: NavigationProp<any> }) {
  const colorScheme = useTheme()
  const theme = useColorScheme()
  const { t } = useTranslation()
  const [employeeProfile, setEmployeeProfile] = useState<EmployeeFull>({} as EmployeeFull)
  const [image, setImage] = useState<string>('')
  const [isSelf, setIsSelf] = useState<boolean>(false)
  const [meId, setMeId] = useState(0)
  const { employeeID }: { employeeID: string } = route.params

  const scrollOffsetY = useRef(new Animated.Value(0)).current

  const copyToClipboard = async (str: string) => {
    await Clipboard.setStringAsync(str)
  }

  const addFeed = async () => {
    try {
      const res = await backend.post('/api/feed', {
        senderId: parseInt(employeeID),
        receiverId: meId,
      })

      navigation.navigate('ChatView', { employee: employeeProfile as Employee, feed: res.data })
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        const res = await api.get(`/api/employees/${employeeID}`)
        setEmployeeProfile(res.data)

        const img = await getImage(employeeID)
        if (!img) throw new Error('error fetching image')
        setImage(img)

        const self = await api.get<Employee>('/api/employees/me')
        setIsSelf(self.data.id.toString() === employeeID)
        setMeId(self.data.id)
      } catch (error) {
        console.log(error)
      }
    }
    fetchEmployee()
  }, [])

  if (!employeeProfile || !image)
    return (
      <View className='w-full h-full flex-col justify-center items-center'>
        <ActivityIndicator size={'large'} />
      </View>
    )

  return (
    <SafeAreaView
      className='flex flex-col w-full h-full'
      style={{ backgroundColor: colorScheme.colors.background }}
    >
      <Header
        image={image}
        employeeProfile={employeeProfile}
        animHeaderValue={scrollOffsetY}
        copyToClipboard={copyToClipboard}
      />
      <ScrollView
        className='flex flex-col max-w-[90%] mx-auto w-[90%] space-y-3 pt-4'
        scrollEventThrottle={16}
        onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scrollOffsetY } } }], {
          useNativeDriver: false,
        })}
      >
        {!isSelf && (
          <Button
            mode='contained'
            className='w-full rounded-xl'
            onPress={addFeed}
          >
            {t('profile.message')}
          </Button>
        )}
        <Card
          className='w-full'
          mode='outlined'
        >
          <Text
            variant='titleSmall'
            className='pt-1 pl-4'
          >
            {t('profile.email')}
          </Text>
          <Card.Content>
            <TextTicker
              className={`text-xl text-${theme === 'dark' ? 'white' : 'black'}`}
              duration={10000}
              scrollSpeed={10}
              loop
              bounce
              repeatSpacer={50}
              marqueeDelay={5000}
              onPress={() => copyToClipboard(employeeProfile.email)}
            >
              {employeeProfile.email}
            </TextTicker>
          </Card.Content>
        </Card>
        <View className='flex flex-row'>
          <Card
            className='w-[45%]'
            mode='outlined'
          >
            <Text
              variant='titleSmall'
              className='pt-1 pl-4'
            >
              {t('profile.birthday')}
            </Text>
            <Card.Content>
              <TextTicker
                className={`text-xl text-${theme === 'dark' ? 'white' : 'black'}`}
                duration={10000}
                scrollSpeed={10}
                loop
                bounce
                repeatSpacer={50}
                marqueeDelay={5000}
                onPress={() =>
                  copyToClipboard(employeeProfile.birth_date.replace(/-/g, '/').split('/').reverse().join('/'))
                }
              >
                {employeeProfile.birth_date.replace(/-/g, '/').split('/').reverse().join('/')}
              </TextTicker>
            </Card.Content>
          </Card>
          <View className='w-[10%]'></View>
          <Card
            className='w-[45%]'
            mode='outlined'
          >
            <Text
              variant='titleSmall'
              className='pt-1 pl-4'
            >
              {t('profile.gender')}
            </Text>
            <Card.Content>
              <TextTicker
                className={`text-xl text-${theme === 'dark' ? 'white' : 'black'}`}
                duration={10000}
                scrollSpeed={10}
                loop
                bounce
                repeatSpacer={50}
                marqueeDelay={5000}
                onPress={() => copyToClipboard(employeeProfile.gender)}
              >
                {employeeProfile.gender}
              </TextTicker>
            </Card.Content>
          </Card>
        </View>
        <Card
          className='w-full'
          mode='outlined'
        >
          <Text
            variant='titleSmall'
            className='pt-1 pl-4'
          >
            {t('profile.work')}
          </Text>
          <Card.Content>
            <TextTicker
              className={`text-xl text-${theme === 'dark' ? 'white' : 'black'}`}
              duration={10000}
              scrollSpeed={10}
              loop
              bounce
              repeatSpacer={50}
              marqueeDelay={5000}
              onPress={() => copyToClipboard(employeeProfile.work)}
            >
              {employeeProfile.work}
            </TextTicker>
          </Card.Content>
        </Card>
        <Card
          className='w-full mb-10'
          mode='outlined'
        >
          <Card.Title
            title='Subordonnées'
            titleVariant='titleMedium'
          />
          <Card.Content className='flex flex-col space-y-4'>
            {Array.isArray(employeeProfile.subordinates) && employeeProfile.subordinates.length > 0 ? (
              <>
                {employeeProfile.subordinates.map(
                  (subordinate: any, index: any) =>
                    index % 2 === 0 && (
                      <View
                        key={index}
                        className='flex flex-row justify-between'
                      >
                        <TouchableRipple
                          onPress={() => {
                            navigation.goBack()
                            navigation.navigate('Profile', { employeeID: subordinate })
                          }}
                        >
                          <ProfileComponent id={subordinate} />
                        </TouchableRipple>
                        {index + 1 < employeeProfile.subordinates.length && (
                          <TouchableRipple
                            onPress={() => {
                              navigation.goBack()
                              navigation.navigate('Profile', { employeeID: employeeProfile.subordinates[index + 1] })
                            }}
                          >
                            <ProfileComponent id={employeeProfile.subordinates[index + 1]} />
                          </TouchableRipple>
                        )}
                      </View>
                    )
                )}
              </>
            ) : (
              <Text
                variant='titleSmall'
                className='text-center'
              >
                {t('profile.noSubordinates')}
              </Text>
            )}
          </Card.Content>
        </Card>
      </ScrollView>
      <FAB
        icon='card-account-details'
        className='absolute bottom-0 right-0 m-4 z-10'
        onPress={() => navigation.navigate('CardProfileScreen', { employee: employeeProfile, image })}
      />
    </SafeAreaView>
  )
}
