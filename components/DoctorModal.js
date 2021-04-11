import React, { useState } from "react";
import { Alert, Modal, StyleSheet, Text, Pressable, View, Button, TouchableOpacity, Image } from "react-native";
import RNPickerSelect from "react-native-picker-select";
import { FontAwesome, AntDesign, Feather } from '@expo/vector-icons'; 
import { LinearGradient } from 'expo-linear-gradient'
import host from '../host'
import axios from 'axios'

export default DoctorModal = (props) => {

  const {data, modal, setModal} = props


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
              <View style={styles.title}>
                  <Text style={styles.title_text}>{data.fullname}</Text>
              </View>
              <View style={styles.footer_component}>
                  <Text style={[styles.footer_text, styles.footer_left, styles.footer_title]} >Birth Year:</Text>
                  <Text style={[styles.footer_text, styles.footer_right]} >{data.birthyear}</Text>
              </View>
              <View style={styles.footer_component}>
                  <Text style={[styles.footer_text, styles.footer_left, styles.footer_title]} >Gender:</Text>
                  <Text style={[styles.footer_text, styles.footer_right]} >{data.gender ? 'Male' : 'fale'}</Text>
              </View>
              <View style={styles.footer_component}>
                  <Text style={[styles.footer_text, styles.footer_left, styles.footer_title]} >Hometown:</Text>
                  <Text style={[styles.footer_text, styles.footer_right]} >{data.hometown}</Text>
              </View>
              <View style={styles.footer_component}>
                  <Text style={[styles.footer_text, styles.footer_left, styles.footer_title]} >Phone:</Text>
                  <Text style={[styles.footer_text, styles.footer_right]} >{data.phone}</Text>
              </View>
              <View>
                <TouchableOpacity onPress={setModal}>
                    <View style={styles.button}>
                        <LinearGradient
                        colors={['#D4919E','#C13815']}
                        style={styles.update} >
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
    width: 310,
    height: 320,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    justifyContent: 'center',
  },
  title: {
      marginVertical: 15,
      alignItems: 'center'
  },
  title_text: {
    fontSize: 20,
    fontWeight: '600'
  },
  button: {
    alignItems: 'flex-end'
  },
  update: {
    borderColor: '#00bfff',
    justifyContent: 'center',
    alignItems: 'center',
    height: 35,
    width: 80,
    borderRadius: 10,
    marginHorizontal: 5,
    marginTop: 30,
    marginRight: 23
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
});

