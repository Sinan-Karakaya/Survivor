import React, { useEffect, useState } from 'react'
import { View, Text } from 'react-native'
import { Card } from 'react-native-paper'
import Svg, { Circle, Line } from 'react-native-svg'

const SECOND_MS = 1000

export default function ClockWidget() {
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

  const secondAngle = (360 / 60) * seconds
  const minuteAngle = (360 / 60) * minutes + (6 / 60) * seconds
  const hourAngle = (360 / 12) * (hours % 12) + (360 / 12) * (minutes / 60)

  const numbers = Array.from({ length: 12 }, (_, index) => index + 1)

  return (
    <Card>
      <View>
        <View style={{ alignItems: 'center' }}>
          <Svg
            width={150}
            height={150}
          >
            {/* Clock face */}
            <Circle
              cx={75}
              cy={75}
              r={60}
              stroke='white'
              fill={'black'}
              strokeWidth={2}
            />

            {/* Numbers */}
            {numbers.map((number, index) => {
              const angle = (360 / 12) * index
              const radius = 45
              const x = 75 + radius * Math.sin((angle * Math.PI) / 180)
              const y = 75 - radius * Math.cos((angle * Math.PI) / 180)
              return (
                <Text
                  key={index}
                  style={{
                    position: 'absolute',
                    left: x - 6,
                    top: y - 10,
                    fontSize: 12,
                    color: 'white',
                  }}
                >
                  {number}
                </Text>
              )
            })}
            <Line
              x1={75}
              y1={75}
              x2={75}
              y2={40}
              stroke='red'
              strokeWidth={1}
              strokeLinecap='round'
              transform={`rotate(${secondAngle}, 75, 75)`}
            />
            {/* Minute hand */}
            <Line
              x1={75}
              y1={75}
              x2={75}
              y2={45}
              stroke='gray'
              strokeWidth={2}
              strokeLinecap='round'
              transform={`rotate(${minuteAngle}, 75, 75)`}
            />

            {/* Hour hand */}
            <Line
              x1={75}
              y1={75}
              x2={75}
              y2={55}
              stroke='white'
              strokeWidth={3}
              strokeLinecap='round'
              transform={`rotate(${hourAngle}, 75, 75)`}
            />
          </Svg>
        </View>
      </View>
    </Card>
  )
}
