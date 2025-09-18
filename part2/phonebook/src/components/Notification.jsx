const Notification = ({message, type}) => {

    if(message === null){
        return null
    }
    if(type === 'success'){
        return (
            <div className="notification_success">
                {message}
            </div>    
        )
    }
    return (
        <div className="notification_error">
            {message}
        </div>    
    )
}

export default Notification