import React, { useState } from 'react'
import { Dialog, Text, Button } from 'react-native-paper'

export default function CardProfileComponent({ onDismiss }) {
  const [visible, setVisible] = useState(false)

  const showDialog = () => setVisible(true)

  const hideDialog = () => {
    setVisible(false)
    onDismiss() // Appeler la fonction de rappel pour fermer le dialogue
  }

  return (
    <Dialog
      visible={visible}
      onDismiss={hideDialog}
    >
      <Dialog.Title>Alert</Dialog.Title>
      <Dialog.Content>
        <Text variant='bodyMedium'>This is simple dialog</Text>
      </Dialog.Content>
      <Dialog.Actions>
        <Button onPress={hideDialog}>Done</Button>
      </Dialog.Actions>
    </Dialog>
  )
}
