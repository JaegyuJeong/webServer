const MongoClient = require('mongodb').MongoClient;
const url = 'mongodb://localhost:27017/SmartHC'


module.exports = {
    contactFormInsertOne: function (name, email, phone, message) {
        MongoClient.connect(url, function (err, db) {
            if (err) {
                console.log(err);
            } else {
                console.log('db connected...ok');
                db = db.db('SmartHC'); /*database명을 다시 한번 명시했다. 이거 안 하면 에러남*/

                db.collection('contactForm').insertOne(
                    {
                        "name": name,
                        "email": email,
                        "phone": phone,
                        "message": message
                    },
                    (err, result) => {
                        if (err) {
                            console.log(err);
                        } else {
                            console.log('메세지 저장됨\n');
                            console.log(result);
                        }

                    }
                );
            }
        });
    }
}