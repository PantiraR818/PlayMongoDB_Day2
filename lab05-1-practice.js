// UPDATE, DELETE and Query Documents

// MongoDB 
//                            เกณฑ์การตั้งชื่อ ขึ้นต้นพิมเล็กคำต่อไป พิมใหญ่
// All MongoDB commands are camelCase ==> begin with lower case, use upper case when beginning the new word
// ตัวอย่าง ==> iLoveYou  myNameIs

// Update document
// updateOne();  = Update Document แรกที่พบ
// updateMany(); = Update ทุก Document ที่เข้าเงื่อนไข

//UPDATE products SET price = 500;

db.products.updateMany(
    { 
        _id: ObjectId("61d3e8d9d6085d743b4e80d6")  //criteria
    },
    { $set : { isBestSeller : true } }      //values to update 
    //$unset ==> เอาออกไป 
);

//set new value in a new or an existing field
db.products.updateMany(
    {
        tags: "school"
    },
    {
        $set : { isBestSeller: true }
    }
);

//unset value a specified field
db.products.updateMany(
    {
        tags : "supplies"
    },
    {
        $unset : { "isBestSeller" : true }
    }
);

//push value to an array field
db.products.updateOne(
    { name: "Woodplate" },
    { $push: { tags: "home" } } //การเพิ่มลงไป
);

// increase: $inc value
db.products.updateMany(
    { name: "Belkin Bags" },
    { $inc : { quantity: 10 } }
);

//include
// decrease: $inc with negative value
db.products.updateMany(
    { name: "Nike Shoes" },
    { $inc : { quantity: -5 } }
);

// DELETE: deleteOne(),  deleteMany()
// DELETE FROM products WHERE quantity<1000;
db.products.deleteMany({ quantity : { $lt : 1000 }  });

db.products.deleteMany({ isBestSeller : false });

//ตอน 2 
//simple query  select * from products; 
db.products.find();

db.products.find(
    //ขอแค่มี คำนั่นอยุ่ในชื่อ ก่อน-หลังยจะเป็นอะไรก็ได้
    { name : "shoes" }  // Exact Value  not include Vintage shoes, nike shoes
);

db.products.find(
    { 
        name : "shoes", //ชื่อต้อง shoes และModel ต้อง DB85
        model : "DB85"
    }
);

// sorting 1=Ascending, -1=Descending
db.products.find().sort( { price : 1 } );
db.products.find().sort( { price : -1 } );

// sorting on 2 fields, price first, the quantity
db.products.find().sort( { price : -1, quantity: -1 } );

db.products.find({ name : { $ne : "shoes" } });

//find product which price lower that 500

//range 100 - 500
db.products.find({ price: { $lte : 500, $gte: 100  }}); //สามารถใส่รวมกันไปได้
//ตัวดำเนินการ
// < $lt, <= $lte, > $gt, >= $gte,  $eq, $neq


// Wildcard  %pen%  name LIKE %pen%
// Regular Expression [string pattern]
// /pen/
db.products.find( { name : { $regex: /pen/  } } );
db.products.find( { name : { $regex: /shoe/  } } );

// WHERE name IN ("pencil", "paper")
//การค้นหาข้อมูล ในArray
db.products.find(
    //          หยิบคำนั้นมา
    { name : { $in : ["Laptop", "shoes"] } 
})

db.products.find(
    { tags : { $in : ["school", "supplies"] } 
})

db.products.find(
            // ที่ไม่มีคำนั่น 
    { tags : { $nin : ["school", "supplies"] } 
})

//find all products having a field size
// check the existing of a field size
//ค้นหาทุกอันที่ไม่มี size ข้างใน **มีหรือไม่มี**
db.products.find({ size : { $exists: false } });

db.products.find( //หรือ $or
    {
        $or : [
            { color: "red"},
            { color: "black"}
        ]
    }
);
// ["aaa","bbb","ccc"]


// SELECT * FROM product  WHERE 

db.products.find(
    {},
    {  //projection (a field list)  รวมหรือไม่รวม ฟิวส์นั่นเข้ามา 
        name: 1,
        price: 1,
        size : 1
    }
);

db.products.find({},{ name: 1, price: 1 });
        //เอาทุกอัน     ไม่เอา
// 1: including, 0: excluding
db.products.find(
    {},
    {  //projection (a field list)
        name : 0
    }
);


db.products.updateMany(
    {
        quantity : { $lt : 500 }
    },
    {
        $unset: { isBestSeller : true }
    }
);

// $exists
db.products.deleteMany(
    { isBestSeller : { $exists : false } }
);

