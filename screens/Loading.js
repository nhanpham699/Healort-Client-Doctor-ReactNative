import React, {useEffect, useState} from 'react';
import {ActivityIndicator, View, AsyncStorage} from 'react-native'
import {addUser} from '../actions/user'
import {useDispatch} from 'react-redux'
import host from '../host'
import axios from 'axios'

export default function Loading({navigation}) {
    const dispatch = useDispatch()

    const changePage = async () => {
       
        const token = await AsyncStorage.getItem('token')
        if(token){
            await axios.get(host + '/users/getuser', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }).then(async (res) => {
                await dispatch(addUser(res.data.dataSending))
                navigation.replace('Home')
            })
        }else{
            navigation.replace('Opening')
        } 
    }
    
    useEffect(() => {
        setTimeout(() => {
            changePage()
        },5000)
    },[])


    return(
        <View style={{flex:1, justifyContent:'center', alignItems:'center'}}>
            <ActivityIndicator size="large" />
        </View>
    )
    
}