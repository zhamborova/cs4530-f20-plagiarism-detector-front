import Parser from "./Parser";
import File from './File';
const fs = require("fs");

const folder1 = './project1';
const folder2 = './project2';

export const results =  () => {

    // This is the output passing to the front
    const files1: { [k: string]: any }[] = [];
    const files2: { [k: string]: any }[] = [];
    var idList: string[] = [];

    var fileList1: string[] = [];
    var fileList2: string[] = [];

    walkFolder(folder1, files1, fileList1);
    walkFolder(folder2, files2, fileList2);

    fileList1.forEach((filePath1: string) => {
        fileList2.forEach((filePath2: string) => {
            const filePaths: File[] = [];
            filePaths.push(new File(filePath1));
            filePaths.push(new File(filePath2));
            const parse = new Parser(filePaths);
            parse.compareCodes();
            walkFiles(parse.getFiles()[0], files1, folder1);
            walkFiles(parse.getFiles()[1], files2, folder2);
            for(var file of parse.getFiles()) {
                idList = idList.concat(file.getSimilarityKeys());
            }
        })
    })

    function walkFolder(folderPath: string, folder: { [k: string]: any }[], fileList: string[]) {
        fs.readdirSync(folderPath).forEach((childPath: string) => {
            var child: { [k: string]: any } = {};

            var path = folderPath + "/" + childPath;
            if (childPath.indexOf(".") === -1) {
                child["type"] = "folder";
                child["name"] = childPath;
                var childFolder: { [k: string]: any }[] = [];
                child["children"] = childFolder;
                walkFolder(path, childFolder, fileList);
            } else {
                child["type"] = "file";
                child["name"] = childPath;
                var content: { [k: string]: any } = {};
                var similarities: { [k: string]: any }[] = [];
                child["contents"] = content;
                child["similarities"] = similarities;
                fileList.push(path);
            }
            folder.push(child);
        });
    }

    function walkFiles(file: File, files: { [k: string]: any }[], folderPath: string) {
        var relativePath = file.getName().replace(folderPath + "/", "");
        const child = files.filter(child => child["name"] === relativePath.split("/")[0]);
        if (child.length != 0) {
            if (child[0]["type"] === "file") {
                child[0]["contents"] = file.getContentMap();
                child[0]["similarities"] = child[0]["similarities"].concat(file.getSimilarity());
            } else {
                walkFiles(file, child[0]["children"], folderPath + "/" + child[0]["name"]);
            }
        }
    }

    idList = idList.filter( function( item, index, inputArray ) {
        return inputArray.indexOf(item) == index;
    });

    return {files1, files2, idList}
}


