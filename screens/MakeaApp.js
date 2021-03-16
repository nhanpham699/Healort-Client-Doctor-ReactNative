import React, {useEffect, useState} from 'react'

import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    StatusBar,
    TextInput,
    ScrollView,
    FlatList
} from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { FontAwesome, AntDesign, Feather } from '@expo/vector-icons'; 
import RNPickerSelect from "react-native-picker-select";
import { Ionicons } from '@expo/vector-icons'; 
import CheckBox from 'react-native-check-box'
import host from '../host'
import axios from 'axios'
import {useSelector} from 'react-redux'

// Schedules Data


console.log(schedulesData);
//Date Data
const date = new Date();
let DATE_DATA = []

for(var i = 0; i<= 14; i++){
    var nextDate = new Date(date);
    nextDate.setDate(date.getDate() + i);
    DATE_DATA.push({id: i.toString(), title: nextDate.getDate() + '-' + (nextDate.getMonth() + 1), value: nextDate})
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
        value: 8
    },
    {
        id: '2',
        title: '9:00',
        value: 9
    },
    {
        id: '3',
        title: '10:00',
        value: 10
    },
    {
        id: '4',
        title: '11:00',
        value: 11
    },
    {
        id: '5',
        title: '12:00',
        value: 12
    },
    {
        id: '6',
        title: '13:00',
        value: 13
    },
    {
        id: '7',
        title: '14:00',
        value: 14
    },
    {
        id: '8',
        title: '15:00',
        value: 15
    },
    {
        id: '9',
        title: '16:00',
        value: 16
    },
    {
        id: '10',
        title: '17:00',
        value: 17
    }
];
// Hour Item
const HourItem = ({ item, onPress, style }) => (
    <TouchableOpacity onPress={onPress} style={[styles.item, style]}>
      <Text style={styles.title}>{item.title}</Text>
    </TouchableOpacity>
);



export default function MakeaApp() {
    const { user } = useSelector(state => state.users)
    const [selectedHourId, setSelectedHourId] = useState(null);
    const [selectedDateId, setSelectedDateId] = useState(null);
    const [data, setData] = useState({
        date: null,
        begin: 0,
        services: [],
        doctorId: null,
        note: null,
        userId: user.id
    })    
    const [doctors, setDoctors] = useState([])
    const [schedules, setSchedules] = useState([])


    const getDate = (item) => {
        setData({...data, date : item.value})
        setSelectedDateId(item.id)
    }

    const renderDateItem = ({ item }) => {
        // console.log(schedules);
        const backgroundColor = item.id === selectedDateId ? "#00e6e6" : '#e6ffff';
        return (
            <DateItem
            item={item}
            onPress={() => getDate(item)}
            style={{ backgroundColor }}/>
        );
    };
    // Hour
    const getHour = (item) => {
        setData({...data, begin : item.value})
        setSelectedHourId(item.id)
    }

    const renderHourItem = ({ item }) => {
        const backgroundColor = item.id === selectedHourId ? "#00e6e6" : '#e6ffff';
        return (
            <HourItem
            item={item}
            onPress={() => getHour(item)}
            style={{ backgroundColor }}/>
        );
    };
    //
    const [isChecked, setIsChecked] = useState({
        first : false,
        second : false,
        third : false
    })

    useEffect(() => {

        axios.get(host + '/doctors/getalldoctors')
        .then(res => {
            const data = res.data.map( dt=> {
                return {label : 'Doctor ' + dt.fullname ,value: dt._id }
            })
            setDoctors(data)
        })
    },[])

    const make = () => {
        let end = data.begin
        if(data.services.indexOf(0) != -1)
            end += 0.5
        if(data.services.indexOf(1) != -1)
            end += 1
        if(data.services.indexOf(2) != -1)
            end += 2
        
        const response = {...data, end: end}
        axios.post(host + '/schedules/add', response)
        .then(()=> {
            alert('Make an appointment successfully!')
        })
    }

    return(
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" />
            <View style={styles.header}>
                <Ionicons style={styles.back} name="arrow-back" size={24} color="black" />
                <Text style={styles.headertext1}>Make an appointment</Text> 
            </View>
            <View style={styles.content}>
                <Text style={styles.choose}>Choose Date/Hours of examination</Text>
                <Text style={styles.radiotitle}>DATE</Text>
                <View style={styles.flatlist}>
                    <FlatList
                        contentContainerStyle={{alignSelf: 'flex-start'}}
                        showsHorizontalScrollIndicator={false}
                        data={DATE_DATA}
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
                        data={HOUR_DATA}
                        renderItem={renderHourItem}
                        keyExtractor={(item) => item.id}
                        extraData={selectedHourId}
                        horizontal={true}
                    />
                </View>  
            </View>
            <ScrollView style={styles.footer}>
                <Text style={styles.choose}>Choose services</Text>  
                <View style={styles.checkboxs}>
                    <CheckBox
                        onClick={()=>{
                            const index = data.services.indexOf(0)
                            if(index >= 0)
                                setData({...data, services: [...data.services.slice(0,index), ...data.services.slice(index+1)]})
                            else
                                setData({...data, services: [...data.services, 0]})
                            setIsChecked({...isChecked, first : !isChecked.first})
                        }}
                        isChecked={isChecked.first}
                        leftText={"Tooth extraction (30 minutes)"}
                    />
                    <CheckBox
                        onClick ={()=>{
                            const index = data.services.indexOf(1)
                            if(index >= 0) 
                                setData({...data, services: [...data.services.slice(0,index), ...data.services.slice(index+1)]})
                            else
                                setData({...data, services: [...data.services, 1]})
                            setIsChecked({...isChecked, second : !isChecked.second})
                        }}
                        isChecked={isChecked.second}
                        leftText={"Fillings (1 hours)"}
                    />
                    <CheckBox
                        onClick={()=>{
                            const index = data.services.indexOf(2)
                            if(index >= 0) 
                                setData({...data, services: [...data.services.slice(0,index), ...data.services.slice(index+1)]})
                            else
                                setData({...data, services: [...data.services, 2]})
                            setIsChecked({...isChecked, third : !isChecked.third})
                        }}
                        isChecked={isChecked.third}
                        leftText={"Dental implants (2 hours)"}
                    />
                </View>
                <Text style={[styles.choose, {marginTop: 30}]}>Choose Doctors</Text>  
                <View style={{flexDirection: 'row'}}> 
                    <RNPickerSelect
                    onValueChange={(value) => setData({...data, doctorId: value})}
                    items={doctors}
                    style={pickerSelectStyles} />       
                    <AntDesign style={styles.iconDown} name="down" size={20} color="gray" />     
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
        marginRight: 25,
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
        flex: 0.7
    },
    footer:{
        backgroundColor: 'white',
        marginTop: 20, 
        flex: 2
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

const pickerSelectStyles = StyleSheet.create({
    inputIOS: {
        width: 367,
        height: 40,
        borderRadius: 6,
        marginLeft: 20,
        marginTop: 10,
        backgroundColor: '#f2f2f2',
        paddingLeft: 10
    },
    inputAndroid: {
        width: 367,
        height: 40,
        borderRadius: 6,
        marginLeft: 20,
        marginTop: 10,
        backgroundColor: '#f2f2f2',
        paddingLeft: 10
    },
});