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
// import {addDoctorInfor} from '../../actions/doctor.infor'


export default function ReExam({navigation}) {

  // const dispatch = useDispatch()
  const { doctor } = useSelector(state => state.doctors)
  const [data, setData] = useState([])

  
  const handleUpdate = (id, user, doctorName, doctorId) => {
    navigation.navigate("UpdateReexam", {id: id, user: user, doctorName: doctorName, doctorId: doctorId, actor: 'doctor'})
 }

  const getAllSchedules = async() => {
    const res = await axios.get(host + '/reexams/getallreexamsbydoctor/' + doctor.id)
    setData(res.data)
  }

  useEffect(() => {
      getAllSchedules()
  },[])


  return (
    <View style={styles.container}>
        <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
               <Ionicons style={styles.back} name="arrow-back" size={24} color="black" />
            </TouchableOpacity>
            <Text style={styles.headertext1}>My Schedules</Text> 
        </View>
        <ScrollView style={{backgroundColor: 'white', flex: 1, marginTop: 20}}>
          <List.Section>
            {data.map(sch => (
              <List.Accordion
                key={sch._id}
                title={(new Date(sch.date)).toString().slice(0,15)}
                left={props => <List.Icon {...props} icon="calendar-today" />}
                >
                <List.Item style={{marginTop: -10}} title={'Time: ' + sch.begin + ':00'} />
                <List.Item title={'User name: ' + sch.userId.fullname} />
                <List.Item title={'Old schedule: ' + (new Date(sch.scheduleId.date)).toString().slice(0,15)} />  

                <View style={{flexDirection: 'row', justifyContent: 'flex-end'}}>
                  {(!sch.confirmation ? sch.confirmation : sch.confirmation.date )?
                      <View style={styles.button}>
                          <LinearGradient
                              colors={['#F3F9A7','#CAC531']}
                              style={[styles.update, {width: 200}]}
                          >
                              <Text style={styles.update_text}>Waiting for confirmation</Text>
                          </LinearGradient>
                      </View>
                  :
                  <TouchableOpacity onPress={() => handleUpdate(sch._id, sch.userId, sch.doctorId.fullname, sch.doctorId._id)}>
                      <View style={styles.button}>
                          <LinearGradient
                              colors={['#CECCF5','#0970BE']}
                              style={styles.update}
                          >
                              <Text style={styles.update_text}>Update</Text>
                          </LinearGradient>
                      </View>
                  </TouchableOpacity>   
                  }  
                </View> 
              </List.Accordion>
            ))}
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
    marginTop: 10,
    fontSize: 15
  },
  update: {
    borderColor: '#00bfff',
    justifyContent: 'center',
    alignItems: 'center',
    height: 30,
    width: 75,
    borderRadius: 10,
    marginRight: 10,
    marginTop: 10
  },
  update_text: {
      color: 'rgba(0, 0, 0, 0.7)',
      fontWeight: '600',
  },
})

