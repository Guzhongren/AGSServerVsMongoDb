var fs= require("fs");
var mongodb= require("mongodb");
var jsonObj= JSON.parse(fs.readFileSync("../lanzhouPOI.json"));
console.log(jsonObj.features.length);
//连接mongodb，进行数据存储
var server= new mongodb.Server('127.0.0.1', 27017, {auto_reconnect:true});
//使用lanzhouPOI数据库
var db= mongodb.Db("lanzhouPOI", server, {safe: true});
db.open((error, db)=>{
    if(error) throw error;
    //创建空间表，将空间数据按这几个字段存储
    //displayFieldName, fieldAliases, geometryType, spatialReference, fields, features

    //displayFieldName 表创建及document插入
    db.createCollection('displayFieldName', {safe: true}, function(err, collection){
        if(err){
            throw err;
        }else {
            var temp= {"displayFieldName": jsonObj.displayFieldName};
            collection.insert(temp, {safe: true}, function(err, result){
                console.log(result);
            });
            temp= null;
        }
    });
    //fieldAliases 表创建及document插入
    db.createCollection('fieldAliases', {safe: true}, function(err, collection){
        if(err){
            throw err;
        }else {
            var temp= {"fieldAliases": jsonObj.fieldAliases};
            collection.insert(temp, {safe: true}, function(err, result){
                console.log(result);
            });
            temp= null;
        }
    });
    //geometryType 表创建及document插入
    db.createCollection('geometryType', {safe: true}, function(err, collection){
        if(err){
            throw err;
        }else {
            var temp= {"geometryType": jsonObj.geometryType};
            collection.insert(temp, {safe: true}, function(err, result){
                console.log(result);
            });
            temp= null;
        }
    });
    //spatialReference 表创建及document插入
    db.createCollection('spatialReference', {safe: true}, function(err, collection){
        if(err){
            throw err;
        }else {
            var temp= {"spatialReference": jsonObj.spatialReference};
            collection.insert(temp, {safe: true}, function(err, result){
                console.log(result);
            });
            temp= null;
        }
    });
    //fields 表创建及document插入
    db.createCollection('fields', {safe: true}, function(err, collection){
        if(err){
            throw err;
        }else {
            // var temp= {"spatialReference": jsonObj.spatialReference};
            jsonObj.fields.forEach(function(value, key){
                var temp= {key: value};
                collection.insert(temp, {safe: true}, function(err, result){
                    console.log(result);
                });
                temp= null;
            });

        }
    });
    //features 表创建及document插入
    db.createCollection('features', {safe: true}, function(err, collection){
        if(err){
            throw err;
        }else {
            jsonObj.features.forEach(function(value, key){
                var temp= {key: value};
                collection.insert(temp, {safe: true}, function(err, result){
                    console.log(result);
                });
                temp= null;
            });

        }
    });
});
//db.close();
db.on('close', function(err, db){
    if(err){
        throw err;
    }else{
        console.log("成功关闭");
    }
});
