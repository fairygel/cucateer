import { useEffect, useState } from "react";
import { View, StyleSheet, Text, TextInput } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { colors } from "@/constants/colors";
import { storageKeys } from "@/constants/storageKeys";
import { TimerType } from "@/constants/TimerType";

const isOnlyNumbers = (str: string) => /^\d*$/.test(str);

const durationKeys = {
  [TimerType.FOCUS]: storageKeys.focusDuration,
  [TimerType.SHORT]: storageKeys.shortDuration,
  [TimerType.LONG]: storageKeys.longDuration,
};

type Duration = { minutes: string; seconds: string };

const readDuration = async (timerType: TimerType) => {
  try {
    const savedDuration = await AsyncStorage.getItem(durationKeys[timerType]);

    if (savedDuration && isOnlyNumbers(savedDuration)) {
      return Number(savedDuration);
    }
  } catch (e) {
    console.log(e);
  }
  return null;
};

const toDuration = (durationMs: number | null): Duration => {
  if (durationMs === null) return { minutes: "", seconds: "" };

  const totalSeconds = Math.ceil(durationMs / 1000);

  return {
    minutes: Math.floor(totalSeconds / 60)
      .toString()
      .padStart(2, "0"),
    seconds: (totalSeconds % 60).toString().padStart(2, "0"),
  };
};

const toDurationMs = ({ minutes, seconds }: Duration) => {
  let finalTime = 0;

  if (isOnlyNumbers(minutes)) {
    finalTime += Number(minutes) * 60;
  }

  if (isOnlyNumbers(seconds)) {
    finalTime += Number(seconds);
  }

  return finalTime * 1000;
};

export default function Settings() {
  const [focus, setFocus] = useState<Duration>({ minutes: "", seconds: "" });
  const [short, setShort] = useState<Duration>({ minutes: "", seconds: "" });
  const [long, setLong] = useState<Duration>({ minutes: "", seconds: "" });

  useEffect(() => {
    Promise.all([
      readDuration(TimerType.FOCUS),
      readDuration(TimerType.SHORT),
      readDuration(TimerType.LONG),
    ])
      .then(([focusMs, shortMs, longMs]) => {
        setFocus(toDuration(focusMs));
        setShort(toDuration(shortMs));
        setLong(toDuration(longMs));
      })
      .catch((e) => console.log(e));
  }, []);

  useEffect(() => {
    AsyncStorage.setItem(
      durationKeys[TimerType.FOCUS],
      toDurationMs(focus).toString(),
    ).catch((e) => console.log(e));
  }, [focus]);

  useEffect(() => {
    AsyncStorage.setItem(
      durationKeys[TimerType.SHORT],
      toDurationMs(short).toString(),
    ).catch((e) => console.log(e));
  }, [short]);

  useEffect(() => {
    AsyncStorage.setItem(
      durationKeys[TimerType.LONG],
      toDurationMs(long).toString(),
    ).catch((e) => console.log(e));
  }, [long]);

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.settingBlock}>
        <Text style={styles.settingHeader}>Timer Settings</Text>
        <View style={styles.settingOption}>
          <Text style={styles.label}>Focus</Text>
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.input}
              value={focus.minutes}
              onChangeText={(value) => {
                if (isOnlyNumbers(value) && value.length <= 4) {
                  setFocus((prev) => ({ ...prev, minutes: value }));
                }
              }}
              placeholder="Min"
              placeholderTextColor={colors.muted}
              keyboardType="number-pad"
              textAlign="center"
              underlineColorAndroid="transparent"
            />
            <Text style={styles.label}>:</Text>
            <TextInput
              style={styles.input}
              value={focus.seconds}
              onChangeText={(value) => {
                if (isOnlyNumbers(value) && Number(value) <= 59) {
                  setFocus((prev) => ({ ...prev, seconds: value }));
                }
              }}
              placeholder="Sec"
              placeholderTextColor={colors.muted}
              keyboardType="number-pad"
              textAlign="center"
              underlineColorAndroid="transparent"
            />
          </View>
        </View>

        <View style={styles.separator}></View>

        <View style={styles.settingOption}>
          <Text style={styles.label}>Short Break</Text>
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.input}
              value={short.minutes}
              onChangeText={(value) => {
                if (isOnlyNumbers(value) && value.length <= 4) {
                  setShort((prev) => ({ ...prev, minutes: value }));
                }
              }}
              placeholder="Min"
              placeholderTextColor={colors.muted}
              keyboardType="number-pad"
              textAlign="center"
              underlineColorAndroid="transparent"
            />
            <Text style={styles.label}>:</Text>
            <TextInput
              style={styles.input}
              value={short.seconds}
              onChangeText={(value) => {
                if (isOnlyNumbers(value) && Number(value) <= 59) {
                  setShort((prev) => ({ ...prev, seconds: value }));
                }
              }}
              placeholder="Sec"
              placeholderTextColor={colors.muted}
              keyboardType="number-pad"
              textAlign="center"
              underlineColorAndroid="transparent"
            />
          </View>
        </View>

        <View style={styles.separator}></View>
        
        <View style={styles.settingOption}>
          <Text style={styles.label}>Long Break</Text>
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.input}
              value={long.minutes}
              onChangeText={(value) => {
                if (isOnlyNumbers(value) && value.length <= 4) {
                  setLong((prev) => ({ ...prev, minutes: value }));
                }
              }}
              placeholder="Min"
              placeholderTextColor={colors.muted}
              keyboardType="number-pad"
              textAlign="center"
              underlineColorAndroid="transparent"
            />
            <Text style={styles.label}>:</Text>
            <TextInput
              style={styles.input}
              value={long.seconds}
              onChangeText={(value) => {
                if (isOnlyNumbers(value) && Number(value) <= 59) {
                  setLong((prev) => ({ ...prev, seconds: value }));
                }
              }}
              placeholder="Sec"
              placeholderTextColor={colors.muted}
              keyboardType="number-pad"
              textAlign="center"
              underlineColorAndroid="transparent"
            />
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    backgroundColor: colors.background,
    flex: 1,
    padding: 16,
    gap: 12,
  },
  settingBlock: {
    backgroundColor: colors.subtle,
    borderRadius: 16,
    padding: 16,
    gap: 12,
  },
  settingHeader: {
    color: colors.muted,
    fontSize: 14,
  },
  settingOption: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  separator: {
    height: 1,
    width: '100%',
    backgroundColor: `${colors.muted}44`,
    marginHorizontal: 8
  },
  label: {
    color: colors.text,
    fontSize: 16,
    fontWeight: 'bold',
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  input: {
    backgroundColor: colors.surface,
    width: 64,
    height: 40,
    borderRadius: 12,
    paddingHorizontal: 12,
    color: colors.text,
    fontSize: 16,
    outlineStyle: "none" as any,
  },
});
