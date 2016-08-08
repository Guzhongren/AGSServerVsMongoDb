var express = require('express');
var router = express.Router();
var url= require('url');
var querystring= require('querystring');
var mongo= require("mongodb");
var events=  require('events');
var eventEmitter= new events.EventEmitter();
//mongodb参数
var host= 'localhost';
var port= 27017;
var db= "lanzhouPOI";
var globalCollection= "features";

/* GET home page. */
router.get('/', function(req, res, next) {
    ///
    ///Test Date
    // var co= linkToMongo(host, port, db, collection);
    // co.then(function(collection){
    //     console.log(collection);
    // }, function(err){
    //     console.log("错误："+err);
    // });


    res.render('index', {
        title:"Server vs MongoDB",
        Servertitle: "Server",
        MongoDBTitle: "MongoDB"
    });

});
/*
**查询数据接口
*@param name string
*http://localhost:3000/getInfoByName?name=红柳沟
*/
router.get('/getInfoByName', function(req, res, next){
    // executeFind(req.query.name).then(function (result){
    //     res.send({
    //         "status": "success",
    //         "result": result
    //     })
    // }, function(err){
    //     if(err) throw err;
    // });
    queryByName(req.query.name).then(function(data){
        res.send(data);
    }, function(err){
        res.send(err);
    });
});

/**
 * 查询某点范围某多少距离范围内含有的点
 * @param {Number}  x   经度
 * @param {Number}  y   纬度
 * @param {Number}  distance    距离
 * localhost:3000/getNear?x=104&y=36&distance=2
 * return {json}  {
 *                  "status": "success",
 *                  "result": [{},{}]
 *                 }
 */
router.get("/getNear", function(req, res, next){
    //转换单位

    var x= parseFloat(req.query.x);
    var y= parseFloat(req.query.y);
    //1 英里 = 5 280 英尺 = 63 360 英寸 = 1 609.344 米 = 1760 码 = 1.609344千 米=1.609344公里
    var distance= parseFloat(req.query.distance/ 160900.344);//
    findNearLocations(x, y, parseFloat(distance)).then(data=>{
        res.send(data);
    }, err=>{
        res.send(err);
    })
});

/**
 * executeFind
 */
// function executeFind(name){
//     return new Promise(function(resolve, reject){
//         if(typeof name === "string"&& name!== "" ){
//             linkToMongo(host, port, db, globalCollection).then( coll=>{
//                 coll.find({"key.attributes.NAME": name}).toArray(function(error, result){
//                     if(error) throw error;
//                     resolve(result);
//                 });
//             }, err=>{
//                 reject({
//                     "status": "faile",
//                     "message": err
//                 });
//             });
//         }else{
//             reject({
//                 "status": "faile",
//                 "message": "操作参数错误！"
//             });
//         }
//     });
// };

/**
 * 查找某点[x, y]附近distance距离内的点
 * @param {Number}  x   经度
 * @param {Number}  y   纬度
 * @param {Number}  distance    距离
 * @return {Function} Promise
 */
function findNearLocations(x, y, distance){
    var db= linkMongo(host, port, globalCollection);
    return new Promise(function(resolve, reject){
        db.open(function (err, db){
        db.collection('features', function(err1, collection){
            if(err1){
                reject({
                    "status": "faile",
                    "message": err1
                });
            }else{
                console.log("连接成功！"+ collection.namespace );
                //var result= collection.find({"key.geometry":{$near: [104.2,36.6]}}).limit(100);
                //var result= collection.find({"key.geometry":{$near: [104, 35], $maxDistance: distance}});

                var result = collection.find({"key.geometry": {$geoWithin: {$center: [[x, y], distance]}}});
                result.toArray(function(err2, docs){
                    if(err2){
                        reject({
                            "status": "faile",
                            "error": err2
                        });
                    }
                    else{
                        db.close();
                         results= {
                            "status": "success",
                            "length": docs.length,
                            "result": docs
                        };
                        resolve(results);
                    }
                });
            }
        })
    });
    })
}

//查询NAME
function queryByName(name){
    var db= linkMongo(host, port, globalCollection);
    var results=null;
    var promise;
    return new Promise(function(resolve, reject){
        db.open(function (err, db){
        db.collection('features', function(err, collection){
            if(err){
                reject({"err":err});
            }else{
                console.log("连接成功！");
                var result= collection.find({"key.attributes.NAME": name});
                result.toArray(function(err, docs){
                    if(err) reject({"error": err});
                    else if(docs.length<=0){
                        db.close();
                         results= {
                            "status": 'faile',
                            "resone":"参数错误！"
                        };
                        reject(results);
                    }else{
                        db.close();
                         results= {
                            "status": "success",
                            "result": docs
                        };
                        resolve(results);
                    }
                });
            }
        })
    });
    });
};
/**
 * 构建MongoDB查询条件
 *
 * @return db
 */
function linkMongo(host, port, collection){
    var server= mongo.Server(host, port, {auto_reconnection: true});
    return new mongo.Db('lanzhouPOI', server, {safe: true});
};
// /<summary>
// /连接到MongoDb
// /<summary>
// /<param name="host" type="string">IP地址</param>
// /<param name="port">MongoDb端口</param>
// /<param name="database">需要连接的数据库</param>
// /<param name="collection">要连接的集合</param>
// /<return>返回Promise,成功(collecion)和失败(err)</return>

// function linkToMongo(host, port, database, collection){
//     return new Promise(function(resolve, reject){
//         console.log(host+ port+ db+ collection);
//         if(host=== ""|| host=== null|| host===undefined||
//             port=== ""|| port=== null|| port===undefined||
//             database=== ""|| database=== null|| database===undefined||
//             collection=== ""|| collection=== null|| collection===undefined){
//                 reject({
//                     "status": "faile",
//                     "message": "请确保参数正确！"
//                 });
//         }else{
//             var server= new mongo.Server(host, port, {auto_reconnection: true});
//             var db= new mongo.Db(database, server, {safe: true});
//             db.open(function(err, db){
//                 if(err){
//                     reject({"err":err});
//                 }else{
//                     console.log("MongoDb："+host+":"+ db+ "数据库连接成功！");
//                     //连接colleciton
//                     db.collection(collection, {strict: true}, (err, coll)=>{
//                         if(err) reject({"err":err});
//                         resolve(coll);
//                     });
//                 }
//             })
//         }
//     });
// }

module.exports = router;
