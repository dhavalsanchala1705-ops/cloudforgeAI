const awsConfig = {
  region: import.meta.env.VITE_COGNITO_REGION || 'us-east-1',
  userPoolId: import.meta.env.VITE_COGNITO_USER_POOL_ID || '',
  userPoolWebClientId: import.meta.env.VITE_COGNITO_APP_CLIENT_ID || '',
  oauth: {
    domain: import.meta.env.VITE_COGNITO_DOMAIN || '',
    scope: ['email', 'openid', 'profile'],
    redirectSignIn: window.location.origin + '/dashboard',
    redirectSignOut: window.location.origin + '/',
    responseType: 'code',
  },
}

export default awsConfig
