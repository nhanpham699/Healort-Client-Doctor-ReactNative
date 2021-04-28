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
import { Ionicons } from '@expo/vector-icons'; 
import CheckBox from 'react-native-check-box'
import host from '../../host'
import axios from 'axios'
import {useSelector} from 'react-redux'
import DoctorCarousel from '../../components/DoctorCarousel'


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



export default function ReExam({navigation, route}) {

    const { doctor, userId, scheduleId } = route.params 
    const [dateArr, setDateArr] = useState(DATE_DATA)
    const [hourArr, setHourArr] = useState(HOUR_DATA)
    const [schedules, setSchedules] = useState([])
    const [selectedHourId, setSelectedHourId] = useState(null);
    const [selectedDateId, setSelectedDateId] = useState(null);
    const [data, setData] = useState({
        date: null,
        begin: 0,
        total: 0,
        doctorId: doctor._id,
        scheduleId: scheduleId,
        note: null,
        userId: userId,
        status: 0,
        times: null
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
    
    const handleCheckDate = (schedule) => {
        setDateArr(DATE_DATA)
        let arr = DATE_DATA
        let repeat = []

        const scheduleArr = schedule.filter(dt => {
            return dt.doctorId._id == doctor._id && dt.status == 0
        })

        for(let sch of scheduleArr){
            for (let i = 0; i<dateArr.length; i++){
                if(new Date(sch.date).toString().slice(0,15) == dateArr[i].value.toString().slice(0,15)){        
                    if(repeat.find(e => e.date == dateArr[i].value && e.re+1 == 5)){
                        arr = [
                            ...arr.slice(0,i), 
                            {id: i.toString(), value: dateArr[i].value , title: dateArr[i].title, state: false}, 
                            ...arr.slice(i+1)
                        ]
                        setDateArr(arr)
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
                            console.log(repeat);         
                        }else{
                            repeat.push({date: dateArr[i].value, re: 1})
                        }
                    }   
                }
            }
        }       
        setHourArr(HOUR_DATA)
    }


    

    const getDate = (item) => {
        setHourArr(HOUR_DATA)
        if(!data.doctorId){
            alert("please choose a doctor!")
        }else{
            let arr = HOUR_DATA
            const scheduleArr = schedules.filter(dt => {
                return dt.doctorId._id == data.doctorId && dt.status == 0
            })
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
                            break
                        }                        
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
            setData({...data, begin : item.value })
            setSelectedHourId(item.id)             
        }
    }

    useEffect(() => {

        axios.get(host + '/schedules/getallschedules/')
        .then(res => {
            setSchedules(res.data)
            handleCheckDate(res.data)
        })         

    },[])

    const make = async() => {
        
        if(!data.date || !data.doctorId || !data.begin || !data.note){
            alert("Make an appointment failed!!")
        }else{
            const newData = {
                ...data,
                total: Number(data.total),
                times: Number(data.times)
            }
            await axios.post(host + '/reexams/add', newData)
            .then(async() => {
                await axios.post(host + '/schedules/updateReexam', {id: data.scheduleId})
                Alert.alert(
                    "Successfully",
                    "Make an appointment succussfully",
                    [
                      { text: "OK", onPress: () => {
                            navigation.pop(1)
                            navigation.replace('DoctorSchedule')
                        }}
                    ]
                );
            })                              
        }
        
    }

   
    

    return(
        <KeyboardAvoidingView style={{flex:1}} behavior="padding">
            <View style={styles.container}>
                <StatusBar barStyle="dark-content" />
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <Ionicons style={styles.back} name="arrow-back" size={24} color="black" />
                    </TouchableOpacity>
                    <Text style={styles.headertext1}>Re-Examination</Text> 
                </View>
                <ScrollView>
                    <View style={styles.content}>
                        <Text style={styles.choose}>Doctor {doctor.fullname}</Text>  
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
                    </View>
                    <View style={styles.footer}>
                        <View>
                            <Text style={styles.choose}>Examination time</Text>
                            <View style={{paddingHorizontal: 15}}>
                                <TextInput 
                                placeholder="   time" 
                                style={styles.text_input} 
                                autoCapitalize="none"
                                onChangeText={value => setData({...data, times: value})} />
                            </View>
                        </View>
                        <View>
                            <Text style={styles.choose}>Price total</Text>
                            <View style={{paddingHorizontal: 15}}>
                                <TextInput 
                                placeholder="   price" 
                                style={styles.text_input} 
                                autoCapitalize="none"
                                onChangeText={value => setData({...data, price: value})} />
                            </View>
                        </View>
                        <View>
                            <Text style={styles.choose}>Note</Text>
                            <View style={{paddingHorizontal: 15}}>
                                <TextInput 
                                // defaultValue={user.phone}
                                placeholder="   Your note" 
                                style={styles.text_input} 
                                autoCapitalize="none"
                                onChangeText={value => setData({...data, note: value})} />
                            </View>
                        </View>
                        <TouchableOpacity onPress={make}>
                            <View style={styles.button}>
                                <LinearGradient
                                    colors={['#99ffff', '#80ffff']}
                                    style={styles.make}
                                >
                                    <Text style={styles.make_text}>Make an appointment</Text>
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
        height: 270
    },
    footer:{
        backgroundColor: 'white',
        marginTop: 20, 
        height: 360
    },  
    choose:{
        fontSize: 17,
        fontWeight: '600',
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
        height: 50,
        width: '80%',
        borderRadius: 10,
        marginBottom: 40
    },
    make_text: {
        color: 'rgba(0, 0, 0, 0.7)',
        fontWeight: 'bold',
        fontSize: 16,
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
