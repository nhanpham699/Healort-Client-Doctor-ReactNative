import React, { useEffect, useState } from 'react'
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Button,    
    Alert,
    ScrollView,
    TextInput
} from 'react-native'
import { Ionicons,  FontAwesome } from '@expo/vector-icons'; 
import { LinearGradient } from 'expo-linear-gradient'
import {Calendar, CalendarList, Agenda} from 'react-native-calendars';
import axios from 'axios';
import host from '../../host';
import { useSelector } from 'react-redux'



export default function BusyDoctor({navigation}) {

    const { doctor } = useSelector(state => state.doctors)
    const [markedDates, setMarkedDates] = useState({})
    const [dayArr, setDayArr] = useState([])
    const [dayCheck, setDayCheck] = useState([])
    const [reasonText, setReasonText] = useState('')
    const [schedules, setSchedules] = useState([])
    const [reexams, setReexams] = useState([])
    
    const handleDay = (day) => {

        
        const index = dayArr.indexOf(day.dateString)
        const obj = {...markedDates}

        if( schedules.indexOf(day.dateString) != -1 || 
            dayCheck.indexOf(day.dateString) != -1 ||
            reexams.indexOf(day.dateString) != -1 ) {
                 return
        }
    
        
        if(index === -1) {
            obj[day.dateString] = {color: '#333333', textColor: 'white', check: true} 
            setDayArr([...dayArr, day.dateString])
            setMarkedDates(obj)
        }else{
            setDayArr([...dayArr.slice(0, index), ...dayArr.slice(index+1)])
            delete obj[day.dateString] 
            setMarkedDates(obj)
        }
    }

   

    const checkDate = (obj, olddates) => {

        for(let a of olddates){
            obj[a] = {color: '#d9e1e8', textColor: 'black', check: false}
        }
        return obj
    }



    const make = async() => {
        const res = {
            dates: dayArr.map(dt => new Date(dt)),
            reason: reasonText,
            doctorId: doctor.id
        }
         
        await axios.post(host + '/absences/add', res)
        .then(() => {
            navigation.goBack()
        })
        
    }

    const getAllSchedules = async() => {
        const res = await axios.get(host + '/schedules/getallbydoctor/' + doctor.id)
        const newData = res.data.map(dt => dt.date.slice(0,10))
        setSchedules(newData)
        await getAllReexams(checkDate({}, newData))

    }

    const getAllReexams = async(check) => {
        const res = await axios.get(host + '/reexams/getallreexamsbydoctor/' + doctor.id)
        const newData = res.data.map(dt => dt.date.slice(0,10))
        setReexams(newData)
        await getAllAbsences(checkDate(check, newData))


    }

    const getAllAbsences = async(check) => {
        const res = await axios.get(host + '/absences/getallabsences/' + doctor.id)
        const newData = res.data.map(dt => dt.dates)
        const arr = []
        for(let i of newData){
            for(let j of i){
                arr.push(j)
            }
        }
        const finalData = arr.map(dt => dt.slice(0,10))
        setDayCheck(finalData)
        setMarkedDates(checkDate(check, finalData))

    }
    
    

    useEffect(() => {
       getAllSchedules()
    },[])

    return(
        <View style={styles.container}>
             <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                <Ionicons style={styles.back} name="arrow-back" size={24} color="black" />
                </TouchableOpacity>
                <Text style={styles.headertext1}>Busy times</Text> 
            </View>
            <View>
            <Calendar
            markingType={'period'}
            markedDates={markedDates}
            style={{
                // borderWidth: 1,
                marginVertical: 20,
                borderColor: 'gray',
                height: 350
            }}
            // Specify theme properties to override specific styles for calendar parts. Default = {}
            theme={{
                backgroundColor: '#ffffff',
                calendarBackground: '#ffffff',
                textSectionTitleColor: '#b6c1cd',
                textSectionTitleDisabledColor: '#d9e1e8',
                selectedDayBackgroundColor: '#00adf5',
                selectedDayTextColor: '#ffffff',
                todayTextColor: '#00adf5',
                dayTextColor: '#2d4150',
                textDisabledColor: '#d9e1e8',
                dotColor: '#00adf5',
                selectedDotColor: '#ffffff',
                arrowColor: 'orange',
                disabledArrowColor: '#d9e1e8',
                monthTextColor: 'blue',
                indicatorColor: 'blue',
                textDayFontWeight: '300',
                textMonthFontWeight: 'bold',
                textDayHeaderFontWeight: '300',
                textDayFontSize: 16,
                textMonthFontSize: 16,
                textDayHeaderFontSize: 16
            }}
            onDayPress={(day) => handleDay(day)}
            />
            </View>
            <View style={styles.footer}>
                <View style={{marginTop: 20}}>
                    <Text style={{
                        fontSize: 16, 
                        color: 'gray', 
                        fontWeight: '500', 
                        marginLeft: 10
                        }}> Reason </Text>
                    <View style={styles.reason}>
                        <TextInput 
                        style={styles.reasontext} 
                        defaultValue={reasonText}
                        onChangeText={value => setReasonText(value)} />
                    </View>
                </View>
                <TouchableOpacity onPress={make}>
                    <View style={styles.button}>
                        <LinearGradient
                            colors={['#CECCF5','#0970BE']}
                            style={styles.make}
                        >
                            <Text style={styles.make_text}>Confirm</Text>
                        </LinearGradient>
                    </View>
                </TouchableOpacity> 
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
    make: {
        borderColor: '#00bfff',
        justifyContent: 'center',
        alignItems: 'center',
        height: 40,
        width: '40%',
        borderRadius: 10,
        marginBottom: 40
    },
    make_text: {
        color: 'rgba(0, 0, 0, 0.7)',
        fontWeight: 'bold',
        fontSize: 16,
    },
    button: {
        marginVertical: 40,
        alignItems: 'center'
    },
    footer: {
        flex: 1,
        backgroundColor: 'white'
    },
    reasontext: {
        width: 250,
        height: 40,
        borderRadius: 6,
        marginLeft: 17,
        marginTop: 10,
        backgroundColor: '#f2f2f2',
        paddingLeft: 10
    },
})