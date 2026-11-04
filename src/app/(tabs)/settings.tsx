import { useEffect, useState } from "react";
import { View, StyleSheet, Text, TextInput } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { colors } from "@/constants/colors";
import { storageKeys } from "@/constants/storageKeys";

const isOnlyNumbers = (str: string) => /^\d*$/.test(str);

const readDuration = async () => {
  try {
    const savedDuration = await AsyncStorage.getItem(storageKeys.focusDuration);

    if (savedDuration && isOnlyNumbers(savedDuration)) {
      return Number(savedDuration);
    }
  } catch (e) {
    console.log(e);
  }
  return null;
};

export default function Settings() {
  const [minutes, setMinutes] = useState("");
  const [seconds, setSeconds] = useState("");

  const saveSettings = async () => {
    try {
      let finalTime = 0;
      
      if (isOnlyNumbers(minutes)) {
        finalTime += Number(minutes) * 60;
      }

      if (isOnlyNumbers(seconds)) {
        finalTime += Number(seconds);
      }

      const time = (finalTime * 1000).toString();
      
      await AsyncStorage.setItem(storageKeys.focusDuration, time)
    } catch(e) {
      console.log(e);
    }
  }

  useEffect(() => {
    readDuration()
      .then((durationMs) => {
        if (durationMs === null) return;

        const totalSeconds = Math.ceil(durationMs / 1000);

        const mm = Math.floor(totalSeconds / 60)
          .toString()
          .padStart(2, "0");
        const ss = (totalSeconds % 60).toString().padStart(2, "0");

        setMinutes(mm);
        setSeconds(ss);
      })
      .catch((e) => console.log(e));
  }, []);

  useEffect(() => {
    saveSettings();
  }, [seconds, minutes]);

  const onMinutesChange = (minutes: string) => {
    if (isOnlyNumbers(minutes) && minutes.length <= 4) {
      setMinutes(minutes);
    }
  };

  const onSecondsChange = (seconds: string) => {
    if (isOnlyNumbers(seconds) && Number(seconds) <= 59) {
      setSeconds(seconds);
    }
  };

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.settingBlock}>
        <Text style={styles.label}>Timer Duration</Text>
        <View style={styles.inputWrapper}>
          <TextInput
            style={styles.input}
            value={minutes}
            onChangeText={onMinutesChange}
            placeholder="Min"
            placeholderTextColor={colors.muted}
            keyboardType="number-pad"
            textAlign="center"
            underlineColorAndroid="transparent"
          />
          <Text style={styles.label}>:</Text>
          <TextInput
            style={styles.input}
            value={seconds}
            onChangeText={onSecondsChange}
            placeholder="Sec"
            placeholderTextColor={colors.muted}
            keyboardType="number-pad"
            textAlign="center"
            underlineColorAndroid="transparent"
          />
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
  },
  settingBlock: {
    backgroundColor: colors.subtle,
    borderRadius: 16,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  label: {
    color: colors.text,
    fontSize: 18,
    fontWeight: "500",
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
