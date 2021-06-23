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



export default function MakeaApp({navigation, route}) {

    const doctorId = route.params ? route.params.doctorId : null
    const { user } = useSelector(state => state.users)

    const [checked, setChecked] = useState([{
        serviceId: null,
        name: "",
        price: 0
    }])
    const [service, setService] = useState([])
    const [dateArr, setDateArr] = useState(DATE_DATA)
    const [hourArr, setHourArr] = useState(HOUR_DATA)
    const [schedules, setSchedules] = useState([])
    const [reexams, setReexams] = useState([])
    const [absences, setAbsences ] = useState([])
    const [selectedHourId, setSelectedHourId] = useState(null);
    const [selectedDateId, setSelectedDateId] = useState(null);
    const [data, setData] = useState({
        date: null,
        begin: 0,
        services: [],
        doctorId: doctorId,
        note: null,
        userId: user.id,
        status: 0
    })    

    const [doctorChecked, setDoctorChecked] = useState({
        id : doctorId,
        isChecked: doctorId ? true : false
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
    
    const chooseDoctor = (value) => {
        setDoctorChecked({
            id: value,
            isChecked: true
        })
        setDateArr(DATE_DATA)
        let arr = DATE_DATA
        let repeat = []

        const absenceArr = absences.filter(dt => {
            return dt.doctorId._id == value 
        })

        for (let i = 0; i < dateArr.length; i++){
            for(var a of absenceArr){
                const b = a.dates.map(dt => { return (new Date(dt).toString().slice(0,15)) })
                const c = (new Date(dateArr[i].value)).toString().slice(0,15)
                if( b.indexOf(c) != -1 ){
                    arr = [
                        ...arr.slice(0,i), 
                        {id: i.toString(), value: dateArr[i].value , title: dateArr[i].title, state: false}, 
                        ...arr.slice(i+1)
                    ]
                }
            }
        }        

        const scheduleArr = schedules.filter(dt => {
            return dt.doctorId._id == value && dt.status == 0
        })

        const reexamArr = reexams.filter(dt => {
            return dt.doctorId._id == value && dt.status == 0
        })

        for(let re of reexamArr){
            scheduleArr.push(re)
        }

        for(let sch of scheduleArr){
            for (let i = 0; i < dateArr.length; i++){
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
        setChecked([])
        setData({...data, date: null, begin: 0, services: [], doctorId: value})
        setSelectedDateId(null)
        setSelectedHourId(null)
    }

    

    const getDate = (item) => {
        setHourArr(HOUR_DATA)
        setChecked([])

        if(!data.doctorId){
            alert("please choose a doctor!")
        }else{
            let arr = HOUR_DATA
            const scheduleArr = schedules.filter(dt => {
                return dt.doctorId._id == data.doctorId && dt.status == 0
            })
            const reexamArr = reexams.filter(dt => {
                return dt.doctorId._id == data.doctorId && dt.status == 0
            })
    
            for(let re of reexamArr){
                scheduleArr.push(re)
            }
            setSelectedDateId(item.id)
            setSelectedHourId(null)
            setData({...data, date: item.value, begin: 0, services: []})
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

    const getAllAbsences = async() => {
        const res = await axios.get(host + '/absences/getallabsences')
        setAbsences(res.data)
    }

    // Hour
    const getHour = (item) => {
        setChecked([])

        if(!data.date){
            alert("you haven't chosen a date yet!")
        }else{
            setData({...data, begin : item.value, services: []})
            setSelectedHourId(item.id)             
        }
    }

    const getAllServices = async() => {
        const res = await axios.get(host + '/services/getallservices')
        setService(res.data)
    }

    useEffect(() => {
        axios.get(host + '/schedules/getallschedules')
        .then(res => {
            setSchedules(res.data)
        })        

        axios.get(host + '/reexams/getallreexams/')
        .then(res => {
            setReexams(res.data)
        })  
        getAllServices()
        getAllAbsences()    
    },[])

    const make = async() => {
        
        if(!data.date || !data.doctorId || !data.begin || !checked.length || !data.note){
            alert("Make an appointment failed!!")
        }else{
            const dataFilter = {...data, date: data.date.toString().slice(0,15), services: checked}
            navigation.navigate('Checkout', {data: dataFilter})                                                                
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
                    <Text style={styles.headertext1}>Make an appointment</Text> 
                </View>
                <ScrollView>
                    <View style={styles.content}>
                        <Text style={styles.choose}>Choose Doctors</Text>  
                        <DoctorCarousel onPress={chooseDoctor} doctorChecked={doctorChecked}/>
                        <Text style={[styles.choose, {marginTop: 20}]}>Choose Date/Hours of examination</Text>
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
                        <Text style={styles.choose}>Choose services</Text>  
                        <View style={styles.checkboxs}>
                            {service.map((ser,num) => (
                                <CheckBox
                                    key={num}
                                    onClick={()=>{
                                        if(data.begin){
                                        const currentIndex = checked.findIndex(x => x.serviceId == ser._id)
                                        const newChecked = [...checked]

                                        if(currentIndex === -1){
                                            newChecked.push({
                                                serviceId: ser._id,
                                                name: ser.name,
                                                price: ser.price
                                            })
                                        }else {
                                            newChecked.splice(currentIndex, 1)
                                        }
                                        // console.log(newChecked, num, currentIndex)
                                        setChecked(newChecked)
                                        }else alert("choose time please!")
                                    }}
                                    isChecked={ (checked.findIndex(x => x.serviceId == ser._id) != -1) ? true : false}
                                    leftText={ser.name + ' ' + '(' + ser.price + '$)'}
                                />
                            ))}
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
        height: 500
    },
    footer:{
        backgroundColor: 'white',
        marginTop: 20, 
        // flex: 2
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