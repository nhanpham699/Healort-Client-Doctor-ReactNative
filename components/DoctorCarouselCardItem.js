import React from 'react'
import { View, Text, StyleSheet, Dimensions, Image } from "react-native"
import { FontAwesome, AntDesign, Feather } from '@expo/vector-icons'; 

const DentistIcon = require('../assets/dentist.png')

export const SLIDER_WIDTH = Dimensions.get('window').width + 80
export const ITEM_WIDTH = Math.round(SLIDER_WIDTH * 0.7)


const CarouselCardItem = ({ item, index }) => {
  return (
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
        <Text style={styles.text}>Review:  {item.review} <AntDesign name="star" size={13} color="black" /></Text>
      </View>
    </View>
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
    width: ITEM_WIDTH-205,
    height: 250,
  },
  text: {
      marginTop: 6,
      fontSize: 14,
      fontWeight: '500'
  }
})

export default CarouselCardItem