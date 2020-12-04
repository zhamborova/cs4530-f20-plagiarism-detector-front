export  const obj = {
    '0': 'const url = "https://wbdv-generic-server.herokuapp.com/api/zhamborova/courses"',
    '1': '',
    '2': 'export const findCourseById = courseId =>',
    '3': '    fetch(`${url}/${courseId}`)',
    '4': '        .then(response => response.json())',
    '5': '',
    '6': 'export const findAllCourses = () =>',
    '7': '    fetch(url)',
    '8': '        .then(response => response.json())',
    '9': '',
    '10': 'export const deleteCourse = (courseId) =>',
    '11': '    fetch(`${url}/${courseId}`, {',
    '12': "        method: 'DELETE'",
    '13': '    })',
    '14': '        .then(response => response.json())',
    '15': '',
    '16': 'export const createCourse = (course) =>',
    '17': '    fetch(url, {',
    '18': "        method: 'POST',",
    '19': '        body: JSON.stringify(course),',
    '20': '        headers: {',
    '21': "            'content-type': 'application/json'",
    '22': '        }',
    '23': '    })',
    '24': '        .then(response => response.json())',
    '25': '',
    '26': 'export const updateCourse = (courseId, newCourse) =>',
    '27': '    fetch(`${url}/${courseId}`, {',
    '28': "        method: 'PUT',",
    '29': '        body: JSON.stringify(newCourse),',
    '30': '        headers: {',
    '31': "            'content-type': 'application/json'",
    '32': '        }',
    '33': '    })',
    '34': '        .then(response => response.json())',
    '35': '',
    '36': 'export default {',
    '37': '    findAllCourses, deleteCourse, createCourse, updateCourse, findCourseById',
    "38": '}',
    "39": '',
    '40': '',
    '41': 'export const findAllCourses = () =>',
    '42': '    fetch(url)',
    '43': '        .then(response => response.json())',
    '44': '',
    '45': 'export const deleteCourse = (courseId) =>',
    '46': '    fetch(`${url}/${courseId}`, {',
    '47': "        method: 'DELETE'",
    '48': '    })',
    '49': '        .then(response => response.json())',
}

const similarity1 = [
    {id:"1", startLine: 4, endLine: 8},
    {id:"2", startLine: 15, endLine: 18}]

const similarity11 = [
    {id:"1", startLine: 20, endLine: 24},
    {id:"2", startLine: 30, endLine: 33}]

const similarity2 = [

    {id:"4", startLine: 12, endLine: 15}]

const similarity22 = [

    {id:"4", startLine: 19, endLine: 22}]


export const files = [
    {
        type: "folder",
        name: "src",
        children: [
            {
                type: "folder",
                name: "components",
                children: []
            },
            { type: "file", name: "index.js", contents: obj, similarities: similarity1 },
            { type: "file", name: "index.css", contents: obj, similarities: similarity2}
        ]
    },

];
export const files1 = [
    {
        type: "folder",
        name: "src",
        children: [
            {
                type: "folder",
                name: "components",
                children: [
                    {  type: "folder",
                        name: "other",
                        children: [
                            { type: "file", name: "index.js", contents: obj, similarities: similarity22 },
                            { type: "file", name: "index.css", contents: obj, similarities:similarity11}]}
                ]
            },

        ]
    },

];
