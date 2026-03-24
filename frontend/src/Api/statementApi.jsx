import axios from "axios";

const API_URL = "http://localhost:8080/api/statements";


const uploadStatement = async (file) => {
    const formdata = new FormData();
    formdata.append("file", file);
    try{
        const response = await axios.post(API_URL + "/upload", formdata)
        return response.data;
        
    }catch (error){
        console.error("Error uploading statement:", error);
        throw error;    
        
    }
}

export { uploadStatement };