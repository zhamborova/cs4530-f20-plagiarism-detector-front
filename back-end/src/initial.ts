// import File from './File';
// const fs = require("fs");

// export function walkFolder(folderPath: string, folder: {[k: string]: any}[], fileList: string[]) {
//     fs.readdirSync(folderPath).forEach((childPath: string) => {
//         var child: {[k: string]: any} = {};
        
//         var path = folderPath +"/"+childPath;
//         if(childPath.indexOf(".") === -1) {
//             child["type"] = "folder";
//             child["name"] = childPath;
//             var childFolder: {[k: string]: any}[]= [];
//             child["children"] = childFolder;
//             walkFolder(path, childFolder, fileList);
//         } else {
//             child["type"] = "file";
//             child["name"] = childPath;
//             var content: {[k: string]: any} = {};
//             var similarities: {[k: string]: any}[] = [];
//             child["contents"] = content;
//             child["similarities"] = similarities;
//             fileList.push(path);
//         }
//         folder.push(child);
//     });
// } 

// export function walkFiles(file: File, files: {[k: string]: any}[], folderPath: string) {
//     var relativePath = file.getName().replace(folderPath+"/", "");
//     const child = files.filter(child => child["name"] === relativePath.split("/")[0]);
//     if(child.length != 0) {
//         if(child[0]["type"] === "file") {
//             child[0]["contents"] = file.getContentMap();
//             child[0]["similarities"] = child[0]["similarities"].concat(file.getSimilarity());
//         } else {
//             walkFiles(file, child, folderPath + "/" + child[0]["name"]);
//         }
//     }   
// }