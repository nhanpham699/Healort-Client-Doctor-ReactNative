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
import { Ionicons, AntDesign, Entypo } from '@expo/vector-icons'; 
import { LinearGradient } from 'expo-linear-gradient'
import host from '../../host'
import { List } from 'react-native-paper';
import axios from 'axios';
import {useSelector, useDispatch} from 'react-redux'
// import {addDoctorInfor} from '../../actions/doctor.infor'
import ReviewModal from '../../components/ReviewModal'

const Star = (props) => {
  return(
      <AntDesign style={{marginHorizontal: 5, marginTop: 10}} name={props.filled ? "star" : "staro"} size={24} color="#ff9900" />
  )
}

const ExamHistory = ({navigation}) => {

//   const dispatch = useDispatch()
  const { doctor } = useSelector(state => state.doctors)
  const [data, setData] = useState([])
 
  const stars = [1,2,3,4,5]


  const getAllSchedules = async() => {
    const res = await axios.get(host + '/schedules/getallbydoctor/' + doctor.id)
    const newData = res.data.filter(dt => dt.status === 3)
    setData(newData)
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
            {data.length ? data.map((sch) => (
              <List.Accordion
                key={sch._id}
                title={(new Date(sch.date)).getDate() + "-" + ((new Date(sch.date)).getMonth()+1) + "-" + (new Date(sch.date)).getFullYear()}
                left={props => <List.Icon {...props} icon="calendar-today" />}
                >
                <List.Item style={{marginTop: -10}} title={'Time: ' + sch.begin + ':00'} />
                <List.Item title={'Patient: ' + sch.userId.fullname} />
                <View style={{flexDirection: 'row', marginBottom: 15}}>
                  <Text style={{fontSize: 15, marginLeft: 7, marginTop: 10}}>Services: </Text>
                  <View style={{flexDirection: 'column'}}>
                    {sch.services.map((ser,index) => (
                      <View style={{flexDirection: 'row'}} key={index} >
                        <Entypo style={{marginTop: 12}} name="dot-single" size={24} color="black" />
                        <Text style={styles.servicetext}>{ser.name} </Text>
                      </View>
                    ))} 
                  </View> 
                </View>
                {sch.doctorId.review.find(x => x.scheduleId == sch._id) &&
                <View style={{flexDirection: 'row'}}>
                  {stars.map(star => (
                      <View key={star}>
                        <Star filled={star <= sch.doctorId.review.find(x => x.scheduleId == sch._id).rating ? true : false} />
                      </View>
                  ))}
                </View>
                }
              </List.Accordion>
            ))  : <View style={{marginTop: '50%', alignItems: 'center'}}>
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

export default ExamHistory;