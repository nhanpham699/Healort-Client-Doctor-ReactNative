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
import { Ionicons, AntDesign } from '@expo/vector-icons'; 
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
  const { user } = useSelector(state => state.users)
  const [modalVisible2, setModalVisible2] = useState(false);
  const [data, setData] = useState([])

  const stars = [1,2,3,4,5]

  const handleReview = () => setModalVisible2(!modalVisible2)

  const getAllSchedules = async() => {
    const res = await axios.get(host + '/schedules/getallschedules/' + user.id)
    const newData = res.data.filter(dt => dt.status === 1)
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
            {data.map((sch) => (
              <List.Accordion
                key={sch._id}
                title={(new Date(sch.date)).toString().slice(0,15)}
                left={props => <List.Icon {...props} icon="calendar-today" />}
                >
                <List.Item style={{marginTop: -10}} title={'Time: ' + sch.begin + ':00'} />
                <List.Item title={'Doctor: ' + sch.doctorId.fullname} />
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
                {!sch.doctorId.review.find(x => x.userId == user.id) ?   
                <View style={{flexDirection: 'row', justifyContent: 'flex-end'}}>
                    <TouchableOpacity onPress={handleReview}>
                        <View style={[styles.button,{marginRight: 20}]}>
                            <LinearGradient
                                colors={['#D4919E','#C13815']}
                                style={styles.update}
                            >
                                <Text style={styles.update_text}>Rate</Text>
                            </LinearGradient>
                        </View>
                    </TouchableOpacity> 
                </View>
                : 
                <View style={{flexDirection: 'row'}}>
                  {stars.map(star => (
                      <View key={star}>
                        <Star filled={star <= sch.doctorId.review.find(x => x.userId == user.id).rating ? true : false} />
                      </View>
                  ))}
                </View>
                }
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

export default ExamHistory;