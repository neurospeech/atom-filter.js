Atom Filter $f()
================

Simple function to create filter with simple JSON syntax.

How to use
----------

    var filterFunction = $f( { category: 'Action' } );
    array.filter(filterFunction);


Examples
-------------

    { name: 'akash' } 

equivalent of

    function(item){
        return item.name == 'akash';
    }


Multiple conditions
-------------------
   
    { 
        category:'Action', 
        'price <': 200
    }

equivalent of

    function(item){
        return 
            item.category == 'Action' &&
            item.price < 200;
    }

Perform or
----------

    { 
        category:'Action', 
        $or:{
            'yearlyPrice <': 200,
            'monthlyPrice <': 20
        }
    }

equivalent of

    function(item){
        return 
            item.category == 'Action' &&
                (item.yearlyPrice < 200 ||
                item.monthlyPrice < 20)
    }

In operator
-----------

    { 'category in': ['Action','Comedy'] }

Not operator
------------

    { 'category !in': ['Drama','Documentory'] }


