use("tiktokshop");

// Aggregation (sum, count, min, max, ...)

db.sales.aggregate([ 
    { $group : { 
        "_id" : "$storeLocation", "totalSales" : { $sum : "$totalPrice" } } 
    } 
]);

db.sales.aggregate([ 
    { $match : { "storeLocation" : { $exists : true } } },
    { $group : { 
        "_id" : "$storeLocation", "totalSales" : { $sum : "$totalPrice" } } 
    } 
]);

//sort value 
db.sales.aggregate([ 
    { $match : { "storeLocation" : { $exists : true } } },
    { $group : { 
        "_id" : "$storeLocation", "totalSales" : { $sum : "$totalPrice" } } 
    },
    { $sort : { "_id" : 1 } }
]);


//show totalsales from online channel by customer gender 
db.sales.aggregate([ 
    { $match : { "purchaseMethod" : "Online"}},
    { $group : {
         "_id" : "$customer.gender", 
	"totalSales" : { $sum : "$totalPrice"}
        }
    }
]);

//show no. sales transction from online channel by customer gender 
//use $sum of value 1 as counting
db.sales.aggregate([ 
    { $match : { "purchaseMethod" : "Online"}},
    { $group : {
         "_id" : "$customer.gender", 
	"totalSales" : { $sum : 1  }
        }
    }
]);

// I need to see only the store having total sales less than 100K
db.sales.aggregate([ 
    { $match : { "storeLocation" : { $exists : true } } },
    { $group : { 
        "_id" : "$storeLocation", "totalSales" : { $sum : "$totalPrice" } } 
    },
    // HAVING clause
    { $match : { "totalSales" : { $lt : 100000 } } },
    { $sort : { "_id" : 1 } }
]);

db.sales.aggregate([ 
    { $match : { "storeLocation" : { $exists : true } } },
    { $group : { 
        "_id" : "$storeLocation", "totalSales" : { $sum : "$totalPrice" } } 
    },
    // HAVING clause
    { $match : { "totalSales" : { $gt : 100000 } } },
    { $sort : { "totalSales" : -1 } },
    { $limit : 3 }
]);

db.sales.aggregate(
    [
        { 
            $lookup: {
                from: 'customers',
                localField: 'customer.email',
                foreignField: 'email',
                as: 'customer.moreInfo'
            }
        },
        { $match : { "customer.moreInfo.name" : "Brandy Huang"} },
        { $group : { "_id" : 1 ,"sales" : { $sum : "$totalPrice"} } }
    ]
);

db.sales.aggregate(
    { $unwind : { path : "$items" } },
    { $group : { "_id": "$items.name", "qty" :  { $sum : "$items.quantity"} } },
    { $sort : { "qty" : -1 } },
    { $limit : 3 }
);

// get total sales by month
db.sales.aggregate(
    [
        { 
            $group : {
                "_id" : { $month : "$saleDate" },
                "totalSales" : { $sum : "$totalPrice"}
            }
        },
        { $sort: { "_id" : 1 } }
    ]
);

// I would like to see which month that store could sale more than $80,000 
db.sales.aggregate(
    [
       { 
           $group : {
            "_id" : { $month : "$saleDate"},
            "totalSales" : { $sum : "$totalPrice"},
            "avgSales" : { $avg : "$totalPrice"},
            "noOfSales": { $sum : 1 }
            }
       },
       { $match : { "totalSales" : { $gt : 80000 } } },
       { $sort: {  "_id" : 1 } }
    ]
);
