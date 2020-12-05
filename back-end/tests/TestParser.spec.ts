import { expect } from 'chai';
import Parser from "../src/Parser";
import File from '../src/File';

describe("test parse class", () => {
    it("test compareCodes method", () => {
        const filePaths= new Set<File>();
        
        filePaths.add(new File(`${__dirname}/file.js`));
        filePaths.add(new File(`${__dirname}/file2.js`));
        const parse = new Parser(filePaths);
        parse.compareCodes();
        for(var file of parse.getFiles()) {
            console.log(file.toStirng());
        }
        
    });
})