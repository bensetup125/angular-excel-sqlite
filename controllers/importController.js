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
		$scope.headers = _.keys(data[0]);
		$scope.data = data;
		$scope.filename = result[0].file_name;
		console.log($scope.filename);
		// $scope.headers = _.keys(result[0].data[0]);
		// console.log($scope.headers);
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
	$scope.excluir = function(dados){
		if(confirm("Deseja realmente apagar o cadastro de "+dados.nome+"?")){
			dbService.update('pessoas', {ativo:0}, {id: dados.id});
			$scope.listaPessoas();
		}
	}
});
