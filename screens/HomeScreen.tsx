import Axios from 'axios';
// @ts-ignore
import { global_vars, colors } from '../data/global';
import * as React from 'react';
import { useState } from 'react';
import { Image, StyleSheet, TextInput } from 'react-native';
import { ScreenStackHeaderRightView } from 'react-native-screens';

import { Text, View } from '../components/Themed';
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import { Ionicons } from '@expo/vector-icons';

export default function HomeScreen({ navigation }:any) {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  const renderSearchResults = (results:Array<any>) => {
    if (results && results.length) {
      return results.map(x => (
        <TouchableOpacity activeOpacity={0.9} key={x.imdbID} onPress={() => onPressMovie(x)}>
          <View style={styles.resultView}>
            <Image style={styles.resultImage} source={{uri: x.Poster}} />
          </View>
        </TouchableOpacity>
        ));
    }
    else {
      return (<Text>FAILURE lol</Text>); //todo fix
    }
  };

  const onPressMovie = (x:any) => {
    navigation.navigate("MovieDetailsScreen", x);  
  }

  const sanitizeSearchQuery = (query:String) => {
    query = query.trimRight();
    query = query.replace(" ", "%20");
    return query;
  }

  const search = (query:String) => {
    if (query) {
      query = sanitizeSearchQuery(query);
      let queryStr = "?type=movie&s=" + query;
      let config = {
        headers: global_vars.imdb_headers
      }
      let reqUrl = global_vars.imdb_endpoint + queryStr;
      console.log("Making request to: " + reqUrl);
      Axios.get(reqUrl, config).then((res) => {
          setSearchResults(res.data.Search);
      })
    }
  };

  return (
    <View style={styles.container}>
      {/* <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" /> */}
      <View style={styles.searchBarContainer}>
        <TextInput style={styles.searchBar} placeholder="Search for a movie" value={searchQuery}
          onChangeText={text => setSearchQuery(text)}
          onSubmitEditing={() => search(searchQuery)} />
        <Ionicons size={30} name="ios-search" color="#000000" 
          onPress={() => search(searchQuery)} style={styles.searchBarIcon} />          
      </View>
      <ScrollView contentContainerStyle={styles.resultsView}>
        { searchResults && searchResults.length ? (renderSearchResults(searchResults)) : (<Text style={{color: 'black'}}>No results to display.</Text>) }
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: colors.main_background
    // justifyContent: 'center',
  },
  header: {
    backgroundColor: colors.main_blue
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginTop: 30,
    height: 1,
    width: '80%',
  },
  searchBarContainer: {
    elevation: 5,
    shadowColor: 'black',
    shadowRadius: 4,
    shadowOpacity: 0.5,
    width: '100%',
    borderColor: colors.main_gray1,
    borderWidth: 1,
  },
  searchBar: {
    width: '100%',
    padding: '3%',
    backgroundColor: colors.main_background,
    // color: 'black'
    // tintColor: 'black',
    // placeholderTextColor: 'black'
    // borderColor: colors.main_gray3,
    // borderWidth: 1,
    // padding: 4
  },
  searchBarIcon: {
    position: "absolute",
    top: '18%',
    right: '2%'
  },
  resultsView: {
    width: '100%',
    marginVertical: 10,
    display: 'flex',
    flexDirection: "row",
    padding: 10,
    // justifyContent: 'center',
    // alignItems: 'center',
    flexWrap: 'wrap'
  },
  resultView: {
    elevation: 8,
    width: 110, // Width and height of result images
    height: 159,
    margin: 5,
    borderColor: 'white',
    borderWidth: 1
  },
  resultImage: {
    width: '100%',
    height: '100%'
  }
});
