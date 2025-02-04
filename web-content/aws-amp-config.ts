// aws-amp-config.ts
import { Amplify, type ResourcesConfig } from 'aws-amplify';

export const ampConfig = {
  Auth: { 
    Cognito: {
      userPoolClientId: "6gijns0ha1i99riv57t9q5fv16",
      userPoolId: "us-east-1_NXZP3TRTc",
      // REQUIRED only for Federated Authentication - Amazon Cognito Identity Pool ID
      identityPoolId: 'us-east-1:aef56353-fe66-482e-bcba-d23b76022e9b',
      // OPTIONAL - Set to true to use your identity pool's unauthenticated role when user is not logged in
      allowGuestAccess: true,
    //   signUpVerificationMethod: 'code',
    //   loginWith: {
    //     username: true,
    //   }
    }
  },
  Storage: {
    S3: {
      region: 'us-east-1', // (required) - Amazon S3 bucket region
      bucket: 'cil-gen-ai-use-cases' // (required) - Amazon S3 bucket URI
    }
  },
  API: {
    REST: {
      cil_gen_ai_use_cases: {
        endpoint:
        'https://y8zhxgsk38.execute-api.us-east-1.amazonaws.com/dev',
        region: 'us-east-1' // Optional
      }
    },
    // GraphQL: {
    //   endpoint: 'https://ycte4yic3bdsthi67kzb5xbn4a.appsync-api.us-east-1.amazonaws.com/graphql',
    //   region: 'us-east-1',
    //   defaultAuthMode: 'apiKey',
    //   apiKey: 'da2-iqrfkealw5a6zhjl2ug4c37fmm'
    // }
  }
} as ResourcesConfig