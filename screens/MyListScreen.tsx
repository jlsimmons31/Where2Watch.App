import * as React from 'react';
import { useState } from 'react';
import { StyleSheet, TouchableOpacity, Image, TextInput, ScrollView } from 'react-native';
import { color } from 'react-native-reanimated';

import EditScreenInfo from '../components/EditScreenInfo';
import { Text, View } from '../components/Themed';
// // @ts-ignore
// import { instance_data } from '../data/instance_data'
// @ts-ignore
import { global_vars, screens, colors, global_state, 
  global_streaming_services, global_rental_services,
  streaming_services_settings } from '../data/global'

export default class MyListScreen extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      myList: global_state.initial_my_list,
      filter_keyword: ''
    };
    screens.my_list = this;
  }

  componentDidMount() {
    console.log("MOUNT");
  }

  onPressMovie(x:any) {
    this.props.navigation.navigate("MovieDetailsScreen", x);  
  }

  getFilteredList() {
    var key = this.state.filter_keyword.toLowerCase();
    return this.state.myList.filter(x => x.title.toLowerCase().includes(key));
  }

  getAvailabilityText(x:any) {
    let stream_providers = {
      "netflix": "Netflix",
      "hulu": "Hulu",
      "amazon_prime": "Amazon Prime",
      "disney": "Disney+",
      "hbo_max": "HBO Max"
    };
    let rent_providers = {
      "amazon_hd": "Amazon Prime",
      "itunes_hd": "iTunes",
      "fandango_hd": "Fandango Now"
    };
    // TODO: allow user to disable some in settings
    if (global_streaming_services[x.id]) {
      for (let s in stream_providers) {
        let s_name = stream_providers[s];
        if (global_streaming_services[x.id][s]
          && s_name in streaming_services_settings
          && streaming_services_settings[s_name] == true)
          return "Streams on " + stream_providers[s];
      }
    }
    else
      console.log("NO SS DATA");

    var lowest_rent = Number.MAX_SAFE_INTEGER;
    if (global_rental_services[x.id]) {
      for (let r in rent_providers) {
        if (global_rental_services[x.id][r] && global_rental_services[x.id][r] < lowest_rent)
          lowest_rent = global_rental_services[x.id][r];
      }
      if (lowest_rent != Number.MAX_SAFE_INTEGER)
        return "Rent from $" + lowest_rent;
    }
    else
      console.log("NO RR DATA");
    return "Unavailable";
  }

  renderResults() {
    return this.getFilteredList().map(x => (
      <TouchableOpacity activeOpacity={0.9} key={x.id} onPress={() => this.onPressMovie(x)}>
        <View style={styles.resultView}>
          <Image style={styles.resultImage} source={{uri: global_vars.build_jw_img_url(x.poster)}} />
          <View style={styles.availabilityStatusView}>
            <Text style={styles.availabilityText}>{this.getAvailabilityText(x)}</Text>
          </View>
        </View>
      </TouchableOpacity>
      ));
  }

  render() {
      return (
      <ScrollView style={{backgroundColor: colors.main_background}}>
        <View style={styles.container}>
          <View style={styles.headerView}>
            <Text style={styles.headerText}>My List</Text>
            <View style={styles.searchBarContainer}>
              <TextInput placeholderTextColor={colors.main_gray4} placeholder="Find in My List" value={this.state.filter_keyword}
                onChangeText={(txt:String) => this.setState({ filter_keyword: txt })}
                style={styles.searchBar} />
            </View>
          </View>
          <View style={styles.resultsView}>
            { this.renderResults() }
          </View>
        </View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: colors.main_background
  },
  // title: {
  //   fontSize: 20,
  //   fontWeight: 'bold',
  //   backgroundColor: colors.main_background
  // },
  // separator: {
  //   marginVertical: 30,
  //   height: 1,
  //   width: '80%',
  //   backgroundColor: colors.main_background
  // },
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
  searchBar: {
    width: '100%',
    padding: 12,
    backgroundColor: "#00000005"
  },
  searchBarContainer: {
    elevation: 5,
    shadowColor: 'black',
    shadowRadius: 2,
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    width: '100%',
    borderColor: colors.main_gray1,
    borderWidth: 1,
    marginTop: 8,
    backgroundColor: colors.main_background
  },
  resultsView: {
    width: '100%',
    marginVertical: 10,
    display: 'flex',
    flexDirection: "row",
    paddingHorizontal: 10,
    // justifyContent: 'center',
    // alignItems: 'center',
    flexWrap: 'wrap',
    backgroundColor: colors.main_background
  },
  resultView: {
    elevation: 8,
    shadowColor: 'black',
    shadowRadius: 2,
    shadowOpacity: 0.5,
    shadowOffset: { width: 1, height: 0},
    width: 176, // Width and height of result images
    height: 280,
    margin: 5,
    // borderColor: 'white',
    // borderWidth: 1
    backgroundColor: "#00000000"
  },
  resultImage: {
    width: '100%',
    height: '100%',
    borderRadius: 4,
  },
  availabilityStatusView: {
    position: 'absolute',
    bottom:0,
    width: '100%',
    backgroundColor: colors.transparent_gray4,
    padding: 2
  },
  availabilityText: {
    color: colors.main_white
  }
});
