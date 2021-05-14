import React, {useEffect, useState} from 'react'

import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Button,    
    Alert,
    ScrollView
} from 'react-native'
import { Ionicons,  FontAwesome } from '@expo/vector-icons'; 
import { LinearGradient } from 'expo-linear-gradient'
import host from '../../host'
import { List } from 'react-native-paper';
import axios from 'axios';
import {useSelector, useDispatch} from 'react-redux'
import {addDoctorInfor} from '../../actions/doctor.infor'


const Prescription = ({navigation}) => {

  const [pres, setPres] = useState([])  
  const { user } = useSelector(state => state.users)  

  const getData = async () => {
      const res = await axios.get(host + "/prescriptions/getallpres/" + user.id)
      setPres(res.data)
      console.log(res.data);  
  }  
    
  useEffect(() => {
    getData()
  },[])  

  return (
    <View style={styles.container}>
        <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
               <Ionicons style={styles.back} name="arrow-back" size={24} color="black" />
            </TouchableOpacity>
            <Text style={styles.headertext1}>My Prescriptions</Text> 
        </View>
        <ScrollView style={{backgroundColor: 'white', flex: 1, marginTop: 20}}>
          <List.Section>
            {pres.length ? pres.map(pr => (
            <List.Accordion
                key={pr._id}
                title={(new Date(pr.date)).toString().slice(0,15)}
                left={props => <List.Icon {...props} icon="calendar-today" />}
                >
                <List.Item title={'Doctor: ' + pr.doctorId.fullname} />
                <List.Item title={'Schedule: ' + (new Date(pr.scheduleId.date)).toString().slice(0,15)} />  
                <View style={{flexDirection: 'row', marginBottom: 15}}>
                  <Text style={{fontSize: 16, marginLeft: 7, marginTop: 14}}>Medicines: </Text>
                    {pr.medicine.map((me,index) => (
                    <View key={index} >
                      <Text style={styles.servicetext}>{' ' + me.name + '-' + me.quantity + ' '}</Text>
                    </View>
                    ))} 
                </View>    
                <List.Item title={'Times: ' + pr.times} />
                <List.Item title={'Total: ' + pr.total + '$'} />
                <List.Item title={'Note: ' + pr.note} />               
            </List.Accordion>
            )) : <View style={{marginTop: '50%', alignItems: 'center'}}>
                    <Text style={{fontSize: 25, letterSpacing: 10}}>N0THING</Text>
                 </View>}    
          </List.Section>
        </ScrollView>
    </View>
  );
};

var styles = StyleSheet.create({
  container: {
      flex: 1
  },
  header: {
      backgroundColor: 'white',
      flexDirection: 'row',
      height: 65,
  },
  headertext1: {
      flex: 1,
      lineHeight: 80,
      fontSize: 18,
      marginRight: 35,
      textAlign: 'center',
      fontWeight: '500'
  },
  back: {
      marginTop: 28,
      marginLeft: 15
  },
  servicetext: {
    marginTop: 14,
    fontSize: 16
  },
})

export default Prescription;