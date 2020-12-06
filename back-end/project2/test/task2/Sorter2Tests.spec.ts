import { expect } from 'chai';
import SorterFactory from "../../src/SorterFactory";
import { testSorter } from '../task1/BlackboxTests.spec';
import Sorter2 from '../../src/task2/Sorter2';
import { resourceLimits } from 'worker_threads';



describe("whitebox tests for sorter2", () => {

    //run blackbox tests
    testSorter("Sorter2")



    let sorter = new Sorter2;

     

     it("call merge function on lists of 0 elements", () => {
        let list = [];
        sorter.merge(list,list, (a,b) => a-b)
        expect(list).to.have.ordered.members([]);
   
    });


    it("call merge function on lists of 3 and 0 elements", () => {
        let list1 = [1,2,3];
        let list2 = [];
        let result = [1,2, 3];
        expect(sorter.merge(list1,list2, (a,b) => a-b)).to.have.ordered.members(result);
   
    });
  
    it("call merge function on lists of 0 and 3 elements", () => {
        let list1 = [1,2,3];
        let list2 = [];
        let result = [1,2, 3];
        expect(sorter.merge(list2,list1, (a,b) => a-b)).to.have.ordered.members(result);
   
    });

    it("call merge function on lists of even and odd nums of different length", () => {
        let list1 = [1,3, 5, 7];
        let list2 = [2,4,6,8, 10];
        let result = [1,2,3,4,5,6,7,8,10];
        expect(sorter.merge(list2,list1, (a,b) => a-b)).to.have.ordered.members(result);
   
    });
})
