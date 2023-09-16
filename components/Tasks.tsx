import React from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import Icon from 'react-native-paper/lib/typescript/components/Icon'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'

export default function Tasks(props: any) {
    return (
        <View className='p-3 rounded-xl bg-white flex-row items-center justify-between mb-10'>
            <View className='flex-row items-center flex-wrap'>
                <View className='w-10 h-10 bg-cyan-500 opacity-40 rounded mr-4'/>
                <Text className='max-w-[80%]'>{props.text}</Text>
            </View>
            <View>
                <MaterialCommunityIcons
                    name="circle-outline"
                    size={24}
                    color="blue"
                />
            </View>
        </View>
    )
}