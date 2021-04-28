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
// import { LinearGradient } from 'expo-linear-gradient'
import host from '../../host'
import { List } from 'react-native-paper';
import axios from 'axios';
import {useSelector, useDispatch} from 'react-redux'
// import {addDoctorInfor} from '../../actions/doctor.infor'


export default function ReExam({navigation}) {

  // const dispatch = useDispatch()
  const { user } = useSelector(state => state.users)
  const [data, setData] = useState([])

  
//   const handleUpdate = (id, doctorName, doctorId) => {
//     navigation.navigate("UpdateSchedules", {
//       id: id, 
//       doctorName: doctorName, 
//       doctorId: doctorId, 
//       actor: 'user'
//     })
//  }


  // const handleDelete = (id) => {
  //   Alert.alert(
  //     "Delete this schedule!",
  //     "Are you sure?",
  //     [
  //       {
  //         text: "Cancel",
  //         onPress: () => console.log("Cancel Pressed"),
  //         style: "cancel"
  //       },
  //       { text: "OK", onPress: async() => {
  //           await axios.post(host + "/schedules/delete", {id: id})
  //           const currentSchedule = data.filter(dt => dt._id == id)
  //           const doctor = currentSchedule[0].doctorId
  //           const dataSaved = {
  //               sender: 'user',
  //               userId : user.id,
  //               doctorId: doctor._id,
  //               title: 'Delete the schedule',
  //               body: user.fullname + ' deleted the schedule! Please check your schedule!',
  //               date: new Date()
  //           }
  //           const doctors = await axios.get(host + '/doctors/gettopdoctor')
  //           await dispatch(addDoctorInfor(doctors.data))

  //           for(var token of doctor.tokens){
  //               await sendPushNotification(token.tokenDevices);
  //           }

  //           await axios.post(host + '/notifications/add', dataSaved)
  //           getAllSchedules()
  //       } }
  //     ]
  //   );
  // }

  const getAllSchedules = async() => {
    const res = await axios.get(host + '/reexams/getallreexamsbyuser/' + user.id)
    setData(res.data)
  }

  useEffect(() => {
      getAllSchedules()
  },[])

  // async function sendPushNotification(expoPushToken) {
  //   const message = {
  //     to: expoPushToken,
  //     sound: 'default',
  //     title: 'Delete the schedule',
  //     body: user.fullname + ' deleted the schedule! Please check your schedule!',
  //     data: { someData: 'goes here' },
  //   };
    

  //   await fetch('https://exp.host/--/api/v2/push/send', {
  //     method: 'POST',
  //     headers: {
  //       Accept: 'application/json',
  //       'Accept-encoding': 'gzip, deflate',
  //       'Content-Type': 'application/json',
  //     },
  //     body: JSON.stringify(message),
  //   });
  // }

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
                <List.Item title={'Doctor: ' + sch.doctorId.fullname} />
                <List.Item title={'Old schedule: ' + (new Date(sch.scheduleId.date)).toString().slice(0,15)} />  
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

