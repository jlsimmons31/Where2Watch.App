import { Ionicons } from '@expo/vector-icons';
import { StackScreenProps } from '@react-navigation/stack';
import Axios from 'axios';
import * as React from 'react';
import { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, Image, ScrollView } from 'react-native';
// @ts-ignore
import { global_vars, colors, screens, global_state,
   global_streaming_services, global_rental_services,
   streaming_services_settings } from '../data/global';
// @ts-ignore
import { instance_data } from '../data/instance_data';

import { RootStackParamList } from '../types';
import { RootSiblingParent } from 'react-native-root-siblings';
import Toast from 'react-native-root-toast';

export default function MovieDetailsScreen({
  navigation, route
}: StackScreenProps<RootStackParamList, 'MovieDetailsScreen'>) {

  const movieAlreadyInMyList = (movie) => {
    let list = [];
    if (screens.my_list) {
      list = screens.my_list.state.myList;
    }
    else {
      list = global_state.initial_my_list;
    }
    return list.filter(x => x.id == movie.id).length > 0;
  }

  const [movie, setMovie] = useState(route.params);
  const [movieIsInMyList, setMovieIsInMyList] = 
    useState(movieAlreadyInMyList(movie));
  const [moviePlotShortened, setMoviePlotShortened] = useState(true);
  const [streamingDetails, setStreamingDetails] = useState(null);
  const [rentalDetails, setRentalDetails] = useState(null);

  const fetchMovieDetails = (imdb_rating) => {
    let tm_id = movie.jw_entity_id;
    let reqUrl = global_vars.build_jw_details_url(tm_id);
    console.log("Making request to: " + reqUrl);
    Axios.get(reqUrl).then((res) => {
      if (res.data) {
        let newMovie = {
           ...movie,
           Plot: res.data.short_description,
           imdb_rating: imdb_rating
        };
        setMovie(newMovie);
      }
    })
  };  

  const addToList = () => {
    if (screens.my_list) {
      let list = [ movie, ...screens.my_list.state.myList ];
      screens.my_list.setState({ myList: list });
    }
    else {
      global_state.initial_my_list.push(movie);
    }


    Toast.show("Added to My List");
    setMovieIsInMyList(true);
  }

  const removeFromList = () => {
    if (screens.my_list) {
      let list = screens.my_list.state.myList.filter(x => x.id != movie.id);
      screens.my_list.setState({ myList: list });
    }
    else {
      let list = global_state.initial_my_list.filter(x => x.id != movie.id);
      global_state.initial_my_list = list;
    }
    Toast.show("Removed from My List");
    setMovieIsInMyList(false);
  }

  React.useEffect(() => {

    let movieCopy: any = { ...movie };

    let newProps: any = {};
    let _imdb = movie.scoring ? 
      movie.scoring.filter(x => x.provider_type == "imdb:score") : []
    movieCopy.imdb_rating = _imdb.length && _imdb[0].value ? _imdb[0].value : null;

    if (movie.offers) {
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
      sub_services.amazon_prime = movie.offers.filter(x => x.provider_id == 9
        && (!x.monetization_type || x.monetization_type == "flatrate")).length > 0
        ? true : false;
      sub_services.hbo_max = movie.offers.filter(x => x.provider_id == 384
        && (!x.monetization_type || x.monetization_type == "flatrate")).length > 0
        ? true : false;
      setStreamingDetails(sub_services);
      global_streaming_services[movie.id] = sub_services;

      let rental_services: any = {
        amazon_hd: get_rental_price(10, "hd"),
        amazon_sd: get_rental_price(10, "sd"),
        itunes_hd: get_rental_price(2, "hd"),
        itunes_sd: get_rental_price(2, "sd"),
        fandango_hd: get_rental_price(105, "hd"),
        fandango_sd: get_rental_price(105, "sd"),
      };
      setRentalDetails(rental_services);
      global_rental_services[movie.id] = rental_services;
    }
    setMovie(movieCopy);
    // Get more details such as plot.
    fetchMovieDetails(movieCopy.imdb_rating);
  }, []);

  const get_rental_price = (providerId, presentationType) => {
    let r = movie.offers.filter(x => x.provider_id == providerId
      && x.monetization_type == "rent" && x.presentation_type == presentationType);
    return r.length > 0 ? r[0].retail_price : null;
  }


  const space = () => { return (<View style={{marginVertical: 10}} />) }; // Gives an additional 20 pixels of space

  const renderStreaming = () => {
    if (!streamingDetails) {
      return (null);
    }

    let jsx = [];
    jsx.push(<Text key="header" style={styles.movieInfoText}>Available to stream on:</Text>);

    for (let serviceName in streaming_services_settings) {
      let avail = false;
      switch (serviceName) {
        case "Netflix":
          avail = streamingDetails.netflix;
          break;
        case "Hulu":
          avail = streamingDetails.hulu;
          break;
        case "Disney+":
          avail = streamingDetails.disney;
          break;
        case "Amazon Prime":
          avail = streamingDetails.amazon_prime;
          break;
        case "HBO Max":
          avail = streamingDetails.hbo_max;
          break;
        default:
          break;
      }
      let showSvcName = serviceName in streaming_services_settings 
        && streaming_services_settings[serviceName] == true;
      if (showSvcName) {
        let txt = serviceName + ": " + (avail ? "Yes" : "No");
        jsx.push(<Text key={serviceName} style={styles.movieInfoTextBold}>{txt}</Text>);
      }
    }

    return jsx.length > 1 ? (<View>{jsx}</View>) : (null);
  }

  const renderRentals = (serviceName:String) => {    
      let rental_txt = "";

      if (rentalDetails) {
      let providers = {
        "amazon_hd": "Amazon Prime Video (HD)",
        // "amazon_sd": "Amazon Prime Video (SD)",
        "itunes_hd": "iTunes (HD)",
        // "itunes_sd": "iTunes (SD)",
        "fandango_hd": "Fandango Now (HD)",
        // "fandango_sd:": "Fandango Now (SD)",
      }
      for (let p in providers) {
        if (rentalDetails[p])
        rental_txt += providers[p] + ": $" + rentalDetails[p] + "\n";
      }
    }

    return (rental_txt) ? (<View>
      <Text style={styles.movieInfoText}>Available to rent on:</Text>
      <Text style={styles.movieInfoTextBold}>{rental_txt}</Text>
      </View>) : null;
  }

  const renderMoviePlot = () => {
    if (movie.Plot) {
      if (movie.Plot.length > 180) {
        return moviePlotShortened ?
          movie.Plot.substring(0, 150) + "...\n(Click to show full plot)"
          : movie.Plot + "\n(Click to hide full plot)";
        }
      else {
        return movie.Plot;
      }
    }
    else return "";
  }

  const renderMyListButton = () => {
    if (!movieIsInMyList) {
      return (
        <TouchableOpacity style={styles.buttonRectangleAdd} activeOpacity={0.8}
          onPress={() => addToList()}>
          <Ionicons size={30} style={{ marginBottom: -3 }} name="ios-add" color="white" />
          <Text style={styles.buttonText}>My List</Text>
        </TouchableOpacity>);
    }
    else {
      return (
        <TouchableOpacity style={styles.buttonRectangleRemove} activeOpacity={0.8}
          onPress={() => removeFromList()}>
          <Ionicons size={30} style={{ marginBottom: -3 }} name="ios-remove" color="white" />
          <Text style={styles.buttonText}>My List</Text>
        </TouchableOpacity>);
    }
  }

  return (
    <RootSiblingParent>
      <ScrollView style={styles.container}>
        <View style={styles.movieInfoTop}>
          <Image source={{uri: global_vars.build_jw_img_url(movie.poster)}} resizeMode="contain" style={styles.movieImage} />
          <View style={styles.movieInfoTopTextContainer}>
            <Text style={styles.movieInfoTextBold}>{movie.title}</Text>
            <Text style={styles.movieInfoTextBold}>({movie.original_release_year})</Text>
            {space()}
            { movie.imdb_rating ? 
            (<Text style={styles.movieInfoText}>Imdb Rating: {movie.imdb_rating}</Text>) : null }            
            { renderMyListButton() }
          </View>
        </View>
        <View style={styles.movieInfoBottom}>
        <Text style={styles.movieInfoText} 
          onPress={() => setMoviePlotShortened(!moviePlotShortened)}>
            {renderMoviePlot()}
        </Text>
        {space()}
        { renderStreaming() }
        {space()}
        { renderRentals() }
        </View>
      </ScrollView>
    </RootSiblingParent>
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
    width: '70%',
    padding: 10,
    marginTop: 10
  },
  movieInfoTopTextContainer: {
    width: '90%'
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
  buttonRectangleAdd: {
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
  buttonRectangleRemove: {
    position: "absolute",
    bottom: 0,
    backgroundColor: colors.main_gray5,
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
