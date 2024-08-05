import * as WebBrowser from 'expo-web-browser'

import { Image, Text, TouchableOpacity, View } from 'react-native'

import { useActionSheet } from '@expo/react-native-action-sheet'
import { useAssets } from 'expo-asset'
import { useRouter } from 'expo-router'

export default function StartPage() {
  const [assets] = useAssets([require('@/assets/images/trello.png')])
  const { showActionSheetWithOptions } = useActionSheet()
  const router = useRouter()
  const openLink = () => WebBrowser.openBrowserAsync('https://google.com')
  const openActionSheet = () => {
    const options = ['View support docs', 'Contact us', 'Cancel']
    const cancelButtonIndex = 2
    showActionSheetWithOptions(
      {
        options,
        cancelButtonIndex,
        title: `Can't log in or sign up`,
      },
      (selected) => {
        console.log(selected)
      }
    )
  }
  return (
    <View className='bg-primary relative'>
      {assets && (
        <Image
          resizeMode='contain'
          source={{ uri: assets[0].uri }}
          className='w-full h-full'
        />
      )}

      <View className='absolute bottom-10 w-full  flex-col items-center space-y-4'>
        <Text className='text-lg text-fontLight'>
          Move teamwork forward - even on the go
        </Text>
        <TouchableOpacity
          onPress={() => router.push('/authModal')}
          className='rounded-lg bg-fontLight w-3/5'>
          <Text className='text-primary text-xl text-center p-3'>Log In</Text>
        </TouchableOpacity>
        <TouchableOpacity className='rounded-lg bg-transparent border border-fontLight w-3/5'>
          <Text className='text-fontLight text-xl p-3 text-center'>
            Sign Up
          </Text>
        </TouchableOpacity>
        <View className='flex-col items-center justify-center w-60'>
          <Text className='text-sm text-center  text-white'>
            By signing up you agree to the
          </Text>
          <View className='flex-row space-x-1'>
            <TouchableOpacity onPress={openLink}>
              <Text className='underline text-sm text-center  text-white'>
                User Notice
              </Text>
            </TouchableOpacity>
            <Text className=' text-white text-sm text-center'>and</Text>
            <TouchableOpacity onPress={openLink}>
              <Text className='text-white underline text-sm text-center'>
                Privacy Policy
              </Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity onPress={openActionSheet}>
            <Text className='underline text-center text-white mt-3'>
              Can`t log in our sign up ?
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  )
}
