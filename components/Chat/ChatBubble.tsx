import { View } from 'react-native'
import { Card, Text } from 'react-native-paper'

export default function ChatBubble({ sender, message, time }: { sender: boolean, message: string, time: Date }) {
  return (
    <View className={`w-full flex-row ${sender ? 'pl-2 justify-start' : 'pr-2 justify-end'}`}>
      <Card
        className='max-w-[80%] p-2 mb-2'
        mode={'contained'}
      >
        <Text variant='bodyMedium'>{message}</Text>
        <View className={`flex-row ${sender ? 'justify-end' : ''} mt-1`}>
          {/* <Text variant='labelSmall'>{time.toLocaleDateString()}</Text> */}
        </View>
      </Card>
    </View>
  )
}
