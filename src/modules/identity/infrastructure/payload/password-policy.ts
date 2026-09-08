import { APIError, type CollectionBeforeValidateHook } from 'payload'

export const validatePassword: CollectionBeforeValidateHook = ({ data }) => {
  if (data?.password !== undefined && (typeof data.password !== 'string' || data.password.length < 12 || data.password.length > 128)) {
    throw new APIError('رمز عبور باید بین ۱۲ تا ۱۲۸ کاراکتر باشد.', 400)
  }
  return data
}
