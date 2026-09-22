import { useEffect, useState } from "react";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import AnimatedSplash from "@/components/AnimatedSplash";

// Mantém a splash nativa até a splash animada assumir
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [appReady, setAppReady] = useState(false);
  const [splashDone, setSplashDone] = useState(false);

  useEffect(() => {
    async function prepare() {
      try {
        // Aqui entram as tarefas de inicialização:
        // - verificar sessão do Supabase (supabase.auth.getSession())
        // - carregar dados do localStorage / AsyncStorage
        // - carregar fontes
      } finally {
        setAppReady(true);
      }
    }
    prepare();
  }, []);

  return (
    <>
      <Stack screenOptions={{ headerShown: false }} />
      {!splashDone && (
        <AnimatedSplash ready={appReady} onFinish={() => setSplashDone(true)} />
      )}
    </>
  );
}
