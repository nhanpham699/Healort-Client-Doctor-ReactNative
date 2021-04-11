import React, { useEffect, useState } from 'react'
import { View, Text, StyleSheet, Dimensions, Image,  TouchableOpacity, Touchable } from "react-native"
import { FontAwesome, AntDesign, Feather } from '@expo/vector-icons'; 
import {useSelector} from 'react-redux'
import { NavigationContainer, useNavigation } from "@react-navigation/native";

const DentistIcon = require('../assets/dentist.png')

export const SLIDER_WIDTH = Dimensions.get('window').width + 80
export const ITEM_WIDTH = Math.round(SLIDER_WIDTH * 0.7)


const CarouselCardItem = ({ item, index }) => {




  return (
    // <TouchableOpacity onPress={() => navigation.navigate('DoctorDetail', {doctor: item})}>

      <View style={styles.container} key={index}>
        <Image
          source={DentistIcon}
          style={styles.image}
        />
        <View style={{marginTop: 10}}>
          <Text style={styles.text}>Name:  {item.fullname}</Text>
          <Text style={styles.text}>Gender:  {Number(item.gender) ? 'Female' : 'Male'}</Text>
          <Text style={styles.text}>Birth Year:  {item.birthyear}</Text>
          <Text style={styles.text}>Phone:  {item.phone}</Text>
          <View style={{ flexDirection: 'row'}}>
              <Text style={styles.text}>Review:  {item.review} <AntDesign name="star" size={13} color="black" /></Text>
              {/* <TouchableOpacity>
                <View style={styles.chat}>
                    <Text style={styles.chat_text}>Chat</Text>
                </View>
              </TouchableOpacity> */}
          </View>    
        </View>
      </View>
      // </TouchableOpacity>
  )
}
const styles = StyleSheet.create({
  container: {
    height: 150,
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 8,
    width: ITEM_WIDTH,
    paddingLeft: 10,
    paddingVertical: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.29,
    shadowRadius: 4.65,
    elevation: 7,
  },
  image: {
    width: ITEM_WIDTH-220,
    height: 250,
  },
  text: {
      marginTop: 6,
      fontSize: 14,
      fontWeight: '500'
  },
  chat: {
    backgroundColor: "white",
    borderRadius:5,
    padding: 6,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.5,
    shadowRadius: 5,
    marginLeft: 75
  },
  chat_text:{
    fontWeight: '600',
    fontSize: 13
  }
})

export default CarouselCardItem