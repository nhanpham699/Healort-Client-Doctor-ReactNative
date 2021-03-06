import React, { useState } from "react";
import { Alert, Modal, StyleSheet, Text, Pressable, View, Button, TouchableOpacity, Image } from "react-native";
import RNPickerSelect from "react-native-picker-select";
import { FontAwesome, AntDesign, Feather } from '@expo/vector-icons'; 
import { LinearGradient } from 'expo-linear-gradient'
import host from '../host'
import axios from 'axios'
import {useNavigation} from "@react-navigation/native"
export default ScheduleModal = (props) => {

  const navigation = useNavigation()
  const {
    data, 
    doctor, 
    notif, 
    modal, 
    setModal, 
    handleUpdate, 
    handleRefuse,
    schedule,
    reexam
  } = props

  return (
    <View style={styles.centeredView}>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modal.state}
        // onRequestClose={setModal}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
              <View>
                <TouchableOpacity onPress={setModal}>
                    <FontAwesome
                    style={{textAlign: 'right', marginRight: 20}} 
                    name="remove" 
                    size={30} 
                    color="black" />
                </TouchableOpacity> 
              </View>
              <View style={{alignItems: 'center'}}>
                  <Image 
                  source={{uri: host + doctor.avatar}}
                  style={{width: 100, height: 100, borderRadius: 50}} />
              </View>
              <View style={styles.footer_component}>
                  <Text style={[styles.footer_text, styles.footer_left, styles.footer_title]}>Doctor:</Text>
                  <Text style={[styles.footer_text, styles.footer_right]}>{doctor.fullname}</Text>
              </View>
              <View style={styles.footer_component}>
                  <Text style={[styles.footer_text, styles.footer_left, styles.footer_title]}>Date:</Text>
                  <Text style={[styles.footer_text, styles.footer_right, {fontWeight: '700'}]}>
                  {data.date.toString().slice(0,10)} convert to {data.confirmation.date.toString().slice(0,10)}
                  </Text>
              </View>
              <View style={styles.footer_component}>
                  <Text style={[styles.footer_text, styles.footer_left, styles.footer_title]} >Time:</Text>
                  <Text style={[styles.footer_text, styles.footer_right, {fontWeight: '700'}]} >
                  {data.begin}:00 convert to {data.confirmation.begin}:00
                  </Text>
              </View>                 
              <View style={{flexDirection: 'row', justifyContent: 'center'}}>
                  <TouchableOpacity  onPress={() => handleUpdate(schedule, reexam, notif)}>
                      <View style={styles.button}>
                          <LinearGradient
                          colors={['#CECCF5','#0970BE']}
                          style={[styles.update, {marginLeft: 15}]} >
                              <Text style={styles.update_text}>Yes</Text>
                          </LinearGradient>
                      </View>
                  </TouchableOpacity> 
                  <TouchableOpacity onPress={() => handleRefuse(schedule, reexam, doctor, notif)}>
                      <View style={styles.button}>
                          <LinearGradient
                          colors={['#D4919E','#C13815']}
                          style={styles.update} >
                              <Text style={styles.update_text}>No</Text>
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
    width: 360,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    justifyContent: 'center',
    paddingVertical: 20
  },
  title: {
      marginBottom: 17,
      alignItems: 'center'
  },
  title_text: {
    fontSize: 20,
    fontWeight: '600'
  },
  update: {
    borderColor: '#00bfff',
    justifyContent: 'center',
    alignItems: 'center',
    height: 35,
    width: 80,
    borderRadius: 10,
    marginTop: 30,
    marginHorizontal: 5,
  },
  update_text: {
      color: 'rgba(0, 0, 0, 0.7)',
      fontWeight: '600',
  },
  footer_text: {
    fontSize: 15,
    marginTop: 20
  },
  footer_left: {
      textAlign: 'left',
      width: '44%'
  },
  footer_right:{
      textAlign: 'right',
      width: '56%',      
      alignItems: 'flex-end'
  },
  footer_title: {
      color: 'black',
      fontWeight: '500'
  },
  footer_component:{
      paddingHorizontal: 25,
      flexDirection: 'row'
  },
  service_text:{
    fontSize: 14,
    marginTop: 7
  }, 
});

