export default class File {
    private similarityMap: Map<string, number[]>;
    constructor(private name: string) {
        this.similarityMap = new Map();
    }

    public addSimilarity(key: string, startLine: number, endLine: number) {
        this.similarityMap.set(key, [startLine, endLine]);
    }

    public getSimilarity() : Map<string, number[]> {
        return this.similarityMap;
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