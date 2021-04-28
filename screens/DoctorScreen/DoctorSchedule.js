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
import {useSelector} from 'react-redux'
import ReviewModal from '../../components/ReviewModal'
import PrescriptionModal from '../../components/PrescriptionModal'

const DoctorSchedule = ({navigation}) => {
  const { doctor } = useSelector(state => state.doctors)
  const [modalVisible1, setModalVisible1] = useState(false);
  const [modalVisible2, setModalVisible2] = useState(false);
  const [data, setData] = useState([])

  
  const handleUpdate = (id, user, doctorName, doctorId) => {
     navigation.navigate("UpdateSchedules", {id: id, user: user, doctorName: doctorName, doctorId: doctorId, actor: 'doctor'})
  }

  const handleReview = () => setModalVisible2(!modalVisible2)
  const handlePrescription = () => setModalVisible1(!modalVisible1)

  const handleExamed = async(id) => {
      await axios.post(host + "/schedules/examed", {id: id})
      .then(() => {
          getSchedules()
      })
  }

  const getSchedules = async() => {
      const res = await axios.get(host + '/schedules/getallbydoctor/' + doctor.id)
      setData(res.data)
  }

  useEffect(() => {
    getSchedules()
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
            {data.map((sch) => (
              <List.Accordion
                key={sch._id}
                title={(new Date(sch.date)).toString().slice(0,15)}
                left={props => <List.Icon {...props} icon="calendar-today" />}
                >
                <List.Item style={{marginTop: -10}} title={'Time: ' + sch.begin + ':00'} />
                <List.Item title={'Client name: ' + sch.userId.fullname} />
                <View style={{flexDirection: 'row', marginBottom: 15}}>
                  <Text style={{fontSize: 15, marginLeft: 7, marginTop: 10}}>Services: </Text>
                {sch.services.map((ser,index) => (
                    <View key={index} >
                      {(ser == 0) && <Text style={styles.servicetext}>Tooth extraction</Text>}
                      {(ser == 1) && <Text style={styles.servicetext}> Fillings</Text>}
                      {(ser == 2) && <Text style={styles.servicetext}> Dental implants</Text>}
                    </View>
                ))} 
                </View>    
                {sch.status 
                ? 
                <View style={{flexDirection: 'row', justifyContent: 'flex-end'}}>
                    {!sch.reexam &&
                    <TouchableOpacity onPress={() => navigation.navigate('ReExam', {doctor : sch.doctorId, userId: sch.userId._id ,scheduleId: sch._id})}>
                        <View style={styles.button}>
                            <LinearGradient
                                colors={['#CECCF5','#0970BE']}
                                style={styles.update}
                            >
                                <Text style={styles.update_text}>Re-exam</Text>
                            </LinearGradient>
                        </View>
                    </TouchableOpacity>
                    }
                    {!sch.prescription &&  
                    <TouchableOpacity onPress={handlePrescription}>
                        <View style={styles.button}>
                            <LinearGradient
                                colors={['#CECCF5','#0970BE']}
                                style={[styles.update, {width: 100}]}
                            >
                                <Text style={styles.update_text}>prescription</Text>
                            </LinearGradient>
                        </View>
                    </TouchableOpacity>  
                    }
                </View>
                :    
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
                  <TouchableOpacity onPress={() => handleExamed(sch._id)}>
                      <View style={styles.button}>
                          <LinearGradient
                              colors={['#D4919E','#C13815']}
                              style={styles.update}
                          >
                              <Text style={styles.update_text}>Examed</Text>
                          </LinearGradient>
                      </View>
                  </TouchableOpacity>  
                </View> 
                }
                <ReviewModal data={sch.doctorId} modal={modalVisible2} setModal={handleReview} /> 
                <PrescriptionModal data={sch} modal={modalVisible1} setModal={handlePrescription} /> 
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

export default DoctorSchedule;