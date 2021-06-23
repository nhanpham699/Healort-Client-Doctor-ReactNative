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
  const [data1, setData1] = useState([])
  const [data2, setData2] = useState([])  
  const [component, setComponent] = useState(0)

  const handleUpdate = (id, user, doctorName, doctorId) => {
    navigation.navigate("UpdateReexam", {id: id, user: user, doctorName: doctorName, doctorId: doctorId, actor: 'doctor'})
  }

  const handleExamed = async(id) => {
      // console.log(id);
      await axios.post(host + '/reexams/examed', {id: id})
      .then(() => {
          getAllSchedules()
      })
  }

  const handleSuccess = async(id) => {
    await axios.post(host + "/reexams/success", {id: id})
    .then(() => {
        getAllSchedules()
    })
  }

  const handleNoReply = async(id) => {
    await axios.post(host + "/reexams/noreply", {id: id})
    .then(() => {
        getAllSchedules()
    })
  }

  const handleNotCome = async(id) => {
    await axios.post(host + "/reexams/notcome", {id: id})
    .then(() => {
        getAllSchedules()
    })
  }

  const handleReExam = async(sch) => {
      navigation.navigate("ReExam", {
        doctor: sch.doctorId,
        userId: sch.userId._id, 
        scheduleId: sch.scheduleId._id,
        reexam: 'ManyReexam'
      })
  }

  const getAllSchedules = async() => {
    const res = await axios.get(host + '/reexams/getallreexamsbydoctor/' + doctor.id)
    const newData = res.data.filter(dt => dt.status != 3 || dt.status != 2)
    const examed = newData.filter(dt => dt.status == 1)
    const exam = newData.filter(dt => dt.status == 0)
    setData1(exam)
    setData2(examed)
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
            <Text style={styles.headertext1}>Re-Examination</Text> 
        </View>
        <ScrollView style={{backgroundColor: 'white', flex: 1, marginTop: 20}}>
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
                        <Text style={styles.schedules_text}>Examed</Text>
                    </LinearGradient>
                </View>
            </TouchableOpacity>  
            <TouchableOpacity onPress={() => setComponent(1)}>
                <View style={styles.button}>
                    <LinearGradient
                        colors={!component ? ['#EAEAEA','#EAEAEA'] : ['#2193b0','#6dd5ed']}
                        style={styles.schedules}
                    >
                        <Text style={styles.schedules_text}>Note examed yet</Text>
                    </LinearGradient>
                </View>
            </TouchableOpacity> 
          </View>
          {!component ?  
          <List.Section>
            {data2.length ? data2.map(sch => (
              <List.Accordion
                key={sch._id}
                title={(new Date(sch.date)).getDate() + "-" + ((new Date(sch.date)).getMonth()+1) + "-" + (new Date(sch.date)).getFullYear()}
                left={props => <List.Icon {...props} icon="calendar-today" />}
                >
                <List.Item style={{marginTop: -10}} title={'Time: ' + sch.begin + ':00'} />
                <List.Item title={'User name: ' + sch.userId.fullname} />
                <List.Item title={'Old schedule: ' + (new Date(sch.scheduleId.date)).getDate() + "-" + ((new Date(sch.scheduleId.date)).getMonth()+1) + "-" + (new Date(sch.scheduleId.date)).getFullYear()}/>  
                <List.Item title={'Problem: ' + sch.problem} />
                <List.Item title={'Note: ' + sch.note} />
                <View style={{flexDirection: 'row', justifyContent: 'flex-end'}}>
                  {(!sch.confirmation ? sch.confirmation : sch.confirmation.date )?
                    <View style={{flexDirection: 'row', justifyContent: 'flex-end'}}>
                        <View style={styles.button}>
                            <LinearGradient
                                colors={['#F3F9A7','#CAC531']}
                                style={[styles.update, {width: 200}]}
                            >
                                <Text style={styles.update_text}>Waiting for confirmation</Text>
                            </LinearGradient>
                        </View>
                        <TouchableOpacity onPress={() => handleNoReply(sch._id)}>
                            <View style={styles.button}>
                                <LinearGradient
                                    colors={['#D4919E','#C13815']}
                                    style={styles.update}
                                >
                                    <Text style={styles.update_text}>No reply</Text>
                                </LinearGradient>
                            </View>
                        </TouchableOpacity>
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
                  <View style={{flexDirection: 'row', justifyContent: 'flex-end'}}>
                    <TouchableOpacity onPress={() => handleReExam(sch)}>
                        <View style={styles.button}>
                            <LinearGradient
                                colors={['#CECCF5','#0970BE']}
                                style={styles.update}
                            >
                                <Text style={styles.update_text}>re-exam {sch.times + 1}</Text>
                            </LinearGradient>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => handleSuccess(sch._id)}>
                        <View style={styles.button}>
                            <LinearGradient
                                colors={['#76b852','#8DC26F']}
                                style={styles.update}
                            >
                                <Text style={styles.update_text}>Success</Text>
                            </LinearGradient>
                        </View>
                    </TouchableOpacity>
                  </View>
                </View> 
              </List.Accordion>
            ))  : <View style={{marginTop: '50%', alignItems: 'center'}}>
                    <Text style={{fontSize: 25, letterSpacing: 10}}>N0THING</Text>
                 </View> }
          </List.Section>
          :
          <List.Section>
            {data1.length ? data1.map(sch => (
              <List.Accordion
                key={sch._id}
                title={(new Date(sch.date)).getDate() + "-" + ((new Date(sch.date)).getMonth()+1) + "-" + (new Date(sch.date)).getFullYear()}
                left={props => <List.Icon {...props} icon="calendar-today" />}
                >
                <List.Item style={{marginTop: -10}} title={'Time: ' + sch.begin + ':00'} />
                <List.Item title={'User name: ' + sch.userId.fullname} />
                <List.Item title={'Old schedule: ' + (new Date(sch.scheduleId.date)).getDate() + "-" + ((new Date(sch.scheduleId.date)).getMonth()+1) + "-" + (new Date(sch.scheduleId.date)).getFullYear()}/>  
                <List.Item title={'Problem: ' + sch.problem} />
                <List.Item title={'Note: ' + sch.note} />
                <View style={{flexDirection: 'row', justifyContent: 'flex-end'}}>
                  {(!sch.confirmation ? sch.confirmation : sch.confirmation.date )?
                    <View style={{flexDirection: 'row', justifyContent: 'flex-end'}}>
                        <View style={styles.button}>
                            <LinearGradient
                                colors={['#F3F9A7','#CAC531']}
                                style={[styles.update, {width: 200}]}
                            >
                                <Text style={styles.update_text}>Waiting for confirmation</Text>
                            </LinearGradient>
                        </View>
                        <TouchableOpacity onPress={() => handleNoReply(sch._id)}>
                            <View style={styles.button}>
                                <LinearGradient
                                    colors={['#D4919E','#C13815']}
                                    style={styles.update}
                                >
                                    <Text style={styles.update_text}>No reply</Text>
                                </LinearGradient>
                            </View>
                        </TouchableOpacity>
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
                    <View style={{flexDirection: 'row', justifyContent: 'flex-end'}}>
                        <TouchableOpacity onPress={() => handleExamed(sch._id)}>
                            <View style={styles.button}>
                                <LinearGradient
                                    colors={['#76b852','#8DC26F']}
                                    style={styles.update}
                                >
                                    <Text style={styles.update_text}>Examed</Text>
                                </LinearGradient>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => handleNotCome(sch._id)}>
                            <View style={styles.button}>
                                <LinearGradient
                                    colors={['#D4919E','#C13815']}
                                    style={[styles.update, {width: 100}]}
                                >
                                    <Text style={styles.update_text}>No comming</Text>
                                </LinearGradient>
                            </View>
                        </TouchableOpacity>  
                    </View>
                </View> 
              </List.Accordion>
            ))  : <View style={{marginTop: '50%', alignItems: 'center'}}>
                    <Text style={{fontSize: 25, letterSpacing: 10}}>N0THING</Text>
                 </View> }
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
  servicetext: {
    marginTop: 10,
    fontSize: 15
  },
  update: {
    borderColor: '#00bfff',
    justifyContent: 'center',
    alignItems: 'center',
    height: 30,
    width: 80,
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

