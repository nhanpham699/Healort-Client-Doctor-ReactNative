import React, { useEffect, useState } from 'react'
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    StatusBar,
    Image,
    Alert,
    ScrollView
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'; 
import { LinearGradient } from 'expo-linear-gradient'
import {useSelector, useDispatch} from 'react-redux'
import {addDoctorInfor} from '../../actions/doctor.infor'
import axios from 'axios';
import host from '../../host';
import ScheduleModal from '../../components/ScheduleModal'

export default function Notifications({navigation}){

    const { notification } = useSelector(state => state.notifications)


    const [modalVisible, setModalVisible] = useState({
        id: "",
        state: false
    });
    const dispatch = useDispatch()
    const { user } = useSelector(state => state.users)
    const [data, setData] = useState(notification ? notification : [])
    const getData = async () => {
        const res = await axios.get(host + '/notifications/getnotificationsbyuser/' + user.id)
        const newData = res.data.filter(dt => dt.sender == "doctor")
        setData(newData)
    }

    const handleModal = (id) => {
        setModalVisible({
            id: id,
            state: !modalVisible.state
        })
     }

    const handleRefuse = (scheduleId, reexamId, doctor, notifId) => {
        
        Alert.alert(
            "Update or delete your schedule",
            "Click 'Update' if you want to update the schedule. Click 'Delete' if you want to remove the schedule",
            [
              { text: "Update", onPress: async() => {
                        setModalVisible({
                            id: "",
                            state: !modalVisible.state
                        })    
                        if(scheduleId){
                            navigation.navigate("UpdateSchedules", {
                                id: scheduleId._id, 
                                doctorName: doctor.fullname, 
                                doctorId: doctor._id, 
                                actor: 'user',
                                component: 'notification',
                                notifId: notifId
                            })
                        }else if(reexamId){
                            navigation.navigate("UpdateReexam", {
                                id: reexamId._id, 
                                doctorName: doctor.fullname, 
                                doctorId: doctor._id, 
                                actor: 'user',
                                component: 'notification',
                                notifId: notifId
                            })
                        }
              } }, 
              { text: "Delete", onPress: async() => {
                    setModalVisible({
                        id: "",
                        state: !modalVisible.state
                    })
                    if(scheduleId){
                        await axios.post(host + "/schedules/delete", {id: scheduleId._id})
                   
                        const dataSaved = {
                            sender: 'user',
                            userId : user.id,
                            doctorId: doctor._id,
                            title: 'Delete the schedule',
                            body: user.fullname + ' has rejected and deleted your request to update the schedule! Please check your schedules!',
                            date: new Date()
                        }
                        const doctors = await axios.get(host + '/doctors/gettopdoctor')
                        await dispatch(addDoctorInfor(doctors.data))
            
                        for(var token of doctor.tokens){
                            await sendDeleteNotification(token.tokenDevices, user.fullname);
                        }
            
                        await axios.post(host + '/notifications/add', dataSaved)
                        await axios.post(host + '/notifications/update', {id : notifId})
                        .then(() => {
                            getData()
                        })
                    }else if(reexamId){
                        await axios.post(host + "/reexams/delete", {id: reexamId._id})
                   
                        const dataSaved = {
                            sender: 'user',
                            userId : user.id,
                            doctorId: doctor._id,
                            title: 'Delete the schedule',
                            body: user.fullname + ' has rejected and deleted your request to update the schedule! Please check your schedules!',
                            date: new Date()
                        }
                        for(var token of doctor.tokens){
                            await sendDeleteNotification(token.tokenDevices, user.fullname);
                        }
            
                        await axios.post(host + '/notifications/add', dataSaved)
                        await axios.post(host + '/notifications/update', {id : notifId})
                        .then(() => {
                            getData()
                        })
                    }
              }},
              {
                text: "Cancel",
                onPress: () => console.log("Cancel Pressed"),
                style: "cancel"
              }
            ]
        );
    }

    const handleUpdate = async(scheduleId, reexamId, notifId) => {
        setModalVisible({
            id: "",
            state: !modalVisible.state
        })
        if(scheduleId){
            const res = await axios.post(host + '/schedules/update', {id : scheduleId._id})
            const doctor = res.data.doctorId
            const dataSaved = {
                sender: 'user',
                userId : user.id,
                doctorId: doctor._id,
                title: 'Update the schedule',
                body: user.fullname + ' has accepted your request to update the schedule! Please check your schedules!',
                date: new Date()
            }
        
            await axios.post(host + '/notifications/add', dataSaved)
        
            for(var token of doctor.tokens){
                await sendUpdateNotification(token.tokenDevices, user.fullname);
            }

            await axios.post(host + '/notifications/update', {id : notifId})
            .then(() => {
                getData()
            })
        }else if(reexamId){
            const res = await axios.post(host + '/reexams/update', {id : reexamId._id})
            const doctor = res.data.doctorId
            const dataSaved = {
                sender: 'user',
                userId : user.id,
                doctorId: doctor._id,
                title: 'Update the re-exam schedule',
                body: user.fullname + ' has accepted your request to update the re-exam schedule! Please check your re-exam schedules!',
                date: new Date()
            }
        
            await axios.post(host + '/notifications/add', dataSaved)
        
            for(var token of doctor.tokens){
                await sendUpdateNotification(token.tokenDevices, user.fullname);
            }

            await axios.post(host + '/notifications/update', {id : notifId})
            .then(() => {
                getData()
            })
        }
    }

    useEffect(() => {
        getData()
    },[notification])

    async function sendUpdateNotification(expoPushToken, username) {
        const message = {
          to: expoPushToken,
          sound: 'default',
          title: 'Update the schedule',
          body: username + ' has accepted your request to update the schedule! Please check your schedules!',
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

      async function sendDeleteNotification(expoPushToken, username) {
        const message = {
          to: expoPushToken,
          sound: 'default',
          title: 'Delete the schedule',
          body: username + ' has rejected and deleted your request to update the schedule! Please check your schedules!',
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

      console.log(data);

    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" />
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons style={styles.back} name="arrow-back" size={24} color="black" />
                </TouchableOpacity>
                <Text style={styles.headertext1}>Notifications</Text> 
            </View>
            <ScrollView style={styles.content}>
                {data.length ? data.map((notif,index) => (
                        <View  key={index} style={styles.item} >
                            <View style={{width: '25%'}}>
                                <Image 
                                source={{uri : host + notif.doctorId.avatar}}
                                style={styles.image} />
                            </View>
                            <View style={{width: '75%', marginTop: 7}}> 
                                <View>
                                    <Text style={styles.textbody}>{notif.body}</Text>
                                </View>
                                <View style={{flexDirection: 'row'}}>
                                    
                                    <Text style={styles.textdate}>
                                    {new Date(notif.date).toString().slice(16,21) + ' ' 
                                    + (new Date(notif.date)).getDate() + '-' 
                                    + ((new Date(notif.date)).getMonth() + 1) }
                                    </Text>
                                    {(notif.status == 1) ?
                                    <View style={{position: 'absolute', right: 0}}>
                                        <LinearGradient
                                            colors={['#76b852','#8DC26F']}
                                            style={[styles.update, {width: 100}]}
                                        >
                                            <Text style={styles.update_text}>confirmed</Text>
                                        </LinearGradient>
                                    </View>
                                    :
                                    <TouchableOpacity style={{position: 'absolute', right: 0}} onPress={() => handleModal(notif._id)}>
                                        <View>
                                            <LinearGradient
                                                colors={['#CECCF5','#0970BE']}
                                                style={[styles.update, {width: 100}]}
                                            >
                                                <Text style={styles.update_text}>Handle</Text>
                                            </LinearGradient>
                                        </View>
                                    </TouchableOpacity>
                                    }
                                </View>
                            </View>
                            {modalVisible.state && modalVisible.id == notif._id &&
                            <ScheduleModal 
                            handleUpdate={handleUpdate}
                            handleRefuse={handleRefuse}
                            schedule={notif.scheduleId}
                            reexam={notif.reexamId}
                            data={notif.scheduleId ? notif.scheduleId : notif.reexamId} 
                            doctor={notif.doctorId}
                            notif={notif._id}
                            modal={modalVisible} 
                            setModal={handleModal} /> }
                        </View>
                )) : <View style={{marginTop: '50%', alignItems: 'center'}}>
                        <Text style={{fontSize: 25, letterSpacing: 10}}>N0THING</Text>
                     </View> }
            </ScrollView>
        </View>
    )
}
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
    content: {
        marginTop: 20,
        flex: 1,
        padding: 20,
        backgroundColor: 'white'
    },
    item: {
        flexDirection: 'row',
        marginBottom: 20
    },
    image: {
        width: 80,
        height: 80,
        borderRadius: 50
    },
    textbody: {
        fontWeight: '500'
    },
    textdate: {
        marginTop: 10
    },
    update: {
        borderColor: '#00bfff',
        justifyContent: 'center',
        alignItems: 'center',
        height: 25,
        width: 60,
        borderRadius: 10,
        marginRight: 5,
        marginTop: 5
    },
    update_text: {
        color: 'rgba(0, 0, 0, 0.7)',
        fontWeight: '600',
    },
})