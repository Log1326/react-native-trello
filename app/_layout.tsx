import 'react-native-reanimated'

import * as SecureStore from 'expo-secure-store'
import * as SplashScreen from 'expo-splash-screen'

import { SupabaseProvider } from '@/context/SupabaseContext'
import { ClerkProvider } from '@clerk/clerk-expo'
import { ActionSheetProvider } from '@expo/react-native-action-sheet'
import FontAwesome from '@expo/vector-icons/FontAwesome'
import { useFonts } from 'expo-font'
import { Stack } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import { useEffect } from 'react'
import { GestureHandlerRootView } from 'react-native-gesture-handler'

export { ErrorBoundary } from 'expo-router'

const tokenCache = {
  async getToken(key: string) {
    try {
      const item = await SecureStore.getItemAsync(key)

      return item
    } catch (error) {
      await SecureStore.deleteItemAsync(key)
      return null
    }
  },
  async saveToken(key: string, value: string) {
    try {
      return SecureStore.setItemAsync(key, value)
    } catch (err) {
      return
    }
  },
}

const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!

if (!publishableKey) {
  throw new Error(
    'Missing Publishable Key. Please set EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY in your .env'
  )
}
export const unstable_settings = {
  initialRouteName: 'index',
}
SplashScreen.preventAutoHideAsync()

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    ...FontAwesome.font,
  })

  useEffect(() => {
    if (error) throw error
  }, [error])

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync()
    }
  }, [loaded])

  if (!loaded) return null

  return <RootLayoutNav />
}

function RootLayoutNav() {
  return (
    <ClerkProvider publishableKey={publishableKey} tokenCache={tokenCache}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <ActionSheetProvider>
          <SupabaseProvider>
            <Stack>
              <Stack.Screen name='index' options={{ headerShown: false }} />
              <Stack.Screen
                name='authModal'
                options={{
                  headerShown: false,
                  presentation: 'modal',
                  contentStyle: {
                    maxHeight: 300,
                    marginTop: 'auto',
                    borderTopLeftRadius: 15,
                    borderTopRightRadius: 15,
                  },
                }}
              />
            </Stack>
          </SupabaseProvider>
        </ActionSheetProvider>
        <StatusBar style='light' />
      </GestureHandlerRootView>
    </ClerkProvider>
  )
}
