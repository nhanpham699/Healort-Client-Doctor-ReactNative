import React, {useEffect, useState} from 'react'

import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    RefreshControl,    
    Alert,
    ScrollView
} from 'react-native'
import { Ionicons,  FontAwesome, Entypo } from '@expo/vector-icons'; 
import { LinearGradient } from 'expo-linear-gradient'
import host from '../../host'
import { List } from 'react-native-paper';
import axios from 'axios';
import {useSelector, useDispatch} from 'react-redux'
import {addDoctorInfor} from '../../actions/doctor.infor'

const wait = (timeout) => {
  return new Promise(resolve => setTimeout(resolve, timeout))
}

const Schedule = ({navigation}) => {

  const [component, setComponent] = useState(0)

  const [refreshing, setRefreshing] = useState(false)
  const onRefresh = React.useCallback(() => {
      setRefreshing(true);
      wait(1000).then(() => {
          setRefreshing(false)
          getAllSchedules()
          getAllReexams()
      })
  })

  const dispatch = useDispatch()
  const { user } = useSelector(state => state.users)
  const [data, setData] = useState([])
  const [reexamData, setReexamData] = useState([])

  
  const handleUpdate = (id, doctorName, doctorId) => {
    navigation.navigate("UpdateSchedules", {
      id: id, 
      doctorName: doctorName, 
      doctorId: doctorId, 
      actor: 'user'
    })
 }


  const handleDelete = (id) => {
    Alert.alert(
      "Delete this schedule!",
      "Are you sure?",
      [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel"
        },
        { text: "OK", onPress: async() => {
            await axios.post(host + "/schedules/delete", {id: id})
            const currentSchedule = data.filter(dt => dt._id == id)
            const doctor = currentSchedule[0].doctorId
            const dataSaved = {
                sender: 'user',
                userId : user.id,
                doctorId: doctor._id,
                title: 'Delete the schedule',
                body: user.fullname + ' deleted the schedule! Please check your schedule!',
                date: new Date()
            }
            const doctors = await axios.get(host + '/doctors/gettopdoctor')
            await dispatch(addDoctorInfor(doctors.data))

            for(var token of doctor.tokens){
                await sendPushNotification(token.tokenDevices);
            }

            await axios.post(host + '/notifications/add', dataSaved)
            getAllSchedules()
        } }
      ]
    );
  }

  const getAllSchedules = async() => {
    const res = await axios.get(host + '/schedules/getallschedules/' + user.id)
    const newData = res.data.filter(dt => dt.status === 0)
    setData(newData)
  }

  useEffect(() => {
      getAllSchedules()
      getAllReexams()
  },[])

  async function sendPushNotification(expoPushToken) {
    const message = {
      to: expoPushToken,
      sound: 'default',
      title: 'Delete the schedule',
      body: user.fullname + ' deleted the schedule! Please check your schedule!',
      data: { someData: 'goes here' },
    };
    

    await fetch('https://exp.host/--/api/v2/push/send', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Accept-encoding': 'gzip, deflate',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(message),
    });
  }


  //////////////
  const handleReexamUpdate = (id, doctorName, doctorId) => {
    navigation.navigate("UpdateReexam", {
      id: id, 
      doctorName: doctorName, 
      doctorId: doctorId, 
      actor: 'user'
    })
 }


  const handleReexamDelete = (id) => {
    Alert.alert(
      "Delete this schedule!",
      "Are you sure?",
      [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel"
        },
        { text: "OK", onPress: async() => {
            await axios.post(host + "/reexams/delete", {id: id})
            const currentSchedule = data.filter(dt => dt._id == id)
            const doctor = currentSchedule[0].doctorId
            const dataSaved = {
                sender: 'user',
                userId : user.id,
                doctorId: doctor._id,
                title: 'Delete the re-exam schedule',
                body: user.fullname + ' deleted the re-exam schedule! Please check your re-exam schedule!',
                date: new Date()
            }
            
            for(var token of doctor.tokens){
                await sendPushNotificationReexam(token.tokenDevices);
            }

            await axios.post(host + '/notifications/add', dataSaved)
            getAllSchedules()
        } }
      ]
    );
  }

  const getAllReexams = async() => {
    const res = await axios.get(host + '/reexams/getallreexamsbyuser/' + user.id)
    setReexamData(res.data)
  }

  async function sendPushNotificationReexam(expoPushToken) {
    const message = {
      to: expoPushToken,
      sound: 'default',
      title: 'Delete the re-exam schedule',
      body: user.fullname + ' deleted the re-exam schedule! Please check your re-exam schedule!',
      data: { someData: 'goes here' },
    };
    

    await fetch('https://exp.host/--/api/v2/push/send', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Accept-encoding': 'gzip, deflate',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(message),
    });
  }
  ///////
  return (
    <View style={styles.container}>
        <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
               <Ionicons style={styles.back} name="arrow-back" size={24} color="black" />
            </TouchableOpacity>
            <Text style={styles.headertext1}>My Schedules</Text> 
        </View>
        <ScrollView
        refreshControl={
            <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            /> 
        } 
        style={{backgroundColor: 'white', flex: 1, marginTop: 20}}>
          <View style={{
            flexDirection: 'row', 
            justifyContent: 'center', 
            backgroundColor: '#EAEAEA',
            marginTop: 30,
            marginBottom: 20,
            marginHorizontal: 56,
            borderRadius: 25
            }}>
            <TouchableOpacity onPress={() => setComponent(0)}>
                <View style={styles.button}>
                    <LinearGradient
                        colors={component ? ['#EAEAEA', '#EAEAEA'] : ['#2193b0','#6dd5ed']}
                        style={styles.schedules}
                    >
                        <Text style={styles.schedules_text}>Schedules</Text>
                    </LinearGradient>
                </View>
            </TouchableOpacity>  
            <TouchableOpacity onPress={() => setComponent(1)}>
                <View style={styles.button}>
                    <LinearGradient
                        colors={!component ? ['#EAEAEA','#EAEAEA'] : ['#2193b0','#6dd5ed']}
                        style={styles.schedules}
                    >
                        <Text style={styles.schedules_text}>Re-Examinations</Text>
                    </LinearGradient>
                </View>
            </TouchableOpacity> 
          </View>
          {!component ?
          <List.Section>
            {data.length ? data.map((sch) => (
              <List.Accordion
                key={sch._id}
                title={(new Date(sch.date)).getDate() + "-" + ((new Date(sch.date)).getMonth()+1) + "-" + (new Date(sch.date)).getFullYear()}
                left={props => <List.Icon {...props} icon="calendar-today" />}
                >
                <List.Item style={{marginTop: -10}} title={'Time: ' + sch.begin + ':00'} />
                <List.Item title={'Doctor: ' + sch.doctorId.fullname} />
                <TouchableOpacity onPress={() => navigation.navigate('ShowExamSlip',{schedule: sch})}>
                  <Text style={styles.link} >My examination slip</Text>
                </TouchableOpacity>
                <View style={{flexDirection: 'row', marginBottom: 15}}>
                  <Text style={{fontSize: 16, marginLeft: 7, marginTop: 14}}>Services: </Text>
                  <View style={{flexDirection: 'column'}}>
                    {sch.services.map((ser,index) => (
                      <View style={{flexDirection: 'row'}} key={index} >
                        <Entypo style={{marginTop: 12}} name="dot-single" size={24} color="black" />
                        <Text style={styles.servicetext}>{ser.name} </Text>
                      </View>
                    ))} 
                  </View>
                </View>    
              
                <View style={{flexDirection: 'row', justifyContent: 'flex-end'}}>
                  <TouchableOpacity onPress={() => handleUpdate(sch._id, sch.doctorId.fullname, sch.doctorId._id)}>
                      <View style={styles.button}>
                          <LinearGradient
                              colors={['#CECCF5','#0970BE']}
                              style={styles.update}
                          >
                              <Text style={styles.update_text}>Update</Text>
                          </LinearGradient>
                      </View>
                  </TouchableOpacity>  
                  <TouchableOpacity onPress={() => handleDelete(sch._id)}>
                      <View style={styles.button}>
                          <LinearGradient
                              colors={['#D4919E','#C13815']}
                              style={styles.update}
                          >
                              <Text style={styles.update_text}>Delete</Text>
                          </LinearGradient>
                      </View>
                  </TouchableOpacity> 
                </View> 
                
              </List.Accordion>
            )) : <View style={{marginTop: '50%', alignItems: 'center'}}>
                    <Text style={{fontSize: 25, letterSpacing: 10}}>N0THING</Text>
                 </View>}
          </List.Section>
          :
          <List.Section>
            {reexamData.length ? reexamData.map(sch => (
              <List.Accordion
                key={sch._id}
                title={(new Date(sch.date)).getDate() + "-" + ((new Date(sch.date)).getMonth()+1) + "-" + (new Date(sch.date)).getFullYear()}
                left={props => <List.Icon {...props} icon="calendar-today" />}
                >
                <List.Item style={{marginTop: -10}} title={'Time: ' + sch.begin + ':00'} />
                <List.Item title={'Doctor: ' + sch.doctorId.fullname} />
                <List.Item title={'Old schedule: ' + (new Date(sch.scheduleId.date)).getDate() + "-" + ((new Date(sch.scheduleId.date)).getMonth()+1) + "-" + (new Date(sch.scheduleId.date)).getFullYear()}/>  
                <View style={{flexDirection: 'row', justifyContent: 'flex-end'}}>
                  <TouchableOpacity onPress={() => handleReexamUpdate(sch._id, sch.doctorId.fullname, sch.doctorId._id)}>
                      <View style={styles.button}>
                          <LinearGradient
                              colors={['#CECCF5','#0970BE']}
                              style={styles.update}
                          >
                              <Text style={styles.update_text}>Update</Text>
                          </LinearGradient>
                      </View>
                  </TouchableOpacity>  
                  <TouchableOpacity onPress={() => handleReexamDelete(sch._id)}>
                      <View style={styles.button}>
                          <LinearGradient
                              colors={['#D4919E','#C13815']}
                              style={styles.update}
                          >
                              <Text style={styles.update_text}>Delete</Text>
                          </LinearGradient>
                      </View>
                  </TouchableOpacity> 
                </View> 
              </List.Accordion>
            )): <View style={{marginTop: '50%', alignItems: 'center'}}>
                    <Text style={{fontSize: 25, letterSpacing: 10}}>N0THING</Text>
                 </View>}
          </List.Section>
          }
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
  link: {
    marginLeft: 7,
    fontSize: 16,
    marginVertical: 15,
    color: '#00aaff',
    textDecorationLine: 'underline'
  },
  servicetext: {
    marginTop: 14,
    fontSize: 16
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
  schedules: {
      width: 150,
      height: 50,
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 25,
  },
  schedules_text: {
    fontSize: 16,
    fontWeight: '500'
  },
})

export default Schedule;