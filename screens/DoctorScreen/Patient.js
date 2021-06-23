import React, {useEffect, useState} from 'react'
import { Searchbar } from 'react-native-paper';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    FlatList,
    SafeAreaView
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'; 
import host from '../../host'
import axios from 'axios'
import { useNavigation } from "@react-navigation/native";
import {useSelector} from 'react-redux'
import PatientModal from '../../components/PatientModal'



const Item = ({ item, onPress, style, onNavigate}) => (
  <View style={[styles.item, style]}>
    <View style={styles.infor}>
        <TouchableOpacity onPress={onPress}>
            <Text style={styles.title}>{item.fullname}</Text>
            <Text style={styles.phone}>Phone: {item.phone}</Text>
        </TouchableOpacity>
    </View>
    <View style={styles.chat}>
        <TouchableOpacity onPress={onNavigate}>
            <Text style={styles.chat_text}>Chat</Text>
        </TouchableOpacity>
    </View>
  </View>  
);

const Flatlist = (props) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [data, setData] = useState({})
  const navigation = useNavigation()

  const handleSetModal = () => {
     setModalVisible(!modalVisible)
  }

  const handleModal = (id) => {
    // console.log(id);  
    const dataFilter = props.data.filter(dt => id == dt._id)
    setData(dataFilter[0])
    handleSetModal()
  }

  const renderItem = ({ item }) => {
    const backgroundColor = '#f2f2f2'
    return (
      <Item
        item={item}
        style={{ backgroundColor }}
        onPress={() => handleModal(item._id)}
        onNavigate={() => navigation.navigate('DoctorChat', {user: item})}
        modal={modalVisible}
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
     <PatientModal data={data} modal={modalVisible} setModal={handleSetModal} />

    </SafeAreaView>
  );
};




export default function Patient({navigation}){

    const { doctor } = useSelector(state => state.doctors)
    // const [checked, setChecked] = useState({
    //     value: null,
    //     isChecked: false
    // })
    const [searchQuery, setSearchQuery] = React.useState('');
    const [data, setData] = useState([])
    const [dataSearch, setDataSearch] = useState([])
    // const [dataAfterSearch, setDataAfterSearch] = useState([])

    const getAllPatients = async() => {
       const res = await axios.get(host+ '/schedules/getallbydoctor/' + doctor.id)
       const dataMap = res.data.map(dt => dt.userId)
       const dataTest = dataMap.map(dt => dt._id)
       const newData = dataMap.filter((dt, index) => dataTest.indexOf(dt._id) == index )
     
       setData(newData)
       setDataSearch(newData)
    }
  
    useEffect(() => {
  
      getAllPatients()
  
    },[])

    const onChangeSearch = (query) => {
        setSearchQuery(query)
        const dataFilter = dataSearch.filter(dt => {
            return dt.fullname.toLowerCase().indexOf(query.toLowerCase()) != -1
        })
        setData(dataFilter)
        // setChecked({value: null, isChecked: false})
    };

   



    return(
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons style={styles.back} name="arrow-back" size={24} color="black" />
                </TouchableOpacity>
                <Text style={styles.headertext1}>Patients</Text> 
            </View>
            <View style={styles.content}>
                <Searchbar
                placeholder="Search"
                onChangeText={onChangeSearch}
                value={searchQuery}
                style={styles.search_bar}
                />
                {data.length ? <Flatlist data={data} />  
                : <View style={{marginTop: '50%', alignItems: 'center'}}>
                    <Text style={{fontSize: 25, letterSpacing: 10}}>N0THING</Text>
                  </View> }
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
        marginLeft: 20,
        marginTop: 5,
        fontSize: 17,
    },
    phone: {
        color: 'gray',
        marginLeft: 20,
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