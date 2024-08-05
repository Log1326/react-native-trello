import { useOAuth, useSignIn, useSignUp } from '@clerk/clerk-expo'
import { Image, Text, TouchableOpacity, View } from 'react-native'

import { AuthStrategy } from '@/types/enums'

const LOGIN_OPTIONS = [
  {
    text: 'Continue with Google',
    icon: require('@/assets/images/google.png'),
    strategy: AuthStrategy.Google,
  },
  {
    text: 'Continue with Apple',
    icon: require('@/assets/images/apple.png'),
    strategy: AuthStrategy.Apple,
  },
]
export default function AuthModal() {
  const { signIn } = useSignIn()
  const { signUp, setActive } = useSignUp()

  const { startOAuthFlow: googleAuth } = useOAuth({
    strategy: AuthStrategy.Google,
  })
  const { startOAuthFlow: appleAuth } = useOAuth({
    strategy: AuthStrategy.Apple,
  })
  const onSelectAuth = async (strategy: AuthStrategy) => {
    if (!signIn || !signUp) return
    const selectedAuth = {
      [AuthStrategy.Google]: googleAuth,
      [AuthStrategy.Apple]: appleAuth,
    }[strategy]

    const userExistsButNeedsToSignIn =
      signUp.verifications.externalAccount.status === 'transferable' &&
      signUp.verifications.externalAccount.error?.code ===
        'external_account_exists'

    if (userExistsButNeedsToSignIn) {
      const res = await signIn.create({ transfer: true })

      if (res.status === 'complete')
        setActive({
          session: res.createdSessionId,
        })
    }
    const userNeedsToBeCreated =
      signIn.firstFactorVerification.status === 'transferable'

    if (userNeedsToBeCreated) {
      const res = await signUp.create({
        transfer: true,
      })

      if (res.status === 'complete')
        setActive({
          session: res.createdSessionId,
        })
    } else {
      try {
        const { createdSessionId, setActive } = await selectedAuth()
        if (createdSessionId) setActive!({ session: createdSessionId })
      } catch (error) {
        console.log(error)
      }
    }
  }
  return (
    <View className='flex flex-col justify-start p-10 items-start h-72 w-full space-y-4'>
      <TouchableOpacity className='flex-row space-x-3 justify-center items-center border border-neutral-400 p-3 rounded-xl w-72'>
        <Image
          source={require('@/assets/images/email.png')}
          className='w-6 h-6'
        />
        <Text className='text-xl'>Continue with Email</Text>
      </TouchableOpacity>
      {LOGIN_OPTIONS.map((item) => (
        <TouchableOpacity
          onPress={() => onSelectAuth(item.strategy)}
          key={item.strategy}
          className='flex-row space-x-3 justify-center items-center border border-neutral-400 p-3 rounded-xl w-72'>
          <Image source={item.icon} className='w-6 h-6' />
          <Text className='text-xl'>{item.text}</Text>
        </TouchableOpacity>
      ))}
    </View>
  )
}
