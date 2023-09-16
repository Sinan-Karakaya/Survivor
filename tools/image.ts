import { api } from './api'
import { encode as btoa } from 'base-64'
import * as FileSystem from 'expo-file-system'
import * as SecureStore from 'expo-secure-store'

function arrayBufferToBase64(buffer: any) {
  let binary = ''
  const bytes = new Uint8Array(buffer)
  let len = bytes.byteLength
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i])
  }
  return btoa(binary)
}

export async function getImage(id: string): Promise<string> {
  try {
    // const res = await api.get(`/api/employees/${id}/image`, {
    //   responseType: 'arraybuffer',
    // })
    const jwt = await SecureStore.getItemAsync('access_token')
    const res = await FileSystem.downloadAsync(
      `${process.env.EXPO_PUBLIC_API_URL}/api/employees/${id}/image`,
      FileSystem.documentDirectory + `/image-${id}.png`,
      {
        headers: {
          Authorization: `Bearer ${jwt}`,
          'X-Group-Authorization': process.env.EXPO_PUBLIC_GROUP_TOKEN ?? 'oh no',
        },
      }
    )

    // const b64 = arrayBufferToBase64(res.uri)
    // const image = `data:image/png;base64,${b64}`

    return res.uri
  } catch (err) {
    console.error(err)
  }
  return ''
}
