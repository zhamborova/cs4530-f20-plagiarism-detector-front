import { expect } from 'chai';
import SorterFactory from "../../src/SorterFactory";
import { testSorter } from '../task1/BlackboxTests.spec';
import Sorter1 from '../../src/task2/Sorter1';



describe("whitebox tests for sorter1", () => {
     //run black box tests
     testSorter("Sorter1")

     let sorter = new Sorter1;

     

     it("call quicksort partioning function on list of 1 element", () => {
        let list = [1];
        let low =  sorter.partition(0,0,list, (a,b)=> a-b)
        expect(list).to.have.ordered.members([1]);
        expect(low).equal(1);
    });
     it("call quicksort partioning function on list of 2 elements", () => {
        let list = [2,1];
        let low =  sorter.partition(0,1,list, (a,b)=> a-b)
        expect(list).to.have.ordered.members([1,2]);
        expect(low).equal(1);
    });

     it("call quicksort partioning function on list of 3 elements", () => {
        let list = [3, 2,1];
        let low = sorter.partition(0,2,list, (a,b)=> a-b)
        expect(list).to.have.ordered.members([1,2,3]);
        expect(low).equal(2);
    });

    it("call quicksort partioning function with low > high", () => {
        //since low>high function should not change the list
        let list = [1,3,2];
        let low =  sorter.partition(2,0,list, (a,b)=> a-b)
        expect(list).to.have.ordered.members([1,3,2]);
    
        
    });

})

