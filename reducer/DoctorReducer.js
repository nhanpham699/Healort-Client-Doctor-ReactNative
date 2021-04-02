const initialState = {
    doctor: {}
} 

const DoctorReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'ADD_DOCTOR':
            return { doctor: action.data }
        default: 
            return state
    }
}

export default DoctorReducer