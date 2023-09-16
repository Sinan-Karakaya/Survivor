import React, { useEffect, useState } from 'react'
import { View } from 'react-native'
import { Card, Text } from 'react-native-paper'

const SECOND_MS = 1000

export default function AnalogClock() {
  const [currentTime, setCurrentTime] = useState(new Date())

  useEffect(() => {
    const updateTime = setInterval(() => {
      setCurrentTime(new Date())
    }, SECOND_MS)

    return () => clearInterval(updateTime)
  }, [])

  const hours = currentTime.getHours()
  const minutes = currentTime.getMinutes()
  const seconds = currentTime.getSeconds()

  const options = { weekday: 'long', day: 'numeric', month: 'long' } as const
  const dateStr = currentTime.toLocaleDateString(undefined, options)

  return (
    <Card>
      <View className='p-2 flex justify-center items-end'>
        <View className='flex w-max items-end'>
          <Text variant='displaySmall'>
            {hours}:{minutes}:{seconds}
          </Text>
        </View>
        <View className='flex w-max items-end'>
          <Text variant='titleSmall'>{dateStr}</Text>
        </View>
      </View>
    </Card>
  )
}
