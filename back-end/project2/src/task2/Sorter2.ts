import ISorter from "../ISorter";

/**
 * Place your second Task 2 implementation of an efficient sorter (e.g. Merge sort, heap sort, quicksort, shell sort) here.
 */
export default class Sorter2<E> implements ISorter<E> {
    /**
     * @param list to sort 
     * @param compareFun function to compare the elements by
     */
    public sort(list: E[], compareFun: (e1: E, e2: E) => number) : void {
        list.splice(0, list.length, ...this.mergeSort(list, compareFun)); 
    }

/**
 * @param list to sort 
 * @param compareFun function to compare the elements by
 */
    public mergeSort = (list: E[], compareFun: (e1: E, e2: E) => number) => {
       if(list.length < 2) return list;

        let mid = Math.floor(list.length/2),
            right =  this.mergeSort(list.slice(0, mid), compareFun),
            left  =  this.mergeSort(list.slice(mid), compareFun);
            
            return this.merge(left, right, compareFun);  
    }


/**
 * @param left array
 * @param right array 
 * @param compare function to compare elements by
 */
public merge = (left, right, compare) => {
    
    let sorted = []
    let i = 0;
    let j = 0;
    while (i<left.length && j < right.length) {
      
        if (compare(left[i],right[j]) < 0) {
   
            sorted.push(left[i])
            i++;  

        } else {
            
            sorted.push(right[j]);
            j++
        }
    }

    return [...sorted, ...left.slice(i, left.length) , ...right.slice(j, right.length) ]
}

}



