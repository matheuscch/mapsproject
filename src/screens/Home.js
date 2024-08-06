import React, { useState, useEffect } from "react";
import { View ,Linking , ScrollView,Image, Dimensions, TouchableOpacity, Animated, TextInput, TouchableWithoutFeedback } from "react-native";
import { getAuth, signOut } from "firebase/auth";
import { Ionicons } from "@expo/vector-icons";
import {
  Layout,
  Button,
  Text,
  TopNav,
  Section,
  SectionContent,
  useTheme,
} from "react-native-rapi-ui";
import MapView, {Marker} from 'react-native-maps'
import Loading from "../screens/utils/Loading";
import {
  requestForegroundPermissionsAsync,
  getCurrentPositionAsync,
  LocationObject
} from 'expo-location'
// import Animated from 'react-native-reanimated';

const { width, height } = Dimensions.get("window");
const CARD_HEIGHT = 220;
const CARD_WIDTH = width * 0.8;
const SPACING_FOR_CARD_INSET = width * 0.1 - 10;

export default function ({ navigation }) {
  const { isDarkmode, setTheme } = useTheme();
  const [location, SetLocation] = useState({});
  const [locationIsLoading, SetLocationIsLoading] = useState(true);
  
  const markers = [
    { index:0,
      coordinate: {
        latitude: -22.910932722922407,
        longitude: -43.288651786610366
      },
      title:"Primeiro role",
      description:"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris"
    },
    { index: 1,
      coordinate: {
        latitude:-22.90986791061126,
        longitude: -43.29044955599267
      },
      title:"Segundo role",
      description:"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
    },
    { index: 2,
      coordinate: {
        latitude:-22.908001668700166,
        longitude:-43.28853781795062
      },
      title:"Terceiro role",
      description:"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
    },  
  ]
  // const auth = getAuth();
  async function requestLocationPermissions() {
    const { granted } = await requestForegroundPermissionsAsync();
    console.log("PERMISSAO:",granted);
    if(granted) {
      const currentPosition = await getCurrentPositionAsync();
      SetLocation(currentPosition);
      console.log("Localização: => ",currentPosition);
      SetLocationIsLoading(false);
    }
  }
  useEffect(()=> {
    requestLocationPermissions({});
  },[]);

  let mapIndex = 0;
  let mapAnimation = new Animated.Value(0);

  const _map = React.useRef(null);
  const _scrollView = React.useRef(null); 
  useEffect(() => {
    mapAnimation.addListener(({ value }) => {
      let index = Math.floor(value / CARD_WIDTH + 0.3); // animate 30% away from landing on the next item
      if (index >= markers.length) {
        index = markers.length - 1;
      }
      if (index <= 0) {
        index = 0;
      }

      clearTimeout(regionTimeout);

      const regionTimeout = setTimeout(() => {
        if( mapIndex !== index ) {
          mapIndex = index;
          const { coordinate } = markers[index];
          _map.current.animateToRegion(
            {
              ...coordinate,
            },
            350
          );
        }
      }, 10);
    });
  });

  const interpolations = markers.map((marker, index) => {
    const inputRange = [
      (index - 1) * CARD_WIDTH,
      index * CARD_WIDTH,
      ((index + 1) * CARD_WIDTH),
    ];

    const scale = mapAnimation.interpolate({
      inputRange,
      outputRange: [1, 1.5, 1],
      extrapolate: "clamp"
    });

    return { scale };
  });

  const onMarkerPress = (mapEventData) => {
    const markerID = mapEventData._targetInst.return.key;

    let x = (markerID * CARD_WIDTH) + (markerID * 20); 
    // if (Platform.OS === 'ios') {
    //   x = x - SPACING_FOR_CARD_INSET;
    // }

    _scrollView.current.scrollTo({x: x, y: 0, animated: true});
  }

  
  return (
    <Layout>
    {locationIsLoading
      ? <Loading/>
      : 
    <MapView
      showsUserLocation={true}
      style={{
        flex: 1,
        // marginTop: -50
      }}
      region={{latitude: -22.910932722922407, longitude: -43.288651786610366, longitudeDelta:0.015, latitudeDelta: 0.0121}}
      ref={_map}
    >

    <View style={{ 
    flex:1,
    alignItems: "center",
    position: "absolute"
  }}>
      <TouchableWithoutFeedback onPress={()=> navigation.openDrawer()}>
        <Animated.View style={{
        marginTop: 40, 
        width: 45,
        height: 45,
        borderRadius: 60/2,
        margin: 5,
        alignItems: "center",
        justifyContent: "center",
        shadowRadius: 10,
        shadowColor: "#2a2a2a",
        shadowOpacity: 0.3,
        shadowOffset: {height: 10},
        backgroundColor:"white"}}>
          <Ionicons name="menu" size={25} color={"black"} />
        </Animated.View>
      </TouchableWithoutFeedback>
    </View> 
     
    {markers.map((marker) => {
      const scaleStyle = {
        transform: [
          {
            scale:  interpolations[marker.index].scale,
          },
        ],
      };
      return (
        <Marker
        coordinate={{
          latitude:marker.coordinate.latitude, longitude: marker.coordinate.longitude
        }}
        title={marker.title}
        // image={require("../../assets/map.png")}
        description={marker.description}
        key={marker.index}
        onPress={(e)=>onMarkerPress(e)}
      >
          <Animated.View style = {{
            alignItems: "center",
            justifyContent: "center",
            width:50,
            height:50
        }}>
          <Animated.Image
            source={require("../../assets/map.png")}
            style={[{    width: 30,
              height: 30,},scaleStyle ]}
          />
        </Animated.View>
      </Marker>
      );
    })}
    <View style={{
    position:'absolute', 
    marginTop: true ? 40 : 20, 
    flexDirection:"row",
    backgroundColor: '#fff',
    width: '70%',
    alignSelf:'center',
    borderRadius: 5,
    padding: 10,
    shadowColor: '#ccc',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.5,
    shadowRadius: 5,
    elevation: 10,}}>
      <TextInput
        placeholder="Buscar aqui..."
        placeholderTextColor="#000"
        autoCapitalize="none"
        style={{flex:1,padding:0}}
      />
      <Ionicons name="ios-search" size={20} />
    </View>

    </MapView>  
    }
    {locationIsLoading ? 
      ""
     :
    <ScrollView
      horizontal
      scrollEventThrottle={1}
      showsHorizontalScrollIndicator={false}
      ref={_scrollView}
      style={{
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        paddingVertical: 10
      }}
      onScroll={Animated.event(
        [
          {
            nativeEvent: {
              contentOffset:{
                x: mapAnimation
              }
            }
          }
        ],{useNativeDriver:false}
      )}
      >
          {markers.map((marker) => {
            return (
             <View key={marker.index} style={{    
              elevation: 2,
              backgroundColor: "#FFF",
              borderTopLeftRadius: 5,
              borderTopRightRadius: 5,
              marginHorizontal: 10,
              shadowColor: "#000",
              shadowRadius: 5,
              shadowOpacity: 0.3,
              shadowOffset: { x: 2, y: -2 },
              height: CARD_HEIGHT,
              width: CARD_WIDTH,
              overflow: "hidden",}}>
              <Image            
                style={{
                  flex: 3,
                  width: "100%",
                  height: "100%",
                  alignSelf: "center",
                }}
                resizeMode="cover"
                source={require("../../assets/banners/food-banner1.jpg")}
              />
              <View 
              style={{    
                flex: 2,
                padding: 10
              }}>
                <Text numberOfLines={1} style={{fontSize: 20, fontWeight: "bold"}}> {marker.title}</Text>
                <Text numberOfLines={3} style={{fontSize: 12, color: "#444"}}> {marker.description}</Text>
                <View style={{ alignItems: 'center', marginTop: 5}}>
                  <TouchableOpacity 
                    onPress={()=>{}}
                    style={[{
                      width: '100%',
                      padding:5,
                      justifyContent: 'center',
                      alignItems: 'center',
                      borderRadius: 3,
                    }, {
                      borderBlockColor:"#FF6347",
                      borderWidth: 1
                    }]}
                  >
                    <Text
                      style={{   fontSize: 14,fontWeight: 'bold', color:"#FF6347"}}
                    >
                    Join</Text>
                  </TouchableOpacity>
                </View>
              </View>
             </View>
            );
          })}
    </ScrollView>
    }
    </Layout>
  );
}
