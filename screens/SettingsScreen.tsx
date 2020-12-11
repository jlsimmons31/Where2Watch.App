import * as React from 'react';
import { ColorPropType, StyleSheet } from 'react-native';
import { Switch } from 'react-native-gesture-handler';

import EditScreenInfo from '../components/EditScreenInfo';
import { Text, View } from '../components/Themed';
// @ts-ignore
import { colors, streaming_services_settings } from '../data/global'

export default function SettingsScreen() {

  const [_net, _setNet] = React.useState(true);
  const [_hul, _setHul] = React.useState(true);
  const [_amz, _setAmz] = React.useState(true);
  const [_dis, _setDis] = React.useState(true);
  const [_hbo, _setHbo] = React.useState(true);

  const setNetflix = (val:boolean) => {
    _setNet(val);
    streaming_services_settings["Netflix"] = val;
  };

  const setHulu = (val:boolean) => {
    _setHul(val);
    streaming_services_settings["Hulu"] = val;
  };
  
  const setAmazonPrime = (val:boolean) => {
    _setAmz(val);
    streaming_services_settings["Amazon Prime"] = val;
  };
  
  const setDisney = (val:boolean) => {
    _setDis(val);
    streaming_services_settings["Disney+"] = val;
  };
  
  const setHboMax = (val:boolean) => {
    _setHbo(val);
    streaming_services_settings["HBO Max"] = val;
  };

  return (
    <View style={styles.container}>      
      <View style={styles.headerView}>
            <Text style={styles.headerText}>Settings</Text>
      </View>
      <View style={styles.settingsContent}>
        <Text style={{fontSize: 16, color: "black", marginBottom: 12}}>Enabled rental services:</Text>
        <View style={styles.switchView}>
          <Switch style={styles.switch} value={_net} onValueChange={(val) => setNetflix(val)} />  
          <Text style={styles.switchText}>Netflix</Text>
        </View>
        <View style={styles.switchView}>
          <Switch style={styles.switch} value={_hul} onValueChange={(val) => setHulu(val)} />  
          <Text style={styles.switchText}>Hulu</Text>
        </View>
        <View style={styles.switchView}>
          <Switch style={styles.switch} value={_amz} onValueChange={(val) => setAmazonPrime(val)} />  
          <Text style={styles.switchText}>Amazon Prime</Text>
        </View>
        <View style={styles.switchView}>
          <Switch style={styles.switch} value={_dis} onValueChange={(val) => setDisney(val)} />  
          <Text style={styles.switchText}>Disney+</Text>
        </View>
        <View style={styles.switchView}>
          <Switch style={styles.switch} value={_hbo} onValueChange={(val) => setHboMax(val)} />  
          <Text style={styles.switchText}>HBO Max</Text>
        </View>
      </View>
      {/* <Text style={styles.title}>Not implemented yet!</Text> */}
      {/* <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" /> */}
      {/* <EditScreenInfo path="/screens/SettingsScreen.js" /> */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // alignItems: 'center',
    // justifyContent: 'center',
    backgroundColor: colors.main_background
  },
  headerView: {
    width: '100%',
    backgroundColor: colors.main_background,
    paddingHorizontal: 12,
    paddingTop: 12,
  },
  headerText: {
    fontSize: 30,
    color: "black"
  },
  settingsContent: {
    padding: 12,
    backgroundColor: colors.main_background
  },
  switchView: {
    backgroundColor: colors.main_background,
    flexDirection: 'row'
  },
  switchText: {
    fontSize: 22,
    color: "black",
    marginLeft: 10,
    marginTop: 6
  },
  switch: {
    marginVertical: 4
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'black'
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
});
