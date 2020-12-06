import * as React from "react"
import Axios from "axios";
import "./upload.css"
import { History } from 'history';
import FileUpload from "../../components/file-upload/file-upload";

interface CodeState {
    loading: boolean,
    file1: string| Blob,
    file2: string| Blob,
    [key: string]: any
}
interface CodeProps {
    setUpload: ()=>void,
    history: History
}


class Upload extends React.Component<CodeProps,CodeState>{
    state={
        file1: "",
        file2: "",
        loading: false,
    }


    /**
     * Uploads two files on the server separately
     */
    send = () => {
          let upload1 = false;
          let upload2 = false;
        if(!this.state.file1 || !this.state.file2){
            alert("Please upload the missing projects!")
        }
        else{
            const data = new FormData();
            const data2 = new FormData();
            data.append("file", this.state.file1);
            data2.append("file", this.state.file2);

            Axios.post("http://localhost:8080/upload/project1", data)
                .then(res => {
                    console.log(res)
                    upload1=true})
                .catch(err => console.log(err));
            Axios.post("http://localhost:8080/upload/project2", data2)
                .then(res => {   console.log(res); upload2= true})
                .then(status =>{
                if(upload1 && upload2){
                this.props.setUpload();
                this.props.history.push('/plagiarism');
                }
            })
                .catch(err => console.log(err));


        }
    }

    /**
     * Set file function to be passed to FileUpload component
     * @param fileNum
     * @param file
     */
    setFile = (fileNum:string, file:Blob|string) => {
        let name = "file"+fileNum;

        this.setState({[name]: file},  ()=>
            console.log(name, this.state))
    }

    render() {
        let canSend = this.state.file2 && this.state.file1

        return ( <div className="container upload-container w-50 ">
                <h3 className="mr-auto ml-auto">Upload two projects/files in
                    <span className="font-weight-bolder"> zip</span> format</h3>
                <form action="#" className="mt-3">
                    <FileUpload setFile={this.setFile} uploaded={this.state.file1 !== ""} fileName="1"/>
                    <FileUpload setFile={this.setFile} uploaded={this.state.file2 !== ""} fileName="2" />
                </form>
                <button className={`btn btn-dark btn-send ${canSend? `` : 'disabled'}`}
                        onClick={()=>{this.send();}}>Compare programs</button>
            </div>
        );
    }
}

export default Upload;
