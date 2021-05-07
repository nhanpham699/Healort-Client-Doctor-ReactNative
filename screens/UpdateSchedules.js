import React, {useEffect, useState} from 'react'

import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    StatusBar,
    TextInput,
    ScrollView,
    FlatList,
    Alert,
    KeyboardAvoidingView,
} from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { NavigationActions } from 'react-navigation';

import { Ionicons } from '@expo/vector-icons'; 
import host from '../host'
import axios from 'axios'
import { addNotif } from '../actions/notification';
import {useDispatch} from 'react-redux'

// Schedules Data


//Date Data
const date = new Date();
let DATE_DATA = []

for(var i = 0; i<= 14; i++){
    var nextDate = new Date(date);
    nextDate.setDate(date.getDate() + i);
    DATE_DATA.push({id: i.toString(), title: nextDate.getDate() + '-' + (nextDate.getMonth() + 1), value: nextDate, state: true})
}
//Date Item
const DateItem = ({ item, onPress, style }) => (
    <TouchableOpacity onPress={onPress} style={[styles.item, style]}>
      <Text style={styles.title}>{item.title}</Text>
    </TouchableOpacity>
)




// Hour Data
const HOUR_DATA = [
    {
        id: '1',
        title: '8:00',
        value: 8,
        state: true
    },
    {
        id: '2',
        title: '10:00',
        value: 10,
        state: true
    },
    {
        id: '3',
        title: '12:00',
        value: 12,
        state: true
    },
    {
        id: '4',
        title: '14:00',
        value: 14,
        state: true
    },
    {
        id: '5',
        title: '16:00',
        value: 16,
        state: true
    },
];
// Hour Item
const HourItem = ({ item, onPress, style }) => (
    <TouchableOpacity onPress={onPress} style={[styles.item, style]}>
      <Text style={styles.title}>{item.title}</Text>
    </TouchableOpacity>
);



export default function UpdateSchedules({navigation,route}) {
    
    const dispatch = useDispatch()
    const { id, user, doctorName, doctorId, actor, component, notifId } = route.params
    const [dateArr, setDateArr] = useState(DATE_DATA)
    const [hourArr, setHourArr] = useState(HOUR_DATA)
    const [schedules, setSchedules] = useState([])
    const [reexams, setReexams] = useState([])
    const [selectedHourId, setSelectedHourId] = useState(null);
    const [selectedDateId, setSelectedDateId] = useState(null);
    const [data, setData] = useState({
        date: null,
        begin: 0,
        id : id        
    })    


    const renderDateItem = ({ item }) => {
        
        let currentColor = null
        if(!item.state){
            currentColor = '#e6e6e6'
        }else{
            currentColor = '#e6ffff'
        }

        const backgroundColor = item.id === selectedDateId ? "#00e6e6" : currentColor;
        return (
            <DateItem
            key={item.id}
            item={item}
            onPress={item.state ? () => getDate(item) : null}
            style={{ backgroundColor }}/>
        );
    };

    const renderHourItem = ({ item }) => {
        // console.log('----------------', hourArr);
        let currentColor = null
        if(!item.state){
            currentColor = '#e6e6e6'
        }else{
            currentColor = '#e6ffff'
        }

        const backgroundColor = item.id === selectedHourId ? "#00e6e6" : currentColor;
        return (
            <HourItem
            key={item.id}
            item={item}
            onPress={item.state ? (() => getHour(item)) : null}
            style={{ backgroundColor }}/>
        );
    };
    
    const handleCheckDate = (schedule, reexam, absence) => {
        setDateArr(DATE_DATA)
        let arr = DATE_DATA
        let repeat = []
        // console.log("aaaaaaaaaaaaaaaa", absence);
        const absenceArr = absence.filter(dt => {
            // console.log(dt.doctorId._id, doctorId);
            return dt.doctorId._id == doctorId 
        })

        // console.log(absenceArr)

        for (let i = 0; i < dateArr.length; i++){
            for(var a of absenceArr){
                const b = a.dates.map(dt => { return (new Date(dt).toString().slice(0,15)) })
                const c = (new Date(dateArr[i].value)).toString().slice(0,15)
                // console.log(b,c);
                if( b.indexOf(c) != -1 ){
                    arr = [
                        ...arr.slice(0,i), 
                        {id: i.toString(), value: dateArr[i].value , title: dateArr[i].title, state: false}, 
                        ...arr.slice(i+1)
                    ]
                }
            }
        }    
    
        const scheduleArr = schedule.filter(dt => {
            return dt.doctorId._id == doctorId && dt.status == 0
        })

        const reexamArr = reexam.filter(dt => {
            return dt.doctorId._id == doctorId && dt.status == 0
        })

        for(let re of reexamArr){
            scheduleArr.push(re)
        }

        for(let sch of scheduleArr){
            for (let i = 0; i<dateArr.length; i++){
                if(new Date(sch.date).toString().slice(0,15) == dateArr[i].value.toString().slice(0,15)){        
                    if(repeat.find(e => e.date == dateArr[i].value && e.re+1 == 5)){
                        arr = [
                            ...arr.slice(0,i), 
                            {id: i.toString(), value: dateArr[i].value , title: dateArr[i].title, state: false}, 
                            ...arr.slice(i+1)
                        ]
                        break
                    }else{
                        let flag = false
                        let index = 0
                        for (var j=0 ; j<repeat.length; j++){
                            if(repeat[j].date == dateArr[i].value){
                                flag = true
                                index = j
                                break
                            }
                        }
                        if(flag){
                            repeat = [
                                ...repeat.slice(0,index), 
                                {date: dateArr[i].value, re: ++repeat[index].re}, 
                                ...repeat.slice(index+1)
                            ] 
                        }else{
                            repeat.push({date: dateArr[i].value, re: 1})
                        }
                    }   
                }
            }
        }
        setDateArr(arr)       
        setHourArr(HOUR_DATA)
    }

    

    const getDate = (item) => {
        setHourArr(HOUR_DATA)
            let arr = HOUR_DATA
            const scheduleArr = schedules.filter(dt => {
                return dt.doctorId._id == doctorId && dt.status == 0
            })
            for(let re of reexams){
                scheduleArr.push(re)
            }
            setSelectedDateId(item.id)
            setSelectedHourId(null)
            setData({...data, date: item.value, begin: 0})
            for(let sch of scheduleArr) {
                 if(new Date(sch.date).toString().slice(0,15) == item.value.toString().slice(0,15)){
                    for(var i=0 ; i< hourArr.length;i++){ 
                        if(sch.begin == hourArr[i].value){
                            arr = [
                                ...arr.slice(0,i), 
                                {id: i+1, value: sch.begin, title: sch.begin+':00', state: false}, 
                                ...arr.slice(i+1)
                            ]
                            setHourArr(arr)
                        }                        
                    }
                 }
            }
    }       
    // Hour
    const getHour = (item) => {
        if(!data.date){
            alert("you haven't chosen a date yet!")
        }else{
            setData({...data, begin : item.value})
            setSelectedHourId(item.id)             
        }
    }

    useEffect(() => {
        axios.get(host + '/schedules/getallschedules/')
        .then(res1 => {
            axios.get(host + '/reexams/getallreexams/')
            .then(res2 => {
                axios.get(host + '/absences/getallabsences')
                .then(res3 => {
                    setReexams(res2.data)
                    setSchedules(res1.data)
                    handleCheckDate(res1.data, res2.data, res3.data)
                })
               
            })  

        })        
    },[])

    const handleUpdate = () => {
        
        if(!data.date || !data.begin ){
            alert("Update failed!!")
        }else{
            Alert.alert(
                "Updated",
                "successfully",
                [
                  {
                    text: "oke",
                    onPress: async() =>  {
                        if(actor == 'doctor'){
                            const dataSaved = {
                                sender: 'doctor',
                                userId : user._id,
                                doctorId: doctorId,
                                scheduleId: id,
                                title: 'Update the schedule',
                                body: 'Doctor' + doctorName + ' want to update your schedule!',
                                status : 0,
                                date: new Date()
                            }
                            await axios.post(host + '/schedules/confirmation', data)
                            for(var token of user.tokens){
                                await sendPushNotification(token.tokenDevices, actor, doctorName);
                            }
                            await axios.post(host + '/notifications/add', dataSaved)
                            navigation.pop(1)
                            navigation.replace("DoctorSchedule")
                        }else if(actor == 'user'){
                            await axios.post(host + '/schedules/update', data)
                            .then(async(res) => {
                                const doctor = res.data.doctorId
                                const user = res.data.userId
                                    const dataSaved = {
                                        sender: 'user',
                                        userId : user._id,
                                        doctorId: doctor._id,
                                        title: 'Update the schedule',
                                        body: user.fullname + ' updated the schedule! Please check your schedule',
                                        date: new Date()
                                    }
                                    for(var token of doctor.tokens){
                                        await sendPushNotification(token.tokenDevices, actor, user.fullname);
                                    }
                                    await axios.post(host + '/notifications/update', {id : notifId})
                                    await axios.post(host + '/notifications/add', dataSaved)
                                    if(component == 'notification'){
                                        const res = await axios.get(host + '/notifications/getnotificationsbyuser/' + user._id)
                                        const newData = res.data.filter(dt => dt.sender == "doctor")
                                        await dispatch(addNotif(newData))
                                        navigation.goBack()

                                    }else{
                                        navigation.pop(1)
                                        navigation.replace("Schedule")
                                    }
                            })
                        }
                    },
                    style: "cancel",
                  },
                ],
            );                                                            
        }
        
    }

    async function sendPushNotification(expoPushToken, actor, name) {

        let message = {}

        if(actor == "user"){
            message = {
                to: expoPushToken,
                sound: 'default',
                title: 'Update the schedule',
                body: name + ' updated the schedule! Please check your schedule',
                data: { someData: 'goes here' },
              };
        }else if(actor == "doctor"){
            message = {
                to: expoPushToken,
                sound: 'default',
                title: 'Update the schedule',
                body: 'Doctor '+ name +' want to update your schedule!',
                data: { someData: 'goes here' },
              };
        }
        

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

    return(
        <KeyboardAvoidingView style={{flex:1}} behavior="padding">
            <View style={styles.container}>
                <StatusBar barStyle="dark-content" />
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <Ionicons style={styles.back} name="arrow-back" size={24} color="black" />
                    </TouchableOpacity>
                    <Text style={styles.headertext1}>Update schedules</Text> 
                </View>
                <ScrollView>
                    <View style={styles.content}>
                        <Text style={styles.choose}>Doctor: {doctorName} </Text>  
                        <Text style={[styles.choose, {marginTop: 35}]}>Choose Date/Hours of examination</Text>
                        <Text style={styles.radiotitle}>DATE</Text>
                        <View style={styles.flatlist}>
                            <FlatList
                                contentContainerStyle={{alignSelf: 'flex-start'}}
                                showsHorizontalScrollIndicator={false}
                                data={dateArr}
                                renderItem={renderDateItem}
                                keyExtractor={(item) => item.id}
                                extraData={selectedDateId}
                                horizontal={true}
                            />
                        </View> 
                        <Text style={[styles.radiotitle, {marginTop: 20}]}>HOURS</Text>
                        <View style={styles.flatlist}>
                            <FlatList
                                contentContainerStyle={{alignSelf: 'flex-start'}}
                                showsHorizontalScrollIndicator={false}
                                data={hourArr}
                                renderItem={renderHourItem}
                                // keyExtractor={(item) => item.id}
                                keyExtractor={(item, index) => index.toString()}
                                extraData={selectedHourId}
                                horizontal={true}
                            />
                        </View>  
                        <TouchableOpacity onPress={handleUpdate}>
                            <View style={styles.button}>
                                <LinearGradient
                                    colors={['#99ffff', '#80ffff']}
                                    style={styles.make}
                                >
                                    <Text style={styles.make_text}>Update</Text>
                                </LinearGradient>
                            </View>
                        </TouchableOpacity> 
                    </View> 
                </ScrollView>
            </View>
        </KeyboardAvoidingView>
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
        backgroundColor: 'white',
        marginTop: 20,
        height: 650
    },
    choose:{
        fontSize: 16,
        fontWeight: '500',
        marginLeft: 15,
        marginTop: 20
    },
    radiotitle:{
        fontSize: 16,
        marginLeft: 15,
        marginTop: 30,
        color: 'gray'
    },
    iconDown: {
        position: 'relative',
        right: 30,
        top: 20
    },
    make: {
        borderColor: '#00bfff',
        justifyContent: 'center',
        alignItems: 'center',
        height: 40,
        width: '40%',
        borderRadius: 10,
        marginTop: 20
    },
    make_text: {
        color: 'rgba(0, 0, 0, 0.7)',
        fontWeight: 'bold',
        fontSize: 15,
    },
    button: {
        alignItems: 'center',
        marginTop: 30
    },
    checkboxs: {
        paddingHorizontal: 30,
        marginTop: 10
    },
    text_input: {
        height: 40,
        borderRadius: 6,
        marginLeft: 5,
        marginTop: 10,
        backgroundColor: '#f2f2f2',
    },
    flatlist: {
        marginTop: StatusBar.currentHeight || 0,
        marginLeft: 5,
        marginTop: 10,
    },
    item: {
        padding: 10,
        marginLeft: 5,
        borderRadius: 10
    },
    title: {
        fontSize: 14,
    },
})

