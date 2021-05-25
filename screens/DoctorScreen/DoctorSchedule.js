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
// import ReviewModal from '../../components/ReviewModal'
import PrescriptionModal from '../../components/PrescriptionModal'

const DoctorSchedule = ({navigation}) => {
  const { doctor } = useSelector(state => state.doctors)
  const [modalVisible1, setModalVisible1] = useState(false);
  const [data, setData] = useState([])

  
  const handleUpdate = (id, user, doctorName, doctorId) => {
     navigation.navigate("UpdateSchedules", {id: id, user: user, doctorName: doctorName, doctorId: doctorId, actor: 'doctor'})
  }

  const handlePrescription = () => setModalVisible1(!modalVisible1)

  const handleExamed = async(id) => {
      await axios.post(host + "/schedules/examed", {id: id})
      .then(() => {
          getSchedules()
      })
  }

  const handleSuccess = async(id) => {
    await axios.post(host + "/schedules/success", {id: id})
    .then(() => {
        getSchedules()
    })
  }

  const handleNoReply = async(id) => {
    await axios.post(host + "/schedules/noreply", {id: id})
    .then(() => {
        getSchedules()
    })
  }

  const handleNotCome = async(id) => {
    await axios.post(host + "/schedules/notcome", {id: id})
    .then(() => {
        getSchedules()
    })
  }

  const getSchedules = async() => {
      const res = await axios.get(host + '/schedules/getallbydoctor/' + doctor.id)
      const newData = res.data.filter(dt => dt.status != 2 && dt.status != 3)
      setData(newData)
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
            {data.length ? data.map((sch) => (
              <List.Accordion
                key={sch._id}
                title={(new Date(sch.date)).getDate() + "-" + ((new Date(sch.date)).getMonth()+1) + "-" + (new Date(sch.date)).getFullYear()}
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
                    {sch.status !=3 && 
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
                    }
                    {!sch.reexam && sch.status !=3 &&
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
                    {!sch.prescription && sch.status !=3 &&  
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
                  <View style={{flexDirection: 'row', justifyContent: 'flex-end'}}>
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
                  } 
                </View> 
                }
                <PrescriptionModal 
                data={sch} 
                modal={modalVisible1} 
                setModal={handlePrescription}
                getData={getSchedules} /> 
              </List.Accordion>
            )) : <View style={{marginTop: '50%', alignItems: 'center'}}>
                    <Text style={{fontSize: 25, letterSpacing: 10}}>N0THING</Text>
                 </View> }
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