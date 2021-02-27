import React, { useState } from 'react';
import { FilePond } from 'react-filepond';
import 'filepond/dist/filepond.min.css';
import axios from 'axios'
import {v4} from 'uuid'
const Upload = (props) => {
   const [photo, setPhoto] = useState()
    const [errors, setErrors] = useState("")
    const [success, setSuccess] = useState(false)
    const onSubmit = (e) => {
        e.preventDefault()
        setErrors("")
        if (photo && photo.length > 0){
        let show = localStorage.getItem("riorecords_event")
        let formData = new FormData()
        formData.append('photo', photo[0].file)
        formData.append('folder', new Date())
        formData.append('user', v4())
        setErrors("Sending File")
        axios.post(`/api/upload`, formData, {
        }).then(res => {
            console.log(res.data)
            if (res.data.errors){
                setErrors(res.data.errors)
            }else if(res.data.success){
                setSuccess(true)
            }
        })}else{
            setErrors("Please select an image file first.")
        }
    }

    const renderErrors = () => {
        if (errors !== ""){
            return (
                <div class="upload__errors">{errors}</div>
            )
        }else{
            return null
        }
    }

    const uploadStyle = { height: "180px"}
    uploadStyle.display = (props.uploadActive) ? 'block' : 'none';

    return (
        <>
        {success ?
        <div>Upload Success!</div>

:

            <div style={{height: "300px", width:"400px", margin: "auto"}}>
                <form onSubmit={onSubmit} >
                <FilePond
                    labelIdle={"Drag your file here"}
                    credits={false}
                    file={photo}
                    name="photo"
                    allowMultiple={false}
                    server={null}
                    instantUpload={false}
                    onupdatefiles={(fileItems) => setPhoto(fileItems)}>
                </FilePond>
            {renderErrors()}
            <div >
                <button type="submit">Upload</button>
            </div>
        </form>
            </div>
}
        </>
        )
};

export default Upload;
