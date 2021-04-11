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
import UpdateSchedulesModal from '../../components/UpdateSchedulesModal'
import ReviewModal from '../../components/ReviewModal'

const DoctorSchedule = ({navigation}) => {
  const { doctor } = useSelector(state => state.doctors)
  const [modalVisible1, setModalVisible1] = useState(false);
  const [modalVisible2, setModalVisible2] = useState(false);
  const [dataUpdate, setDataUpdate] = useState({
      id : null,
      time: 0,
      doctorId: null,
  })

  
  const [data, setData] = useState([])

  
  const handleUpdate = (id, time, doctorId) => {
     setDataUpdate({
        id: id,
        time: time,
        doctorId: doctorId
     })
     setModalVisible1(!modalVisible1)
  }

  const handleReview = () => setModalVisible2(!modalVisible2)

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
        { text: "OK", onPress: () => {
            axios.post(host + "/schedules/delete", {id: id})
        } }
      ]
    );
  }

  useEffect(() => {
    //   console.log(user.id);
      axios.get(host + '/schedules/getallbydoctor/' + doctor.id)
      .then(res => {
          setData(res.data)
      })
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
    
                <View style={{flexDirection: 'row', justifyContent: 'flex-end'}}>
                  <TouchableOpacity onPress={() => handleUpdate(sch._id, sch.end-sch.begin, sch.doctorId._id)}>
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
                <UpdateSchedulesModal dataUpdate={dataUpdate} modal={modalVisible1} setModal={handleUpdate} /> 
                <ReviewModal data={sch.doctorId} modal={modalVisible2} setModal={handleReview} /> 
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