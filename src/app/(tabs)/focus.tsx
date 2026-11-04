import AsyncStorage from "@react-native-async-storage/async-storage";
import { Pause, Play, RotateCcw } from "lucide-react-native";
import { useCallback, useEffect, useRef, useState } from "react";
import { Text, View, StyleSheet, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Svg, { Circle, Path } from "react-native-svg";

import { colors } from "@/constants/colors";
import { storageKeys } from "@/constants/storageKeys";
import { TimerType } from "@/constants/TimerType";
import { useFocusEffect } from "expo-router";

const isOnlyNumbers = (str: string) => /^\d*$/.test(str);

const durationKeys = {
  [TimerType.FOCUS]: storageKeys.focusDuration,
  [TimerType.SHORT]: storageKeys.shortDuration,
  [TimerType.LONG]: storageKeys.longDuration,
};

const readDuration = async (timerType: TimerType) => {
  try {
    const savedDuration = await AsyncStorage.getItem(durationKeys[timerType]);

    if (savedDuration && isOnlyNumbers(savedDuration)) {
      return Number(savedDuration);
    }
  } catch (e) {
    console.log(e);
  }
  return 0;
};

const circleRadius = 120;
const circleSize = circleRadius * 2;
const stroke = 10;
const dashCount = 2 * Math.PI * (circleRadius - stroke);

export default function HomeScreen() {
  const [timerType, setTimerType] = useState(TimerType.FOCUS);

  const [durationMs, setDurationMs] = useState(0);
  const [remainingTime, setRemainingTime] = useState(0);
  const [endAt, setEndAt] = useState(0);

  const [isOnPause, setIsOnPause] = useState(true);
  const [isStarted, setIsStarted] = useState(false);

  const isStartedRef = useRef(isStarted);
  const isOnPauseRef = useRef(isOnPause);

  const getLeftTime = () => {
    return Math.max(0, endAt - Date.now());
  };

  const setOnPause = (onPause: boolean) => {
    if (onPause) {
      setRemainingTime(getLeftTime());
      setEndAt(0);
    } else {
      setEndAt(Date.now() + remainingTime);
      setIsStarted(true);
    }
    setIsOnPause(onPause);
  };

  const onResetHandle = () => {
    readDuration(timerType)
      .then((duration) => {
        setDurationMs(duration);
        setRemainingTime(duration);
        setEndAt(0);
        setIsOnPause(true);
        setIsStarted(false);
      })
      .catch((e) => console.log(e));
  };

  const continueText = () => {
    return isStarted ? "Continue" : "Start";
  };

  useFocusEffect(
    useCallback(() => {
      isOnPauseRef.current = isOnPause;
    }, [isOnPause]),
  );

  useFocusEffect(
    useCallback(() => {
      isStartedRef.current = isStarted;
    }, [isStarted]),
  );

  // on first open and tab was switched to this
  useFocusEffect(
    useCallback(() => {
      readDuration(timerType)
        .then((duration) => {
          if (isOnPauseRef.current) {
            setRemainingTime(duration);
            setEndAt(0);
          }
          if (!isStartedRef.current) {
            setDurationMs(duration);
          }
        })
        .catch((e) => console.log(e));
    }, [timerType]),
  );

  useEffect(() => {
    if (!endAt) return;
    const id = setInterval(() => {
      const left = getLeftTime();

      setRemainingTime(left);

      if (left === 0) clearInterval(id);
    }, 250);
    return () => clearInterval(id);
  }, [endAt]);

  const getProgress = () => {
    return (durationMs - remainingTime) / durationMs || 0;
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
        backgroundColor: colors.background,
      }}
      edges={["top", "bottom"]}
    >
      {!isStarted && (
        <View style={styles.typeContainer}>
          <Pressable
            style={
              timerType === TimerType.FOCUS
                ? styles.typeOptionActive
                : styles.typeOptionInactive
            }
            onPress={() => setTimerType(TimerType.FOCUS)}
          >
            <Text
              style={
                timerType === TimerType.FOCUS
                  ? styles.typeTextActive
                  : styles.typeTextInactive
              }
            >
              Focus
            </Text>
          </Pressable>
          <Pressable
            style={
              timerType === TimerType.SHORT
                ? styles.typeOptionActive
                : styles.typeOptionInactive
            }
            onPress={() => setTimerType(TimerType.SHORT)}
          >
            <Text
              style={
                timerType === TimerType.SHORT
                  ? styles.typeTextActive
                  : styles.typeTextInactive
              }
            >
              Short Break
            </Text>
          </Pressable>
          <Pressable
            style={
              timerType === TimerType.LONG
                ? styles.typeOptionActive
                : styles.typeOptionInactive
            }
            onPress={() => setTimerType(TimerType.LONG)}
          >
            <Text
              style={
                timerType === TimerType.LONG
                  ? styles.typeTextActive
                  : styles.typeTextInactive
              }
            >
              Long Break
            </Text>
          </Pressable>
        </View>
      )}

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
            fill={colors.accent}
          />
          <Path
            d={`
                M 180 ${circleSize - 35}
                L 210 ${circleSize - 150}
                L 240 ${circleSize - 50}
                Q 240 ${circleSize - 42}, 230 ${circleSize - 40}
                Z`}
            fill={colors.accent}
          />

          <Circle
            fill={colors.background}
            cx={circleRadius}
            cy={circleRadius}
            r={circleRadius - stroke / 1.9}
          />

          <Circle
            stroke={`${colors.accent}55`}
            fill="none"
            cx={circleRadius}
            cy={circleRadius}
            r={circleRadius - stroke}
            strokeWidth={stroke}
          />

          <Circle
            stroke={colors.accent}
            fill="none"
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
          <Text
            style={{
              fontFamily: "Andika",
              fontSize: 55,
              fontWeight: "bold",
              color: colors.text,
            }}
          >
            {timeToString()}
          </Text>
        </View>
      </View>

      <View style={styles.session}>
        {isOnPause ? (
          <Pressable
            style={styles.continueButton}
            onPress={() => setOnPause(false)}
          >
            <Play
              style={{ position: "absolute", left: 16 }}
              size={24}
              color={colors.background}
            />
            <Text
              style={{
                fontFamily: "Andika",
                fontSize: 20,
                color: colors.background,
              }}
            >
              {continueText()}
            </Text>
          </Pressable>
        ) : (
          <Pressable
            style={styles.pauseButton}
            onPress={() => setOnPause(true)}
          >
            <Pause
              style={{ position: "absolute", left: 16 }}
              size={24}
              color={colors.text}
            />
            <Text
              style={{ fontFamily: "Andika", fontSize: 20, color: colors.text }}
            >
              Pause
            </Text>
          </Pressable>
        )}
        <Pressable style={styles.resetButton} onPress={onResetHandle}>
          <RotateCcw color={colors.text} />
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  typeContainer: {
    backgroundColor: colors.subtle,
    borderRadius: 48,
    flexDirection: "row",
    padding: 6,
    width: "75%",
    marginBottom: 48,
  },
  typeOptionActive: {
    padding: 12,
    backgroundColor: colors.surface,
    borderRadius: 48,
    width: "33.33%",
    alignItems: "center",
  },
  typeOptionInactive: {
    padding: 12,
    width: "33.33%",
    alignItems: "center",
  },
  typeTextActive: {
    fontFamily: "Andika",
    color: colors.text,
    fontWeight: "bold",
  },
  typeTextInactive: {
    fontFamily: "Andika",
    color: colors.muted,
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
    backgroundColor: colors.accent,
    width: "55%",
    padding: 18,
    borderRadius: 48,
    flexDirection: "row",
  },
  pauseButton: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.subtle,
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
    backgroundColor: colors.surface,
    marginLeft: 12,
  },
});
