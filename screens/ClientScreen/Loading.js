import React, {useEffect, useState} from 'react';
import {ActivityIndicator, View, AsyncStorage} from 'react-native'
import {addUser} from '../actions/user'
import {addDoctorInfor} from '../actions/doctor.infor'
import {useDispatch} from 'react-redux'
import host from '../host'
import axios from 'axios'

export default function Loading({navigation}) {
    const dispatch = useDispatch()

    const changePage = async () => {
       
        const UserToken = await AsyncStorage.getItem('UserToken')

        if(UserToken){
            await axios.get(host + '/users/getuser', {
                headers: {
                    Authorization: `Bearer ${UserToken}`,
                },
            }).then(async (res) => {
                const doctors = await axios.get(host + '/doctors/getalldoctors')
                await dispatch(addDoctorInfor(doctors.data))
                await dispatch(addUser(res.data.dataSending))
                navigation.replace('Home')
            })
        }else{
            navigation.replace('Login')
        }
    }
    
    useEffect(() => {
        setTimeout(() => {
            changePage()
        },3000)
    },[])


    return(
        <View style={{flex:1, justifyContent:'center', alignItems:'center'}}>
            <ActivityIndicator size="large" />
        </View>
    )
    
}