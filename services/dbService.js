"USE STRICT";
app.factory("DB", function($http){
	var sqlite = require('sqlite-sync');
	var db = sqlite.connect('database.db');
	return db;
});

app.service("dbService", function(DB){
	this.insertData = function(filename, json) {
		var data = JSON.stringify(json);
		DB.insert("excel",{file_name:filename, data: data}, function(res){
		    if(res.error)
		        throw res.error;
		    console.log(res);
		});
	};

	this.updateData = function(filename, json) {
		var data = JSON.stringify(json);
		var rows_modified = DB.update("excel",{id:1, file_name:filename, data: data}, {id:1});
		console.log(rows_modified);
	};

	this.updateOrInsertData = function(filename, json) {

		var result = this.readData();
		if (_.isEmpty(result)) {
			console.log("Empty");
			this.insertData(filename, json);
		}else{
			console.log("Not Empty");

			var id = result[0].id;
			var data = JSON.stringify(json);
			var rows_modified = DB.update("excel",{file_name:filename, data: data}, {id:id});
			console.log(rows_modified);

		}
	};

	this.readData = function() {
		var data = DB.run("SELECT * FROM excel");
		return data;
	}
});
