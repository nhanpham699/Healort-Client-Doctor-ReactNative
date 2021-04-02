import React, { useState } from "react";
import {
    Modal, 
    StyleSheet, 
    Text,
    View,
    TouchableOpacity,    
    TextInput,
    Alert
 } from "react-native";
import {addDoctorInfor} from '../actions/doctor.infor'
import {useDispatch} from 'react-redux'
import { FontAwesome, AntDesign, Feather } from '@expo/vector-icons'; 
import { LinearGradient } from 'expo-linear-gradient'
import host from '../host'
import axios from 'axios'
import {useSelector} from 'react-redux'
import * as Animatable from 'react-native-animatable'

const Star = (props) => {
    return(
        <AntDesign style={{marginHorizontal: 3}} name={props.filled ? "star" : "staro"} size={24} color="blue" />
    )
}

export default ReviewModal = (props,{navigation}) => {
  const dispatch = useDispatch()
  
  const {data, modal, setModal} = props

  const stars = [1,2,3,4,5]
  const { user } = useSelector(state => state.users)
  const [review, setReview] = useState({
      rating: 0,
      comment: null,
      userId: user.id,
      doctorId: data._id
  })

  const handleRating = (rate,id) => {
      setReview({...review, rating: rate})
  }

          
         
  const handleRate = () => {
      axios.post(host + '/doctors/rate',review)
      .then(() => {
        Alert.alert(
            "Rating",
            "successfully",
            [
                {
                text: "ok",
                onPress: async() =>  {
                    const doctors = await axios.get(host + '/doctors/getalldoctors')
                    await dispatch(addDoctorInfor(doctors.data))
                    setModal(!modal)
                },
                style: "cancel",
                },
            ],
        );    
      })
  }
  

  return (
    <View style={styles.centeredView}>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modal}
        onRequestClose={setModal}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
                <View>
                    <Text style={styles.title}>Review</Text>
                </View>
                <View style={{flexDirection: 'row', marginTop: 10, justifyContent: 'center'}}>
                    <Text style={styles.star_text}>Stars:</Text>
                    {stars.map(star => (
                    <TouchableOpacity key={star} onPress={ () => handleRating(star)}>
                        <Animatable.View>
                            <View>
                                <Star filled={star <= review.rating  ? true : false} />
                            </View>
                        </Animatable.View>
                    </TouchableOpacity>
                    ))}
                 </View>
                 <View style={{marginTop: 25, flexDirection: 'row', justifyContent: 'center'}}>
                    <Text style={styles.comment_text}>Comment:</Text>
                    <View style={styles.text}>
                        <TextInput 
                        value={review.comment}
                        placeholder="Your commnet" 
                        style={styles.text_input} 
                        autoCapitalize="none" 
                        onChangeText={value => setReview({...review, comment: value})} 
                        />
                    </View>
                 </View>
                 <View style={{flexDirection: 'row', justifyContent: 'center', marginTop: 20}}>
                        <TouchableOpacity onPress={handleRate}>
                            <View style={styles.button}>
                                <LinearGradient
                                    colors={['#CECCF5','#0970BE']}
                                    style={styles.update}
                                >
                                    <Text style={styles.update_text}>Rate</Text>
                                </LinearGradient>
                            </View>
                        </TouchableOpacity>  
                        <TouchableOpacity onPress={setModal}>
                            <View style={styles.button}>
                                <LinearGradient
                                    colors={['#D4919E','#C13815']}
                                    style={styles.update}
                                >
                                    <Text style={styles.update_text}>Close</Text>
                                </LinearGradient>
                            </View>
                        </TouchableOpacity> 
                 </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalView: {
    backgroundColor: "white",
    borderRadius: 20,
    width: 300,
    height: 300,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  update: {
    borderColor: '#00bfff',
    justifyContent: 'center',
    alignItems: 'center',
    height: 35,
    width: 80,
    borderRadius: 10,
    marginHorizontal: 5,
    marginTop: 30
  },
  update_text: {
      color: 'rgba(0, 0, 0, 0.7)',
      fontWeight: '600',
  },
  rate: {
    borderColor: '#00bfff',
    justifyContent: 'center',
    alignItems: 'center',
    height: 30,
    width: 75,
    borderRadius: 10,
    marginRight: 10,
    marginTop: 25
  },
  rate_text: {
      color: 'rgba(0, 0, 0, 0.7)',
      fontWeight: '600',
  },
  star_text: {
      fontSize: 16,
      marginTop: 2,
      paddingRight: 20
  },
  comment_text: {
      fontSize: 16,
      marginRight: 16,
      paddingRight: 20
  },
  text: {
      borderBottomWidth: 1,
      borderBottomColor: '#f2f2f2',
  },
  text_input: {
      width: 100,
      flex: 1,
      color: '#05375a'
  },
  title: {
      marginVertical: 30,
      textAlign: 'center',
      fontSize: 30,
      fontWeight: '600'
  }
});

