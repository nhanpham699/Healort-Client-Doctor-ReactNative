import React, {useEffect, useState} from 'react'
import { Searchbar } from 'react-native-paper';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    FlatList,
    SafeAreaView,
    Image
} from 'react-native'
import { Ionicons, AntDesign } from '@expo/vector-icons'; 
import host from '../../host'
import axios from 'axios'
import CheckBox from 'react-native-check-box'
import { useNavigation } from "@react-navigation/native";



const Item = ({ item, onDetailPress, style}) => (
  <TouchableOpacity onPress={onDetailPress}>
    <View style={[styles.item, style]}>
        <View style={{justifyContent: 'center', marginLeft: 25}}>
            <Image 
            style={{width: 90, height: 90, borderRadius: 50}} 
            source={{uri: host + item.avatar}} />
        </View>
        <View style={styles.infor}>
            <View style={{flexDirection: 'row', marginLeft: 5}}>
                <Text style={styles.cmt_text}>{item.reviewAVG ? item.reviewAVG : 'Not yet'} </Text>
                <AntDesign style={{marginTop: 1}} name="star" size={13} color="orange" />
            </View>
            <Text style={styles.title}>{item.fullname}</Text>
            <Text style={styles.phone}>Phone: {item.phone}</Text>
        </View>
    </View>  
  </TouchableOpacity>

);

const Flatlist = (props) => {
  const navigation = useNavigation()
  
  const renderItem = ({ item }) => {
    const backgroundColor = '#f2f2f2'
    return (
      <Item
        item={item}
        style={{ backgroundColor }}
        onDetailPress={() => navigation.navigate('DoctorDetail', {doctor: item})}
      />
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={props.data}
        renderItem={renderItem}
        keyExtractor={(item) => item._id}
        showsVerticalScrollIndicator={false}
        // extraData={selectedId}
      />
    </SafeAreaView>
  );
};




export default function Doctor({navigation}){

    const [checked, setChecked] = useState({
        value: null,
        isChecked: false
    })
    const [searchQuery, setSearchQuery] = React.useState('');
    const [data, setData] = useState([])
    const [dataSearch, setDataSearch] = useState([])
    const [dataAfterSearch, setDataAfterSearch] = useState([])
    const ratingTotal = (rate) => {
        let total = 0
        for(let i of rate){
            total += i.rating 
        }
        total = total/rate.length
        return total
    }
    const getAllDoctors = async() => {
       const res = await axios.get(host+ '/doctors/getalldoctors')
       const newData = res.data.map(dt => {
            return {...dt, reviewAVG: ratingTotal(dt.review)}
        })
       setData(newData)
       setDataSearch(newData)
    }
  
    useEffect(() => {
  
      getAllDoctors()
  
    },[])

    const onChangeSearch = (query) => {
        setSearchQuery(query)
        const dataFilter = dataSearch.filter(dt => {
            return dt.fullname.toLowerCase().indexOf(query.toLowerCase()) != -1
        })
        setData(dataFilter)
        setDataAfterSearch(dataFilter)
        setChecked({value: null, isChecked: false})
    };

    const getRating = (review) => {
        let rating = 0
        if(review.length){
            const ratingData = review.map(dt => dt.rating)
            for(let i of ratingData){
                rating += i
            }
        }
        return rating
    }

    const handleCheckBox = (value) => {
        const currentData = dataAfterSearch.length ? dataAfterSearch : dataSearch
        var newChecked = -1
        if(checked.value == value){
            setChecked({
                value: null,
                isChecked: !checked.isChecked
            })
        }else {
            newChecked = value
            setChecked({
                value: value,
                isChecked: true
            })
        }
        // console.log(currentData);
        if (newChecked == 0){

            const reviewData = currentData.map(dt => {
                return {...dt, review: getRating(dt.review)}
            })
            const reviewSort = reviewData.sort((a,b) => b.review - a.review)
            setData(reviewSort)

        }else if (newChecked == 1){
            const exData = [...currentData]
            const exSort = exData.sort((a,b) => b.experience - a.experience)
            setData(exSort)

        }else if (newChecked == 2){
            const ageData = [...currentData]
            const ageSort = ageData.sort((a,b) => b.birthyear - a.birthyear)
            setData(ageSort)

        }else{
            // getAllDoctors()
            setData(currentData)
        }

        
    }



    return(
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons style={styles.back} name="arrow-back" size={24} color="black" />
                </TouchableOpacity>
                <Text style={styles.headertext1}>Doctors</Text> 
            </View>
            <View style={styles.content}>
                <Searchbar
                placeholder="Search"
                onChangeText={onChangeSearch}
                value={searchQuery}
                style={styles.search_bar}
                />
                {/* <Text style={{fontWeight: '500', fontSize: 18, marginLeft: 30}}>Brands</Text> */}
                <View style={styles.checkboxs}>
                    <CheckBox  
                        style={styles.checkbox}
                        onClick={() => handleCheckBox(0)}
                        isChecked={(checked.isChecked && checked.value == 0 ) ? true : false}
                        leftText={"Review"}
                    />
                    <CheckBox
                        style={styles.checkbox}
                        onClick={() => handleCheckBox(1)}
                        isChecked={(checked.isChecked && checked.value == 1 ) ? true : false}
                        leftText={"Experience"}
                    />
                    <CheckBox
                        style={styles.checkbox}
                        onClick={() => handleCheckBox(2)}
                        isChecked={(checked.isChecked && checked.value == 2 ) ? true : false}
                        leftText={"Age"}
                    />
                </View>  
                <Flatlist data={data} />
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
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
        flex: 1
    },  
    item: {
        marginVertical: 10,
        marginHorizontal: 20,
        borderRadius: 20,
        flexDirection: 'row'
    },
    title: {
        marginLeft: 5,
        marginTop: 5,
        fontSize: 17,
    },
    phone: {
        color: 'gray',
        marginLeft: 5,
        marginTop: 10
    },
    infor: {
        paddingVertical: 20,
        paddingLeft: 20,
        width: '80%'
    },
    chat: {
        justifyContent: 'center',
        width: '20%',
        backgroundColor: '#CECCF5',
        borderTopRightRadius: 20,
        borderBottomRightRadius: 20,
    },
    chat_text: {
        textAlign: 'center',
        fontWeight: '500',
    },
    search_bar : {
        marginHorizontal: 30,
        marginVertical: 30
    },
    checkboxs: {
        marginHorizontal: 40,
        marginTop: 10,
        marginBottom: 20
    }
})