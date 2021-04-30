import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { TouchableOpacity, View } from "react-native"

import Carousel, { Pagination } from 'react-native-snap-carousel'
import TopCarouselCardItem, { SLIDER_WIDTH, ITEM_WIDTH } from './TopDoctorCarouselCardItem'
import {useSelector} from 'react-redux'

// const data = [
//     {
//       title: "Aenean leo",
//       body: "Ut tincidunt tincidunt erat. Sed cursus turpis vitae tortor. Quisque malesuada placerat nisl. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem.",
//       imgUrl: DentistIcon
//     },
//     {
//       title: "In turpis",
//       body: "Aenean ut eros et nisl sagittis vestibulum. Donec posuere vulputate arcu. Proin faucibus arcu quis ante. Curabitur at lacus ac velit ornare lobortis. ",
//       imgUrl: DentistIcon
//     },
//     {
//       title: "Lorem Ipsum",
//       body: "Phasellus ullamcorper ipsum rutrum nunc. Nullam quis ante. Etiam ultricies nisi vel augue. Aenean tellus metus, bibendum sed, posuere ac, mattis non, nunc.",
//       imgUrl: DentistIcon
//     }
//   ]

const ratingTotal = (rate) => {
    let total = 0
    for(let i of rate){
        total += i.rating 
    }
    total = total/rate.length
    return total
}

const TopDoctorCarousel = () => {

    let { doctors } = useSelector(state => state.doctorInfor)

    
    // console.log(user);
    const isCarousel = React.useRef(null)
    const [data,setData] = useState([])

    useEffect(() => {
        
        let dataFilter = doctors.map(dt => {
            return {...dt, review: ratingTotal(dt.review)}
        })
        setData(dataFilter)

    },[doctors])
  
    // // console.log(data);
    return (
        <View>
            <Carousel
                layout="tinder"
                layoutCardOffset={9}
                ref={isCarousel}
                data={data}
                renderItem={TopCarouselCardItem}
                sliderWidth={SLIDER_WIDTH}
                itemWidth={ITEM_WIDTH}
                // onSnapToItem={(index) => setIndex(index)}
                useScrollView={true}
            />
        </View>
    )
}



export default TopDoctorCarousel