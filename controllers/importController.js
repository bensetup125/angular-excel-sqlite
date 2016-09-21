"USE STRICT";
app.controller("importController", function($scope, $parse, $location, dbService){
	//Listando

	$scope.csv = {
		content: null,
		header: true,
		separator: ',',
		result: null,
		encoding: 'ISO-8859-1',
		callback: 'csvCallback'
	}

	var _lastGoodResult = '';

	$scope.headers = [];
	$scope.data = [];

	$scope.csvCallback = function(result) {
		dbService.updateOrInsertData($scope.csv.result.filename, $scope.csv.result);

		$scope.readData();
		$scope.$apply();
	}

	$scope.chnageSortType = function(sortType) {
		console.log(sortType);
		$scope.data = _.sortBy($scope.data, sortType)
	}
	$scope.export = function() {

	}
	$scope.readData = function() {
		var result = dbService.readData();
		console.log(result);
		var data = null;
		try {
			data = $parse(result[0].data)({});
		}catch(e){

		}
		console.log(result[0].id);
		$scope.headers = _.keys(data[0]);
		$scope.data = data;
		$scope.filename = result[0].file_name;
	}

	$scope.toPrettyJSON = function(json, tabWidth) {
		var objStr = JSON.stringify(json);
		var obj = null;
		try {
			obj = $parse(objStr)({});
		}catch(e){
			return _lastGoodResult;
		}

		var result = JSON.stringify(obj, null, Number(tabWidth));
		_lastGoodResult = result;

		return result;
	}

	$scope.deleteRow = function(row){
		$scope.data = _.without($scope.data, row)
		//dbService.updateOrInsertData($scope.filename, $scope.data);
	}

	$scope.listaPessoas = function(){
		dbService.runAsync("SELECT * FROM pessoas WHERE ativo = 1", function(data){
			$scope.pessoas = data;
		});
	}

	//Salvando
	$scope.salvar = function(){
		if($scope.pessoa.id){
			//Editar
			var id = $scope.pessoa.id;
			delete $scope.pessoa.id;
			delete $scope.pessoa.$$hashKey; //Apaga elemento $$hashKey do objeto
			dbService.update('pessoas', $scope.pessoa, {id: id}); //entidade, dados, where
		}else{
			//nova
			dbService.insert('pessoas', $scope.pessoa); // entidade, dados
		}
		$scope.pessoa = {};
		$scope.listaPessoas();
		$('#modalPessoa').modal('hide');
	}

	//Abrindo para editar
	$scope.editar = function(dados){
		$scope.pessoa = dados;
		$('#modalPessoa').modal('show');
	}

	//Excluindo

});
