import React from 'react'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import { createMaterialBottomTabNavigator } from 'react-native-paper/react-navigation'

import HomeScreen from '../pages/Home'
import ChatScreen from '../pages/Chat'
import SettingsScreen from '../pages/Settings'

const Tab = createMaterialBottomTabNavigator()

export default function Router() {
  return (
    <Tab.Navigator
      labeled={false}
      initialRouteName='Home'
    >
      <Tab.Screen
        name='Chat'
        component={ChatScreen}
        options={{
          tabBarIcon: ({ color }: { color: any }) => {
            return (
              <MaterialCommunityIcons
                name='chat-outline'
                color={color}
                size={26}
              />
            )
          },
        }}
      />
      <Tab.Screen
        name='Home'
        component={HomeScreen}
        options={{
          tabBarIcon: ({ color }: { color: any }) => {
            return (
              <MaterialCommunityIcons
                name='home-outline'
                color={color}
                size={26}
              />
            )
          },
        }}
      />
      <Tab.Screen
        name='Settings'
        component={SettingsScreen}
        options={{
          tabBarIcon: ({ color }: { color: any }) => {
            return (
              <MaterialCommunityIcons
                name='cog-outline'
                color={color}
                size={26}
              />
            )
          },
        }}
      />
    </Tab.Navigator>
  )
}
