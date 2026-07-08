import { useState, useCallback } from 'react'
import {
  CognitoUserPool,
  CognitoUser,
  AuthenticationDetails,
  CognitoUserAttribute,
} from 'amazon-cognito-identity-js'
import awsConfig from '../aws-exports'
import { useAuthStore } from '../store/authStore'

const getUserPool = () => {
  if (!awsConfig.userPoolId || !awsConfig.userPoolWebClientId) {
    console.warn('Cognito config missing — auth will fail')
  }
  return new CognitoUserPool({
    UserPoolId: awsConfig.userPoolId,
    ClientId: awsConfig.userPoolWebClientId,
  })
}

export function useAuth() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const { setAuth, clearAuth } = useAuthStore()

  const clearError = useCallback(() => setError(null), [])

  const signUp = useCallback(async ({ email, password, name }) => {
    setLoading(true)
    setError(null)
    const pool = getUserPool()
    const attributes = [
      new CognitoUserAttribute({ Name: 'email', Value: email }),
      new CognitoUserAttribute({ Name: 'name', Value: name }),
    ]
    return new Promise((resolve, reject) => {
      pool.signUp(email, password, attributes, null, (err, result) => {
        setLoading(false)
        if (err) { setError(err.message); reject(err) }
        else resolve(result)
      })
    })
  }, [])

  const confirmSignUp = useCallback(async ({ email, code }) => {
    setLoading(true)
    setError(null)
    const pool = getUserPool()
    const user = new CognitoUser({ Username: email, Pool: pool })
    return new Promise((resolve, reject) => {
      user.confirmRegistration(code, true, (err, result) => {
        setLoading(false)
        if (err) { setError(err.message); reject(err) }
        else resolve(result)
      })
    })
  }, [])

  const resendCode = useCallback(async ({ email }) => {
    const pool = getUserPool()
    const user = new CognitoUser({ Username: email, Pool: pool })
    return new Promise((resolve, reject) => {
      user.resendConfirmationCode((err, result) => {
        if (err) { setError(err.message); reject(err) }
        else resolve(result)
      })
    })
  }, [])

  const signIn = useCallback(async ({ email, password }) => {
    setLoading(true)
    setError(null)
    const pool = getUserPool()
    const user = new CognitoUser({ Username: email, Pool: pool })
    const authDetails = new AuthenticationDetails({ Username: email, Password: password })
    return new Promise((resolve, reject) => {
      user.authenticateUser(authDetails, {
        onSuccess: (session) => {
          setLoading(false)
          const idToken = session.getIdToken().getJwtToken()
          const accessToken = session.getAccessToken().getJwtToken()
          const payload = session.getIdToken().decodePayload()
          setAuth({
            user: { email: payload.email, name: payload.name || payload['cognito:username'], sub: payload.sub },
            accessToken,
            idToken,
          })
          resolve(session)
        },
        onFailure: (err) => {
          setLoading(false)
          setError(err.message)
          reject(err)
        },
        newPasswordRequired: () => {
          setLoading(false)
          setError('New password required')
          reject(new Error('NEW_PASSWORD_REQUIRED'))
        },
      })
    })
  }, [setAuth])

  const forgotPassword = useCallback(async ({ email }) => {
    setLoading(true)
    setError(null)
    const pool = getUserPool()
    const user = new CognitoUser({ Username: email, Pool: pool })
    return new Promise((resolve, reject) => {
      user.forgotPassword({
        onSuccess: (data) => { setLoading(false); resolve(data) },
        onFailure: (err) => { setLoading(false); setError(err.message); reject(err) },
      })
    })
  }, [])

  const resetPassword = useCallback(async ({ email, code, newPassword }) => {
    setLoading(true)
    setError(null)
    const pool = getUserPool()
    const user = new CognitoUser({ Username: email, Pool: pool })
    return new Promise((resolve, reject) => {
      user.confirmPassword(code, newPassword, {
        onSuccess: () => { setLoading(false); resolve() },
        onFailure: (err) => { setLoading(false); setError(err.message); reject(err) },
      })
    })
  }, [])

  const signOut = useCallback(() => {
    const pool = getUserPool()
    const user = pool.getCurrentUser()
    if (user) user.signOut()
    clearAuth()
  }, [clearAuth])

  return { loading, error, clearError, signUp, confirmSignUp, resendCode, signIn, forgotPassword, resetPassword, signOut }
}
