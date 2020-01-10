import AuthValidationDemo from './auth/auth-validation-demo';

export default {
  auth: {
    basic: {
      name: 'basic',
      username: 'node',
      password: 'node',
      options: {
        validate: new AuthValidationDemo().basic
      }
    },
    jwt: {
      name: 'jwt',
      options: {
        key: 'JWT-SECRET-KEY',
        verifyOptions: {algorithms: ['HS256']},
        validate: new AuthValidationDemo().jwt
      }
    }
  }
};
