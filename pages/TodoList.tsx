import { View, SafeAreaView, KeyboardAvoidingView, Platform, ScrollView } from 'react-native'
import { useTheme, Appbar, Searchbar, Text, Divider, Checkbox, TouchableRipple, Menu } from 'react-native-paper'
import { NavigationProp } from '@react-navigation/native'
import { useState } from 'react'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import { useTranslation } from 'react-i18next'

export default function TodoListScreen({ navigation }: { navigation: NavigationProp<any> }) {
  const colorScheme = useTheme()
  const { t } = useTranslation()
  const [task, setTask] = useState('')
  const [taskItems, setTaskItems] = useState<Array<string>>([])
  const [inputMessage, setInputMessage] = useState<string>('')
  const [checkbox, setCheckbox] = useState<Array<'checked' | 'unchecked'>>([])
  const [isMenuOpen, setIsMenuOpen] = useState<Array<boolean>>([false])

  const handleToDoComplete = (index: number) => {
    if (checkbox[index] === 'unchecked') {
      setCheckbox((prev) => {
        const tmp = [...prev]
        tmp[index] = 'checked'
        return tmp
      })
    } else {
      setCheckbox((prev) => {
        const tmp = [...prev]
        tmp[index] = 'unchecked'
        return tmp
      })
    }
  }

  return (
    <SafeAreaView
      style={{ backgroundColor: colorScheme.colors.background }}
      className='h-full'
    >
      <Appbar.Header>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title={t('todo.title')} />
      </Appbar.Header>
      <View className='flex flex-row items-end justify-around w-full pb-5 z-10'>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          className='w-[95%]'
        >
          <Searchbar
            placeholder={t('todo.addTask')}
            value={inputMessage}
            onChangeText={(e) => setInputMessage(e)}
            multiline
            icon={() => <></>}
            right={() => (
              <View className='pr-4'>
                <MaterialCommunityIcons
                  name='send'
                  color={colorScheme.colors.primary}
                  size={26}
                  onPress={() => {
                    if (inputMessage === '') return
                    setTaskItems([...taskItems, inputMessage])
                    setInputMessage('')
                  }}
                />
              </View>
            )}
          />
        </KeyboardAvoidingView>
      </View>
      <ScrollView scrollEnabled>
        <Divider />
        <View className='space-y-2'>
          {taskItems.map((item, index) => {
            return (
              <>
                <TouchableRipple
                  onLongPress={() => {
                    setIsMenuOpen((prev) => {
                      const tmp = [...prev]
                      tmp[index] = !tmp[index]
                      return tmp
                    })
                  }}
                >
                  <>
                    <Menu
                      visible={isMenuOpen[index]}
                      onDismiss={() => {
                        setIsMenuOpen((prev) => {
                          const tmp = [...prev]
                          tmp[index] = false
                          return tmp
                        })
                      }}
                      anchor={
                        <>
                          <View className='p-3 flex flex-row items-center pl-5 justify-between'>
                            <Text variant='titleMedium'>{item}</Text>
                            <Checkbox
                              status={checkbox[index]}
                              onPress={() => handleToDoComplete(index)}
                            />
                          </View>
                          <Divider key={index} />
                        </>
                      }
                    >
                      <Menu.Item
                        trailingIcon={() => {
                          return (
                            <MaterialCommunityIcons
                              name='delete'
                              color={colorScheme.colors.primary}
                              size={26}
                            />
                          )
                        }}
                        title='Delete'
                        onPress={() => {
                          setIsMenuOpen((prev) => {
                            const tmp = [...prev]
                            tmp[index] = false
                            return tmp
                          })
                          setTaskItems((prev) => {
                            const tmp = [...prev]
                            tmp.splice(index, 1)
                            return tmp
                          })
                          setCheckbox((prev) => {
                            const tmp = [...prev]
                            tmp.splice(index, 1)
                            return tmp
                          })
                        }}
                      />
                    </Menu>
                  </>
                </TouchableRipple>
              </>
            )
          })}
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}
