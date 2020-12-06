import Parser from "./Parser";
import File from './File';
const fs = require("fs");


// Specify the project name
const folder1 = './project1';
const folder2 = './project2';

function main() {
// This is the output passing to the front
    const files1: { [k: string]: any }[] = [];
    const files2: { [k: string]: any }[] = [];

    var fileList1: string[] = [];
    var fileList2: string[] = [];
    var idList: string[] = [];


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
            //console.log(parse.getFiles()[0].getName(), "\n",parse.getFiles()[1].getName());
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
        //console.log(relativePath);
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

main()


// import Parser from "./Parser";
// import File from './File';
// const babelify    = require("babelify");
// const fs = require("fs");


// // Specify the project name
// // const folder1 = `${__dirname}/project1`;
// // const folder2 = `${__dirname}/project2`;

// // // This is the output passing to the front
// // const files1: {[k: string]: any}[]= [];
// // const files2: {[k: string]: any}[]= [];

// // var fileList1: string[] = [];
// // var fileList2: string[] = [];

// var filePath1 = '/Users/shuhongyan/Documents/neu/5500/Team-12/back-end/src/project1/file.js';
// var filePath2 = '/Users/shuhongyan/Documents/neu/5500/Team-12/back-end/src/project2/easy2.js';

// // console.log(filePath1);
// // console.log(filePath2);
// const filePaths: File[] = [];
// filePaths.push(new File(filePath1));
// filePaths.push(new File( filePath2));
// const parse = new Parser(filePaths);
// parse.compareCodes();
// for (var file of parse.getFiles()) {
//     console.log(file.toStirng());
// }
// //const ast1 = fs.readFileSync(filePath1).toString();
// // const util = require("util");
// // const babylon = require("babylon");
// // const code = `
// // `;
// // let AST = babylon.parse(code, {
// //     allowReturnOutsideFunction: true,
// //     allowImportExportEverywhere: true,
// //     sourceType: "module",
// //     sourceFilename: filePath1,
// //     plugins: ['jsx', 'flow', 'doExpressions', 'objectRestSpread', 'decorators',
// //       'classProperties', 'exportExtensions', 'asyncGenerators', 'functionBind',
// //       'functionSent', 'dynamicImport']
// //   })
// // console.log(util.inspect(AST, false, null));

// var babylon = require('babylon');
// //var debug   = require('./debug');

// // /**
// //  * Parses the specified src string with babylon, returning the resulting AST
// //  * and skipping the undocumented File root node, which is neither Babylon AST
// //  * nor ESTree spec compliant.
// //  *
// //  * @param {string} src      Source to parse
// //  * @param {string} filePath Path to the file
// //  */
// // function parse(src: string, filePath: string) {
// //   debug(`parsing ${filePath}`);
// //   try {
// //     return attempt(
// //       () => _parse(src, filePath, 'script'),
// //       () => _parse(src, filePath, 'module')
// //     );
// //   } catch (err) {
// //     let ctx = getErrorContext(err, src);
// //     throw new Error(`Couldn't parse ${filePath}: ${err.message}${ctx}`);
// //   }
// // };

// // function attempt(...fns: any[]) {
// //   for (let i = 0; i < fns.length; i++) {
// //     try {
// //       return fns[i]();
// //     } catch (err) {
// //       if (i === fns.length - 1) throw err;
// //     }
// //   }
// // }

// // function _parse(src: string, filePath: string, sourceType: string) {
// //   return babylon.parse(src, {
// //     allowReturnOutsideFunction: true,
// //     allowImportExportEverywhere: true,
// //     sourceType: sourceType
// //   }).program;
// // }

// // function getErrorContext(err: any, src: any) {
// //   if (!err.loc || !err.loc.line || err.loc.column >= 100) return '';

// //   var line = src.split('\n')[err.loc.line - 1];
// //   var caret = ' '.repeat(err.loc.column) + '^';

// //   return `\n${line}\n${caret}`;
// // }

// // function debug(str: any) {
// //     if (process.env.DEBUG) {
// //       console.error(str);
// //     }
// //   };

// // console.log(parse(ast1, filePath1))


