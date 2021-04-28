import React, { useEffect, useState } from 'react'
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    Image,
    Alert
} from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { Ionicons } from '@expo/vector-icons'; 
import axios from 'axios';
import host from '../../host';
import {useDispatch, useSelector} from 'react-redux'
import {addDoctorInfor} from '../../actions/doctor.infor'


export default function Checkout({navigation, route}){

    const { user } = useSelector(state => state.users)

    const dispatch = useDispatch()
    const [dataCheckOut, setDataCheckOut] = useState({})
    const [doctor, setDoctor] = useState({})
    const [total, setTotal] = useState(0)
    const { data } = route.params
    useEffect(() => {

        axios.get(host + '/doctors/getdoctorbyid/' + data.doctorId)
        .then(res => {
            // console.log(res.data);
            setDoctor(res.data)
        })
        let Total = 0
        if(data.services.indexOf(0) != -1) 
            Total += 100 
        if(data.services.indexOf(1) != -1) 
            Total += 50 
        if(data.services.indexOf(2) != -1) 
            Total += 500
        setTotal(Total)     
        setDataCheckOut({...data, total: Total, date: new Date(data.date)})

    },[])

    const handleCheckOut = async() => {
        await axios.post(host + '/schedules/add', dataCheckOut)
        .then(() => {
            Alert.alert(
                "Make an appointment",
                "Successfully",
                [
                  { text: "OK", onPress: async() => {
                        const dataSaved = {
                            sender: 'user',
                            userId : data.userId,
                            doctorId: doctor._id,
                            title: 'Make an appoinment',
                            body: user.fullname + ' maked an appoinment for you!',
                            date: new Date()
                        }
                        const doctors = await axios.get(host + '/doctors/gettopdoctor')
                        await dispatch(addDoctorInfor(doctors.data))
                        await axios.post(host + '/notifications/add', dataSaved)
                        for(var token of doctor.tokens){
                            await sendPushNotification(token.tokenDevices, user.fullname);
                        }

                        const dataFilter = {...dataCheckOut, date: dataCheckOut.date.toString().slice(0,15)}
                        navigation.navigate('ExaminationSlip', {data: dataFilter, doctor: doctor})
                        
                    }}
                ]
              );
        })
    }

    async function sendPushNotification(expoPushToken, username) {
        const message = {
          to: expoPushToken,
          sound: 'default',
          title: 'Make an appoinment',
          body: username + ' maked an appoinment for you!',
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
      

    return (
        <View style={styles.container}>
             <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons style={styles.back} name="arrow-back" size={24} color="black" />
                </TouchableOpacity>
                <Text style={styles.headertext1}>Check out</Text> 
            </View>
            <View style={styles.content}>
                <View style={{flexDirection: 'row'}}>
                    <View style={{width: '50%'}}>
                        <Image 
                        source={{uri : host + doctor.avatar}} 
                        style={styles.doctorLogo} />
                    </View>
                    <View style={styles.doctorInfor}>
                        <View>
                            <Text style={styles.doctorInfor_text}><Text style={{fontWeight: '700'}}>Name:</Text>  {doctor.fullname}</Text>
                            <Text style={styles.doctorInfor_text}><Text style={{fontWeight: '700'}}>Birth Year:</Text> {doctor.birthyear}</Text>
                            <Text style={styles.doctorInfor_text}><Text style={{fontWeight: '700'}}>Gender:</Text>  {doctor.gender ? 'Male' : 'fale'}</Text>
                            <Text style={styles.doctorInfor_text}><Text style={{fontWeight: '700'}}>Hometown:</Text>  {doctor.hometown}</Text>
                            <Text style={styles.doctorInfor_text}><Text style={{fontWeight: '700'}}>Phone:</Text>  {doctor.phone}</Text>
                            <Text style={styles.doctorInfor_text}><Text style={{fontWeight: '700'}}>Experience:</Text>  {doctor.experience} years</Text>
                        </View>
                    </View>   
                </View>  
            </View>
            
            <View style={styles.footer}>
                <ScrollView>
                    <View style={styles.footer_header}>
                        <View style={styles.footer_component}>
                            <View style={styles.footer_left}>
                                <Text style={[styles.footer_text, styles.footer_title]}>Services:</Text>
                            </View>
                            <View style={[styles.footer_right, {marginTop: 13}]}>
                            {data.services.map((ser,index) => (
                                <View key={index} >
                                {(ser == 0) && <Text style={styles.service_text}>Tooth extraction (100$)</Text>}
                                {(ser == 1) && <Text style={styles.service_text}>Fillings (50$)</Text>}
                                {(ser == 2) && <Text style={styles.service_text}>Dental implants (500$)</Text>}
                                </View>
                            ))} 
                            </View> 
                        </View>
                        <View style={styles.footer_component}>
                            <Text style={[styles.footer_text, styles.footer_left, styles.footer_title]}>Date:</Text>
                            <Text style={[styles.footer_text, styles.footer_right]}>{data.date}</Text>
                        </View>
                        <View style={styles.footer_component}>
                            <Text style={[styles.footer_text, styles.footer_left, styles.footer_title]} >Time:</Text>
                            <Text style={[styles.footer_text, styles.footer_right]} >{data.begin}:00</Text>
                        </View>
                        <View style={styles.footer_component}>
                            <Text style={[styles.footer_text, styles.footer_left, styles.footer_title]} >Total:</Text>
                            <Text style={[styles.footer_text, styles.footer_right]} >{total}$</Text>
                        </View>
                    </View>
                    <View>
                        <TouchableOpacity onPress={handleCheckOut}>
                            <View style={styles.button}>
                                <LinearGradient
                                    colors={['#99ffff', '#80ffff']}
                                    style={styles.make}
                                >
                                    <Text style={styles.make_text}>Confirm</Text>
                                </LinearGradient>
                            </View>
                        </TouchableOpacity> 
                    </View>
                </ScrollView>
            </View>
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
        // width: '100%',
        backgroundColor: 'white',
        flex: 1.1,
        paddingHorizontal: 20,
        paddingTop: 15
    },
    footer: {
        paddingHorizontal: 20,
        flex: 2,
        backgroundColor: 'white',
        marginTop: 20
    },
    doctorLogo: {
        marginTop: 10,
        width: 170,
        height: 165,
        borderRadius: 5,
        resizeMode: 'stretch',
    },
    doctorInfor: {
        width: '55%',
        justifyContent: 'center',
        alignItems: 'center'
    },
    doctorInfor_text: {
        fontWeight: '500',
        fontSize: 15,
        marginTop: 10,
    },
    footer_header: {
        backgroundColor: "white",
        padding: 20
    },
    footer_component:{
        flexDirection: 'row'
    },  
    footer_text: {
        fontSize: 17,
        marginTop: 14
    },
    service_text:{
        textAlign: 'right',
        fontSize: 14,
        marginTop: 3
    },
    footer_left: {
        width: '44%'
    },
    footer_right:{
        width: '56%',
        textAlign: 'right'      
    },
    footer_title: {
        color: 'black',
        fontWeight: '500',
        fontSize: 16
    },
    make: {
        borderColor: '#00bfff',
        justifyContent: 'center',
        alignItems: 'center',
        height: 50,
        width: '70%',
        borderRadius: 10,
        marginVertical: 25
    },
    make_text: {
        color: 'rgba(0, 0, 0, 0.7)',
        fontWeight: 'bold',
        fontSize: 16,
    },
    button: {
        alignItems: 'center',
    }
})