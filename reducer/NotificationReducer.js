const initialState = {
    notification: []
} 

const NotificationReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'ADD_NOTIF':
            return {notification: action.data}
        default: 
            return state
    }
}

export default NotificationReducer