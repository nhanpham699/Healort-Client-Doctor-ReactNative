const initialState = {
    user: {}
} 

const UserReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'ADD_USER':
            return { user: action.data }
        default: 
            return state
    }
}

export default UserReducer