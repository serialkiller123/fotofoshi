import * as SecureStore from "expo-secure-store";

export const setAuthData = async (newToken, user) => {
  await SecureStore.setItemAsync("token", newToken);
  await SecureStore.setItemAsync("user", JSON.stringify(user));
};

export const getToken = async () => {
  let result = await SecureStore.getItemAsync("token");
  return result ? result : null;
};

export const getUser = async () => {
  let result = await SecureStore.getItemAsync("user");
  return result ? JSON.parse(result) : null;
};

export const deleteAuthData = async () => {
  await SecureStore.deleteItemAsync("token");
  await SecureStore.deleteItemAsync("user");
};

export const setSettings = async (apiKey, websiteDomain) => {
  await SecureStore.setItemAsync("apiKey", apiKey);
  await SecureStore.setItemAsync("websiteDomain", websiteDomain);
};

export const getSettings = async () => {
  const apiKey = await SecureStore.getItemAsync("apiKey");
  const websiteDomain = await SecureStore.getItemAsync("websiteDomain");
  return {
    apiKey: apiKey ? apiKey : null,
    websiteDomain: websiteDomain ? websiteDomain : null,
  };
};

export const deleteSettings = async () => {
  await SecureStore.deleteItemAsync("apiKey");
  await SecureStore.deleteItemAsync("websiteDomain");
};
