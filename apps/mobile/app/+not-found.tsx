import { Screen } from '@/components/Screen';
import { type } from '@/theme/type';
import { Link } from 'expo-router';
import { Text, View } from 'react-native';

export default function NotFound() {
  return (
    <Screen>
      <View style={{ padding: 24, gap: 12 }}>
        <Text style={type.display}>Lost.</Text>
        <Link href="/(app)/(tabs)">
          <Text style={type.body}>Back to home</Text>
        </Link>
      </View>
    </Screen>
  );
}
