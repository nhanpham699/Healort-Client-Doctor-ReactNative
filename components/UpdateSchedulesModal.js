import React, { useState } from "react";
import { Alert, Modal, StyleSheet, Text, Pressable, View, Button, TouchableOpacity } from "react-native";
import RNPickerSelect from "react-native-picker-select";
import { FontAwesome, AntDesign, Feather } from '@expo/vector-icons'; 
import { LinearGradient } from 'expo-linear-gradient'
import host from '../host'
import axios from 'axios'


//Date Data
const date = new Date();
let DATE_DATA = []

for(var i = 0; i<= 14; i++){
    var nextDate = new Date(date);
    nextDate.setDate(date.getDate() + i);
    DATE_DATA.push({id: i.toString(), label: nextDate.getDate() + '-' + (nextDate.getMonth() + 1), value: nextDate.toString().slice(0,15)})
}

const HOUR_DATA = [
  {
      id: '1',
      label: '8:00',
      value: 8
  },
  {
      id: '2',
      label: '9:00',
      value: 9
  },
  {
      id: '3',
      label: '10:00',
      value: 10
  },
  {
      id: '4',
      label: '11:00',
      value: 11
  },
  {
      id: '5',
      label: '12:00',
      value: 12
  },
  {
      id: '6',
      label: '13:00',
      value: 13
  },
  {
      id: '7',
      label: '14:00',
      value: 14
  },
  {
      id: '8',
      label: '15:00',
      value: 15
  },
  {
      id: '9',
      label: '16:00',
      value: 16
  },
];


export default UpdateSchedulesModal = (props,{navigation}) => {

  const {dataUpdate, modal, setModal} = props
  const [data, setData] = useState({
      date: null,
      begin: 0,
  })
  const refHour = React.useRef(null)


  const handleDate = (value) => {
      setData({
        ...data,
        date: value,
        begin: 0,
        end: 0
      })
      refHour.current.state.selectedItem = {label: 'Select an item...', value: null, color: "gray"}
  }
  const handleHour = (value) => {
    setData({
      ...data,
      begin: value,
    })
}

  const handleUpdate = () => {
      axios.get(host + '/schedules/getallschedules')
      .then(res => {
          let dataFilter = res.data.filter(dt => {
              return ((new Date(dt.date)).toString().slice(0,15)) == data.date
                    && dt.doctorId._id == dataUpdate.doctorId
                    && data.begin == dt.begin
                    && dt.status == 0 
          })
          // console.log(data.date, data.begin);
          if(dataFilter.length || data.date == null || data.begin == 0 ){
              alert("Update failed!")
          }else{
              Alert.alert(
                  "Updated",
                  "successfully",
                  [
                    {
                      text: "oke",
                      onPress: () =>  {
                          const res = {...data, id: dataUpdate.id, date: new Date(data.date)}
                          axios.post(host + '/schedules/update', res)
                          .then(() => {
                              // navigation.reset({
                              //     index: 0,
                              //     routes: [{ name: 'Schedule'}]
                              // })
                          })
                      },
                      style: "cancel",
                    },
                  ],
              );
            
          }
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
            <View style={{marginLeft: 20}}>
              <Text style={styles.choose}>Choose Date</Text>  
              <View style={{flexDirection: 'row', justifyContent:'center'}}> 
                  <RNPickerSelect
                  onValueChange={(value) => handleDate(value)}
                  items={DATE_DATA}
                  style={pickerSelectStyles} />       
                  <AntDesign style={styles.iconDown} name="down" size={20} color="gray" />     
              </View>  
              <Text style={[styles.choose, {marginTop: 20}]}>Choose Hours</Text>  
              <View style={{flexDirection: 'row', justifyContent:'center'}}> 
                  <RNPickerSelect
                  ref={refHour}
                  onValueChange={(value) => handleHour(value)}
                  items={HOUR_DATA}
                  style={pickerSelectStyles} />       
                  <AntDesign style={styles.iconDown} name="down" size={20} color="gray" />     
              </View>  
            </View>
            
            <View style={{flexDirection: 'row', justifyContent: 'center'}}>
                <TouchableOpacity onPress={handleUpdate}>
                    <View style={styles.button}>
                        <LinearGradient
                            colors={['#CECCF5','#0970BE']}
                            style={styles.update}
                        >
                            <Text style={styles.update_text}>Update</Text>
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
  choose:{
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 45,
    marginTop: 30
  },
  iconDown: {
      position: 'relative',
      right: 30,
      top: 20
  },
});

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
      width: 170,
      height: 40,
      // marginLeft: 68,
      borderRadius: 6,
      marginTop: 10,
      backgroundColor: '#f2f2f2',
      paddingLeft: 10
  },
  inputAndroid: {
      width: 167,
      height: 40,
      borderRadius: 6,
      // marginLeft: 20,
      marginTop: 10,
      backgroundColor: '#f2f2f2',
      paddingLeft: 10
  },
});