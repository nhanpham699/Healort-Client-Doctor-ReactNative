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
// import { LinearGradient } from 'expo-linear-gradient'
import host from '../../host'
import { List } from 'react-native-paper';
import axios from 'axios';
import {useSelector} from 'react-redux'


export default function Patient({navigation}) {
    const { doctor } = useSelector(state => state.doctors)

    const [data, setData] = useState([])

    useEffect(() => {
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
                <Text style={styles.headertext1}>My Patient</Text> 
            </View>
            <ScrollView style={{backgroundColor: 'white', flex: 1, marginTop: 20}}>
              <List.Section>
                {data.map((sch) => (
                  <List.Accordion
                    key={sch._id}
                    title={sch.userId.fullname}
                    left={props => <List.Icon {...props} icon="account-circle" />}
                    >
                    <List.Item style={{marginTop: -10}} title={'Date: ' + (new Date(sch.date)).toString().slice(0,15) + ':00'} />
                    <List.Item style={{marginTop: -10}} title={'Time: ' + sch.begin + ':00'} />
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