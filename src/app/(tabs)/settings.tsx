import { useEffect, useState } from "react";
import { View, StyleSheet, Text, TextInput } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Settings() {
  const DURATION_KEY = "@timer_duration";

  const [minutes, setMinutes] = useState("");
  const [seconds, setSeconds] = useState("");

  useEffect(() => {
    loadSettings();
  }, []);

  useEffect(() => {
    saveSettings();
  }, [seconds, minutes]);

  const loadSettings = async () => {
    try {
      const savedDuration = await AsyncStorage.getItem(DURATION_KEY);
      if (savedDuration && isOnlyNumbers(savedDuration)) {
        let durationAsNumber = Number(savedDuration);

        const totalSeconds = Math.ceil(durationAsNumber / 1000);

        const mm = Math.floor(totalSeconds / 60)
          .toString()
          .padStart(2, "0");
        const ss = (totalSeconds % 60).toString().padStart(2, "0");

        setMinutes(mm);
        setSeconds(ss);
      }
    } catch (e) {
      console.log(e);
    }
  };

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
      
      await AsyncStorage.setItem(DURATION_KEY, time)
    } catch(e) {
      console.log(e);
    }
  }
  
  const isOnlyNumbers = (str: string) => /^\d+$/.test(str);

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
            placeholderTextColor="#8E8E93"
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
            placeholderTextColor="#8E8E93"
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
    backgroundColor: "black",
    flex: 1,
    padding: 16,
  },
  settingBlock: {
    backgroundColor: "#1C1C1E",
    borderRadius: 16,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  label: {
    color: "white",
    fontSize: 18,
    fontWeight: "500",
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  input: {
    backgroundColor: "#2C2C2E",
    width: 64,
    height: 40,
    borderRadius: 12,
    paddingHorizontal: 12,
    color: "white",
    fontSize: 16,
    outlineStyle: "none" as any,
  },
});
