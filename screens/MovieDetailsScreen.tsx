import { Ionicons } from '@expo/vector-icons';
import { StackScreenProps } from '@react-navigation/stack';
import Axios from 'axios';
import * as React from 'react';
import { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, Image, ScrollView } from 'react-native';
// @ts-ignore
import { global_vars, colors } from '../data/global';

import { RootStackParamList } from '../types';

export default function MovieDetailsScreen({
  navigation, route
}: StackScreenProps<RootStackParamList, 'MovieDetailsScreen'>) {

  const [movie, setMovie] = useState(route.params);
  const [streamingDetails, setStreamingDetails] = useState(null);

  // const fetchImdbDetails = () => {
  //   let queryStr = "?i=" + movie.imdbID;
  //   let reqUrl = global_vars.imdb_endpoint + queryStr;
  //   let config = { headers: global_vars.imdb_headers };
  //   console.log("Making request to: " + reqUrl);
  //   Axios.get(reqUrl, config).then((res) => {
  //     if (res.data) {
  //       let newMovie = {
  //          ...movie,
  //          Plot: res.data.Plot,
  //          imdbRating: res.data.imdbRating
  //       };
  //       setMovie(newMovie);
  //     }
  //   })
  // };

  // const fetchStreamingDetails = () => {
  //   let queryStr = "?imdbId=" + movie.imdbID;
  //   let reqUrl = global_vars.streaming_endpoint + queryStr;
  //   console.log("Making request to: " + reqUrl);
  //   Axios.get(reqUrl).then((res) => {
  //     console.log(res.data);
  //     setStreamingDetails(res.data);
  //   });
  // }

  React.useEffect(() => {
    let movieCopy: any = { ...movie };
    // let _imdb_scores = movie.scoring.filter(x => x.provider_type == "imdb:score")
    // if (_imdb_scores.length > 0) {
    //   movieCopy.imdb_rating = _imdb_scores[0].value;
    // }

    let newProps: any = {};
    let _imdb = movie.scoring.filter(x => x.provider_type == "imdb:score");
    movieCopy.imdb_rating = _imdb[0].value;

    let sub_services: any = {};
    sub_services.netflix = movie.offers.filter(x => x.provider_id == 8
      && (!x.monetization_type || x.monetization_type == "flatrate")).length > 0
      ? true : false;
    sub_services.hulu = movie.offers.filter(x => x.provider_id == 15
      && (!x.monetization_type || x.monetization_type == "flatrate")).length > 0
      ? true : false;
    sub_services.disney = movie.offers.filter(x => x.provider_id == 337
      && (!x.monetization_type || x.monetization_type == "flatrate")).length > 0
      ? true : false;
    sub_services.amazon_stream = movie.offers.filter(x => x.provider_id == 9
      && (!x.monetization_type || x.monetization_type == "flatrate")).length > 0
      ? true : false;
    //TODO: include rental services.
    setStreamingDetails(sub_services);

    setMovie(movieCopy);

  }, []);

  const space = () => { return (<View style={{marginVertical: 10}} />) }; // Gives an additional 20 pixels of space

  const renderStreaming = (serviceName:String) => {
    if (streamingDetails) {
      if ((serviceName == "Netflix" && streamingDetails.netflix == true)
        || (serviceName == "Hulu" && streamingDetails.hulu == true)
        || (serviceName == "Disney+" && streamingDetails.disney == true
        || (serviceName == "Amazon Prime" && streamingDetails.amazon_stream == true))) {
          return serviceName + ": Yes";
      }
      else {
        return serviceName + ": No";
      }
    }
    else {
      return "";
    }
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.movieInfoTop}>
        <Image source={{uri: global_vars.build_jw_img_url(movie.poster)}} resizeMode="contain" style={styles.movieImage} />
        <View>
          <Text style={styles.movieInfoTextBold}>{movie.title}</Text>
          <Text style={styles.movieInfoTextBold}>({movie.original_release_year})</Text>
          <Text style={styles.movieInfoText}>Imdb Rating: {movie.imdb_rating}</Text>
          <TouchableOpacity style={styles.buttonRectangle} activeOpacity={0.8}>
            <Ionicons size={30} style={{ marginBottom: -3 }} name="ios-add" color="white" />
            <Text style={styles.buttonText}>My List</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.movieInfoBottom}>
      <Text style={styles.movieInfoText}>{movie.id} No plot info!! :( </Text>
      {space()}
      <Text style={styles.movieInfoText}>Available to stream on:</Text>
      <Text style={styles.movieInfoTextBold}>{renderStreaming("Netflix")}</Text>
      <Text style={styles.movieInfoTextBold}>{renderStreaming("Hulu")}</Text>
      <Text style={styles.movieInfoTextBold}>{renderStreaming("Disney+")}</Text>
      <Text style={styles.movieInfoTextBold}>{renderStreaming("Amazon Prime")}</Text>
      {space()}
      <Text style={styles.movieInfoText}>Available to rent on:</Text>
      <Text>{ "(Feature coming soon)" }</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.main_background,
    // alignItems: 'center',
    // padding: 20
  },
  movieInfoTop: {
    // flex: 1,
    flexDirection: 'row',
    height: 200,
    width: '60%',
    padding: 10,
    marginTop: 10
  },
  movieInfoBottom: {
    padding: 20
  },
  movieInfoText: {
    fontSize: 18
  },  
  movieInfoTextBold: {
    fontSize: 18,
    fontWeight: 'bold'
  },
  buttonRectangle: {
    position: "absolute",
    bottom: 0,
    backgroundColor: colors.main_blue,
    paddingVertical: 8,
    paddingHorizontal: 12,
    elevation: 5,
    display: "flex",
    flexDirection: "row",
    alignItems: "center"
  },
  buttonText: { 
    color: colors.main_white,
    fontSize: 18,
    marginLeft: 10,
    fontWeight: 'bold'
  },
  movieImage: {
    width: 134,
    marginRight: 10
  }
});
