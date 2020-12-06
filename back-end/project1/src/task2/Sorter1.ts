import ISorter from "../ISorter";

/**
 * Place your first Task 2 implementation of an efficient sorter (e.g. Merge sort, heap sort, quicksort, shell sort) here.
 */
export default class Sorter1<E> implements ISorter<E> {
    /**
     * @param list to sort
     * @param compareFun function to sort by
     * @description sort the list by compareFun
     */
    public sort(list: E[], compareFun: (e1: E, e2: E) => number) : void {   
     this.quickSort(0, list.length-1, list, compareFun);

    }

 /**
  * @param low starting index
  * @param high ending index
  * @param list to sort
  * @param compare function to sort by
  * @description sorts the array accroding to compare function
  */
    public quickSort = (low, high, list, compare) => {
            if (list.length < 2) return list;

            let p = this.partition(low, high, list,compare);
            if (low < p - 1){
              this.quickSort(low, p-1 , list, compare )
            }

            if (high > p) {
                this.quickSort(p, high, list, compare);
            }
            return list
       

    }

    /**
     * 
     * @param low  low partitioning index
     * @param high  high partitioning index
     * @param list list to sort
     * @param compare function to compare the elements with
     * @description puts elements > pivot after the pivot and elements < pivot before the pivot element 
     */
    public partition = (low, high, list, compare) => {
        
        let pivot = list[Math.floor((low + high) / 2)];

        while(low <= high){
           
        while(compare(list[low],pivot) < 0){   
            low++;
       
        }
        while(compare(list[high],pivot) > 0){
            high--;
        }

        if(low <= high){
            let temp = list[low];
            list[low] = list[high];
            list[high] = temp;
            low++;
            high--;
        }
      }


      return low;
    }


 
}
