import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { View, Text, StyleSheet, Dimensions, Image, TouchableOpacity } from "react-native"
import Carousel from 'react-native-snap-carousel'
import { Feather } from '@expo/vector-icons'; 

import host from '../host'

const SLIDER_WIDTH = Dimensions.get('window').width + 100
const ITEM_WIDTH = Math.round(SLIDER_WIDTH * 0.7)


const ratingTotal = (rate) => {
    let total = 0
    for(let i of rate){
        total += i.rating 
    }
    total = total/rate.length
    return total
}



const DoctorCarousel = (props) => {

    const { onPress, doctorChecked } = props
    const isCarousel = React.useRef(null)
    const [data,setData] = useState([])

    const getdoctors = async() => {
        const res = await axios.get(host + '/doctors/getbaddoctor')
        let dataFilter = res.data.map(dt => {
            return {...dt, review: ratingTotal(dt.review)}
        })

        if(doctorChecked.id){
              const index = dataFilter.indexOf(dataFilter.find(x => x._id == doctorChecked.id))
              console.log(index)
              let data = [...dataFilter];
              let temp = data[0];
              data[0] = data[index];
              data[index] = temp;
              console.log(data);
              setData(data)
        }else setData(dataFilter)
    }

    useEffect(() => {
        getdoctors()
    },[])
  
    
    const CarouselCardItem = ({ item, index }) => {
        return (
          <TouchableOpacity  onPress={() => onPress(item._id)}>
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
                  <View style={{flexDirection: 'row'}}>
                    <Text style={styles.text}>Experience:  {item.experience} years</Text>
                      {(doctorChecked.id == item._id && doctorChecked.isChecked) 
                        ? <Feather style={{marginLeft: 40}} name="check-circle" size={30} color="green" />
                        : <Feather style={{marginLeft: 40}} name="check-circle" size={24} color="black" /> }
                  </View>
                </View>
            </View>
         </TouchableOpacity>
        )
      }


    return (
        <View>
            <Carousel
                layout="default"
                layoutCardOffset={9}
                ref={isCarousel}
                data={data}
                renderItem={CarouselCardItem}
                sliderWidth={410}
                itemWidth={ITEM_WIDTH}
                // onSnapToItem={(index) => setIndex(index)}
                useScrollView={true}
            />
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
      marginVertical: 20
    },
    image: {
      width: ITEM_WIDTH-250,
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
    }
  })

export default DoctorCarousel