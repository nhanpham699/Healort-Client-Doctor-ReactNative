import React, {useState, useEffect} from 'react'
import {useSelector} from 'react-redux'
import {
    View,
    Text,
    StyleSheet,
    SafeAreaView,
    StatusBar,
    Button,
    Image,
    ScrollView,
    AsyncStorage,
    TouchableOpacity,
    KeyboardAvoidingView
} from 'react-native'
import { TextInput } from 'react-native-gesture-handler'
import { FontAwesome,Ionicons, AntDesign, Feather } from '@expo/vector-icons'; 
import * as ImagePicker from 'expo-image-picker';
import RNPickerSelect from "react-native-picker-select";
import axios from 'axios';
import host from '../../host';
import {addUser} from '../../actions/user'
import {useDispatch} from 'react-redux'
import { ModalDatePicker } from "react-native-material-date-picker";


export default function Profile({navigation}) {

    const dispatch = useDispatch()

    const [edit, setEdit] = useState(false)

    const [image, setImage] = useState(null);
    const [imageForm, setImageForm] = React.useState(null);
    
    const [province, setProvince] = useState([])
    const [district, setDistrict] = useState([])
    const [commune, setCommune] = useState([])

    
    

    const { user } = useSelector(state => state.users)
    
    // const refProvince = React.useRef()
    const refDistrict = React.useRef(null)
    const refCommue = React.useRef(null)


    const [dataUpdate, setDataUpdate] = useState({
        id: user.id,
        fullname: user.fullname,
        email: user.email,
        phone: user.phone,
        date: user.date,
        gender: user.gender,
        address: {
            city: user.address.city,
            district: user.address.district,
            ward: user.address.ward,
            street: user.address.street
        },
        avatar: user.avatar
    })
    


    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.All,
          allowsEditing: true,
          aspect: [4, 3],
          quality: 1,
        });
        
        if (!result.cancelled) {
          setImage(result.uri);
          setImageForm(result);
        }

    };
    

    useEffect(() => {
        // console.log(dataUpdate.gender + 'in uffect');
        (async () => {
          if (Platform.OS !== 'web') {
            const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (status !== 'granted') {
              alert('Sorry, we need camera roll permissions to make this work!');
            }
          }
        })();

        axios.get('https://thongtindoanhnghiep.co/api/city')
        .then(res => {
            let data = res.data.LtsItem
            data = data.map(dt => {
                return { 
                    'id': dt.ID,
                    'label' : dt.Title, 
                    'value' : dt.Title 
                }
            })
            data.pop()
            setProvince(data)
        })
    }, []);
   

    const changeCity = (val) => {
        console.log(typeof(dataUpdate.date) + ' in changecity');
        const provinceNow = province.filter(pro => { return pro.value == val })
        if(provinceNow.length){
            
            axios.get('https://thongtindoanhnghiep.co/api/city/' + provinceNow[0].id + '/district')
            .then(res => {
                let data = res.data.map(dt => {
                    return { 
                        'id': dt.ID,
                        'label' : dt.Title, 
                        'value' : dt.Title 
                    }
                })
                setDistrict(data)
                setDataUpdate({
                    ...dataUpdate,
                    address: {
                        ...dataUpdate.address,
                        city: val
                    }
                })
            })

            refDistrict.current.state.selectedItem = {label: 'Select an item...', value: null, color: "gray"}
            refCommue.current.state.selectedItem = {label: 'Select an item...', value: null, color: "gray"}
        }        
    }   

    const changeDistrict = (val) => {
        
        const districtNow = district.filter(dis => { return dis.value == val })

        if(districtNow.length){
            
            axios.get('https://thongtindoanhnghiep.co/api/district/' + districtNow[0].id + '/ward')
            .then(res => {
                let data = res.data.map(dt => {
                    return { 
                        'id': dt.ID,
                        'label' : dt.Title, 
                        'value' : dt.Title 
                    }
                })
                // console.log(data);
                setCommune(data)
                setDataUpdate({
                    ...dataUpdate,
                    address: {
                        ...dataUpdate.address,
                        district: val
                    }
                })
            })

            refCommue.current.state.selectedItem = {label: 'Select an item...', value: null, color: "gray"}
        }
    } 

    const hanldeEdit = () => {
        setEdit(!edit)
    }



    const save = () => {

        const formData = new FormData();

        if(imageForm){
           const localUri = imageForm.uri
           const filename = localUri.split('/').pop()
           const match = /\.(\w+)$/.exec(filename);
           const type = match ? `image/${match[1]}` : `image`;
           
           const dataPicture = JSON.parse(JSON.stringify({ uri: localUri, name: filename, type }));
           formData.append('photo', dataPicture);     
        }
        
        
        formData.append('id', dataUpdate.id)
        formData.append('fullname', dataUpdate.fullname)
        formData.append('email', dataUpdate.email)
        formData.append('phone', dataUpdate.phone)
        formData.append('date', dataUpdate.date.toString())
        formData.append('gender', dataUpdate.gender)
        formData.append('city', dataUpdate.address.city)
        formData.append('district', dataUpdate.address.district)
        if(dataUpdate.address.ward != null)
            formData.append('ward', dataUpdate.address.ward)
        else 
            formData.append('ward', user.address.ward)
        formData.append('street', dataUpdate.address.street)
        const config = { headers: { 'Content-Type': 'multipart/form-data' } };
        axios.post(host + '/users/update', formData, config)
        .then(async() => {
            const token = await AsyncStorage.getItem('UserToken')

            axios.get(host + '/users/getuser', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }).then(async (res) => {
                await dispatch(addUser(res.data.dataSending))
                setEdit(!edit)
            })
        })
    }


    return (
        <KeyboardAvoidingView style={{flex: 1}} behavior="padding">
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" />
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons style={styles.back} name="arrow-back" size={24} color="black" />
                </TouchableOpacity>
                <Text style={styles.headertext1}>Personal Information</Text>
                {!edit ? <TouchableOpacity onPress={hanldeEdit}>
                            <FontAwesome style={[styles.headertext2,{ fontSize:23, marginTop: 3 }]} name="pencil-square-o" />
                         </TouchableOpacity>
                       : <TouchableOpacity onPress={save}>
                            <Text style={styles.headertext2}>Save</Text> 
                         </TouchableOpacity> }
            </View>
            
            <View style={styles.content}>          
                {image ? <Image source={{ uri: image }} style={{ width: 80, height: 80, borderRadius: 50, marginLeft: 15, marginTop: 10 }} />
                       : <View> 
                            {dataUpdate.avatar ? <Image source={{uri : host + dataUpdate.avatar}} style={{ width: 80, height: 80, borderRadius: 50, marginLeft: 15, marginTop: 10 }} /> 
                            : <View style={styles.avatar}> 
                                 <FontAwesome name="user-circle-o" size={70} color="black" /> 
                              </View> } 
                         </View> }
                <View style={styles.infor}>
                    <View style={styles.infortextborder}>
                        <TextInput 
                        editable={edit ? true : false}
                        style={styles.infortext} 
                        defaultValue={user.fullname}
                        onChangeText={value => setDataUpdate({...dataUpdate, fullname: value})} />
                    </View>
                    <View style={{flexDirection: 'row'}}>
                        <Text style={{fontSize: 16, marginTop: 10}}>Change image</Text>
                        <Feather onPress={edit ? pickImage : null} style={styles.camicon} name="camera" size={24} color="black" />
                    </View>
                </View>
            </View>
            <ScrollView style={styles.footer}>
                <View>
                    <Text style={styles.label}>Date Birth</Text>

                    <View style={{position: 'absolute', right: 12, top: 60, zIndex: 10}}>
                        {edit &&
                        <ModalDatePicker 
                            button={<FontAwesome name="calendar" size={20} color="black" />} 
                            locale="tr" 
                            onSelect={value => setDataUpdate({...dataUpdate, date: value})}
                            isHideOnSelect={true}
                            language={require('../../locales/en.json')}
                            initialDate={new Date()}
                        /> }
                    </View>
                    <TextInput 
                        value={dataUpdate.date ? dataUpdate.date.toString().slice(0,10) : ''}
                        editable={false}
                        placeholder="Your date birth" 
                        style={styles.text_input} 
                        autoCapitalize="none" />
                </View>
                <View>
                    <Text style={styles.label}>Gender</Text>
                    <View style={styles.select} >
                        <RNPickerSelect
                            disabled={edit ? false : true}
                            value={user.gender}
                            onValueChange={(value) => setDataUpdate({...dataUpdate, gender: value})}
                            items={[
                                { label: "Male", value: "Male" },
                                { label: "Female", value: "Female" },
                                { label: "Other", value: "Other" }
                            ]}
                            style={pickerSelectStyles} />
                        <AntDesign style={styles.iconDown} name="down" size={20} color="gray" />   
                    </View>
                </View>
                <View>
                    <Text style={styles.label}>Email</Text>
                    <TextInput 
                        editable={edit ? true : false}
                        defaultValue={user.email}
                        placeholder="Your email" 
                        style={styles.text_input} 
                        autoCapitalize="none"
                        onChangeText={value => setDataUpdate({...dataUpdate, email: value})} />
                </View>
                <View>
                    <Text style={styles.label}>Phone</Text>
                    <TextInput 
                        editable={edit ? true : false}
                        defaultValue={user.phone}
                        placeholder="Your email" 
                        style={styles.text_input} 
                        autoCapitalize="none"
                        onChangeText={value => setDataUpdate({...dataUpdate, phone: value})} />
                </View>
                <View>
                    <Text style={styles.label}>Province/City</Text>
                    <View style={styles.select}>
                        {edit ?    
                        <RNPickerSelect
                            onValueChange={val => changeCity(val)}
                            items={province}      
                            style={pickerSelectStyles}
                        />
                        :
                        <RNPickerSelect
                            disabled={edit ? false : true}
                            value={user.address.city}
                            onValueChange={val => changeCity(val)}
                            items={province} 
                            style={pickerSelectStyles} /> }
                        <AntDesign style={styles.iconDown} name="down" size={20} color="gray" />   
                    </View>
                </View>
                <View>
                    <Text style={styles.label}>District</Text>
                    <View style={styles.select}>
                        {edit ?    
                        <RNPickerSelect
                            ref={refDistrict}
                            onValueChange={val => changeDistrict(val)}
                            items={district}
                            style={pickerSelectStyles}
                        /> 
                        :
                        <RNPickerSelect
                            disabled={edit ? false : true}
                            value={user.address.district}
                            ref={refDistrict}
                            onValueChange={val => changeDistrict(val)}
                            items={district}
                            style={pickerSelectStyles}
                        /> }
                        <AntDesign style={styles.iconDown} name="down" size={20} color="gray" />   
                    </View>
                </View>
                <View>
                    <Text style={styles.label}>Ward/Commune</Text>
                    <View style={styles.select}>
                        {edit ?    
                        <RNPickerSelect
                            ref={refCommue}
                            onValueChange={value => setDataUpdate({...dataUpdate, address: {
                                ...dataUpdate.address,
                                ward: value
                            }})}
                            items={commune}
                            style={pickerSelectStyles} 
                        /> 
                        :
                        <RNPickerSelect
                            value={user.address.ward}
                            ref={refCommue}
                            onValueChange={value => setDataUpdate({...dataUpdate, address: {
                                ...dataUpdate.address,
                                ward: value
                            }})}
                            items={commune}
                            style={pickerSelectStyles}
                            disabled={edit ? false : true}
                        /> } 
                        <AntDesign style={styles.iconDown} name="down" size={20} color="gray" />   
                    </View>
                </View>
                <View style={{paddingBottom: 30}}>
                    <Text style={styles.label}>Street</Text>
                    <TextInput
                        editable={edit ? true : false}
                        defaultValue={dataUpdate.address.street} 
                        placeholder="your address" 
                        style={styles.text_input} 
                        autoCapitalize="none"
                        onChangeText={value => setDataUpdate({...dataUpdate, address: {
                                ...dataUpdate.address,
                                street: value
                            }})} />
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
        textAlign: 'center',
        fontWeight: 'bold'
    },
    headertext2: {
        color: '#6495ED',
        fontSize: 15,
        lineHeight: 80,
        paddingRight: 10,
        fontWeight: 'bold'
    },
    back: {
        marginTop: 28,
        marginLeft: 15
    },
    content: {
        flexDirection: 'row',
        marginTop: 20,
        backgroundColor: 'white',
        height: 100
    },
    avatar: {
        marginTop: 15,
        marginLeft: 30
    },
    infor: {
        marginLeft: 25,
        marginTop: 15,
    },
    infortext: {
        // textTransform: 'uppercase',
        fontSize: 18,
    },
    infortextborder: {
        width: 275,
        height: 40,
        borderBottomWidth: 2,
        borderBottomColor: '#f2f2f2'
    },
    camicon: {
        marginTop: 7,
        marginLeft: 140,
    },
    footer: {
        paddingHorizontal: 20,
        backgroundColor: 'white',
        marginTop: 20, 
        flex: 1,
    },
    label: {
        color: 'gray',
        marginTop: 20,
        fontSize: 18
    },
    text_input: {
        height: 40,
        borderRadius: 6,
        marginLeft: 5,
        marginTop: 10,
        backgroundColor: '#f2f2f2',
        paddingLeft: 10
    },
    select: {
        flexDirection: 'row',
    },
    iconDown: {
        position: 'relative',
        right: 30,
        top: 20
    }
})

const pickerSelectStyles = StyleSheet.create({
    inputIOS: {
        width: 367,
        height: 40,
        borderRadius: 6,
        marginLeft: 5,
        marginTop: 10,
        backgroundColor: '#f2f2f2',
        paddingLeft: 10
    },
    inputAndroid: {
        width: 367,
        height: 40,
        borderRadius: 6,
        marginLeft: 5,
        marginTop: 10,
        backgroundColor: '#f2f2f2',
        paddingLeft: 10
    },
  });