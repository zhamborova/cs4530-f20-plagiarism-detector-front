import { expect, assert } from 'chai';
import SorterFactory from "../../src/SorterFactory";


//note this function was not put in another file since instructors said not to add other files
export const testSorter = (s) => {
describe("blackbox tests for sorter", () => {

    var sorterFactory = new SorterFactory(s);

    it("call sorter on empty array", () => {
        let sorter = sorterFactory.createSorter();
        let list = [];
        sorter.sort(list, (s1: number, s2: number) => s1 - s2);
        expect(list).to.have.ordered.members([]);
        expect(list.length == 0)
    });

    it("call sorter on list of one element", () => {
        let sorter = sorterFactory.createSorter();
        let list = ["a"];
        sorter.sort(list, (s1: string, s2: string) => s1.localeCompare(s2));
        expect(list).to.have.ordered.members(["a"]);
    });

    it("call sorter on list of two unsorted elements", () => {
        let sorter = sorterFactory.createSorter();
        let list = ["z","a"];
        sorter.sort(list, (s1: string, s2: string) => s1.localeCompare(s2));
        expect(list).to.have.ordered.members(["a", "z"]);
    });


    it("call sorter on list of two sorted elements", () => {
        let sorter = sorterFactory.createSorter();
        let list = ["a", "z"];
        sorter.sort(list, (s1: string, s2: string) => s1.localeCompare(s2));
        expect(list).to.have.ordered.members(["a", "z"]);
    });

    it("call sorter on list of three elements", () => {
        let sorter = sorterFactory.createSorter();
        let list = ["loser","z","a"];
        sorter.sort(list, (s1: string, s2: string) => s1.localeCompare(s2));
        expect(list).to.have.ordered.members(["a", "loser", "z", ]);
    });

    it("call sorter on list of 4 half sorted elements", () => {
        let sorter = sorterFactory.createSorter();
        let list = ["loser","big","z","a"];
        sorter.sort(list, (s1: string, s2: string) => s2.localeCompare(s1));
        expect(list).to.have.ordered.members(["z", "loser", "big", "a"]);
    });

    it("test correct length", () => {
        let sorter = sorterFactory.createSorter();
        let list = ["loser","big","z","a"];
        sorter.sort(list, (s1: string, s2: string) => s2.localeCompare(s1));
        expect(list.length == 4); 
    });


    

    it("call sorter on even odd even pattern", () => {
        let sorter = sorterFactory.createSorter();
        let list = [1,3,2,4,6,5];
        sorter.sort(list, (s1: number, s2: number) => s1 - s2);
        expect(list).to.have.ordered.members([1,2,3,4,5,6]);
    });

    it("call sorter on odd even odd pattern", () => {
        let sorter = sorterFactory.createSorter();
        let list = [2,1,4,3,6,5];
        sorter.sort(list, (s1: number, s2: number) => s1 - s2);
        expect(list).to.have.ordered.members([1,2,3,4,5,6]);
    });
   

    it("call sorter on half odd half even pattern with duplciates", () => {
        let sorter = sorterFactory.createSorter();
        let list = [2,1,4,3,6,5,1,3,2,4,6,5];
        sorter.sort(list, (s1: number, s2: number) => s1 - s2);
        expect(list).to.have.ordered.members([1,1,2,2,3,3,4,4,5,5,6,6]);
    });
   
    it("call sorter on almost sorted duplicate array", () => {
        let sorter = sorterFactory.createSorter();
        let list = [1,2,3,3,4,4,5,5,5,6,6,6,7,6];
        sorter.sort(list, (s1: number, s2: number) => s1 - s2);
        expect(list).to.have.ordered.members([1,2,3,3,4,4,5,5,5,6,6,6,6,7]);
    });



    it("call sorter on ordered array ascednding", () => {
        let sorter = sorterFactory.createSorter();
        let list = [1,2,3,4,5,6];
        sorter.sort(list, (s1: number, s2: number) => s1 - s2);
        expect(list).to.have.ordered.members([1,2,3,4,5,6]);
    });
    it("call sorter on ordered array descending", () => {
        let sorter = sorterFactory.createSorter();
        let list = [1,2,3,4,5,6];
        sorter.sort(list, (s1: number, s2: number) => s2 - s1);
        expect(list).to.have.ordered.members([6,5,4,3,2,1]);
    });



    it("call sorter on unordered array with duplicates", () => {
        let sorter = sorterFactory.createSorter();
        let list = [6,3,5,4,1,2,6,5, 0];
        sorter.sort(list, (s1: number, s2: number) => s1 - s2);
        expect(list).to.have.ordered.members([ 0,1,2,3,4,5,5,6,6]);
    });

    it("call sorter on unordered array with negative ints", () => {
        let sorter = sorterFactory.createSorter();
        let list = [6,3,-5,5,4,-7,1,2,6,5, 0, -2, -5, -7, -1];
        sorter.sort(list, (s1: number, s2: number) => s1 - s2);
        expect(list).to.have.ordered.members([-7,-7, -5, -5,-2, -1, 0, 1,2,3,4,5,5,6,6]);
    });


    it("call sorter on unordered array with negative ints and check size", () => {
        let sorter = sorterFactory.createSorter();
        let list = [6,3,-5,5,4,-7,1,2,6,5, 0, -2, -5, -7, -1];
        sorter.sort(list, (s1: number, s2: number) => s2 - s1);
        expect(list).to.have.ordered.members([6,6,5,5,4,3,2,1,0, -1,-2,-5,-5,-7,-7]);
        expect(list.length).equal(15)
    });

    it("call sorter on halfway ordered  array ", () => {
        let sorter = sorterFactory.createSorter();
        let list = [6,6,5,5,4,0,1,2,3];
        sorter.sort(list, (s1: number, s2: number) => s2- s1);
        expect(list).to.have.ordered.members([6,6,5,5,4,3,2,1,0]);
       
    });
    it("call sorter on an array of objects - sort by Id", () => {
        let sorter = sorterFactory.createSorter();
        const objArray = [];

        for(let i = 0; i < 1000; i++){

            objArray.push({id: i, title:`item # ${i}`})
        }

        const objIdComparator = (obj1, obj2) => {
            return obj1.id - obj2.id
        

        } 
        sorter.sort(objArray, objIdComparator);
        for(let i = 0; i < 1000; i++){
            assert.deepEqual(objArray[i], objArray[i])
                
        }
       
    });

    it("call sorter on an array of objects - sort by Id other way around", () => {
        let sorter = sorterFactory.createSorter();
        const objArray = [];
        const sorted =[];
        for(let i = 0; i < 1000; i++){
            objArray.push({id: i, title:`item # ${i}`})
        }

        for(let i = 999; i >= 0; i--){
            sorted.push({id: i, title:`item # ${i}`})
        }


        const objIdComparator = (obj1, obj2) => {  
            return obj2.id - obj1.id
    
        } 
      
        sorter.sort(objArray, objIdComparator);
          
        for(let i = 0; i < 100; i++){
            assert.deepEqual(sorted[i], objArray[i])
                
        }

        
       
    });
})
}

//call function to run the tests
testSorter("BubbleSorter")