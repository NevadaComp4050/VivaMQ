'use server'

import { signIn } from '~/auth'

export async function authenticate(
  prevState: string | undefined,
  formData: FormData,
) {
  try {
    await signIn('credentials', {
      email: formData.get('email'),
      password: formData.get('password'),
      redirect: false,
    })
  } catch (error) {
    if (error instanceof Error) {
      return error.message
    }
    return 'Something went wrong'
  }
}