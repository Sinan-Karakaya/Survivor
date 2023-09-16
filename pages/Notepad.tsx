import { SafeAreaView, TouchableOpacity, KeyboardAvoidingView } from 'react-native'
import { useTheme, TextInput, Appbar } from 'react-native-paper'
import { NavigationProp } from '@react-navigation/native'
import { useEffect, useRef, useState } from 'react'
import { api, backend } from '../tools/api'
import { Employee } from '../types/employee'
import { useTranslation } from 'react-i18next'

export default function NotepadScreen({ navigation }: { navigation: NavigationProp<any> }) {
  const colorScheme = useTheme()
  const [note, setNote] = useState('')
  const [me, setMe] = useState<Employee>()
  const inputRef = useRef<any>(null)
  const { t } = useTranslation()

  useEffect(() => {
    ;(async () => {
      try {
        const me = await api.get<Employee>('/api/employees/me')
        setMe(me.data)
        const note = await backend.post('/api/note/me', {
          employeeId: me.data.id,
        })

        if (note.data.note) setNote(note.data.note)
      } catch (error) {
        console.log(error)
      }
    })()
  }, [])

  const saveNote = async () => {
    try {
      const res = await backend.post('/api/note', {
        employeeId: me?.id ?? 0,
        note,
      })

      navigation.goBack()
    } catch (error) {
      console.log(error)
    }
  }

  const handleFocus = () => {
    inputRef.current?.focus()
  }

  return (
    <SafeAreaView
      style={{ backgroundColor: colorScheme.colors.background }}
      className='h-full'
    >
      <Appbar.Header>
        <Appbar.BackAction onPress={saveNote} />
        <Appbar.Content title={t('notepad.title')} />
      </Appbar.Header>
      <TouchableOpacity onPress={handleFocus}>
        <TextInput
          value={note}
          ref={inputRef}
          onChangeText={(e) => setNote(e)}
          multiline
          className='min-h-full'
        />
      </TouchableOpacity>
    </SafeAreaView>
  )
}
