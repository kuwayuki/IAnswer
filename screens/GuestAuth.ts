import { getCurrentUser, signIn, signUp } from "@aws-amplify/auth";
import { v4 as uuidv4 } from "uuid";
import { getLocalStorage, saveLocalStorage } from "./utils";

const GUEST_PASSWORD = "sjhadiyans78213@";
const USER_NAME = "username";

export async function authenticate(): Promise<void> {
  try {
    await getCurrentUser();
  } catch (error) {
    const username = await getLocalStorage(USER_NAME);
    if (username) {
      await authSignIn(username);
    } else {
      await authSignUp();
    }
  }
}

async function authSignIn(username: string): Promise<void> {
  try {
    await signIn({
      username: username,
      password: GUEST_PASSWORD,
      options: {
        authFlowType: "USER_PASSWORD_AUTH",
      },
    });
  } catch (error) {
    console.log("error signing in", error);
    await authSignUp();
  }
}

async function authSignUp(): Promise<void> {
  try {
    const username: string = uuidv4();
    const userInfo = await signUp({
      username: username,
      password: GUEST_PASSWORD,
    });
    saveLocalStorage(USER_NAME, username);
    console.log(userInfo);
  } catch (error) {
    console.error("error signing up:", error);
  }
}
