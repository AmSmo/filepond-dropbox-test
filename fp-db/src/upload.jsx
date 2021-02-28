import React, { useState } from 'react';
import { FilePond } from 'react-filepond';
import 'filepond/dist/filepond.min.css';
import axios from 'axios'
import {v4} from 'uuid'
const Upload = (props) => {
   const [photo, setPhoto] = useState()
    const [errors, setErrors] = useState("")
    const [success, setSuccess] = useState(false)
    const onSubmit = async (e) => {
        e.preventDefault()
        setErrors("")
        if (photo && photo.length > 0){
        let formData = new FormData()
        formData.append('photo', photo[0].file)
        formData.append('folder', new Date())
        formData.append('user', v4())
        setErrors("Sending File")
        axios.post(`http://localhost:5000/upload`, formData, {
        }).then(res => {
            console.log(res.data)
            if (res.data.errors){
                setErrors(res.data.errors)
            }else if(res.data.success){
                setSuccess(true)
            }
        }).catch(e=> console.log(e))}else{
            setErrors("Please select an image file first.")
        }
    }

    const renderErrors = () => {
        if (errors !== ""){
            return (
                <div>{errors}</div>
            )
        }else{
            return null
        }
    }


    

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
