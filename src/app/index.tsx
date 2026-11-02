import {
  ChartNoAxesColumn,
  Pause,
  PawPrint,
  Play,
  RotateCcw,
  Settings,
} from "lucide-react-native";
import { useEffect, useState } from "react";
import { Text, View, StyleSheet, Pressable } from "react-native";
import {
  SafeAreaProvider,
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

export default function HomeScreen() {
  const insets = useSafeAreaInsets();

  const [durationMs, setDurationMs] = useState(2 * 60 * 1000);
  const [remainingTime, setRemainingTime] = useState(0);
  const [endAt, setEndAt] = useState(0);

  const [isOnPause, setIsOnPause] = useState(true);

  const setOnPause = (onPause: boolean) => {
    if (onPause) {
      setRemainingTime(endAt - Date.now());
      setEndAt(0);
    } else {
      setEndAt(Date.now() + remainingTime);
    }
    setIsOnPause(onPause);
  };

  const onResetHandle = () => {
    setRemainingTime(durationMs);
    setEndAt(0);
    setIsOnPause(true);
  };

  const continueText = () => {
    return durationMs === remainingTime ? "Start" : "Continue";
  };

  useEffect(() => {
    setRemainingTime(durationMs);
  }, []);

  useEffect(() => {
    if (!endAt) return;
    const id = setInterval(() => {
      const left = Math.max(0, endAt - Date.now());

      setRemainingTime(left);

      if (left === 0) clearInterval(id);
    }, 250);
    return () => clearInterval(id);
  }, [endAt]);

  const timeToString = () => {
    const totalSeconds = Math.ceil(remainingTime / 1000);

    const mm = Math.floor(totalSeconds / 60)
      .toString()
      .padStart(2, "0");
    const ss = (totalSeconds % 60).toString().padStart(2, "0");

    return `${mm}:${ss}`;
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView
        style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
        edges={["top", "bottom"]}
      >
        <View style={styles.header}></View>

        <View style={styles.clock}>
          <Text style={{ fontSize: 56 }}>{timeToString()}</Text>
        </View>

        <View style={styles.session}>
          {isOnPause ? (
            <Pressable
              style={styles.continueButton}
              onPress={() => setOnPause(!isOnPause)}
            >
              <Play
                style={{ position: "absolute", left: 16 }}
                size={24}
                color="#000000"
              />
              <Text style={{ fontSize: 20 }}>{continueText()}</Text>
            </Pressable>
          ) : (
            <Pressable
              style={styles.pauseButton}
              onPress={() => setOnPause(!isOnPause)}
            >
              <Pause
                style={{ position: "absolute", left: 16 }}
                size={24}
                color="#000000"
              />
              <Text style={{ fontSize: 20 }}>Pause</Text>
            </Pressable>
          )}
          <Pressable style={styles.resetButton} onPress={onResetHandle}>
            <RotateCcw />
          </Pressable>
        </View>

        <View style={[styles.footer, { marginBottom: insets.bottom + 8 }]}>
          <View style={styles.footerItem}>
            <PawPrint color="grey" />
            <Text style={{ color: "grey" }}>Focus</Text>
          </View>
          <View style={styles.footerItem}>
            <ChartNoAxesColumn color="grey" />
            <Text style={{ color: "grey" }}>Sessions</Text>
          </View>
          <View style={styles.footerItem}>
            <Settings color="grey" />
            <Text style={{ color: "grey" }}>Settings</Text>
          </View>
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  header: {},
  clock: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "lightgrey",
    width: 240,
    height: 240,
    borderRadius: "50%",
  },
  session: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 48,
    flexDirection: "row",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-around",
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
  },
  footerItem: {
    alignItems: "center",
    justifyContent: "center",
  },
  continueButton: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#4fcf6f",
    width: "55%",
    padding: 18,
    borderRadius: 48,
    flexDirection: "row",
  },
  pauseButton: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
    width: "55%",
    padding: 18,
    borderRadius: 48,
    flexDirection: "row",
  },
  resetButton: {
    width: 66,
    height: 66,
    borderRadius: 48,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
    marginLeft: 12,
  },
});
