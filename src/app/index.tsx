import { ChartNoAxesColumn, Pause, PawPrint, Settings } from 'lucide-react-native';
import { useState } from 'react';
import { Text, View, StyleSheet, Pressable } from 'react-native';
import {
  SafeAreaProvider,
  SafeAreaView,
  useSafeAreaInsets
} from 'react-native-safe-area-context';

export default function HomeScreen() {
  const insets = useSafeAreaInsets();

  const [remainingTime, setRemainingTime] = useState('11:22');

  return (
    <SafeAreaProvider>
    <SafeAreaView style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }} edges={['top', 'bottom']}>
      <View style={styles.header}></View>

      <View style={styles.clock}>
        <Text style={{fontSize: 56}}>{remainingTime}</Text>
      </View>

      <View style={styles.session}>
        <Pressable style={styles.pauseButton}>
          <Pause style={{position: 'absolute', left: 16}} size={24} color="#000000" />
          <Text style={{fontSize: 20}}>Pause</Text>
        </Pressable>
      </View>
      
      <View style={[styles.footer, {marginBottom: insets.bottom}]}>
        <View style={styles.footerItem}>
          <PawPrint color='grey' />
          <Text style={{color: 'grey'}}>Focus</Text>
        </View>
        <View style={styles.footerItem}>
          <ChartNoAxesColumn color='grey' />
          <Text style={{color: 'grey'}}>Sessions</Text>
        </View>
        <View style={styles.footerItem}>
          <Settings color='grey' />
          <Text style={{color: 'grey'}}>Settings</Text>
        </View>
      </View>
    </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  header: {

  },
  clock: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'lightgrey',
    width: 240,
    height: 240,
    borderRadius: '50%'
  },
  session: {
    width: '100%',
    alignItems: 'center',
    marginTop: 48
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0
  },
  footerItem: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  pauseButton: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#4fcf6f',
    width: '70%',
    padding: 18,
    borderRadius: 48,
    flexDirection: 'row'
  }
});
