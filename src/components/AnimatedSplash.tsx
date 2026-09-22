import { useEffect, useRef } from "react";
import {
  Animated,
  Image,
  ImageSourcePropType,
  StyleSheet,
  Text,
  View,
} from "react-native";
import * as SplashScreen from "expo-splash-screen";

// 👉 Quando receber a logo, troque por: require('../assets/images/logo.png')
const LOGO: ImageSourcePropType | null = null;

type Props = {
  ready: boolean; // true quando o app terminou de carregar
  onFinish: () => void; // remove a splash da tela
  minDuration?: number; // tempo mínimo exibida (ms)
};

export default function AnimatedSplash({
  ready,
  onFinish,
  minDuration = 1200,
}: Props) {
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const logoScale = useRef(new Animated.Value(0.9)).current;
  const containerOpacity = useRef(new Animated.Value(1)).current;
  const minTimePassed = useRef(false);

  // Entrada da logo
  useEffect(() => {
    Animated.parallel([
      Animated.timing(logoOpacity, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.spring(logoScale, { toValue: 1, useNativeDriver: true }),
    ]).start();

    const t = setTimeout(() => {
      minTimePassed.current = true;
      if (ready) fadeOut();
    }, minDuration);
    return () => clearTimeout(t);
  }, []);

  // Saída quando o app estiver pronto
  useEffect(() => {
    if (ready && minTimePassed.current) fadeOut();
  }, [ready]);

  const fadeOut = () => {
    Animated.timing(containerOpacity, {
      toValue: 0,
      duration: 400,
      useNativeDriver: true,
    }).start(onFinish);
  };

  return (
    <Animated.View
      style={[styles.container, { opacity: containerOpacity }]}
      onLayout={() => SplashScreen.hideAsync()} // esconde a splash nativa sem "piscar"
    >
      <Animated.View
        style={{ opacity: logoOpacity, transform: [{ scale: logoScale }] }}
      >
        {LOGO ? (
          <Image source={LOGO} style={styles.logo} resizeMode="contain" />
        ) : (
          <View style={styles.placeholder}>
            <Text style={styles.placeholderText}>LOGO</Text>
          </View>
        )}
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 999,
  },
  logo: { width: 200, height: 200 },
  placeholder: {
    width: 160,
    height: 160,
    borderRadius: 24,
    borderWidth: 2,
    borderStyle: "dashed",
    borderColor: "#D1D5DB",
    alignItems: "center",
    justifyContent: "center",
  },
  placeholderText: {
    color: "#9CA3AF",
    fontSize: 16,
    fontWeight: "600",
    letterSpacing: 2,
  },
});
