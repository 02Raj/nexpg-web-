import AsyncStorage from '@react-native-async-storage/async-storage';

const key = (userId: string) => `nexpg.onboarding.done.${userId}`;

export async function isOnboardingComplete(userId: string) {
  const value = await AsyncStorage.getItem(key(userId));
  return value === '1';
}

export async function completeOnboarding(userId: string) {
  await AsyncStorage.setItem(key(userId), '1');
}

export const ONBOARDING_STEPS = 4;
