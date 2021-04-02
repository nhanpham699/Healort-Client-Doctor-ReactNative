const initialState = {
    doctors: []
} 

const DoctorInforReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'ADD_DOCTOR_INFOR':
            return { doctors: action.data }
        default: 
            return state
    }
}

export default DoctorInforReducer