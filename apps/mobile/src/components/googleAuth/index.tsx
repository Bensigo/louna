import type { Session, User } from "@supabase/supabase-js";
import { Alert } from "react-native";
import {
  GoogleSignin,
  GoogleSigninButton,
  statusCodes,
} from "@react-native-google-signin/google-signin";

import { supabase } from "~/utils/supabase";

export type AuthData = {
  user: User | null;
  session: Session | null;
};

export function SignInWithGoogleAuth({
  onAuth,
}: {
  onAuth: (data: AuthData) => void;
}) {
  GoogleSignin.configure({
    scopes: ["https://www.googleapis.com/auth/drive.readonly"],
    webClientId: "YOUR CLIENT ID FROM GOOGLE CONSOLE",
  });

  return (
    <GoogleSigninButton
      size={GoogleSigninButton.Size.Wide}
      color={GoogleSigninButton.Color.Dark}
      onPress={async () => {
        try {
          await GoogleSignin.hasPlayServices();
          const userInfo = await GoogleSignin.signIn();
          if (userInfo.idToken) {
            const { data, error } = await supabase.auth.signInWithIdToken({
              provider: "google",
              token: userInfo.idToken,
            });
            console.log(error, data);
            if (error) {
              Alert.alert("Error", error.message);
              return;
            }
            onAuth(data);
          } else {
            throw new Error("no ID token present!");
          }
        } catch (error: any) {
          if (error.code === statusCodes.SIGN_IN_CANCELLED) {
            Alert.alert("Cancelled", error.message);
          } else if (error.code === statusCodes.IN_PROGRESS) {
            // operation (e.g. sign in) is in progress already
            Alert.alert(error.message);
          } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
            // play services not available or outdated
            Alert.alert(error.message);
          } else {
            // some other error happened
            Alert.alert("Error", error.message);
          }
        }
      }}
    />
  );
}
