const MongoClient = require('mongodb').MongoClient;
const url = 'mongodb://localhost:27017/SmartHC'


module.exports = {
    MedicalReportFormInsertOne: function (name ,rnum, address, email, date, iarea, iname, comments) {
        MongoClient.connect(url, function (err, db) {
            if (err) {
                console.log(err);
            } else {
                console.log('db connected...ok');
                db = db.db('SmartHC'); /*database명을 다시 한번 명시했다. 이거 안 하면 에러남*/

                db.collection('MedicalReportForm').insertOne(
                    {
                        "name": name,
                        "rnum": rnum,
                        "address" : address,
                        "email": email,
                        "date": date,
                        "iarea": iarea,
                        "iname": iname,
                        "comments": comments
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