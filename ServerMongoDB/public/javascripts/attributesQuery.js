require(["esri/map",
        'esri/layers/ArcGISDynamicMapServiceLayer',
        'esri/layers/FeatureLayer',
        'esri/tasks/query',
        'esri/tasks/QueryTask',
        'dojo/dom',
        'dojo/on',
        'dojo/html',
        'dojo/dom-construct',
        "dojo/domReady!"], function(Map, ArcGISDynamicMapServiceLayer, FeatureLayer, Query, QueryTask,
            dom,on, dojoHtml, domConstruct
          ) {
            //   var map = new Map("map", {
            //     center: [103.8, 36],
            //     zoom: 14,
            //     basemap: "topo"
            //   });
            //   var featureLayerUrl= 'http://zhongren.esri.com/arcgis/rest/services/Hosted/lanzhouPOI/FeatureServer/0';
            //   var featureLayer= new FeatureLayer(featureLayerUrl);
            //   map.addLayer(featureLayer);
              var queryLayer= 'http://zhongren.esri.com/arcgis/rest/services/Hosted/lanzhouPOI/FeatureServer/0';
              var query = new Query();
              query.where= "NAME = '中国联通(庄浪东路营业厅)'";
              query.outSpatialReference= {wkid:102100};
              query.returnGeometry= true;
              query.outFields= ["*"];
              var queryTask= new QueryTask(queryLayer);
              var i=0;
              // on(dom.byId('poiInfo'), 'change', function(evt){
              //   alert(evt);
              // });
              $("#poiInfo").change(function(){
                  //Server开始计时
                  var serverStartTime= new Date();
                var currentValue= $(this).children('option:selected').val();
                i++;
                var serverEndTime=null;
                var serverTimeSpan= null;

                queryTask.execute(query, (featureSet)=>{
                  //Server结束计时
                  serverEndTime= new Date();
                  serverTimeSpan= serverEndTime- serverStartTime;
                  //MongoDb查询
                  var mongoStartTime= new Date();
                  var url="http://localhost:3000/getInfoByName";
                  var data= {"name": currentValue};
                  //MongoDb开始计时                  
                  var mongoEndTime= null;
                  var mongoTimeSpan= null;
                  $.get(url, data, function(response, status){
                      //MongDb结束计时
                        mongoEndTime= new Date();
                        mongoTimeSpan= mongoEndTime- mongoStartTime;
                        var span= mongoTimeSpan- serverTimeSpan;
                        var html= '';
                        html+= '<tr>';
                        html+= '<td>'+i +'</td>';
                        html+= '<td>'+currentValue +'</td>';
                        html+= '<td>'+serverStartTime.toLocaleTimeString() +'</td>';
                        html+= '<td>'+serverEndTime.toLocaleTimeString() +'</td>';
                        html+= '<td>'+serverTimeSpan +'</td>';
                        html+= '<td>'+mongoStartTime.toLocaleTimeString() +'</td>';
                        html+= '<td>'+mongoEndTime.toLocaleTimeString() +'</td>';
                        html+= '<td>'+mongoTimeSpan +'</td>';
                        html+= '<td class="focused">'+span +'</td>';
                        html+= '</tr>';
                        // domConstruct.place(html, d);
                        domConstruct.place(html, 'attr', "last");
                        //$("#attr").append(html);
                        html =null;
                  });
                });
              });
});
