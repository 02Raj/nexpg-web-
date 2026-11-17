import { colors, radius } from '@/theme/tokens';
import { fonts } from '@/theme/fonts';
import { Tabs } from 'expo-router';
import { Platform, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const TAB_CONTENT_HEIGHT = 56;

function TabIcon({ focused, glyph, label }: { focused: boolean; glyph: string; label: string }) {
  return (
    <View style={styles.item}>
      <View style={[styles.mark, focused && styles.markOn]} />
      <Text style={[styles.glyph, focused && styles.glyphOn]}>{glyph}</Text>
      <Text style={[styles.label, focused && styles.labelOn]}>{label}</Text>
    </View>
  );
}

export default function TabsLayout() {
  const insets = useSafeAreaInsets();
  // Android 3-button nav often reports 0 inset — keep tabs above system buttons.
  const bottomPad = Math.max(insets.bottom, Platform.OS === 'android' ? 28 : 8);

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          backgroundColor: '#FFFcf7',
          borderTopColor: colors.line,
          borderTopWidth: StyleSheet.hairlineWidth,
          paddingTop: 8,
          paddingBottom: bottomPad,
          height: TAB_CONTENT_HEIGHT + 8 + bottomPad,
        },
        tabBarItemStyle: {
          paddingVertical: 4,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarIcon: ({ focused }) => <TabIcon focused={focused} glyph="▣" label="Home" />,
        }}
      />
      <Tabs.Screen
        name="beds"
        options={{
          tabBarIcon: ({ focused }) => <TabIcon focused={focused} glyph="▦" label="Beds" />,
        }}
      />
      <Tabs.Screen
        name="bills"
        options={{
          tabBarIcon: ({ focused }) => <TabIcon focused={focused} glyph="₹" label="Bills" />,
        }}
      />
      <Tabs.Screen
        name="more"
        options={{
          tabBarIcon: ({ focused }) => <TabIcon focused={focused} glyph="⋯" label="More" />,
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  item: {
    alignItems: 'center',
    minWidth: 64,
    gap: 2,
  },
  mark: {
    width: 16,
    height: 3,
    borderRadius: radius.pill,
    backgroundColor: 'transparent',
  },
  markOn: {
    backgroundColor: colors.ochre,
  },
  glyph: {
    fontFamily: fonts.mono,
    fontSize: 16,
    color: colors.inkFaint,
  },
  glyphOn: {
    color: colors.ink,
  },
  label: {
    fontFamily: fonts.bodyMedium,
    fontSize: 11,
    color: colors.inkFaint,
  },
  labelOn: {
    color: colors.ink,
  },
});
