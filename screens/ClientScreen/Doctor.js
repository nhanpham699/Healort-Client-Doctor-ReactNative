import React, {useEffect, useState} from 'react'
import { Searchbar } from 'react-native-paper';
import {
    View,
    Text,
    TouchableOpacity,
    TextInput,
    Image,
    StyleSheet,
    FlatList,
    SafeAreaView
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'; 
import host from '../../host'
import axios from 'axios'
import DoctorModal from '../../components/DoctorModal'
// import { FontAwesome, MaterialIcons } from '@expo/vector-icons'; 
import { NavigationContainer, useNavigation } from "@react-navigation/native";



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
        onNavigate={() => navigation.navigate('Chat', {doctorName: item.fullname, doctorId: item._id})}
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
     <DoctorModal data={data} modal={modalVisible} setModal={handleSetModal} />

    </SafeAreaView>
  );
};




export default function Doctor({navigation}){

    const [searchQuery, setSearchQuery] = React.useState('');
    const [data, setData] = useState([])
    const [dataSearch, setDataSearch] = useState([])
  
    useEffect(() => {
  
      axios.get(host+ '/doctors/getalldoctors/')
      .then(res => {
          setData(res.data)
          setDataSearch(res.data)
      })
  
    },[])

    const onChangeSearch = (query) => {
        setSearchQuery(query)
        const dataFilter = dataSearch.filter(dt => {
            return dt.fullname.toLowerCase().indexOf(query.toLowerCase()) != -1
        })
        setData(dataFilter)
    };

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
    }
})