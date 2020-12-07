import Axios from "axios";


export const sendProject = (data:FormData) =>
    Axios.post("http://localhost:8080/upload/project1", data)
        .then(res => res)
        .catch(err => console.log(err))

export  const getResults = () =>
    fetch("http://localhost:8080/plagiarism")
    .then(res => res.json());
