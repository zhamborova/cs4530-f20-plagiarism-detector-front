const fs = require("fs");

export default class File {
    private similarityMap: Map<string, number[]>;
    private contentMap: {[k: string]: string};
    
    constructor(private name: string) {
        this.similarityMap = new Map();
        this.contentMap = {} ;
        let contents = fs.readFileSync(name).toString();
        var i = 1;
        for(var content of contents.split("\n")) {
            this.contentMap[i.toString()] = content;
            i++;
        }
        
    }

    public addSimilarity(key: string, startLine: number, endLine: number) {
        this.similarityMap.set(key, [startLine, endLine]);
    }

    public getContentMap(): {[k: string]: string} {
        return this.contentMap;
    }

    public getSimilarityKeys(): string[] {
        return Array.from(this.similarityMap.keys());
    }

    public getSimilarity() : {[k: string]: any}[] {
        const similarities = [];
    
        for(var info of this.similarityMap) {
            const similarity: {[k: string]: any} = {};
            similarity["id"] = info[0];
            similarity["startLine"] = info[1][0];
            similarity["endLine"] = info[1][1];
            similarities.push(similarity);
            
        }
        return similarities;
    }

    public getName(): string {
        return this.name;
    }

    
    public toStirng(): string {
        var str = this.name.concat("\n");
        for(var key of this.similarityMap.keys()) {
            str = str.concat("Key:", key, "\n");
            str = str.concat("Start Line:", this.similarityMap.get(key)[0].toString(), "\n");
            str = str.concat("End Line:", this.similarityMap.get(key)[1].toString(), "\n");
        }
        return str;
    }
}