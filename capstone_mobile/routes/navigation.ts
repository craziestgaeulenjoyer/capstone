export type RootStackParamList = {
  Landing: undefined;
  Choice: undefined;

  VerificationScreen: {
    email: string;
    otpToken: string;
  };

  SignIn: undefined;
  Loading: undefined;

  Home: undefined;

  Menu: {
    category?: string;
    useReward?: boolean; 
  };

  Cart: {
    checkoutStep?: "review" | "payment" | "confirm";
  } | undefined;

  Profile: undefined;

  ForgotPassword: undefined;

  OtpVerificationScreen: {
    email: string;
    token: string;
  };

  ResetPassword: {
    email: string;
    token: string;
  };
};
