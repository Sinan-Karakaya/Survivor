import React, { useEffect, useState } from 'react'
import { TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import WeatherWidget from '../components/Widgets/WeatherWidget'
import TimeWidget from '../components/Widgets/TimeWidget'
import ProfileWidget from '../components/Widgets/ProfileWidget'
import TrombiWidget from '../components/Widgets/TrombiWidget'
import { FAB, IconButton, Modal, useTheme } from 'react-native-paper'
import NotepadWidget from '../components/Widgets/NotepadWidget'
import TodoListWidget from '../components/Widgets/TodoListWidget'
import { useTranslation } from 'react-i18next'
import Draggable from 'react-native-draggable'
import * as Animatable from 'react-native-animatable'
import { api } from '../tools/api'
import { Employee } from '../types/Employee'
import ClockWidget from '../components/Widgets/ClockWidget'
import WeatherWidget2 from '../components/Widgets/WeatherWidget2'
import BirthdayWidget from '../components/Widgets/BirthdayWidget'
import DiscordWidget from '../components/Widgets/DiscordWidget'
import GrettingsWidget from '../components/Widgets/GrettingsWidget'

export default function HomeScreen({ navigation }: { navigation: any }) {
  const { t } = useTranslation()
  const [id, setId] = useState(0)
  const [visible, setVisible] = useState(false)
  const theme = useTheme()

  const getUser = async () => {
    try {
      const user = await api.get<Employee>('/api/employees/me')
      setId(user.data.id)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    getUser()
  }, [])

  const [widgets, setWidgets] = useState([
    {
      id: 1,
      name: 'Weather',
      position: { x: 250, y: 200 },
      size: { width: 150, height: 150 },
      actual: <WeatherWidget />,
      component: [<WeatherWidget />, <WeatherWidget2 />],
      isVisible: true,
      isDraggable: false,
    },
    {
      id: 2,
      name: 'Profile',
      position: { x: 100, y: 200 },
      size: { width: 150, height: 150 },
      actual: <ProfileWidget />,
      component: [<ProfileWidget />],
      isVisible: true,
      isDraggable: false,
    },
    {
      id: 3,
      name: 'Heure',
      position: { x: 100, y: 50 },
      size: { width: 150, height: 150 },
      actual: <TimeWidget />,
      component: [<TimeWidget />, <ClockWidget />],
      isVisible: true,
      isDraggable: false,
    },
    {
      id: 4,
      name: 'Trombinoscope',
      position: { x: 100, y: 420 },
      size: { width: 150, height: 150 },
      actual: <TrombiWidget navigation={navigation} />,
      component: [<TrombiWidget navigation={navigation} />],
      isVisible: true,
      isDraggable: false,
    },
    {
      id: 6,
      name: 'Notepad',
      position: { x: 100, y: 600 },
      size: { width: 150, height: 150 },
      actual: <NotepadWidget navigation={navigation} />,
      component: [<NotepadWidget navigation={navigation} />],
      isVisible: true,
      isDraggable: false,
    },
    {
      id: 7,
      name: 'TodoList',
      position: { x: 250, y: 600 },
      size: { width: 150, height: 150 },
      actual: <TodoListWidget navigation={navigation} />,
      component: [<TodoListWidget navigation={navigation} />],
      isVisible: true,
      isDraggable: false,
    },
    {
      id: 5,
      name: 'Discord',
      position: { x: 250, y: 200 },
      size: { width: 150, height: 150 },
      component: <DiscordWidget navigation={navigation} />,
      isVisible: true,
      isDraggable: false,
    },
    {
      id: 8,
      name: 'Grettings',
      position: { x: 350, y: 50 },
      size: { width: 150, height: 150 },
      actual: <GrettingsWidget/>,
      component: [<GrettingsWidget/>],
      isVisible: true,
      isDraggable: false,
    }
    // greeting
    // estimation salaire
    // birthday notification
  ])

  const FABActions = [
    {
      icon: 'weather-cloudy',
      label: t('home.fab.weather'),
      onPress: () => openModal('Weather'),
    },
    {
      icon: 'clock-outline',
      label: t('home.fab.time'),
      onPress: () => openModal('Heure'),
    },
    {
      icon: 'account-outline',
      label: t('home.fab.profile'),
      onPress: () => openModal('Profile'),
    },
    {
      icon: 'account-group-outline',
      label: t('home.fab.trombi'),
      onPress: () => openModal('Trombinoscope'),
    },
    {
      icon: 'notebook-outline',
      label: t('home.fab.notepad'),
      onPress: () => openModal('Notepad'),
    },
    {
      icon: 'clipboard-list-outline',
      label: t('home.fab.todolist'),
      onPress: () => openModal('TodoList'),
    },
    {
      icon: 'cake',
      label: t('home.fab.birthday'),
      onPress: () => openModal('Birthday'),
    },
    {
      icon: 'discord',
      label: t('home.fab.discord'),
      onPress: () => addWidget('Discord', <DiscordWidget navigation={navigation} />),
    },
    {
      icon: 'human-greeting-variant',
      label: t('home.fab.greeting'),
      onPress: () => openModal('Grettings'),
    },
  ]

  const [listComponent, setListComponent] = useState<Array<JSX.Element>>([<></>])
  const [listName, setListName] = useState<string>('')

  const openModal = (name: string) => {
    setVisible(true)
    switch (name) {
      case 'Weather':
        setListComponent([<WeatherWidget />, <WeatherWidget2 />])
        setListName('Weather')
        break
      case 'Heure':
        setListComponent([<TimeWidget />, <ClockWidget />])
        setListName('Heure')
        break
      case 'Profile':
        setListComponent([<ProfileWidget />])
        setListName('Profile')
        break
      case 'Trombinoscope':
        setListComponent([<TrombiWidget navigation={navigation} />])
        setListName('Trombinoscope')
        break
      case 'Notepad':
        setListComponent([<NotepadWidget navigation={navigation} />])
        setListName('Notepad')
        break
      case 'TodoList':
        setListComponent([<TodoListWidget navigation={navigation} />])
        setListName('TodoList')
        break
      case 'Birthday':
        setListComponent([<BirthdayWidget />])
        setListName('Birthday')
        break
      case 'Grettings':
        setListComponent([<GrettingsWidget />])
        setListName('Grettings')
        break
      default:
        break
    }
  }

  const handleDragging = (id: number) => {
    setWidgets(
      widgets.map((widget) => {
        if (widget.id === id) {
          widget.isDraggable = !widget.isDraggable
        }
        return widget
      })
    )
  }

  const removeWidget = (widgetId: number) => {
    setWidgets((prevWidgets) => prevWidgets.filter((widget) => widget.id !== widgetId))
  }

  const [isFABOpen, setIsFABOpen] = useState(false)

  const addWidget = (widgetName: any, component: any) => {
    const newId = Math.max(...widgets.map((widget) => widget.id), 0) + 1

    setWidgets((prevWidgets) => [
      ...prevWidgets,
      {
        id: newId,
        name: widgetName,
        position: { x: 100, y: 100 },
        size: { width: 150, height: 150 },
        actual: component,
        component: listComponent,
        isVisible: true,
        isDraggable: false,
      },
    ])
  }

  return (
    <>
      <SafeAreaView>
        <View className='w-full h-full'>
          {widgets
            .filter((widget) => widget.isVisible)
            .map((widget) => (
              <View
                key={`widget-${widget.id}`}
                style={{
                  left: widget.position.x - widget.size.width / 2,
                  top: widget.position.y - widget.size.height / 4,
                }}
                react-native-animatable
              >
                <Draggable disabled={!widget.isDraggable}>
                  <TouchableOpacity
                    onLongPress={() => handleDragging(widget.id)}
                    onPress={() =>
                      widget.name === 'Trombinoscope'
                        ? navigation.navigate('Trombi')
                        : null || widget.name === 'Profile'
                        ? navigation.navigate('Profile', { employeeID: id.toString() })
                        : null || widget.name === 'Notepad'
                        ? navigation.navigate('Notepad')
                        : null || widget.name === 'TodoList'
                        ? navigation.navigate('TodoList')
                        : null
                    }
                  >
                    <Animatable.View
                      easing='ease-out'
                      iterationCount='infinite'
                      animation={widget.isDraggable ? 'pulse' : ''}
                    >
                      {!widget.isDraggable ? (
                        <>{widget.actual}</>
                      ) : (
                        <>
                          {widget.actual}
                          <IconButton
                            icon='close'
                            style={{ position: 'absolute', top: -20, right: -20 }}
                            containerColor='rgba(0,0,0,0.5)'
                            iconColor='red'
                            onPress={() => removeWidget(widget.id)}
                          />
                        </>
                      )}
                    </Animatable.View>
                  </TouchableOpacity>
                </Draggable>
              </View>
            ))}
          <FAB.Group
            open={isFABOpen}
            visible={!visible}
            icon={'plus'}
            onStateChange={({ open }) => setIsFABOpen(open)}
            actions={FABActions}
            style={{ position: 'absolute', zIndex: 10 }} // margin: 16, right: 0, bottom: 0, width: '95%'
          />
        </View>
        {visible ? <View className={visible ? 'absolute w-screen h-screen bg-black opacity-40' : ''}></View> : null}
        <Modal
          visible={visible}
          onDismiss={() => {
            setVisible(false)
          }}
          contentContainerStyle={{
            backgroundColor: theme.colors.background,
            opacity: 0.9,
            width: '90%',
            display: 'flex',
            alignSelf: 'center',
            height: '80%',
            borderRadius: 16,
          }}
        >
          <View className='space-y-8 flex flex-col justify-center items-center'>
            {listComponent.map((component, index) => (
              <TouchableOpacity
                key={`component-${index}`}
                onPress={() => {
                  addWidget(listName, component)
                  setVisible(false)
                }}
              >
                <View>{component}</View>
              </TouchableOpacity>
            ))}
          </View>
        </Modal>
      </SafeAreaView>
    </>
  )
}
