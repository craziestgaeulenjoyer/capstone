  export type RootStackParamList = {
    Landing: undefined;
    Choice: undefined;
    VerificationScreen: undefined;
    SignIn: undefined;
    Loading: undefined;
    Home: undefined;
    ForgotPassword: undefined; 
    OtpVerificationScreen: { email: string; token: string }; 
    ResetPassword: { email: string; token: string }; 
  };
    