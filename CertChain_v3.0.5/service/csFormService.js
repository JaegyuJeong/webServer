const MongoClient=require('mongodb').MongoClient;
const url = 'mongodb://localhost:27017/CertChain';

module.exports={
    csFormInsertOne: function(res, name,email,message) {
        MongoClient.connect(url, function(err,db) {
            if(err) {
                console.log(err);
            }else{
                console.log('db connected....ok');
                db = db.db('CertChain');

                db.collection('csForm').insertOne(
                    {
                        "name":name,
                        "email":email,
                        "message":message
                    },
                    (err, result) => {
                        if(err) {
                            console.log(err);
                        }else{
                            // res.send("요청이 접수되었습니다.");
                            const msg = {msg:"요청이 접수되었습니다."};
                            res.json(JSON.stringify(msg));
                        }
                    }
                );
            }
        });
    }
}