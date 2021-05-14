import React, { useEffect, useState } from 'react'
import { View, Text, StyleSheet, Dimensions, Image } from "react-native"
import { FontAwesome, AntDesign, Feather } from '@expo/vector-icons'; 
import host from '../host';


export const SLIDER_WIDTH = Dimensions.get('window').width + 80
export const ITEM_WIDTH = Math.round(SLIDER_WIDTH * 0.7)


const TopCarouselCardItem = ({ item, index }) => {




  return (
    // <TouchableOpacity onPress={() => navigation.navigate('DoctorDetail', {doctor: item})}>

      <View style={styles.container} key={index}>
        <Image
          source={{uri : host + item.avatar}}
          style={styles.image}
        />
        <View style={{marginTop: 10}}>
          <Text style={styles.text}>Name:  {item.fullname}</Text>
          <Text style={styles.text}>Gender:  {Number(item.gender) ? 'Female' : 'Male'}</Text>
          <Text style={styles.text}>Birth Year:  {item.birthyear}</Text>
          <Text style={styles.text}>Phone:  {item.phone}</Text>
          <View style={{ flexDirection: 'row'}}>
              {item.review ? <Text style={styles.text}>Review:  {item.review} <AntDesign name="star" size={13} color="black" /></Text> 
              :
              <Text style={styles.text}>Review: Not yet</Text> }
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
    width: ITEM_WIDTH-235,
    height: 110,
    resizeMode: 'stretch',
    marginTop: 12,
    marginLeft: 5,
    borderRadius: 5
  },
  text: {
      marginLeft: 15,
      marginTop: 5,
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

export default TopCarouselCardItem