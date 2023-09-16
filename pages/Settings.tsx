import { Appbar, Text, Divider, Menu, TouchableRipple, useTheme, Switch } from 'react-native-paper'
import { View, useColorScheme, StyleSheet } from 'react-native'
import { NavigationProp } from '@react-navigation/native'
import * as SecureStore from 'expo-secure-store'
import { api } from '../tools/api'
import { useTranslation } from 'react-i18next'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import { useState } from 'react'

export default function SettingsScreen({ navigation }: { navigation: NavigationProp<any> }) {
  const colorScheme = useColorScheme()
  const theme = useTheme()
  const { t, i18n } = useTranslation()

  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const logout = async () => {
    await SecureStore.deleteItemAsync('access_token')
    api.defaults.headers.common.Authorization = undefined
    navigation.navigate('Login', { isConnected: false })
  }

  const changeLanguage = (locale: string) => {
    i18n.changeLanguage(locale)
    setIsMenuOpen(false)
  }

  return (
    <>
      <Appbar.Header>
        <Appbar.Content title={t('settings.settings')} />
      </Appbar.Header>
      <View>
        <Divider />
        <View className='p-2 flex-row flex-grow justify-between'>
          <Text
            variant='titleLarge'
            className=''
          >
            {t('settings.language')}
          </Text>
          <View>
            <TouchableRipple onPress={() => setIsMenuOpen(true)}>
              <Menu
                visible={isMenuOpen}
                onDismiss={() => setIsMenuOpen(false)}
                anchor={
                  <View className='flex-row spacxe-x-1'>
                    <Text variant='titleLarge'>{i18n.language.toLocaleUpperCase()}</Text>
                    <MaterialCommunityIcons
                      color='white'
                      name={isMenuOpen ? 'chevron-up' : 'chevron-down'}
                      size={26}
                    />
                  </View>
                }
              >
                <Menu.Item
                  title='FR'
                  onPress={() => changeLanguage('fr')}
                />
                <Menu.Item
                  title='EN'
                  onPress={() => changeLanguage('en')}
                />
                <Menu.Item
                  title='ES'
                  onPress={() => changeLanguage('es')}
                />
                <Menu.Item
                  title='CN'
                  onPress={() => changeLanguage('cn')}
                />
              </Menu>
            </TouchableRipple>
          </View>
        </View>
        <Divider />
        <TouchableRipple
          onPress={logout}
          className='w-full p-2'
        >
          <Text
            variant='headlineSmall'
            className='text-red-700 text-right'
          >
            {t('settings.logout')}
          </Text>
        </TouchableRipple>
        <Divider />
      </View>
    </>
  )
}

const styles = StyleSheet.create({})
