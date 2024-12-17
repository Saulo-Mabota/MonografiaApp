import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'CEAD.ionic.starter',
  appName: 'souCEAD',
  webDir: 'www',
  server: {
    androidScheme: 'https'
  },
  plugins:{
    PushNotifications:{
      presentationOptions:["badge","sound","alert"],
    },
  },
};

export default config;
