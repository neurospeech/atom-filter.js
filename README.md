Atom Filter $f()
================

Simple function to create filter with simple JSON syntax. Arrow functions cannot be dynmically composed and serialized, but JSON based query can be easily composed dynamically and serialized as needed.

How to use
----------

    var filtered = array.filter({ category: 'Action' });

You can also pass function that will be forwarded to default filter function of array.

To create filter function you can also use $f

    var f = $f({ category: 'Action' });
    var filtered = array.filter(f);

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


Contains operator
-----------------
For string values only, this does not raise error if any property chain is null. If any object in property chain returns null, function returns false.

    { 'broker.name contains': 'ash' }

equivalent of

    function(item){
        return ((broker || {}).name || '').indexOf('ash') !== -1;
    }

Any operator
------------

    { 'children any': { name: 'Akash' } }

equivalent of

    function(item){

        return item.children.filter( 
            function(c){
                c.name == 'Akash'
            } ) ? true : false;
    }

or in short...

    function (item){
        return item.children.filter($f({ name: 'Akash' }$) ? true : false;
    }

Regexp
-------

    { 'first ~': /^A/ }

equivalent of

    function (item){
        return /^A/.test(item.name);
    }

Multi Field Sorting
===================

    array.sort('Gender DESC,FirstName');
    
equivalent of

    array.sort(function(a,b){
        if(!a){
            return !b ? 0 : -1;
        }
        if(!b){
            return 1;
        }
        var ag = (a.Gender || '').toLowerCase();
        var bg = (b.Gender || '').toLowerCase();
        var n = bg.localeCompare(ag);
        if(n!=0){
            return n;
        }
        var af = (a.FirstName || '').toLowerCase();
        var bf = (b.FirstName || '').toLowerCase();
        return af.localeCompare(bf);
    });

Sorting case insensitive, to perform case sensitive, you should use operator CSASC for case sensitive ascending and CSDESC for case sensitive descending sorting.

Null Safe
---------
The method is null safe, it does not throw null exceptions.

Operators
---------

     ASC - Case insensitive ascending order (default)
     DESC - Case insensitive descending order
     CSASC - Case sensitive ascending order
     CSDESC - Case sensitive descending order
