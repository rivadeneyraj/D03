module.exports = function (app) {
    console.log("Registering marriages API....");
    const dataStore = require ("nedb");
    const path = require ("path"); //para que podamos trabajar de manera standar con las direcciones (No haya problema entre Unix y Windows )

    const dbFileName =path.join(__dirname,"./globalMarriages.db");   //archivo donde almacenamos los datos que vamos a persistir
    const BASE_API_URL="/api/v3";   // ESta es la URL base
    
    const db = new dataStore({
        filename: dbFileName,
        autoload:true
    });

    const request = require('request');
	const express = require("express");

    var initial_marriages =  [
        {"country": "Italy","year": 2018,"marriages": 195778,"avg_wm": 32.4,"avg_m": 35.2},
        {"country": "Belgium", "year": 2017,   "marriages": 44329,   "avg_wm": 31.2,   "avg_m": 33.5 },
        {"country": "Mexico",   "year": 2011,   "marriages": 570954,  "avg_wm": 26.3,   "avg_m": 29.2 },
        {"country": "Portugal",   "year": 2016,   "marriages": 32399,   "avg_wm": 30.4,   "avg_m": 32.2 },
        {"country": "Suiza",   "year": 2018,   "marriages": 40716,   "avg_wm": 30.5,   "avg_m": 32.9 },

        {"country": "Turkey",   "year": 2018,   "marriages": 553202	,   "avg_wm": 24.9,   "avg_m": 27.9 },
        {"country": "Ukranie",   "year": 2018,   "marriages": 553202	,   "avg_wm": 24.4,   "avg_m": 27.4 },
        {"country": "Slovakia",   "year": 2018,   "marriages": 31177,   "avg_wm": 26.5,   "avg_m": 29.2 },
        {"country": "Slovenia",   "year": 2018,   "marriages": 7256,   "avg_wm": 31.2,   "avg_m": 33.7 },
        {"country": "Montenegro",   "year": 2018,   "marriages": 3321,   "avg_wm": 28.3,   "avg_m": 31.9 },

        {"country": "Iceland",   "year": 2011,   "marriages": 1458,   "avg_wm": 32.4,   "avg_m": 34.4 },
        {"country": "Invented",   "year": 2017,   "marriages": 3321,   "avg_wm": 28.3,   "avg_m": 31.9 },
        {"country": "Invented2",   "year": 2019,   "marriages": 4324,   "avg_wm": 28.3,   "avg_m": 31.9 },
        {"country": "Invented3",   "year": 2020,   "marriages": 3321,   "avg_wm": 28.3,   "avg_m": 31.9 }


    ];

                            //=============================================================
                            //======================ZONA INTEGRACIONES=====================
                            //=============================================================

    //*********************************PROXY***********************************************/

//Configuracion para el PROXY con el grupo 26 
var paths='/api/v3/global-coef';          //Aqui seria donde esta ubicada nuestra API
var apiServerHost = 'http://sos1920-26.herokuapp.com';     //Aqui es a donde redirigimos 

    //Para que el PROXY redireccione
app.use(paths, function(req, res) {
    var url = apiServerHost + req.baseUrl + req.url;
    console.log('piped: '+req.baseUrl + req.url);
    req.pipe(request(url)).pipe(res);
  });
  // *****************************************************************************************


    //*********************************CORS***********************************************/
    const URL_05 = "https://sos1920-05.herokuapp.com";
    app.use("/api/v1/books-exports", function(req, res) {
        console.log("GET API DIEGO");
        var url = URL_05 + req.baseUrl + req.url;
        console.log("URL_DIEGO: "+url);
        console.log('piped: ' + req.baseUrl + req.url);
        req.pipe(request(url)).pipe(res);
    });
    app.use(express.static('.'));




    const URL_21 = "https://sos1920-21.herokuapp.com";
    app.use("/api/v2/traffic-injuries", function(req, res) {
        console.log("GET API JUAN");
        var url = URL_21 + req.baseUrl + req.url;
        console.log("URL_JUAN: "+url);
        console.log('piped: ' + req.baseUrl + req.url);
        req.pipe(request(url)).pipe(res);
    });
    app.use(express.static('.'));




    const URL_01 = "https://sos1920-01.herokuapp.com";
    app.use("/api/v2/emigrants-stats", function(req, res) {
        console.log("GET API ANTONIO");
        var url = URL_01 + req.baseUrl + req.url;
        console.log("URL_ANTONIO: "+url);
        console.log('piped: ' + req.baseUrl + req.url);
        req.pipe(request(url)).pipe(res);
    });
    app.use(express.static('.'));
  // *****************************************************************************************





    function deleteIDs (marriages){
        marriages.forEach( (m) => {
            delete m._id;
        });
    }




    
    //*****************************METODOS DEL GET***************************************/
    // LOAD INITIAL DATA     
    app.get(BASE_API_URL+"/global-marriages/loadInitialData",(req,res) =>{
        db.remove({}, { multi: true }, function (err, numRemoved) {});
        console.log("New GET... /loadInitialData")
        db.insert(initial_marriages);
        res.send(JSON.stringify(initial_marriages,null,2));
        console.log("Initial marriages loaded:"+JSON.stringify(initial_marriages,null,2));
    })
    


    //GET MARRIAGES
    app.get(BASE_API_URL+"/global-marriages",(req, res) => {
        console.log("GET Global Marriages");       
        //if(req.query.country) request["country"] = req.query.country;
        if(req.query.year) req.query.year = parseInt(req.query.year);
        if(req.query.marriages) req.query.marriages = parseInt(req.query.marriages);
        if(req.query.avg_m) req.query.avg_m = parseFloat(req.query.avg_m);
        if(req.query.avg_wm) req.query.avg_wm = parseFloat(req.query.avg_wm);
        
        var parametros = req.query;
        console.log(parametros);
        
        //Paginacion
        let offset = null;
        let limit =null;
  
        if (req.query.offset) {
            offset = parseInt(req.query.offset);
            delete req.query.offset;
        }
        if (req.query.limit) {
            limit = parseInt(req.query.limit);
            delete req.query.limit;
        }  
        
        db.find(parametros).skip(offset).limit(limit).exec((err, marriages)=> {
        deleteIDs(marriages);

        if (marriages.length>=1) {
            res.send(JSON.stringify(marriages,null,2));
            console.log("Data sent: "+JSON.stringify(marriages,null,2));
        }else {
            res.sendStatus(404,"Not found")
        }
        
        });
    });


 
    //GET GLOBAL-MARRIAGES/XXX

	app.get(BASE_API_URL+"/global-marriages/:country/:year", (req,res) => {
        var country = req.params.country;
        var year = parseInt(req.params.year);
       
        db.find({$and: [{"country": country},{"year": year}]  },(err,marriages)=>{
            console.log(marriages);
            if (marriages.length != 0) {
                deleteIDs(marriages);
                res.send(JSON.stringify(marriages[0],null,2));
                console.log("Data sent: " + JSON.stringify(marriages[0],null,2));
            } else{
                res.sendStatus(404, "COUNTRY NOT FOUND");
            }
        })
	});








// GET GLOBAL-MARRIAGES/XXX
/*
app.get(BASE_API_URL+"/global-marriages/:param", (req, res) => {
    var param = req.params.param;
    var query = {};
    // Checking if we can parse the param, if so, it's a country
    // And the query is just to specify the country
    if (isNaN(parseInt(param))) {
        query = {country: param};
    } else {
        query = {year: parseInt(param)};
        
    }
    
    db.find(query).exec((error, marriages) => {

        if (marriages.length > 1) {
            deleteIDs(marriages);
            res.send(JSON.stringify(marriages, null, 2)); 
            console.log("Data sent: " + JSON.stringify(marriages, null, 2));
            
        }
        // We consider the posibility of returning just 1 element and return a JSON and not an array
        
        else if (marriages.length == 1) {
            delete marriages[0]._id;
            res.send(JSON.stringify(marriages[0], null, 2)); 
            console.log("Data sent: " + JSON.stringify(marriages[0], null, 2));
            
        } 
        
        else {
            res.sendStatus(404, "NOT FOUND");
        }
    });

    console.log("OK.");

});
*/


      //*****************************METODOS DEL POST***************************************/

    // POST GLOBAL-MARRIAGES

	app.post(BASE_API_URL+"/global-marriages", (req, res) => {
        var marriage = req.body;


		if((marriage == {}) 
			 || (marriage.country == null || !isNaN(marriage.country) )
             || (marriage.year == null  || isNaN(marriage.year) || marriage.year <= 0) 
			 || (marriage.marriages == null || isNaN(marriage.marriages) || marriage.marriages <= 0) 
			 || (marriage.avg_m == null|| isNaN(marriage.avg_m) || marriage.avg_m <= 0 ) 
             || (marriage.avg_wm == null || isNaN(marriage.avg_wm) || marriage.avg_wm <= 0 )){	
			res.sendStatus(400,"BAD REQUEST");
		} else {
			db.insert(marriage);
			
			res.sendStatus(201, "CREATED");
		}
	});


    //POST incorrecto
app.post(BASE_API_URL + "/global-marriages/:country", (req, res) => {
    res.sendStatus(405);
});
//POST incorrecto
app.post(BASE_API_URL + "/global-marriages/:country/:year", (req, res) => {
    res.sendStatus(405);
});



      //*****************************METODOS DEL PUT***************************************/

//PUT GLOBAL-MARRIAGE/XXX

	app.put(BASE_API_URL+"/global-marriages/:country/:year", (req,res) =>{
        var country = req.params.country;
        var year = parseInt(req.params.year);

		var body = req.body;

		db.update({country: country, year: year}, body, (error, numRemoved) => {
			// Checking if any data has been updated (numRemoved>=1)
			if (numRemoved == 0) {
				res.sendStatus(404, "NOT FOUND");
			} else {
				res.sendStatus(200, "OK");
			}
		});

	});


    //PUT incorrecto
    app.put(BASE_API_URL + "/global-marriages/", (req, res) => {
        res.sendStatus(405);
    });


      //*****************************METODOS DEL DELETE***************************************/

    //DELETE GLOBAL-MARRIAGES

	app.delete(BASE_API_URL + "/global-marriages", (req,res)=>{
		db.remove({}, { multi: true }, function (err, numRemoved) {
            if (numRemoved>=1) {
                res.sendStatus(200, "OK");
            }else{
                res.sendStatus(404, "NOT FOUND");
            }
          
        });
    });
    

    //DELETE GLOBAL-MARRIAGES/XXX

	app.delete(BASE_API_URL+"/global-marriages/:country/:year",(req,res) =>{

		var country = req.params.country;
		var year =  parseInt(req.params.year);
		
		var query = {country: country, year:year};
		
		db.remove(query, { multi: true }, (error, numRemoved) => {
			if (numRemoved == 0) {
				res.sendStatus(404, "NOT FOUND");
			} else {
				res.sendStatus(200, "OK");
			}
		}); 
	});

/*
    app.delete(BASE_API_URL+"/global-marriages/:param",(req,res) =>{

		var param = req.params.param;
		
		var query = {};
		
		// Checking if we can parse the param, if so, it's a country
		// And the query is just to specify the country
		if (isNaN(parseInt(param))) {
			query = { country: param };
			
		} else {
			query = { year: parseInt(param) };
			
		}
		
		db.remove(query, { multi: true }, (error, numRemoved) => {
			if (numRemoved == 0) {
				res.sendStatus(404, "NOT FOUND");
			} else {
				res.sendStatus(200, "OK");
			}
		}); 
		
	});
*/












    console.log("... OK")
    

};




