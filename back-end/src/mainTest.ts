import Parser from "./Parser";
import File from './File';
const babelify    = require("babelify");
const fs = require("fs");


// Specify the project name
// const folder1 = `${__dirname}/project1`;
// const folder2 = `${__dirname}/project2`;

// // This is the output passing to the front
// const files1: {[k: string]: any}[]= [];
// const files2: {[k: string]: any}[]= [];

// var fileList1: string[] = [];
// var fileList2: string[] = [];

var filePath1 = '/Users/shuhongyan/Documents/neu/5500/Team-12/back-end/src/project1/file.js';
var filePath2 = '/Users/shuhongyan/Documents/neu/5500/Team-12/back-end/src/project2/easy2.js';

// console.log(filePath1);
// console.log(filePath2);
const filePaths: File[] = [];
filePaths.push(new File(filePath1));
filePaths.push(new File( filePath2));
const parse = new Parser(filePaths);
parse.compareCodes();
for (var file of parse.getFiles()) {
    console.log(file.toStirng());
}
//const ast1 = fs.readFileSync(filePath1).toString();
// const util = require("util");
// const babylon = require("babylon");
// const code = `
// `;
// let AST = babylon.parse(code, {
//     allowReturnOutsideFunction: true,
//     allowImportExportEverywhere: true,
//     sourceType: "module",
//     sourceFilename: filePath1,
//     plugins: ['jsx', 'flow', 'doExpressions', 'objectRestSpread', 'decorators',
//       'classProperties', 'exportExtensions', 'asyncGenerators', 'functionBind',
//       'functionSent', 'dynamicImport']
//   })
// console.log(util.inspect(AST, false, null));

var babylon = require('babylon');
//var debug   = require('./debug');

// /**
//  * Parses the specified src string with babylon, returning the resulting AST
//  * and skipping the undocumented File root node, which is neither Babylon AST
//  * nor ESTree spec compliant.
//  *
//  * @param {string} src      Source to parse
//  * @param {string} filePath Path to the file
//  */
// function parse(src: string, filePath: string) {
//   debug(`parsing ${filePath}`);
//   try {
//     return attempt(
//       () => _parse(src, filePath, 'script'),
//       () => _parse(src, filePath, 'module')
//     );
//   } catch (err) {
//     let ctx = getErrorContext(err, src);
//     throw new Error(`Couldn't parse ${filePath}: ${err.message}${ctx}`);
//   }
// };

// function attempt(...fns: any[]) {
//   for (let i = 0; i < fns.length; i++) {
//     try {
//       return fns[i]();
//     } catch (err) {
//       if (i === fns.length - 1) throw err;
//     }
//   }
// }

// function _parse(src: string, filePath: string, sourceType: string) {
//   return babylon.parse(src, {
//     allowReturnOutsideFunction: true,
//     allowImportExportEverywhere: true,
//     sourceType: sourceType
//   }).program;
// }

// function getErrorContext(err: any, src: any) {
//   if (!err.loc || !err.loc.line || err.loc.column >= 100) return '';

//   var line = src.split('\n')[err.loc.line - 1];
//   var caret = ' '.repeat(err.loc.column) + '^';

//   return `\n${line}\n${caret}`;
// }

// function debug(str: any) {
//     if (process.env.DEBUG) {
//       console.error(str);
//     }
//   };

// console.log(parse(ast1, filePath1))


