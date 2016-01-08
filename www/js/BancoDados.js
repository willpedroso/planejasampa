// Bom tutorial de Web SQL Database:
// https://developer.tizen.org/dev-guide/2.2.1/org.tizen.web.appprogramming/html/guide/w3c_guide/storage_guide/web_sql_database.htm
var BANCODADOS = {
    // Objeto do banco de dados
	dbObj: null,

    // todo: revisar - API de metas
    urlCheckUpdate: "xxxx",
    urlDoUpdate: "xxxx",

/*	// todo: links de desenvolvimento
    urlGoals: "http://dsj2231.prodam/metas/api/mobile/metas",
    urlPrefectures: "http://dsj2231.prodam/metas/api/mobile/prefeituras",
    urlProjects: "http://dsj2231.prodam/metas/api/mobile/projetos",
    urlMilProjects: "http://dsj2231.prodam/metas/api/mobile/projetos-marcos",
    urlMonProjects: "http://dsj2231.prodam/metas/api/mobile/projetos-mensal",
*/
	// todo: links de homologação
    urlGoals: "http://hsj2231.prodam/metas/api/mobile/metas",
    urlPrefectures: "http://hsj2231.prodam/metas/api/mobile/prefeituras",
    urlProjects: "http://hsj2231.prodam/metas/api/mobile/projetos",
    urlMilProjects: "http://hsj2231.prodam/metas/api/mobile/projetos-marcos",
    urlMonProjects: "http://hsj2231.prodam/metas/api/mobile/projetos-mensal",

    msgGoals: [],
    msgPrefectures: [],
    msgProjects: [],
    msgMilProjects: [],
    msgMonProjects: [],

    // Funções de retorno
    cbSuccess_f: null,
    cbFail_f: null,
    cbSuccess_DidUpdate: null,
    cbSuccess_DidNotUpdate: null,

    // Controle de atualização de dados
    bUpdated: false,

    // Variáveis auxiliares
    auxVar_1: null,
    auxVar_2: null,
    auxVar_3: null,
    // Indicador de progresso de projetos por fase
    prjFase: null,

    // Variáveis listas auxiliares
    auxListVar_1: [],
    auxListVar_2: [],

    // Controle do número de registros na inserção de dados no banco
    countReg: 0,
    maxReg: 100,

    // Lista de subpreituras atendidas pela meta
    vIdGoal: "",

    // Controle de consultas com subprefeitura selecionada
    vIdPrefecture: "Sao Paulo",
    statusGoalsListPrefecture: [],
    tiposStatus: [],
    tiposObjetivos: [],
    idStatus: null,
    idObjective: null,

    // **********************************************************************************************************
    // Busca dados na internet
    // **********************************************************************************************************
    // Informações de Evolução Mensal de Projetos
    igetMonProjects: function () {
        console.log("igetMonProjects");

	    $.ajax({
	        type: "GET",
	        url: BANCODADOS.urlMonProjects
	    })
	    .done((function (msg) {
			try {
				BANCODADOS.msgMonProjects = msg;
				BANCODADOS.createDB();
			}
			catch (err) {
				BANCODADOS.cbFail_f("Erro no parse de metas - msg: " +err);
			}
        }).bind(this)).fail(function(){
			BANCODADOS.cbFail_f("Houve falha de acesso à internet.");
        });		
    },

    // Informações de Marcos de Projetos
    igetMilProjects: function () {
        console.log("igetMilProjects");

	    $.ajax({
	        type: "GET",
	        url: BANCODADOS.urlMilProjects
	    })
	    .done((function (msg) {
			try {
				BANCODADOS.msgMilProjects = msg;
				BANCODADOS.igetMonProjects();
			}
			catch (err) {
				BANCODADOS.cbFail_f("Erro no parse de metas - msg: " +err);
			}
        }).bind(this)).fail(function(){
			BANCODADOS.cbFail_f("Houve falha de acesso à internet.");
        });		
    },

    // Informações de Projetos
    igetProjects: function () {
        console.log("igetProjects");

	    $.ajax({
	        type: "GET",
	        url: BANCODADOS.urlProjects
	    })
	    .done((function (msg) {
			try {
				BANCODADOS.msgProjects = msg;
				BANCODADOS.igetMilProjects();
			}
			catch (err) {
				BANCODADOS.cbFail_f("Erro no parse de metas - msg: " +err);
			}
        }).bind(this)).fail(function(){
			BANCODADOS.cbFail_f("Houve falha de acesso à internet.");
        });		
    },

    // Lista de Subprefeituras
    igetPrefectures: function () {
        console.log("igetPrefectures");

	    $.ajax({
	        type: "GET",
	        url: BANCODADOS.urlPrefectures
	    })
	    .done((function (msg) {
			try {
				BANCODADOS.msgPrefectures = msg;
				BANCODADOS.igetProjects();
			}
			catch (err) {
				BANCODADOS.cbFail_f("Erro no parse de metas - msg: " +err);
			}
        }).bind(this)).fail(function(){
			BANCODADOS.cbFail_f("Houve falha de acesso à internet.");
        });		
    },

    // Informações de Metas
    igetGoals: function () {
		console.log("igetGoals");
		
	    $.ajax({
	        type: "GET",
	        url: BANCODADOS.urlGoals
	    })
	    .done((function (msg) {
			try {
				BANCODADOS.msgGoals = msg;
				BANCODADOS.igetPrefectures();
			}
			catch (err) {
				BANCODADOS.cbFail_f("Erro no parse de metas - msg: " +err);
			}
        }).bind(this)).fail(function(){
			BANCODADOS.cbFail_f("Houve falha de acesso à internet.");
        });		
    },

    // Verifica se deve efetuar a atualização de dados
    checkUpdate: function () {
        console.log("checkUpdate URL = " + BANCODADOS.urlCheckUpdate);
        BANCODADOS.bUpdated = false;
        // todo: testes - retirar
        BANCODADOS.doUpdate();
        //BANCODADOS.cbSuccess_DidNotUpdate();
        return;
        // testes - retirar
        $.ajax({
            type: "GET",
            url: BANCODADOS.urlCheckUpdate
        })
        .done((function (msg) {
            console.log("checkUpdate = " + msg);
            // todo: sucesso na requisição, verifica se deve efetuar a atualização dos dados
            if (msg == "sim") {
                // 2o passo: atualização necessária
                BANCODADOS.doUpdate();
            }
            else {
                // os dados já estão atualizados
                BANCODADOS.cbSuccess_DidNotUpdate();
            }
        }).bind(this)).fail(function () {
            // falha na requisição
            console.log("Falha checkUpdate");
            BANCODADOS.cbFail_f("Falha na verificação de necessidade de atualização de dados.");
        });
    },

    // Efetua a atualização de dados
    doUpdate: function () {
        console.log("doUpdate URL = " + BANCODADOS.urlDoUpdate);
        UIS.showTelaAguarde("Atualizando os dados...");
		
        // todo: testes - retirar
        BANCODADOS.cbSuccess_f = BANCODADOS.cbSuccess_DidUpdate;
        BANCODADOS.bUpdated = true;
        BANCODADOS.igetGoals();
        return;
        // testes - retirar
        $.ajax({
            type: "GET",
            url: BANCODADOS.urlDoUpdate
        })
        .done((function (msg) {
            console.log("doUpdate = " + msg);
            // todo: sucesso na requisição, processa dados (atualiza metas por status, metas por objetivo e subprefeituras)
            BANCODADOS.cbSuccess_f = BANCODADOS.cbSuccess_DidUpdate;
            BANCODADOS.bUpdated = true;
            BANCODADOS.igetGoals();
        }).bind(this)).fail(function () {
            // falha na requisição
            console.log("Falha doUpdate");
            BANCODADOS.cbFail_f("Falha na atualização de dados.");
        });
    },
    // **********************************************************************************************************
    // Fim - Busca dados na internet
    // **********************************************************************************************************

    // **********************************************************************************************************
    // Atualização de dados
    // **********************************************************************************************************
    updateDataGoals: function (sucDidUpdate, sucDidNotUpdate, fail) {
        console.log("Iniciando update de dados do sistema...");
		
        UIS.showTelaAguarde("Verificando a atualização de dados...");
		
        this.cbFail_f = fail;

        this.cbSuccess_DidNotUpdate = sucDidNotUpdate;
        this.cbSuccess_DidUpdate = sucDidUpdate;

        // 1o passo: executar método que indica se a atualização é necessária
        this.checkUpdate();
    },
    // **********************************************************************************************************
    // Fim - Atualização de dados
    // **********************************************************************************************************

    // **********************************************************************************************************
    // Busca detalhes de um projeto
    // **********************************************************************************************************
    getProjectDetails: function (idProject, cbSuc, cbFail) {
        console.log("getProjectDetails");
        BANCODADOS.auxVar_1 = idProject;
        BANCODADOS.cbSuccess_f = cbSuc;
        if (cbFail != null) BANCODADOS.cbFail_f = cbFail;
        BANCODADOS.sqlCmdDB("SELECT NAME_PROJETO, \
                            TIPO_PROJETO, \
                            ACOMPANHAMENTO_PROJETO, \
                            DISTRITO_PROJETO, \
                            B13_PROJETO, \
                            B14_PROJETO, \
                            B15_PROJETO, \
                            B16_PROJETO, \
                            Q1_PROJETO, \
                            Q2_PROJETO, \
                            Q3_PROJETO, \
                            Q4_PROJETO, \
                            Q5_PROJETO, \
                            Q6_PROJETO \
                            FROM PROJECTS WHERE ID = ?", [idProject], BANCODADOS.getProjectDetailsPrefecturesList, BANCODADOS.getProjectDetailsFail);
    },

    getProjectDetailsSuccess: function (trans, res) {
        console.log("getProjectDetailsSuccess");

        // Retorna
        BANCODADOS.cbSuccess_f(BANCODADOS.auxVar_2, BANCODADOS.auxVar_3, BANCODADOS.prjFase, res);
    },

    getProjectDetailsFail: function (err) {
        console.log("getProjectDetailsFail");
        if (BANCODADOS.cbFail_f != null) {
            BANCODADOS.cbFail_f("Houve falha de acesso ao banco de dados, durante a consulta aos detalhes do projeto - msg: " + err.code);
        }
        else {
            alert("Houve falha de acesso ao banco de dados, durante a consulta aos detalhes do projeto.");
        }
    },

    getProjectDetailsPrefecturesList: function (trans, res) {
        console.log("getProjectDetailsPrefecturesList");
        // guarda resultado
        BANCODADOS.auxVar_2 = res;
        // seleciona a lista de subprefeituras atendidas pela meta
        BANCODADOS.sqlCmdDB("SELECT DISTINCT pr.NAME \
                        FROM PREFECTURES AS pr \
                        INNER JOIN MILPROJECTS as pm ON pm.PREFEITURA_ID = pr.ID \
                        INNER JOIN PROJECTS as p ON p.ID = pm.PROJETO_ID \
                        WHERE p.META_ID = ?", [BANCODADOS.vIdGoal], BANCODADOS.getProjectDetailsAcompanhamento, BANCODADOS.getProjectDetailsFail);
    },
	
	getProjectDetailsAcompanhamento: function (trans, res) {
		console.log("getProjectDetailsAcompanhamento");
		// guarda resultado
		BANCODADOS.auxVar_3 = res;
		// obtém o acompanhamento do projeto, em função do tipo
		BANCODADOS.prjFase = false;
		if (BANCODADOS.auxVar_2.rows.item(0).TIPO_PROJETO != 8) {		// tipo de projeto != 8 ==> projeto por fases
			BANCODADOS.prjFase = true;
			// Acompanhamento obtido na tabela de progresso por marcos - PROJETOS POR FASES
			// Fases (json = "ml" / banco = "MARCO"):
			//		1 ==> "Definição de Terreno (10%)"
			//		2 ==> "Projeto Básico (5%)"
			//		3 ==> "Garantia da fonte de financiamento (10%)"
			//		4 ==> "Licenciamento (5%)"
			//		5 ==> "Licitação da Obra (10%)"
			//		6 ==> "Obras - Fase 1 (20%)"
			//		7 ==> "Obras - Fase 2 (35%)"
			//		8 ==> "Estruturação para o funcionamento (5%)"
			//		
			// Situação da fase (json = "st" / banco = "STATUS_MARCO"):
			//		= 0 ==> "NÃO INICIADA"
			//		> 0 e < 100 ==> "EM ANDAMENTO"
			//		= 100 ==> "CONCLUÍDA"
			if (BANCODADOS.vIdPrefecture == "Sao Paulo") {
				BANCODADOS.sqlCmdDB("SELECT MARCO, STATUS_MARCO \
								FROM MILPROJECTS \
								WHERE PROJETO_ID = ?", [BANCODADOS.auxVar_1], BANCODADOS.getProjectDetailsSuccess, BANCODADOS.getProjectDetailsFail);
			}
			else {
				BANCODADOS.sqlCmdDB("SELECT MARCO, STATUS_MARCO \
								FROM MILPROJECTS \
								WHERE PROJETO_ID = ? AND PREFEITURA_ID = ?", [BANCODADOS.auxVar_1, BANCODADOS.vIdPrefecture], BANCODADOS.getProjectDetailsSuccess, BANCODADOS.getProjectDetailsFail);
			}
		}
		else {
			// Acompanhamento obtido na tabela de progresso mensal - PROJETOS POR PROGRESSO MENSAL
			// Somar os valores mensais (json = "vl" / banco = "VALOR_MENSAL") do ano (json = "my" / banco = "MES_ANO") seguido pelo nome do projeto
			if (BANCODADOS.vIdPrefecture == "Sao Paulo") {
				BANCODADOS.sqlCmdDB("SELECT MES_ANO, VALOR_MENSAL \
								FROM MONPROJECTS \
								WHERE PROJETO_ID = ?", [BANCODADOS.auxVar_1], BANCODADOS.getProjectDetailsSuccess, BANCODADOS.getProjectDetailsFail);
			}
			else {
				BANCODADOS.sqlCmdDB("SELECT MES_ANO, VALOR_MENSAL \
								FROM MONPROJECTS \
								WHERE PROJETO_ID = ? AND PREFEITURA_ID = ?", [BANCODADOS.auxVar_1, BANCODADOS.vIdPrefecture], BANCODADOS.getProjectDetailsSuccess, BANCODADOS.getProjectDetailsFail);
			}
		}
	},
    // **********************************************************************************************************
    // Fim - Busca detalhes de um projeto
    // **********************************************************************************************************

    // **********************************************************************************************************
    // Busca detalhes de uma meta
    // **********************************************************************************************************
    getGoalDetails: function (idGoal, cbSuc, cbFail) {
        console.log("getGoalDetails");
        BANCODADOS.auxVar_1 = BANCODADOS.vIdGoal = idGoal;
        BANCODADOS.cbSuccess_f = cbSuc;
        if (cbFail != null) BANCODADOS.cbFail_f = cbFail;
        BANCODADOS.sqlCmdDB("SELECT ID_META, \
                            STATUS_META, \
                            ACOMPANHAMENTO_META, \
                            NAME_META, \
                            NAME_OBJETIVO, \
                            NAME_ARTICULACAO, \
                            QP1_META, \
                            QP2_META, \
                            QP3_META, \
                            QP4_META, \
                            QP5_META, \
                            QP6_META, \
                            PREVISTO_META, \
                            EXECUTADO_META \
                            FROM GOALS WHERE ID_META = ?", [idGoal], BANCODADOS.getGoalDetailsTipos_e_Projetos, BANCODADOS.getGoalDetailsFail);
    },

    getGoalDetailsSuccess: function (trans, res) {
        console.log("getGoalDetailsSuccess");
 
        // Retorna
        BANCODADOS.cbSuccess_f(BANCODADOS.auxVar_2, res);
    },

    getGoalDetailsFail: function (err) {
        console.log("getGoalDetailsFail - erro: " + err);
        if (BANCODADOS.cbFail_f != null) {
            BANCODADOS.cbFail_f("Houve falha de acesso ao banco de dados, durante a consulta aos detalhes da meta - msg: " + err);
        }
        else {
            alert("Houve falha de acesso ao banco de dados, durante a consulta aos detalhes da meta.");
        }
    },

    getGoalDetailsTipos_e_Projetos: function (trans, res) {
        console.log("getGoalDetailsTipoProjetos");
        // guarda resultado
        BANCODADOS.auxVar_2 = res;
        // seleciona a lista de tipos de projeto
        if (BANCODADOS.vIdPrefecture == "Sao Paulo") {
            BANCODADOS.sqlCmdDB("SELECT DISTINCT ID, \
                            TIPO_PROJETO, \
                            NAME_PROJETO \
                            FROM PROJECTS WHERE META_ID = ?", [BANCODADOS.auxVar_1], BANCODADOS.getGoalDetailsSuccess, BANCODADOS.getGoalDetailsFail);
        }
        else {
            BANCODADOS.sqlCmdDB("SELECT DISTINCT p.ID, p.TIPO_PROJETO, p.NAME_PROJETO \
                            FROM PROJECTS AS p INNER JOIN MILPROJECTS AS pm \
                            ON p.ID = pm.PROJETO_ID \
                            WHERE p.META_ID = ? AND pm.PREFEITURA_ID = ?",
                                [BANCODADOS.auxVar_1, BANCODADOS.vIdPrefecture], BANCODADOS.getGoalDetailsSuccess, BANCODADOS.getGoalDetailsFail);
        }
    },
    // **********************************************************************************************************
    // Fim - Busca detalhes de uma meta
    // **********************************************************************************************************

    // **********************************************************************************************************
    // Busca lista de metas por objetivo, por prefeitura opcional
    // **********************************************************************************************************
    // Dados - lista contendo:
    //      Tipo da meta (TELA ANTERIOR)
    //      Subprefeitura (TELA ANTERIOR)
    //      Número da meta
    //      Status (?)
    //      Percentual (?)
    //      Nome da meta
    getObjectivesGoalsList: function (idObjective, idPrefecture, cbSuc, cbFail) {
        console.log("getObjectivesGoalsList - idObjetive = " + idObjective);
        BANCODADOS.cbSuccess_f = cbSuc;
        if (cbFail != null) BANCODADOS.cbFail_f = cbFail;

        BANCODADOS.idStatus = null;
        BANCODADOS.idObjective = idObjective;

        if (BANCODADOS.vIdPrefecture != "Sao Paulo") {
            // Utiliza dados da lista de metas filtrada por subprefeitura
            UIS.showListaMetasPrefecture(BANCODADOS.statusGoalsListPrefecture, BANCODADOS.idStatus, BANCODADOS.idObjective, true);
        }
        else {
            BANCODADOS.sqlCmdDB("SELECT ID_META, NAME_META, STATUS_META, ACOMPANHAMENTO_META FROM GOALS WHERE NAME_OBJETIVO = ? ORDER BY ID_META", [BANCODADOS.idObjective], BANCODADOS.getStatusGoalsListSuccess, BANCODADOS.getStatusGoalsListFail);
        }
    },

    getObjectivesGoalsListSuccess: function (trans, res) {
        console.log("getObjectivesGoalsListSuccess");

        // Retorna
        BANCODADOS.cbSuccess_f(res);
    },

    getObjectivesGoalsListFail: function (err) {
        console.log("getObjectivesGoalsListFail: " + err);
        if (BANCODADOS.cbFail_f != null) {
            BANCODADOS.cbFail_f("Houve falha de acesso ao banco de dados, durante a busca da lista de metas - msg: " + err);
        }
        else {
            alert("Houve falha de acesso ao banco de dados, durante a busca da lista de metas.");
        }
    },
    // **********************************************************************************************************
    // Fim - Busca lista de metas por objetivo, por prefeitura opcional
    // **********************************************************************************************************

    // **********************************************************************************************************
    // Busca lista de metas por status, por prefeitura opcional
    // **********************************************************************************************************
    // Dados - lista contendo:
    //      Tipo da meta (TELA ANTERIOR)
    //      Subprefeitura (TELA ANTERIOR)
    //      Número da meta
    //      Status (?)
    //      Percentual (?)
    //      Nome da meta
    getStatusGoalsList: function (idStatus, idPrefecture, cbSuc, cbFail) {
        console.log("getStatusGoalsList");
        BANCODADOS.cbSuccess_f = cbSuc;
        if (cbFail != null) BANCODADOS.cbFail_f = cbFail;

        BANCODADOS.idStatus = idStatus;
        BANCODADOS.idObjective = null;

        if (BANCODADOS.vIdPrefecture != "Sao Paulo") {
            // Utiliza dados da lista de metas filtrada por subprefeitura
            UIS.showListaMetasPrefecture(BANCODADOS.statusGoalsListPrefecture, BANCODADOS.idStatus, BANCODADOS.idObjective, true);
        }
        else {
            BANCODADOS.sqlCmdDB("SELECT ID_META, NAME_META, STATUS_META, ACOMPANHAMENTO_META, EXECUTADO_META FROM GOALS WHERE STATUS_META = ? ORDER BY ID_META", [BANCODADOS.idStatus], BANCODADOS.getStatusGoalsListSuccess, BANCODADOS.getStatusGoalsListFail);
        }
    },

    getStatusGoalsListSuccess: function (trans, res) {
        console.log("getStatusGoalsListSuccess");

        // Retorna
        BANCODADOS.cbSuccess_f(res);
    },

    getStatusGoalsListFail: function (err) {
        console.log("getStatusGoalsListFail: " + err);
        if (BANCODADOS.cbFail_f != null) {
            BANCODADOS.cbFail_f("Houve falha de acesso ao banco de dados, durante a busca da lista de metas por status - msg: " + err);
        }
        else {
            alert("Houve falha de acesso ao banco de dados, durante a busca da lista de metas por status.");
        }
    },
    // **********************************************************************************************************
    // Fim - Busca lista de metas por status, por prefeitura opcional
    // **********************************************************************************************************

    // **********************************************************************************************************
    // Busca das subprefeituras
    // **********************************************************************************************************
    getPrefectures: function () {
        console.log("getPrefectures");
        BANCODADOS.sqlCmdDB("SELECT ID, NAME FROM PREFECTURES ORDER BY NAME ASC", [], BANCODADOS.getPrefecturesSuccess, BANCODADOS.getPrefecturesFail);
    },

    getPrefecturesSuccess: function (trans, res) {
        console.log("getPrefecturesSuccess");
        UIS.fillDivPrefectures(res);

        if (BANCODADOS.cbSuccess_f != null) {
            BANCODADOS.cbSuccess_f();
        } 
    },

    getPrefecturesFail: function (err) {
        console.log("getPrefecturesFail");
        if (BANCODADOS.cbFail_f != null) {
            BANCODADOS.cbFail_f("Houve falha de acesso ao banco de dados, durante a busca da lista de subprefeituras - msg: " + err);
        }
        else {
            alert("Houve falha de acesso ao banco de dados, durante a busca da lista de subprefeituras.");
        }
    },
    // **********************************************************************************************************
    // Fim - Busca das subprefeituras
    // **********************************************************************************************************

    // **********************************************************************************************************
    // Busca de metas por objetivo
    // **********************************************************************************************************
    getObjectivesGoals: function () {
        console.log("getObjectivesGoals");
        BANCODADOS.sqlCmdDB("SELECT NAME_OBJETIVO, COUNT(1) as QTD FROM GOALS GROUP BY NAME_OBJETIVO ORDER BY NAME_OBJETIVO ", [], BANCODADOS.getObjectivesGoalsSuccess, BANCODADOS.getObjectivesGoalsFail);
    },

    getObjectivesGoalsSuccess: function (trans, res) {
        console.log("getObjectivesGoalsSuccess");
        // Salva lista de tipos de status
        while (BANCODADOS.tiposObjetivos.length > 0) {
            BANCODADOS.tiposObjetivos.pop();
        }
        for (var i = 0; i < res.rows.length; i++) {
            BANCODADOS.tiposObjetivos.push(res.rows.item(i).NAME_OBJETIVO);
        }
        // Atualiza telas
        UIS.fillDivObjectivesGoals(res);
        BANCODADOS.getPrefectures();
    },

    getObjectivesGoalsFail: function (err) {
        console.log("getObjectivesGoalsFail");
        if (BANCODADOS.cbFail_f != null) {
            BANCODADOS.cbFail_f("Houve falha de acesso ao banco de dados, durante a busca da lista de metas por objetivo - msg: " + err);
        }
        else {
            alert("Houve falha de acesso ao banco de dados, durante a busca da lista de metas por objetivo.");
        }
    },
    // **********************************************************************************************************
    // Fim - Busca de metas por objetivo
    // **********************************************************************************************************

    // **********************************************************************************************************
    // Busca de metas, por subprefeitura (por status e por objetivo)
    // **********************************************************************************************************
    getStatusGoalsPrefecture: function (idPrefecture, blistaMetas) {
        console.log("getStatusGoalsPrefecture");
        console.log("idPrefecture = " + idPrefecture);
        // Retorno de sucesso e falha já foram definidos anteriormente, na abertura da aplicação
        // BANCODADOS.cbSuccess_f = cbSuc;
        // BANCODADOS.cbFail_f = cbFail;
        if ((BANCODADOS.vIdPrefecture = idPrefecture) == "Sao Paulo" &&
			blistaMetas == false) {
			// Não está na tela de lista de metas
            // Desconsidera a subprefeitura
            BANCODADOS.getStatusGoals(true, null);
        }
        else {
            // Obtém os projetos associados a prefeitura selecionada
			if (blistaMetas == true && idPrefecture == "Sao Paulo") {
				// Desconsidera a subprefeitura, mas precisa das informações detalhadas, pois a tela de lista de metas é a tela atual
				BANCODADOS.sqlCmdDB("SELECT DISTINCT PROJETO_ID FROM MILPROJECTS" + 
									" UNION " +
									"SELECT DISTINCT PROJETO_ID FROM MONPROJECTS", 
									[], BANCODADOS.getStatusGoalsPrefectureP1Success, BANCODADOS.getStatusGoalsPrefectureP1Fail);
			}
			else {
				BANCODADOS.sqlCmdDB("SELECT DISTINCT PROJETO_ID FROM MILPROJECTS WHERE PREFEITURA_ID = ?" + 
									" UNION " +
									"SELECT DISTINCT PROJETO_ID FROM MONPROJECTS WHERE PREFEITURA_ID = ?", 
									[idPrefecture, idPrefecture], BANCODADOS.getStatusGoalsPrefectureP1Success, BANCODADOS.getStatusGoalsPrefectureP1Fail);
			}
        }
    },

    getStatusGoalsPrefectureP1Success: function (trans, res) {
        console.log("getStatusGoalsPrefectureP1Success");
        // Monta lista de projetos
        while (BANCODADOS.auxListVar_1.length > 0) {
            BANCODADOS.auxListVar_1.pop();
        }
        for (var i = 0; i < res.rows.length; i++) {
            BANCODADOS.auxListVar_1.push(res.rows.item(i).PROJETO_ID);
        }
        BANCODADOS.auxVar_1 = 0;
        while (BANCODADOS.statusGoalsListPrefecture.length > 0) {
            BANCODADOS.statusGoalsListPrefecture.pop();
        }
        // Com a lista de projetos obtém a lista de metas
        BANCODADOS.sqlCmdDB("SELECT DISTINCT META_ID FROM PROJECTS WHERE ID = ?", [BANCODADOS.auxListVar_1[BANCODADOS.auxVar_1]],
                            BANCODADOS.getStatusGoalsPrefectureP2Success,
                            BANCODADOS.getStatusGoalsPrefectureP2Fail);
    },

    getStatusGoalsPrefectureP2Success: function (trans, res) {
        //console.log("getStatusGoalsPrefectureP2Success");
        if (res.rows.length > 1 || res.rows.length == 0) {
            // Inconsistência no banco: mais de uma meta por projeto
            if (BANCODADOS.cbFail_f != null) {
                BANCODADOS.cbFail_f("Houve falha de acesso ao banco de dados, durante a busca da lista de metas por status: metas na tabela de projetos: nenhuma ou mais de uma meta por projeto.");
            }
            else {
                alert("Houve falha de acesso ao banco de dados, durante a busca da lista de metas por status: metas na tabela de projetos: nenhuma ou mais de uma meta por projeto.");
            }
            return;
        }

        var MetaIDEncontrada = false;
        // Verifica se a meta já está na lista
        for (var i = 0; i < BANCODADOS.statusGoalsListPrefecture.length; i++) {
            if (BANCODADOS.statusGoalsListPrefecture[i].META_ID == res.rows.item(0).META_ID) {
                MetaIDEncontrada = true;
            }
        }
        if (MetaIDEncontrada == false) {
            var s = {
                META_ID: res.rows.item(0).META_ID,
                NAME_META: "",
                STATUS_META: "",
                ACOMPANHAMENTO_META: "",
                NAME_OBJETIVO: "",
            };
            BANCODADOS.statusGoalsListPrefecture.push(s);
        }
        // Com a lista de projetos obtém a lista de metas
        if (++BANCODADOS.auxVar_1 < BANCODADOS.auxListVar_1.length) {
            BANCODADOS.sqlCmdDB("SELECT DISTINCT META_ID FROM PROJECTS WHERE ID = ?", [BANCODADOS.auxListVar_1[BANCODADOS.auxVar_1]],
                                BANCODADOS.getStatusGoalsPrefectureP2Success,
                                BANCODADOS.getStatusGoalsPrefectureP2Fail);
        }
        else {
            // Não há mais projetos na lista, busca informações das metas
            BANCODADOS.auxVar_1 = 0;
            BANCODADOS.sqlCmdDB("SELECT NAME_META, STATUS_META, ACOMPANHAMENTO_META, NAME_OBJETIVO FROM GOALS WHERE ID_META = ?", [BANCODADOS.statusGoalsListPrefecture[BANCODADOS.auxVar_1].META_ID],
                                BANCODADOS.getStatusGoalsPrefectureP3Success,
                                BANCODADOS.getStatusGoalsPrefectureP3Fail);
        }
    },
        
    getStatusGoalsPrefectureP3Success: function (trans, res) {
        console.log("getStatusGoalsPrefectureP3Success");
        // Salva dados na lista de metas
        BANCODADOS.statusGoalsListPrefecture[BANCODADOS.auxVar_1].NAME_META = res.rows.item(0).NAME_META;
        BANCODADOS.statusGoalsListPrefecture[BANCODADOS.auxVar_1].STATUS_META = res.rows.item(0).STATUS_META;
        BANCODADOS.statusGoalsListPrefecture[BANCODADOS.auxVar_1].ACOMPANHAMENTO_META = res.rows.item(0).ACOMPANHAMENTO_META;
        BANCODADOS.statusGoalsListPrefecture[BANCODADOS.auxVar_1].NAME_OBJETIVO = res.rows.item(0).NAME_OBJETIVO;

        if (++BANCODADOS.auxVar_1 < BANCODADOS.statusGoalsListPrefecture.length) {
            BANCODADOS.sqlCmdDB("SELECT NAME_META, STATUS_META, ACOMPANHAMENTO_META, NAME_OBJETIVO FROM GOALS WHERE ID_META = ?", [BANCODADOS.statusGoalsListPrefecture[BANCODADOS.auxVar_1].META_ID],
                            BANCODADOS.getStatusGoalsPrefectureP3Success,
                            BANCODADOS.getStatusGoalsPrefectureP3Fail);
        }
        else {
            // Não há mais metas na lista, preenche a telas
            // lista de metas por status, lista de metas por objetivo e tela de lista de metas se for a tela ativa
            UIS.fillDivGoalsPrefecture(BANCODADOS.statusGoalsListPrefecture, BANCODADOS.tiposStatus, BANCODADOS.tiposObjetivos, BANCODADOS.idStatus, BANCODADOS.idObjective);
        }
    },

    getStatusGoalsPrefectureP3Fail: function (err) {
        console.log("getStatusGoalsPrefectureP3Fail: " + err);
        if (BANCODADOS.cbFail_f != null) {
            BANCODADOS.cbFail_f("Houve falha de acesso ao banco de dados, durante a busca da lista de metas por status: informações das metas - msg: " + err);
        }
        else {
            alert("Houve falha de acesso ao banco de dados, durante a busca da lista de metas por status: informações das metas.");
        }
    },

    getStatusGoalsPrefectureP2Fail: function (err) {
        console.log("getStatusGoalsPrefectureP2Fail: " + err);
        if (BANCODADOS.cbFail_f != null) {
            BANCODADOS.cbFail_f("Houve falha de acesso ao banco de dados, durante a busca da lista de metas por status: metas na tabela de projetos - msg: " + err);
        }
        else {
            alert("Houve falha de acesso ao banco de dados, durante a busca da lista de metas por status: metas na tabela de projetos.");
        }
    },

    getStatusGoalsPrefectureP1Fail: function (err) {
        console.log("getStatusGoalsPrefectureP1Fail: " + err);
        if (BANCODADOS.cbFail_f != null) {
            BANCODADOS.cbFail_f("Houve falha de acesso ao banco de dados, durante a busca da lista de metas por status: marcos de projetos por prefeitura - msg: " + err);
        }
        else {
            alert("Houve falha de acesso ao banco de dados, durante a busca da lista de metas por status: marcos de projetos por prefeitura.");
        }
    },

    getStatusGoalsPrefectureFail: function (err) {
        console.log("getStatusGoalsPrefectureFail: " + err);
        if (BANCODADOS.cbFail_f != null) {
            BANCODADOS.cbFail_f("Houve falha de acesso ao banco de dados, durante a busca da lista de metas por status - msg: " + err);
        }
        else {
            alert("Houve falha de acesso ao banco de dados, durante a busca da lista de metas por status.");
        }
    },
    // **********************************************************************************************************
    // Fim - Busca de metas, por prefeitura (por status e por objetivo)
    // **********************************************************************************************************

    // **********************************************************************************************************
    // Busca de metas por status
    // **********************************************************************************************************
    initGetStatusGoals: function(entrada, idPrefecture, cbSuc, cbFail) {
        console.log("initGetStatusGoals");
        BANCODADOS.cbSuccess_f = cbSuc;
        BANCODADOS.cbFail_f = cbFail;
        BANCODADOS.getStatusGoals(entrada, idPrefecture);
    },

    getStatusGoals: function (entrada, idPrefecture) {
        var now = new Date();
        console.log("getStatusGoals - Datahora: " + now);
        if (entrada == null) {
            entrada = false;
        }
        console.log("Busca de metas por status");
        if (idPrefecture == null) {
            BANCODADOS.sqlCmdDB("SELECT STATUS_META, COUNT(1) AS QTD FROM GOALS GROUP BY STATUS_META ORDER BY STATUS_META", [], BANCODADOS.getStatusGoalsSuccess, entrada ? BANCODADOS.igetGoals : BANCODADOS.cbFail_f);
        }
        else {
            BANCODADOS.sqlCmdDB("SELECT STATUS_META, COUNT(1) AS QTD FROM GOALS WHERE NAME_SECRETARIA = ? GROUP BY STATUS_META ORDER BY STATUS_META", [idPrefecture], BANCODADOS.getStatusGoalsSuccess, entrada ? BANCODADOS.igetGoals : BANCODADOS.cbFail_f);
        }
    },

    getStatusGoalsSuccess: function (trans, res) {
        console.log("getStatusGoalsSuccess");
        // Salva lista de tipos de status
        while (BANCODADOS.tiposStatus.length > 0) {
            BANCODADOS.tiposStatus.pop();
        }
        for (var i = 0; i < res.rows.length; i++) {
            BANCODADOS.tiposStatus.push(res.rows.item(i).STATUS_META);
        }
        // Atualiza telas
        UIS.fillDivStatusGoals(res);
        BANCODADOS.getObjectivesGoals();
    },

    getStatusGoalsFail: function (err) {
        console.log("getStatusGoalsFail: " + err.code);
        if (BANCODADOS.cbFail_f != null) {
            BANCODADOS.cbFail_f("Houve falha de acesso ao banco de dados, durante a busca da lista de metas por status - msg: " + err);
        }
        else {
            alert("Houve falha de acesso ao banco de dados, durante a busca da lista de metas por status.");
        }
    },
    // **********************************************************************************************************
    // Fim - Busca de metas por status
    // **********************************************************************************************************

    // **********************************************************************************************************
    // BANCO DE DADOS
    // **********************************************************************************************************
    // Abre o banco de dados
    openDB: function(cbSuc, cbfail) {
	    console.log("openDB");
	    this.dbObj = window.sqlitePlugin.openDatabase({ name: "metasDB.db", location: 1 }, cbSuc, cbfail);
	},

    // Insere Evolução Mensal de Projetos
    insertMonProjects: function (trans) {
        var now = new Date();
        console.log("insertMonProjects - Datahora: " + now);

        //*************************************************************************
        //**************************************************************************
        //INCLUSÃO DE DADOS NA TABELA DE EVOLUÇÃO MENSAL DE PROJETOS
        //**************************************************************************
        //**************************************************************************
        //console.log("Mensal de Projetos - inserindo " + ((BANCODADOS.msgMonProjects.length - BANCODADOS.countReg) > BANCODADOS.maxReg ? BANCODADOS.maxReg : (BANCODADOS.msgMonProjects.length - BANCODADOS.countReg)) + " registros" + " (" + (BANCODADOS.countReg + ((BANCODADOS.msgMonProjects.length - BANCODADOS.countReg) > BANCODADOS.maxReg ? BANCODADOS.maxReg : (BANCODADOS.msgMonProjects.length - BANCODADOS.countReg))) + "/" + BANCODADOS.msgMonProjects.length + ")");
        Dados = "";

        Dados += "INSERT INTO MONPROJECTS SELECT " + BANCODADOS.countReg + " AS 'iid', '" +
            BANCODADOS.msgMonProjects[BANCODADOS.countReg].id + "' AS 'ID', '" +
            BANCODADOS.msgMonProjects[BANCODADOS.countReg].pjid + "' AS 'PROJETO_ID', '" +
            BANCODADOS.msgMonProjects[BANCODADOS.countReg].pfid + "' AS 'PREFEITURA_ID', '" +
            BANCODADOS.msgMonProjects[BANCODADOS.countReg].gtg + "' AS 'ALVO_META', '" +
            BANCODADOS.msgMonProjects[BANCODADOS.countReg].my + "' AS 'MES_ANO', '" +
            BANCODADOS.msgMonProjects[BANCODADOS.countReg].vl + "' AS 'VALOR_MENSAL', '" +
            BANCODADOS.msgMonProjects[BANCODADOS.countReg].up + "' AS 'ATUALIZACAO_MENSAL'";
        BANCODADOS.countReg++;
        for (var i = 1; (BANCODADOS.countReg < BANCODADOS.msgMonProjects.length) && (i < BANCODADOS.maxReg) ; BANCODADOS.countReg++, i++) {
            //for (var i = 1; i < BANCODADOS.msgMonProjects.length; i++) {
            Dados += " UNION ALL SELECT " + BANCODADOS.countReg + ", '" +
            BANCODADOS.msgMonProjects[BANCODADOS.countReg].id + "', '" +
            BANCODADOS.msgMonProjects[BANCODADOS.countReg].pjid + "', '" +
            BANCODADOS.msgMonProjects[BANCODADOS.countReg].pfid + "', '" +
            BANCODADOS.msgMonProjects[BANCODADOS.countReg].gtg + "', '" +
            BANCODADOS.msgMonProjects[BANCODADOS.countReg].my + "', '" +
            BANCODADOS.msgMonProjects[BANCODADOS.countReg].vl + "', '" +
            BANCODADOS.msgMonProjects[BANCODADOS.countReg].up + "'";
        }
        trans.executeSql(Dados, [], null, null);
    },

    // Insere Marcos de Projetos
    insertMilProjects: function (trans) {
        var now = new Date();
        console.log("insertMilProjects - Datahora: " + now);

        //*************************************************************************
        //**************************************************************************
        //INCLUSÃO DE DADOS NA TABELA DE MARCOS DE PROJETO
        //**************************************************************************
        //**************************************************************************
        //console.log("Marcos de Projetos - inserindo " + ((BANCODADOS.msgMilProjects.length - BANCODADOS.countReg) > BANCODADOS.maxReg ? BANCODADOS.maxReg : (BANCODADOS.msgMilProjects.length - BANCODADOS.countReg)) + " registros" + " (" + (BANCODADOS.countReg + ((BANCODADOS.msgMilProjects.length - BANCODADOS.countReg) > BANCODADOS.maxReg ? BANCODADOS.maxReg : (BANCODADOS.msgMilProjects.length - BANCODADOS.countReg))) + "/" + BANCODADOS.msgMilProjects.length + ")");
        Dados = "";
        Dados += "INSERT INTO MILPROJECTS SELECT " + BANCODADOS.countReg + " AS 'iid', '" +
            BANCODADOS.msgMilProjects[BANCODADOS.countReg].id + "' AS 'ID', '" +
            BANCODADOS.msgMilProjects[BANCODADOS.countReg].pjid + "' AS 'PROJETO_ID', '" +
            BANCODADOS.msgMilProjects[BANCODADOS.countReg].pfid + "' AS 'PREFEITURA_ID', '" +
            BANCODADOS.msgMilProjects[BANCODADOS.countReg].ml + "' AS 'MARCO', '" +
            BANCODADOS.msgMilProjects[BANCODADOS.countReg].st + "' AS 'STATUS_MARCO', '" +
            BANCODADOS.msgMilProjects[BANCODADOS.countReg].up + "' AS 'ATUALIZACAO_MARCO'";
        BANCODADOS.countReg++;
        for (var i = 1; (BANCODADOS.countReg < BANCODADOS.msgMilProjects.length) && (i < BANCODADOS.maxReg) ; BANCODADOS.countReg++, i++) {
            Dados += " UNION ALL SELECT " + BANCODADOS.countReg + ", '" +
            BANCODADOS.msgMilProjects[BANCODADOS.countReg].id + "', '" +
            BANCODADOS.msgMilProjects[BANCODADOS.countReg].pjid + "', '" +
            BANCODADOS.msgMilProjects[BANCODADOS.countReg].pfid + "', '" +
            BANCODADOS.msgMilProjects[BANCODADOS.countReg].ml + "', '" +
            BANCODADOS.msgMilProjects[BANCODADOS.countReg].st + "', '" +
            BANCODADOS.msgMilProjects[BANCODADOS.countReg].up + "'";
        }
        trans.executeSql(Dados, [], null, null);
    },

    // Insere Projetos
    insertProjects: function (trans) {
        var now = new Date();
        console.log("insertProjects - Datahora: " + now);

        //*************************************************************************
        //**************************************************************************
        //INCLUSÃO DE DADOS NA TABELA DE PROJETOS
        //**************************************************************************
        //**************************************************************************
        //console.log("Projetos - inserindo " + ((BANCODADOS.msgProjects.length - BANCODADOS.countReg) > BANCODADOS.maxReg ? BANCODADOS.maxReg : (BANCODADOS.msgProjects.length - BANCODADOS.countReg)) + " registros" + " (" + (BANCODADOS.countReg + ((BANCODADOS.msgProjects.length -BANCODADOS.countReg) > BANCODADOS.maxReg ? BANCODADOS.maxReg: (BANCODADOS.msgProjects.length -BANCODADOS.countReg))) + "/" +BANCODADOS.msgProjects.length + ")");
        Dados = "";
        Dados += "INSERT INTO PROJECTS SELECT " + BANCODADOS.countReg + " AS 'iid', '" +
            BANCODADOS.msgProjects[BANCODADOS.countReg].id + "' AS 'ID', '" +
            (BANCODADOS.msgProjects[BANCODADOS.countReg].nm != null ? BANCODADOS.msgProjects[BANCODADOS.countReg].nm.replace(/'/g, "''") : "") + "' AS 'NAME_PROJETO', '" +
            BANCODADOS.msgProjects[BANCODADOS.countReg].gid + "' AS 'META_ID', '" +
            (BANCODADOS.msgProjects[BANCODADOS.countReg].pjt != null ? BANCODADOS.msgProjects[BANCODADOS.countReg].pjt.replace(/'/g, "''") : "") + "' AS 'TIPO_PROJETO', '" +
            (BANCODADOS.msgProjects[BANCODADOS.countReg].dis != null ? BANCODADOS.msgProjects[BANCODADOS.countReg].dis.replace(/'/g, "''") : "") + "' AS 'DISTRITO_PROJETO', '" +
            (BANCODADOS.msgProjects[BANCODADOS.countReg].add != null ? BANCODADOS.msgProjects[BANCODADOS.countReg].add.replace(/'/g, "''") : "") + "' AS 'ENDERECO_PROJETO', '" +
            BANCODADOS.msgProjects[BANCODADOS.countReg].lat + "' AS 'LATITUDE_PROJETO', '" +
            BANCODADOS.msgProjects[BANCODADOS.countReg].long + "' AS 'LONGITUDE_PROJETO', '" +
            BANCODADOS.msgProjects[BANCODADOS.countReg].b13 + "' AS 'B13_PROJETO', '" +
            BANCODADOS.msgProjects[BANCODADOS.countReg].b14 + "' AS 'B14_PROJETO', '" +
            BANCODADOS.msgProjects[BANCODADOS.countReg].b15 + "' AS 'B15_PROJETO', '" +
            BANCODADOS.msgProjects[BANCODADOS.countReg].b16 + "' AS 'B16_PROJETO', '" +
            (BANCODADOS.msgProjects[BANCODADOS.countReg].q1 != null ? BANCODADOS.msgProjects[BANCODADOS.countReg].q1.replace(/'/g, "''") : "") + "' AS 'Q1_PROJETO', '" +
            (BANCODADOS.msgProjects[BANCODADOS.countReg].q2 != null ? BANCODADOS.msgProjects[BANCODADOS.countReg].q2.replace(/'/g, "''") : "") + "' AS 'Q2_PROJETO', '" +
            (BANCODADOS.msgProjects[BANCODADOS.countReg].q3 != null ? BANCODADOS.msgProjects[BANCODADOS.countReg].q3.replace(/'/g, "''") : "") + "' AS 'Q3_PROJETO', '" +
            (BANCODADOS.msgProjects[BANCODADOS.countReg].q4 != null ? BANCODADOS.msgProjects[BANCODADOS.countReg].q4.replace(/'/g, "''") : "") + "' AS 'Q4_PROJETO', '" +
            (BANCODADOS.msgProjects[BANCODADOS.countReg].q5 != null ? BANCODADOS.msgProjects[BANCODADOS.countReg].q5.replace(/'/g, "''") : "") + "' AS 'Q5_PROJETO', '" +
            (BANCODADOS.msgProjects[BANCODADOS.countReg].q6 != null ? BANCODADOS.msgProjects[BANCODADOS.countReg].q6.replace(/'/g, "''") : "") + "' AS 'Q6_PROJETO', '" +
            (BANCODADOS.msgProjects[BANCODADOS.countReg].lot != null ? BANCODADOS.msgProjects[BANCODADOS.countReg].lot.replace(/'/g, "''") : "") + "' AS 'TIPO_LOCAL_PROJETO', '" +
            BANCODADOS.msgProjects[BANCODADOS.countReg].up + "' AS 'ATUALIZACAO_PROJETO', '" +
            (BANCODADOS.msgProjects[BANCODADOS.countReg].acp + "%") + "' AS 'ACOMPANHAMENTO_PROJETO'";
        BANCODADOS.countReg++;
        for (var i = 1; (BANCODADOS.countReg < BANCODADOS.msgProjects.length) && (i < BANCODADOS.maxReg); BANCODADOS.countReg++, i++) {
            Dados += " UNION ALL SELECT " + BANCODADOS.countReg + ", '" +
            BANCODADOS.msgProjects[BANCODADOS.countReg].id + "', '" +
            (BANCODADOS.msgProjects[BANCODADOS.countReg].nm != null ? BANCODADOS.msgProjects[BANCODADOS.countReg].nm.replace(/'/g, "''") : "") + "', '" +
            BANCODADOS.msgProjects[BANCODADOS.countReg].gid + "', '" +
            (BANCODADOS.msgProjects[BANCODADOS.countReg].pjt != null ? BANCODADOS.msgProjects[BANCODADOS.countReg].pjt.replace(/'/g, "''") : "") + "', '" +
            (BANCODADOS.msgProjects[BANCODADOS.countReg].dis != null ? BANCODADOS.msgProjects[BANCODADOS.countReg].dis.replace(/'/g, "''") : "") + "', '" +
            (BANCODADOS.msgProjects[BANCODADOS.countReg].add != null ? BANCODADOS.msgProjects[BANCODADOS.countReg].add.replace(/'/g, "''") : "") + "', '" +
            BANCODADOS.msgProjects[BANCODADOS.countReg].lat + "', '" +
            BANCODADOS.msgProjects[BANCODADOS.countReg].long + "', '" +
            BANCODADOS.msgProjects[BANCODADOS.countReg].b13 + "', '" +
            BANCODADOS.msgProjects[BANCODADOS.countReg].b14 + "', '" +
            BANCODADOS.msgProjects[BANCODADOS.countReg].b15 + "', '" +
            BANCODADOS.msgProjects[BANCODADOS.countReg].b16 + "', '" +
            (BANCODADOS.msgProjects[BANCODADOS.countReg].q1 != null ? BANCODADOS.msgProjects[BANCODADOS.countReg].q1.replace(/'/g, "''") : "") + "', '" +
            (BANCODADOS.msgProjects[BANCODADOS.countReg].q2 != null ? BANCODADOS.msgProjects[BANCODADOS.countReg].q2.replace(/'/g, "''") : "") + "', '" +
            (BANCODADOS.msgProjects[BANCODADOS.countReg].q3 != null ? BANCODADOS.msgProjects[BANCODADOS.countReg].q3.replace(/'/g, "''") : "") + "', '" +
            (BANCODADOS.msgProjects[BANCODADOS.countReg].q4 != null ? BANCODADOS.msgProjects[BANCODADOS.countReg].q4.replace(/'/g, "''") : "") + "', '" +
            (BANCODADOS.msgProjects[BANCODADOS.countReg].q5 != null ? BANCODADOS.msgProjects[BANCODADOS.countReg].q5.replace(/'/g, "''") : "") + "', '" +
            (BANCODADOS.msgProjects[BANCODADOS.countReg].q6 != null ? BANCODADOS.msgProjects[BANCODADOS.countReg].q6.replace(/'/g, "''") : "") + "', '" +
            (BANCODADOS.msgProjects[BANCODADOS.countReg].lot != null ? BANCODADOS.msgProjects[BANCODADOS.countReg].lot.replace(/'/g, "''") : "") + "', '" +
            BANCODADOS.msgProjects[BANCODADOS.countReg].up + "', '" +
            (BANCODADOS.msgProjects[BANCODADOS.countReg].acp + "%") + "'";
        }
        trans.executeSql(Dados, [], null, null);
    },

    // Insere Subprefeituras
    insertPrefectures: function (trans) {
        var now = new Date();
        console.log("insertPrefectures - Datahora: " + now);

        //*************************************************************************
        //**************************************************************************
        //INCLUSÃO DE DADOS NA TABELA DE SUBPREFEITURAS
        //**************************************************************************
        //**************************************************************************
        //console.log("Subprefeituras - inserindo " + BANCODADOS.msgPrefectures.length + " registros");
        Dados = "";
        Dados += "INSERT INTO PREFECTURES SELECT 1 AS 'iid', '" +
            BANCODADOS.msgPrefectures[0].id + "' AS 'ID', '" +
            (BANCODADOS.msgPrefectures[0].nm != null ? BANCODADOS.msgPrefectures[0].nm.replace(/'/g, "''") : "") + "' AS 'NAME', '" +
            BANCODADOS.msgPrefectures[0].cd + "' AS 'SIGLA', '" +
            BANCODADOS.msgPrefectures[0].lat + "' AS 'LATITUDE', '" +
            BANCODADOS.msgPrefectures[0].long + "' AS 'LONGITUDE', '" +
            BANCODADOS.msgPrefectures[0].up + "' AS 'ATUALIZACAO'";
        for (var i = 1; i < BANCODADOS.msgPrefectures.length; i++) {
            Dados += " UNION ALL SELECT " + i + ", '" +
            BANCODADOS.msgPrefectures[i].id + "', '" +
            (BANCODADOS.msgPrefectures[i].nm != null ? BANCODADOS.msgPrefectures[i].nm.replace(/'/g, "''") : "") + "', '" +
            BANCODADOS.msgPrefectures[i].cd + "', '" +
            BANCODADOS.msgPrefectures[i].lat + "', '" +
            BANCODADOS.msgPrefectures[i].long + "', '" +
            BANCODADOS.msgPrefectures[i].up + "'";
        }
        trans.executeSql(Dados, [], null, null);
    },

    // Insere Metas
    insertGoals: function (trans) {
        var now = new Date();
        console.log("insertGoals - Datahora: " + now);

        //*************************************************************************
        //**************************************************************************
        //INCLUSÃO DE DADOS NA TABELA DE INFORMAÇÕES DAS METAS
        //**************************************************************************
        //**************************************************************************
        //console.log("Metas - inserindo " + BANCODADOS.msgGoals.length + " registros");
        Dados = "";
        Dados += "INSERT INTO GOALS SELECT 1 AS 'iid', '" +
            BANCODADOS.msgGoals[0].id + "' AS 'ID_META', '" +
            (BANCODADOS.msgGoals[0].nm != null ? BANCODADOS.msgGoals[0].nm.replace(/'/g, "''") : "") + "' AS 'NAME_META', '" +
            BANCODADOS.msgGoals[0].st + "' AS 'STATUS_META', '" +
            (BANCODADOS.msgGoals[0].acm + "%") + "' AS 'ACOMPANHAMENTO_META', '" +
//            "R$ " + UIS.formatoMonetario(BANCODADOS.msgGoals[0].tc.toFixed(2)) + "' AS 'PREVISTO_META', '" +
            "R$ " + UIS.formatoMonetario(BANCODADOS.msgGoals[0].tc) + "' AS 'PREVISTO_META', '" +
            BANCODADOS.msgGoals[0].ecm + "' AS 'EXECUTADO_META', '" +
            BANCODADOS.msgGoals[0].gup + "' AS 'ATUALIZACAO_META', '" +
            (BANCODADOS.msgGoals[0].qp1 != null ? BANCODADOS.msgGoals[0].qp1.replace(/'/g, "''") : "") + "' AS 'QP1_META', '" +
            (BANCODADOS.msgGoals[0].qp2 != null ? BANCODADOS.msgGoals[0].qp2.replace(/'/g, "''") : "") + "' AS 'QP2_META', '" +
            (BANCODADOS.msgGoals[0].qp3 != null ? BANCODADOS.msgGoals[0].qp3.replace(/'/g, "''") : "") + "' AS 'QP3_META', '" +
            (BANCODADOS.msgGoals[0].qp4 != null ? BANCODADOS.msgGoals[0].qp4.replace(/'/g, "''") : "") + "' AS 'QP4_META', '" +
            (BANCODADOS.msgGoals[0].qp5 != null ? BANCODADOS.msgGoals[0].qp5.replace(/'/g, "''") : "") + "' AS 'QP5_META', '" +
            (BANCODADOS.msgGoals[0].qp6 != null ? BANCODADOS.msgGoals[0].qp6.replace(/'/g, "''") : "") + "' AS 'QP6_META', '" +
            (BANCODADOS.msgGoals[0].onm != null ? BANCODADOS.msgGoals[0].onm.replace(/'/g, "''") : "") + "' AS 'NAME_OBJETIVO', '" +
            BANCODADOS.msgGoals[0].oup + "' AS 'ATUALIZACAO_OBJETIVO', '" +
            (BANCODADOS.msgGoals[0].xnm != null ? BANCODADOS.msgGoals[0].xnm.replace(/'/g, "''") : "") + "' AS 'NAME_EIXO', '" +
            BANCODADOS.msgGoals[0].xup + "' AS 'ATUALIZACAO_EXIT', '" +
            (BANCODADOS.msgGoals[0].anm != null ? BANCODADOS.msgGoals[0].anm.replace(/'/g, "''") : "") + "' AS 'NAME_ARTICULACAO', '" +
            BANCODADOS.msgGoals[0].aup + "' AS 'ATUALIZACAO_ARTICULACAO', '" +
            (BANCODADOS.msgGoals[0].snm != null ? BANCODADOS.msgGoals[0].snm.replace(/'/g, "''") : "") + "' AS 'NAME_SECRETARIA', '" +
            BANCODADOS.msgGoals[0].sup + "' AS 'ATUALIZACAO_SECRETARIA'";
        for (var i = 1; i < BANCODADOS.msgGoals.length; i++) {
            Dados += " UNION ALL SELECT " + i + ", '" +
            BANCODADOS.msgGoals[i].id + "', '" +
            (BANCODADOS.msgGoals[i].nm != null ? BANCODADOS.msgGoals[i].nm.replace(/'/g, "''") : "") + "', '" +
            BANCODADOS.msgGoals[i].st + "', '" +
            (BANCODADOS.msgGoals[i].acm + "%") + "', '" +
//            "R$ " + UIS.formatoMonetario(BANCODADOS.msgGoals[i].tc.toFixed(2)) + "', '" +
            "R$ " + UIS.formatoMonetario(BANCODADOS.msgGoals[i].tc) + "', '" +
            BANCODADOS.msgGoals[i].ecm + "', '" +
            BANCODADOS.msgGoals[i].gup + "', '" +
            (BANCODADOS.msgGoals[i].qp1 != null ? BANCODADOS.msgGoals[i].qp1.replace(/'/g, "''") : "") + "', '" +
            (BANCODADOS.msgGoals[i].qp2 != null ? BANCODADOS.msgGoals[i].qp2.replace(/'/g, "''") : "") + "', '" +
            (BANCODADOS.msgGoals[i].qp3 != null ? BANCODADOS.msgGoals[i].qp3.replace(/'/g, "''") : "") + "', '" +
            (BANCODADOS.msgGoals[i].qp4 != null ? BANCODADOS.msgGoals[i].qp4.replace(/'/g, "''") : "") + "', '" +
            (BANCODADOS.msgGoals[i].qp5 != null ? BANCODADOS.msgGoals[i].qp5.replace(/'/g, "''") : "") + "', '" +
            (BANCODADOS.msgGoals[i].qp6 != null ? BANCODADOS.msgGoals[i].qp6.replace(/'/g, "''") : "") + "', '" +
            (BANCODADOS.msgGoals[i].onm != null ? BANCODADOS.msgGoals[i].onm.replace(/'/g, "''") : "") + "', '" +
            BANCODADOS.msgGoals[i].oup + "', '" +
            (BANCODADOS.msgGoals[i].xnm != null ? BANCODADOS.msgGoals[i].xnm.replace(/'/g, "''") : "") + "', '" +
            BANCODADOS.msgGoals[i].xup + "', '" +
            (BANCODADOS.msgGoals[i].anm != null ? BANCODADOS.msgGoals[i].anm.replace(/'/g, "''") : "") + "', '" +
            BANCODADOS.msgGoals[i].aup + "', '" +
            (BANCODADOS.msgGoals[i].snm != null ? BANCODADOS.msgGoals[i].snm.replace(/'/g, "''") : "") + "', '" +
            BANCODADOS.msgGoals[i].sup + "'";
        }
        trans.executeSql(Dados, [], null, null);

    },

    // Cria as tabelas
    createTables: function (trans) {
        var now = new Date();
        console.log("createPopulateTables - Datahora: " + now);

        //*************************************************************************
        //**************************************************************************
        //CRIAÇÃO DA TABELA DE INFORMAÇÕES DAS METAS
        //**************************************************************************
        //**************************************************************************
        console.log("Criando tabela de Metas");
        trans.executeSql("DROP TABLE IF EXISTS GOALS", [], null, null);
        //trans.executeSql("CREATE TABLE GOALS (iid INTEGER PRIMARY KEY, \
        trans.executeSql("CREATE TABLE GOALS (iid INTEGER, \
                            ID_META TEXT, \
                            NAME_META TEXT, \
                            STATUS_META TEXT, \
                            ACOMPANHAMENTO_META TEXT, \
                            PREVISTO_META TEXT, \
                            EXECUTADO_META TEXT, \
                            ATUALIZACAO_META TEXT, \
                            QP1_META TEXT, \
                            QP2_META TEXT, \
                            QP3_META TEXT, \
                            QP4_META TEXT, \
                            QP5_META TEXT, \
                            QP6_META TEXT, \
                            NAME_OBJETIVO TEXT, \
                            ATUALIZACAO_OBJETIVO TEXT, \
                            NAME_EIXO TEXT, \
                            ATUALIZACAO_EXIT TEXT, \
                            NAME_ARTICULACAO TEXT, \
                            ATUALIZACAO_ARTICULACAO TEXT, \
                            NAME_SECRETARIA TEXT, \
                            ATUALIZACAO_SECRETARIA TEXT \
                            )", [], null, null);

        console.log("Criando tabela Objectives");
        trans.executeSql("DROP TABLE IF EXISTS Objectives", [], null, null);
        trans.executeSql("CREATE TABLE Objectives (id INTEGER PRIMARY KEY, idText TEXT, name TEXT, description TEXT, created_at TEXT, updated_at TEXT)", [], null, null);

        //*************************************************************************
        //**************************************************************************
        //CRIAÇÃO DA TABELA DE LISTA DE SUBPREFEITURAS
        //**************************************************************************
        //**************************************************************************
        console.log("Criando tabela de subprefeituras");
        trans.executeSql("DROP TABLE IF EXISTS PREFECTURES", [], null, null);
        //trans.executeSql("CREATE TABLE PREFECTURES (iid INTEGER PRIMARY KEY, \
        trans.executeSql("CREATE TABLE PREFECTURES (iid INTEGER, \
                            ID TEXT, \
                            NAME TEXT, \
                            SIGLA TEXT, \
                            LATITUDE TEXT, \
                            LONGITUDE TEXT, \
                            ATUALIZACAO TEXT \
                            )", [], null, null);

        //*************************************************************************
        //**************************************************************************
        //CRIAÇÃO DA TABELA DE PROJETOS
        //**************************************************************************
        //**************************************************************************
        console.log("Criando tabela Projetos");
        trans.executeSql("DROP TABLE IF EXISTS PROJECTS", [], null, null);
        //trans.executeSql("CREATE TABLE PROJECTS (iid INTEGER PRIMARY KEY, \
        trans.executeSql("CREATE TABLE PROJECTS (iid INTEGER, \
                            ID TEXT, \
                            NAME_PROJETO TEXT, \
                            META_ID TEXT, \
                            TIPO_PROJETO TEXT, \
                            DISTRITO_PROJETO TEXT, \
                            ENDERECO_PROJETO TEXT, \
                            LATITUDE_PROJETO TEXT, \
                            LONGITUDE_PROJETO TEXT, \
                            B13_PROJETO TEXT, \
                            B14_PROJETO TEXT, \
                            B15_PROJETO TEXT, \
                            B16_PROJETO TEXT, \
                            Q1_PROJETO TEXT, \
                            Q2_PROJETO TEXT, \
                            Q3_PROJETO TEXT, \
                            Q4_PROJETO TEXT, \
                            Q5_PROJETO TEXT, \
                            Q6_PROJETO TEXT, \
                            TIPO_LOCAL_PROJETO TEXT, \
                            ATUALIZACAO_PROJETO TEXT, \
                            ACOMPANHAMENTO_PROJETO TEXT \
                            )", [], null, null);

        //*************************************************************************
        //**************************************************************************
        //CRIAÇÃO DA TABELA DE MARCOS DE PROJETO
        //**************************************************************************
        //**************************************************************************
        console.log("Criando tabela de marcos de projeto");
        trans.executeSql("DROP TABLE IF EXISTS MILPROJECTS", [], null, null);
        //trans.executeSql("CREATE TABLE MILPROJECTS (iid INTEGER PRIMARY KEY, \
        trans.executeSql("CREATE TABLE MILPROJECTS (iid INTEGER, \
                            ID TEXT, \
                            PROJETO_ID TEXT, \
                            PREFEITURA_ID TEXT, \
                            MARCO TEXT, \
                            STATUS_MARCO TEXT, \
                            ATUALIZACAO_MARCO TEXT \
                            )", [], null, null);

        //*************************************************************************
        //**************************************************************************
        //CRIAÇÃO DA TABELA DE EVOLUÇÃO MENSAL DE PROJETOS
        //**************************************************************************
        //**************************************************************************
        console.log("Criando tabela de evolução mensal de projeto");
        trans.executeSql("DROP TABLE IF EXISTS MONPROJECTS", [], null, null);
        trans.executeSql("CREATE TABLE MONPROJECTS (iid INTEGER PRIMARY KEY, \
                            ID TEXT, \
                            PROJETO_ID TEXT, \
                            PREFEITURA_ID TEXT, \
                            ALVO_META TEXT, \
                            MES_ANO TEXT, \
                            VALOR_MENSAL TEXT, \
                            ATUALIZACAO_MENSAL TEXT \
                            )", [], null, null);
    },

    insertMonProjectsFail: function (err) {
        console.log("insertMonProjectsFail - msg: " + err);
        BANCODADOS.cbFail_f("Erro na inclusão de Evolução Mensal de Projetos - msg: " + err);
    },

    insertMonProjectsSuccess: function () {
        console.log("insertMonProjectsSuccess");
        if (BANCODADOS.countReg == BANCODADOS.msgMonProjects.length) {
            // não há mais registros a serem inseridos
            BANCODADOS.getStatusGoals();
        }
        else {
            // ainda há registros a serem inseridos
            BANCODADOS.dbObj.transaction(BANCODADOS.insertMonProjects, BANCODADOS.insertMonProjectsFail, BANCODADOS.insertMonProjectsSuccess);
        }
    },

    insertMilProjectsFail: function (err) {
        console.log("insertMilProjectsFail - msg: " + err);
        BANCODADOS.cbFail_f("Erro na inclusão de Marcos de Projetos - msg: " + err);
    },

    insertMilProjectsSuccess: function () {
        console.log("insertMilProjectsSuccess");
        if (BANCODADOS.countReg == BANCODADOS.msgMilProjects.length) {
            // não há mais registros a serem inseridos
            BANCODADOS.countReg = 0;
            BANCODADOS.maxReg = 100;    // Número de registros por comando para evolução mensal de projetos
            BANCODADOS.dbObj.transaction(BANCODADOS.insertMonProjects, BANCODADOS.insertMonProjectsFail, BANCODADOS.insertMonProjectsSuccess);
        }
        else {
            // ainda há registros a serem inseridos
            BANCODADOS.dbObj.transaction(BANCODADOS.insertMilProjects, BANCODADOS.insertMilProjectsFail, BANCODADOS.insertMilProjectsSuccess);
        }
    },

    insertProjectsFail: function (err) {
        console.log("insertProjectsFail - msg: " + err);
        BANCODADOS.cbFail_f("Erro na inclusão de dados de Projetos - msg: " + err);
    },

    insertProjectsSuccess: function () {
        console.log("insertProjectsSuccess");
        if (BANCODADOS.countReg == BANCODADOS.msgProjects.length) {
            // não há mais registros a serem inseridos
            BANCODADOS.countReg = 0;
            BANCODADOS.maxReg = 100;    // Número de registro por comando para marcos de projetos
            BANCODADOS.dbObj.transaction(BANCODADOS.insertMilProjects, BANCODADOS.insertMilProjectsFail, BANCODADOS.insertMilProjectsSuccess);
        }
        else {
            // ainda há registros a serem inseridos
            BANCODADOS.dbObj.transaction(BANCODADOS.insertProjects, BANCODADOS.insertProjectsFail, BANCODADOS.insertProjectsSuccess);
        }
    },

    insertPrefecturesFail: function (err) {
        console.log("insertPrefecturesFail - msg: " + err);
        BANCODADOS.cbFail_f("Erro na inclusão de dados de Subprefeituras - msg: " + err);
    },

    insertPrefecturesSuccess: function () {
        console.log("insertPrefecturesSuccess");
        BANCODADOS.countReg = 0;
        BANCODADOS.maxReg = 100;        // Número de registros por comando para projetos
        BANCODADOS.dbObj.transaction(BANCODADOS.insertProjects, BANCODADOS.insertPrefecturesFail, BANCODADOS.insertProjectsSuccess);
    },

    insertGoalsFail: function (err) {
        console.log("insertGoalsFail - msg: " + err);
        BANCODADOS.cbFail_f("Erro na inclusão de dados de Metas - msg: " + err);
    },

    insertGoalsSuccess: function () {
        console.log("insertGoalsSuccess");
        BANCODADOS.countReg = 0;
        BANCODADOS.maxReg = 100;
        BANCODADOS.dbObj.transaction(BANCODADOS.insertPrefectures, BANCODADOS.insertGoalsFail, BANCODADOS.insertPrefecturesSuccess);
    },

    createTablesFail: function (err) {
        console.log("createTablesFail - msg: " + err);
        BANCODADOS.cbFail_f("Erro na criação das tabelas do banco de dados - msg: " + err);
    },

    createTablesSuccess: function () {
        console.log("createTablesSuccess");
        BANCODADOS.countReg = 0;
        BANCODADOS.maxReg = 100;
        BANCODADOS.dbObj.transaction(BANCODADOS.insertGoals, BANCODADOS.createTablesFail, BANCODADOS.insertGoalsSuccess);
    },

    // Cria banco e insere os dados
	createDB: function () {
	    console.log("createDB - falha: " + BANCODADOS.cbFail_f);
	    try {
	        this.dbObj.transaction(BANCODADOS.createTables, BANCODADOS.cbFail_f, BANCODADOS.createTablesSuccess);
        }
	    catch (err) {
	        alert("createDB() exception: " + err.msg);
	    }
	},

    // Executa comando SQL
	sqlCmdDB: function (sqlCmd, arg, suc, fail) {
	    console.log("sqlCmdDB");
	    console.log("sqlCmd = " + sqlCmd + "\nArgumentos = " + arg);
	    // Executa o comando SQL no banco de dados
	    this.dbObj.transaction(function (t) {
            t.executeSql(sqlCmd, arg, suc, fail);
	    });
	},
    // **********************************************************************************************************
    // Fim - BANCO DE DADOS
    // **********************************************************************************************************
}
