import React, { useState } from 'react';
import { FilePond } from 'react-filepond';
import 'filepond/dist/filepond.min.css';
import axios from 'axios'
import {v4} from 'uuid'

const Upload = (props) => {
    const [photo, setPhoto] = useState()
    const [errors, setErrors] = useState("")
    const [success, setSuccess] = useState(false)
    const [status,setStatus] = useState("")

    /* 
    Submit compiles the information to send to the backend.
    
    User is a UUID but in production took actual username, this is to avoid
    collisions in storage. 

    Folder is set to current date, where it was scheduled show time stored in Eventbrite API
    
    Ensures file is there also. Limited to one file
    as to restraint of use case, but can handle multiple files if desired.
    */

    const clearMessages = () => {
        setErrors("")
        setStatus("")
    }

    const onSubmit = async (e) => {
        e.preventDefault()
        clearMessages()
        let currentShow = new Date().toLocaleDateString().replaceAll("/", "-")
        if (photo && photo.length > 0){
            let formData = new FormData()
            formData.append('photo', photo[0].file)
            formData.append('folder', currentShow)
            formData.append('user', v4())
            setStatus("Sending")
            sendFile(formData)
        }else{
            setErrors("Please select an image file first.")
        }
    }

    /*
    This is the actual file being set, it receives errors after the backend validates the file.
    Will return true if it goes through which would then change the page to just show a success message.
    */

    const sendFile = async (formData) => {
        try{
            let res = await axios.post(`http://localhost:5000/upload`, formData, {})
            clearMessages("")
            if (res.data.errors){
                
                setErrors(res.data.errors)
            }else if(res.data.success){
                setSuccess(true)
                setStatus("Upload Success!")
            }
        }catch(err){
            setErrors(err)
        }
    }

    // Shows a status message should one appear

    const renderStatus = () =>{
        if (status !== "") {
            return <div className="status message">{status}</div>
        }
    }

    // Shows an error message should one appear

    const renderErrors = () => {
        if (errors !== ""){
            return (
                <div className="error message">{errors}</div>
            )
        }else{
            return null
        }
    }

    return (
        <div className="form-box">
            {
            
            success ?

            null

            :                
                    <form onSubmit={onSubmit} >
                        <FilePond
                            labelIdle={"Drag your file here"}
                            credits={false}
                            file={photo}
                            name="photo"
                            allowMultiple={false}
                            server={null}
                            instantUpload={false}
                            onupdatefiles={(fileItems) => {
                                clearMessages()
                                setPhoto(fileItems)}}>
                        </FilePond>
                        <div>
                            <button className="upload-button" type="submit">Upload</button>
                        </div>
                        {renderErrors()}
                        
                    </form>
            }
            {renderStatus()}
        </div>
        )
};

export default Upload;
