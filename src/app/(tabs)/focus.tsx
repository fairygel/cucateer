import { Pause, Play, RotateCcw } from "lucide-react-native";
import { useEffect, useState } from "react";
import { Text, View, StyleSheet, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Svg, { Circle, Path } from "react-native-svg";

export default function HomeScreen() {
  const circleRadius = 120;
  const circleSize = circleRadius * 2;
  const stroke = 10;
  const dashCount = 2 * Math.PI * (circleRadius - stroke);

  const [durationMs, setDurationMs] = useState(60 * 1000);
  const [remainingTime, setRemainingTime] = useState(0);
  const [endAt, setEndAt] = useState(0);

  const [isOnPause, setIsOnPause] = useState(true);

  const setOnPause = (onPause: boolean) => {
    if (onPause) {
      setRemainingTime(getLeftTime());
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
      const left = getLeftTime();

      setRemainingTime(left);

      if (left === 0) clearInterval(id);
    }, 250);
    return () => clearInterval(id);
  }, [endAt]);

  const getLeftTime = () => {
    return Math.max(0, endAt - Date.now());
  };

  const getProgress = () => {
    return (durationMs - remainingTime) / durationMs;
  };

  const timeToString = () => {
    const totalSeconds = Math.ceil(remainingTime / 1000);

    const mm = Math.floor(totalSeconds / 60)
      .toString()
      .padStart(2, "0");
    const ss = (totalSeconds % 60).toString().padStart(2, "0");

    return `${mm}:${ss}`;
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#000000",
      }}
      edges={["top", "bottom"]}
    >
      <View style={styles.header}></View>

      <View style={{ alignItems: "center", justifyContent: "center" }}>
        <Svg
          width={circleSize}
          height={circleSize}
          style={{ transform: [{ rotate: "-90deg" }] }}
        >
          <Path
            d="
                M 180 35
                L 210 150
                L 240 50
                Q 240 42, 230 40
                Z"
            fill="#4fcf6f"
          />
          <Path
            d={`
                M 180 ${circleSize - 35}
                L 210 ${circleSize - 150}
                L 240 ${circleSize - 50}
                Q 240 ${circleSize - 42}, 230 ${circleSize - 40}
                Z`}
            fill="#4fcf6f"
          />

          <Circle
            stroke="#4fcf6f"
            fill="#1C1C1E"
            cx={circleRadius}
            cy={circleRadius}
            r={circleRadius - stroke}
            strokeWidth={stroke}
            strokeDasharray={dashCount}
            strokeDashoffset={dashCount - getProgress() * dashCount}
            strokeLinecap="round"
          />
        </Svg>
        <View style={{ position: "absolute" }}>
          <Text style={{ fontSize: 55, color: "#FFFFFF" }}>
            {timeToString()}
          </Text>
        </View>
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
              color="#FFFFFF"
            />
            <Text style={{ fontSize: 20, color: "#FFFFFF" }}>Pause</Text>
          </Pressable>
        )}
        <Pressable style={styles.resetButton} onPress={onResetHandle}>
          <RotateCcw color="#FFFFFF" />
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {},
  clock: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#000000",
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
    backgroundColor: "#1C1C1E",
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
    backgroundColor: "#1C1C1E",
    marginLeft: 12,
  },
});
