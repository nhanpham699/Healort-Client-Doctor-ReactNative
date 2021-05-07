import React, { useEffect, useState } from "react";
import {
    Modal, 
    StyleSheet, 
    Text,
    View,
    TouchableOpacity,    
    TextInput,
    Alert,
    LogBox
 } from "react-native";
import {addDoctorInfor} from '../actions/doctor.infor'
import {useDispatch} from 'react-redux'
import { FontAwesome, AntDesign, Feather, MaterialIcons } from '@expo/vector-icons'; 
import NumericInput from 'react-native-numeric-input'
import { LinearGradient } from 'expo-linear-gradient'
import host from '../host'
import axios from 'axios'
import {useSelector} from 'react-redux'
import * as Animatable from 'react-native-animatable'
import RNPickerSelect from "react-native-picker-select";



export default PresctiptionModal = (props,{navigation}) => { 
  
  const {data, modal, setModal, getData} = props
  const [medicineData, setMedicineData] = useState([])
  // const [number, setNumber] = useState([1])
  const [pres, setPres] = useState({
      date: new Date(),
      medicine: [{name: "", value: "", quantity: 1, price: 0}],
      scheduleId: data._id,
      doctorId: data.doctorId._id,
      userId: data.userId._id,
      times: 1,
      note: "",
      total: 0
  })
  const getAllMedicine = async() => {
      const res = await axios.get(host + '/medicines/getallmedicines')
      const newData = res.data.map(dt => {
        return {...dt, label: dt.name, value: dt._id}
      })
      setMedicineData(newData)
  }

  const getMedicine = async(value, index) => {
      const res = await axios.get(host + '/medicines/getmedicinebyid/' + value)
      const { price, name }  = res.data
      const arr = [...pres.medicine]
      arr[index].value = value;
      arr[index].price = price;
      arr[index].name = name
      const total = calculateTotal(arr, pres.times)
      setPres({...pres, medicine: arr, total: total})
  }

  const calculateTotal = (arr, times) => {
    let total = 0
    for(let m of arr){
      total += m.price * m.quantity
    }
    return total * times
  }

  const getNum = async(value, index) => {
    const arr = [...pres.medicine]
    arr[index].quantity = value;
    const total = calculateTotal(arr, pres.times)
    setPres({...pres, medicine: arr, total: total})
  }

  const getTimes = (value) => {
    const total = calculateTotal(pres.medicine, value)
    setPres({...pres, times: value, total: total})

  }

  const addMedicine = () => {
      setPres({...pres, medicine: [...pres.medicine, {name: "", value: "", quantity: 1, price: 0}]})
  }

  const removeMedicine = (index) => {
      const arr = [...pres.medicine];
      arr.splice(index, 1);
      const total = calculateTotal(arr, pres.times)
      setPres({...pres, medicine: arr, total: total});
  }
 
  const hanldeConfirm = async() => {
    if(pres.total){
        await axios.post(host + '/medicines/addpres', pres)
        .then(() => {
          Alert.alert(
            "Create the prescription",
            "successfully",
            [
              { text: "OK", onPress: async() => {
                  setModal()
                  await axios.post(host + '/schedules/updatePrescription',{id: pres.scheduleId})
                  .then(() => {
                      getData()
                  })
              } }
            ]
          );
        })
    }else {
      alert("Create the prescription failed!")
    }
    // console.log(pres);
  }

  useEffect(() => {
    getAllMedicine()
  },[]) 

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
                    <Text style={styles.title}>Prescription</Text>
                </View>
                <View>
                    <Text style={[styles.title_text, {marginLeft: 50}]}>Medicines list:</Text>
                    {pres.medicine?.map((pr,index) => (
                      <View key={index} style={{
                        flexDirection: 'row', 
                        justifyContent: 'center', 
                        marginBottom: 10}} >
                          <RNPickerSelect
                          onValueChange={(value) => getMedicine(value, index)}
                          items={medicineData}
                          style={pickerSelectStyles} />
                          <View style={{marginTop: 2, marginLeft: 10}}> 
                            <NumericInput 
                            value={pr.quantity} 
                            minValue={1}
                            maxValue={10}
                            onChange={(value) => getNum(value, index)} 
                            onLimitReached={(isMax,msg) => console.log(isMax,msg)}
                            totalWidth={70} 
                            totalHeight={37} 
                            iconSize={25}
                            step={1}
                            valueType='real'
                            rounded  
                            // iconStyle={{ color: 'white' }} 
                            rightButtonBackgroundColor='#e6e6e6' 
                            leftButtonBackgroundColor='#e6e6e6'
                            />
                          </View>
                          {(pres.medicine.length > 1) &&
                          <TouchableOpacity onPress={() => removeMedicine(index)}>
                              <FontAwesome 
                              style={{marginLeft: 5, marginTop: 10}}
                              name="remove" 
                              size={22} 
                              color="black" />
                          </TouchableOpacity> 
                          }
                      </View>
                    ))}
                    <TouchableOpacity onPress={addMedicine}>
                        <AntDesign style={{textAlign: 'right', marginRight: 50, marginTop: 10}} name="pluscircleo" size={22} color="black" />    
                    </TouchableOpacity>
                </View>
                <View style={{flexDirection: 'row'}}>
                  <Text style={[styles.title_text, {marginTop: 4, marginLeft: 50}]}>Times: </Text>
                  <View style={{marginLeft: 10}}> 
                      <NumericInput 
                      value={pres.times}
                      minValue={1}
                      maxValue={5}    
                      onChange={(value) => getTimes(value)} 
                      // onLimitReached={(isMax,msg) => console.log(isMax,msg)}
                      totalWidth={70} 
                      totalHeight={30} 
                      iconSize={25}
                      step={1}
                      valueType='real'
                      rounded  
                      // iconStyle={{ color: 'white' }} 
                      rightButtonBackgroundColor='#e6e6e6' 
                      leftButtonBackgroundColor='#e6e6e6'
                      />
                  </View>  
                </View>
                <View style={{marginTop: 10, flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
                  <Text style={[styles.title_text, {marginTop: 20}]}>Note: </Text>
                  <TextInput 
                    onChangeText={(value) => setPres({...pres, note: value})}
                    value={pres.note}
                    placeholder="Your note" 
                    style={styles.text_input} 
                    autoCapitalize="none" />
                </View>
                <View>
                  <Text style={[styles.title_text, {marginTop: 30, marginLeft: 50}]}>Total: {pres.total}$</Text>
                </View>
                <View style={{flexDirection: 'row', justifyContent: 'center', marginVertical: 30}}>
                    <TouchableOpacity onPress={hanldeConfirm}>
                        <View style={styles.button}>
                            <LinearGradient
                                colors={['#CECCF5','#0970BE']}
                                style={styles.update}
                            >
                                <Text style={styles.update_text}>Confirm</Text>
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
    width: 350,
    // height: auto',
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
    marginHorizontal: 5
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
  title: {
    marginVertical: 30,
    textAlign: 'center',
    fontSize: 30,
    fontWeight: '600'
  },
  title_text: {
      fontSize: 16,
      fontWeight: '500',
      paddingBottom: 15
  },
  text_input: {
    width: 200,
    height: 40,
    borderRadius: 6,
    marginLeft: 5,
    marginTop: 10,
    backgroundColor: '#f2f2f2',
    paddingLeft: 10
  },
});

const pickerSelectStyles = StyleSheet.create({
    inputIOS: {
        width: 165,
        height: 40,
        borderRadius: 7,
        backgroundColor: '#f2f2f2',
        paddingLeft: 10
    },
    inputAndroid: {
        width: 165,
        height: 40,
        borderRadius: 7,
        backgroundColor: '#f2f2f2',
        paddingLeft: 10
    },
  });
