var express = require('express');
var router = express.Router();
const { Car } = require('../models');
/* post car_update */
router.post('/', function (req, res, next) {
    const result = { msg: '' };
    if (req.body.car_no && req.body.useType) {
        Car.update(
            { vehicle_type: req.body.useType },
            { where: { car_no: req.body.car_no } })
            .then((rs) => {
                result.msg = '차량정보가 수정되었습니다';
                res.json(JSON.stringify(result));
            })
            .catch((err) => {
                res.status(500);
                result.msg = '차량정보 수정 실패';
                res.json(JSON.stringify(result));
            });
    } else {
        console.log(req.body.car_no, req.body.useType);
        res.status(204);
        result.msg = '차량정보를 확인하세요';
        console.log(JSON.stringify(result));
        res.json(JSON.stringify(result));
    }
});
module.exports = router; 