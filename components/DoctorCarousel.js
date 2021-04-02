import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { View } from "react-native"
import Carousel, { Pagination } from 'react-native-snap-carousel'
import CarouselCardItem, { SLIDER_WIDTH, ITEM_WIDTH } from './DoctorCarouselCardItem'
import host from '../host'
import {useSelector} from 'react-redux'
const { doctors } = useSelector(state => state.doctorInfor)

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

// const ratingTotal = (rate) => {
//     let total = 0
//     for(let i of rate){
//         total += i.rating 
//     }
//     return total
// }

const DoctorCarousel = () => {
    const isCarousel = React.useRef(null)
    const [data,setData] = useState([])

    // useEffect(() => {
    //     setData(doctors)
    // },[])
  
    // // console.log(data);
    return (
        <View>
        <Carousel
            layout="tinder"
            layoutCardOffset={9}
            ref={isCarousel}
            data={data}
            renderItem={CarouselCardItem}
            sliderWidth={SLIDER_WIDTH}
            itemWidth={ITEM_WIDTH}
            // onSnapToItem={(index) => setIndex(index)}
            useScrollView={true}
        />
        </View>
    )
}



export default DoctorCarousel