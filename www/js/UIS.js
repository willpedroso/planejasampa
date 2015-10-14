/*  * Controle de interfaces  http://stackoverflow.com/questions/1554893/google-maps-api-v3-infowindow-not-sizing-correctly
 */

var UIS = {

    // Divs
    div_metasObjetivos:null,
    div_metasStatus: null,
    div_listaMetas: null,
    div_detalhesMeta: null,
    div_detalhesProjeto: null,
    div_configuracao: null,
    div_atualizacao: null,
    div_termosUso: null,
    div_desenvolvimento: null,
    div_footer: null,
    div_ultima_atualizacao: null,
    div_listaSubprefeituras: null,
    select_ListaSubprefeituras: null,
    select_ListaSubprefeiturasMetas: null,
    array_Divs: [],

    // ULs
    ul_listaObjetivos: null,
    ul_ListaMetasStatus: null,
    ul_ListaMetas: null,
    ul_DetalhesMeta: null,
    ul_listaProjetosDeMetas:null,

    // Ações
    bt_showMetasObjetivos: null,
    bt_showMetasStatus: null,
    bt_Voltar: null,
    bt_Configure: null,
    atualizacaoDados: null,
    termosUso: null,
    desenvolvimento: null,
    atualizacao_Automatica: null,
    bt_Subprefeituras: null,

    // touch - scroll
    dragging: false,
    bodyPM: null,

    // Texto para status de metas
    txtStatusMetas: [],
    txtTipoProjeto: [],
    txtNomeFases: [],
    touchEndEvent:null,

    //flag que avisa se a animacao esta rodando
    animandovoltar:false,

    // Variáveis usadas no header das telas
    tipoMeta: null,
    subprefSelecionada: null,
    metaSelecionada: null,

    // Armazenagem da lista de metas
    varListaMetas: [],

    // Div para aguarde
    div_Aguarde: null,
    msg_Aguarde: null,

    // Controle de click
    aguardaTransicaoTela: false,
        
    configListeners: function () {
        // Texto para status de metas
        this.txtStatusMetas[1] = "Metas não iniciadas";
        this.txtStatusMetas[2] = "Metas em andamento";
        this.txtStatusMetas[3] = "Metas em andamento com benefícios à população";
        this.txtStatusMetas[4] = "Metas concluídas";
        this.txtStatusMetas[5] = "Metas superadas";

        // Texto para tipos de projeto
        this.txtTipoProjeto[0] = "Tipo 0";
        this.txtTipoProjeto[1] = "Construção de equipamento";
        this.txtTipoProjeto[2] = "Obras de infraestrutura";
        this.txtTipoProjeto[3] = "Novos equipamentos em imóvel alugado";
        this.txtTipoProjeto[4] = "Equipamentos readequados";
        this.txtTipoProjeto[5] = "Novos órgãos ou estruturas administrativas";
        this.txtTipoProjeto[6] = "Sistemas";
        this.txtTipoProjeto[7] = "Atos Normativos";
        this.txtTipoProjeto[8] = "Novos serviços ou benefícios";

        // Texto para nome das fases
        this.txtNomeFases[0] = "Definição de Terreno (10%)";
        this.txtNomeFases[1] = "Projeto Básico (5%)";
        this.txtNomeFases[2] = "Garantia da fonte de financiamento (10%)";
        this.txtNomeFases[3] = "Licenciamento (5%)";
        this.txtNomeFases[4] = "Licitação da obra (10%)";
        this.txtNomeFases[5] = "Obras - Fase 1 (20%)";
        this.txtNomeFases[6] = "Obras - Fase 2 (35%)";
        this.txtNomeFases[7] = "Estruturação para funcionamento (5%)";

        this.div_metasObjetivos = $("#div_metasObjetivos");
	    this.div_metasStatus = $("#div_metasStatus");
	    this.div_listaMetas = $("#div_listaMetas");
	    this.div_detalhesMeta = $("#div_detalhesMeta");
	    this.div_detalhesProjeto = $("#div_detalhesProjeto");
	    this.div_configuracao = $("#div_configuracao");
	    this.div_atualizacao = $("#div_atualizacao");
	    this.div_termosUso = $("#div_termosUso");
	    this.div_desenvolvimento = $("#div_desenvolvimento");
	    this.div_footer = $("#div_footer");
	    this.div_ultima_atualizacao = $("#div_ultima_atualizacao");
	    this.div_listaSubprefeituras = $("#listaSubprefeituras");
        this.select_ListaSubprefeituras = $("#selectListaSubprefeituras");
        this.select_ListaSubprefeiturasMetas = $("#listaSubprefeituras_metas");
        this.listaMetasSelect = $("#lista_metas_select");

	    this.ul_ListaMetas = $("#ulListaMetas");
	    this.ul_listaObjetivos = $("#ulListaObjetivos");
	    this.ul_ListaMetasStatus = $("#ulListaMetasStatus");
	    this.ul_DetalhesMeta = $("#ulDetalhesMeta");
	    this.ul_listaProjetosDeMetas = $("#listaProjetosDeMetas");

        this.div_Aguarde = $("#telaAguarde");
        this.msg_Aguarde = $("#cont_telaAguarde");

	    //console.log("****",this.ul_listaProjetosDeMetas)

	    this.bt_showMetasObjetivos = $("#bt_showMetasObjetivos");
	    this.bt_showMetasStatus = $("#bt_showMetasStatus");
	    this.bt_Voltar = $("#bt_Voltar");
	    this.bt_Configure = $("#bt_Configure");
	    this.atualizacaoDados = $("#atualizacaoDados");
	    this.termosUso = $("#termosUso");
	    this.desenvolvimento = $("#desenvolvimento");
	    this.atualizacao_Automatica = $("#atualizacao_Automatica");
	    this.bt_Subprefeituras = $("#bt_Subprefeituras");
        this.touchEndEvent = ('ontouchend' in window ? 'touchend' : 'mouseup');

	    this.bodyPM = $("body");

        // Recupera a data da última atualização
	    if (localStorage.getItem("lastUpdateDate") == null) {
	        // Não há data da última atualização, deixa em branco
	        //console.log("Não há data da última atualização");
	    }
	    else {
	        //console.log("Data da última atualização = " + localStorage.lastUpdateDate);
	        this.div_ultima_atualizacao.html(localStorage.lastUpdateDate);
        }

        // Recupera flag de atualização automática
	    if (localStorage.getItem("autoUpdate") == null) {
            //console.log("Não há flag autoUpdate")
	        this.atualizacao_Automatica.prop("checked", false);
	        localStorage.setItem("autoUpdate", 0);
	    }
	    else {
	        //console.log("autoUpdate armazenado = " + localStorage.autoUpdate);
	        this.atualizacao_Automatica.prop("checked", localStorage.autoUpdate == 0 ? false : true);
        }

        // controle de touchmove
        this.bodyPM.bind("touchmove", (function () {
        	// Marca dragging
        	//alert("touchmove");
        	this.dragging = true;
        }).bind(this));

       this.bodyPM.bind("touchstart", (function () {
        	// Desmarca dragging
        	//alert("touchstart");
        	this.dragging = false;
        }).bind(this));

        // Checkbox de atualização automática
	    this.atualizacao_Automatica.bind("change", (function () {
	        //console.log("Checkbox onchange = " + UIS.atualizacao_Automatica.prop("checked"));
	        // Armazena o estado do flag
	        localStorage.setItem("autoUpdate", UIS.atualizacao_Automatica.prop("checked") == false ? 0 : 1);
	    }).bind(this));

        // Subprefeitura selecionada na tela de metas por status
        this.select_ListaSubprefeituras.bind("change", (function (event) {
            console.log("subprefeitura: ", this.select_ListaSubprefeituras.attr("value"));
            UIS.subprefSelecionada = $("#selectListaSubprefeituras option:selected").text();
            // Altera o item selecionado na lista de subprefeituras da tela de lista de metas
            $('#listaSubprefeituras_metas option[value="' + $("#selectListaSubprefeituras option:selected").val() + '"]').attr({ selected : "selected"});

            UIS.showTelaAguarde("Atualizando lista de metas por status...");
            BANCODADOS.getStatusGoalsPrefecture(this.select_ListaSubprefeituras.attr("value"));
        }).bind(this));

        // Subprefeitura selecionada na tela de lista de metas
        this.select_ListaSubprefeiturasMetas.bind("change", (function (event) {
            console.log("subprefeitura: ", this.select_ListaSubprefeiturasMetas.attr("value"));
            UIS.subprefSelecionada = $("#listaSubprefeituras_metas option:selected").text();
            // Altera o item selecionado na lista de subprefeituras da tela de metas por status
            $('#selectListaSubprefeituras option[value="' + $("#listaSubprefeituras_metas option:selected").val() + '"]').attr({ selected : "selected"});

            UIS.showTelaAguarde("Atualizando lista de metas...");
            BANCODADOS.getStatusGoalsPrefecture(this.select_ListaSubprefeiturasMetas.attr("value"));
        }).bind(this));

        // Altera a meta selecionada
        this.listaMetasSelect.bind("change", (function (event) {
            console.log("meta: ", this.listaMetasSelect.attr("value"));
            UIS.metaSelecionada = $("#lista_metas_select option:selected").text();
            UIS.showTelaAguarde("Atualizando detalhes da meta...");
            BANCODADOS.getGoalDetails(this.listaMetasSelect.attr("value"), UIS.showDetalhesMetas, null);
        }).bind(this));

        // Botão da combobox de subprefeituras
        // todo: apenas para testes
	    this.bt_Subprefeituras.bind("touchend", (function () {
	        if (UIS.div_listaSubprefeituras.attr("style") == "display: block") {
	            // combobox aberta, fecha
	            //UIS.div_listaSubprefeituras.attr("style", "display: none");
	        }
	        else {
	            //UIS.div_listaSubprefeituras.attr("style", "display: block");
	        }
	    }).bind(this));


        // Botão (físico) voltar do dispositivo
        document.addEventListener("backbutton", (function (e) {
            //console.log("botão físico voltar");
            //so dispara o click se a animacao da voltar estiver completa
            if(!UIS.animandovoltar){
                if (UIS.div_configuracao.attr("style") == "display: block") {
                    // Está na tela de configuração, esconde
                    UIS.div_configuracao.attr("style", "display: none");
                    UIS.array_Divs[UIS.array_Divs.length - 1].attr("style", "display: block");
                    // Verifica se houve atualização de dados
                    if (BANCODADOS.bUpdated) {
                        BANCODADOS.bUpdated = false;
                        // Houve atualização de dados, volta para a tela de metas por status
                        UIS.resetDivStack();
                    }
                    return;
                }
                if (UIS.array_Divs.length == 1){
                    // Está na primeira tela
                    if (confirm("Deseja realmente sair?") == true) {
                        e.preventDefault();
                        navigator.app.exitApp();
                    }
                    return;
                }else{
                    voltar();
                }
            }
        }), false);

	    // Botão voltar
	    this.bt_Voltar.bind(this.touchEndEvent, (function () {
             //console.log("click voltar");

            //so dispara o click se a animacao da voltar estiver completa

            if(!UIS.animandovoltar){

    	        if (UIS.div_configuracao.attr("style") == "display: block") {


                    // Está na tela de configuração, esconde
    	            UIS.div_configuracao.attr("style", "display: none");
    	            UIS.array_Divs[UIS.array_Divs.length - 1].attr("style", "display: block");
    	            // Verifica se houve atualização de dados
                    if (BANCODADOS.bUpdated) {
                        BANCODADOS.bUpdated = false;
                        // Houve atualização de dados, volta para a tela de metas por status
                        UIS.resetDivStack();
                    }
                    return;
    	        }

                if (UIS.array_Divs.length == 1){
    	            return;
                }else{
                    voltar();
                }

            }

	        //UIS.popDiv();
	    }).bind(this));

	    // Botão para visualização de metas por objetivo
	    this.bt_showMetasObjetivos.bind("touchend", (function () {
	    	// insere borda de ativo
	    	UIS.bt_showMetasObjetivos.addClass("bt_border_ativo");
	    	// remove a borda de ativo
	    	UIS.bt_showMetasStatus.removeClass("bt_border_ativo");

            //mostra a div
            UIS.div_metasStatus.attr("style", "display: none");
            UIS.div_metasObjetivos.attr("style", "display: block");
            UIS.array_Divs[0] = UIS.div_metasObjetivos;
        }).bind(this));

        // Botão para visualização de metas por status
	    this.bt_showMetasStatus.bind("touchend", (function () {
	    	// insere borda de ativo
	    	UIS.bt_showMetasStatus.addClass("bt_border_ativo");
            // remove a borda de ativo
	    	UIS.bt_showMetasObjetivos.removeClass("bt_border_ativo");

	        UIS.div_metasObjetivos.attr("style", "display: none");
	        UIS.div_metasStatus.attr("style", "display: block");
            UIS.array_Divs[0] = UIS.div_metasStatus;
        }).bind(this));

	    // Botão para visualização das configurações
	    this.bt_Configure.bind("touchend", (function () {
	    	//alert("estado = " + UIS.div_configuracao.attr("style"));
            if (UIS.div_configuracao.attr("style") == "display: none") {
            	//alert("esta none");
                // Apresenta div de configurações
                UIS.div_configuracao.attr("style", "display: block");
                UIS.array_Divs[UIS.array_Divs.length - 1].attr("style", "display: none");
            }
            else {
            	//alert("esta block")
                // Esconde div de configuração
                UIS.div_configuracao.attr("style", "display: none");
                UIS.array_Divs[UIS.array_Divs.length - 1].attr("style", "display: block");
                // Verifica se houve atualização de dados
                if (BANCODADOS.bUpdated) {
                    BANCODADOS.bUpdated = false;
                    // Houve atualização de dados, volta para a tela de metas por status
                    //console.log("Dados atualizados. Volta para a tela de metas por status");
                    UIS.resetDivStack();
                    //console.log("clicou")
                }
            }
        }).bind(this));

	    // Área de informações de atualização de dados
	    this.atualizacaoDados.bind("touchend", (function () {
            if(this.dragging == false) {
            if (UIS.div_atualizacao.attr("style") == "display: none") {
                // Apresenta as informações de atualização de dados
                UIS.div_atualizacao.attr("style", "display: block");
                // Fecha as outras divs da tela de configuração
                UIS.div_termosUso.attr("style", "display: none");
                UIS.div_desenvolvimento.attr("style", "display: none");
            }
            else {
                // Esconde as informações de atualização de dados
                UIS.div_atualizacao.attr("style", "display: none");
            }}
        }).bind(this));

	    // Área de termos de uso
	    this.termosUso.bind("touchend", (function () {
	    	if(this.dragging == false) {
	        if (UIS.div_termosUso.attr("style") == "display: none") {
	            // Apresenta os termos de uso
	            UIS.div_termosUso.attr("style", "display: block");
	            // Fecha as outras divs da tela de configuração
	            UIS.div_atualizacao.attr("style", "display: none");
	            UIS.div_desenvolvimento.attr("style", "display: none");
	        }
	        else {
	            // Esconde os termos de uso
	            UIS.div_termosUso.attr("style", "display: none");
	        }
	   		}
	    }).bind(this));

	    // Área de desenvolvimento
	    this.desenvolvimento.bind("touchend", (function () {
            if(this.dragging == false) {
            if (UIS.div_desenvolvimento.attr("style") == "display: none") {
                // Apresenta informações de desenvolvimento
                UIS.div_desenvolvimento.attr("style", "display: block");
                // Fecha as outras divs da tela de configuração
                UIS.div_termosUso.attr("style", "display: none");
                UIS.div_atualizacao.attr("style", "display: none");
            }
            else {
                // Esconde informações de desenvolvimento
                UIS.div_desenvolvimento.attr("style", "display: none");
            }}
        }).bind(this));

	    // Navegação da tela de metas por status para a tela de lista de metas
	    this.ul_ListaMetasStatus.bind("touchend", (function (event) {
            // Evita clicks durante a transição da tela
            console.log("Click!!!");
            if (UIS.aguardaTransicaoTela == true) {
                return;
            }
            UIS.aguardaTransicaoTela = true;

	        //alert("Lista de metas por status");
	        //alert("idRegistro = " + event.target.getAttribute('idRegistro'));
	        //console.log("++++++ idRegistro = " + event.target.getAttribute('idRegistro'))
            //$('#container_relativo').css({"height":"100%"});

	        if(this.dragging == false) {
                //alert("Tipo de Meta por status: " + event.target.getAttribute('idRegistro'));
                UIS.tipoMeta = UIS.txtStatusMetas[event.target.getAttribute('idRegistro')];
	        	BANCODADOS.getStatusGoalsList(event.target.getAttribute('idRegistro'), null, UIS.prepareShowListaMetas, null);
	    	}
	    }).bind(this));

	    // Navegação da tela de metas por objetivo para a tela de lista de metas
	    this.ul_listaObjetivos.bind("touchend", (function (event) {
            // Evita clicks durante a transição da tela
            console.log("Click!!!");
            if (UIS.aguardaTransicaoTela == true) {
                return;
            }
            UIS.aguardaTransicaoTela = true;

	        //alert("Lista de metas por objetivo");
	        ////alert("Lista de Objetivos \nidObjetivo: " + event.target.getAttribute('idRegistro'));
	        if(this.dragging == false) {
                //alert("Tipo de Meta por objetivo: " + event.target.getAttribute('idRegistro'));
                UIS.tipoMeta = event.target.getAttribute('idRegistro');
	        	BANCODADOS.getObjectivesGoalsList(event.target.getAttribute('idRegistro'), null, UIS.prepareShowListaMetas, null);
	    	}
	    }).bind(this));

//==>>

	    // Navegação da tela de lista de metas para a tela de detalhes da meta
	    this.ul_ListaMetas.bind("touchend", (function (event) {
            // Evita clicks durante a transição da tela
            console.log("Click!!!");
            if (UIS.aguardaTransicaoTela == true) {
                return;
            }
            UIS.aguardaTransicaoTela = true;

	        //alert("Lista de metas");
	        ////alert("Detalhes da Meta: \nidMeta: " + event.target.getAttribute('idMeta'));
            event.stopImmediatePropagation();

	        if(this.dragging == false) {
	        	BANCODADOS.getGoalDetails(event.target.getAttribute('idMeta'), UIS.showDetalhesMetas, null);
	    	}
	    }).bind(this));

	    // Navegação da tela de detalhes da meta para a tela de detalhes de um projeto
	    //this.ul_DetalhesMeta.bind("touchend mouseup", (function (event) {
	    this.ul_listaProjetosDeMetas.bind("touchend", (function (event) {
            // Evita clicks durante a transição da tela
            console.log("Click!!!");
            if (UIS.aguardaTransicaoTela == true) {
                return;
            }
            UIS.aguardaTransicaoTela = true;

	        //alert("Detalhes do Projeto \nidProjeto: " + event.target.getAttribute('idProjeto'));
	       //console.log("++++++ this.ul_DetalhesMeta.bind")

			//UIS.pushDiv(UIS.div_detalhesProjeto);

	        if(this.dragging == false) {
                //alert("Detalhes da meta");
	        	BANCODADOS.getProjectDetails(event.target.getAttribute('idProjeto'), UIS.showDetalhesProjeto, null);
	    	}
	    }).bind(this));
	},

    hideTelaAguarde: function(){
        // Esconde a tela de aguarde
        this.div_Aguarde.removeClass('dspl-blk');
        this.div_Aguarde.addClass('dspl-nn');
    },

    showTelaAguarde: function(msgAguarde){
        // Mostra a tela de aguarde
        this.div_Aguarde.removeClass('dspl-nn');
        var msg = "";
        msg += "<h3  class='font-br txt-alg-c' id='msgAguarde'>" +
                    msgAguarde +
                "</h3>";
        this.msg_Aguarde.empty();
        this.msg_Aguarde.append(msg);
        this.div_Aguarde.addClass('dspl-blk');
    },

	fakeShowHideConfiguracoes:function(){
		//console.log("++++ FAKE!!!")

		if (UIS.div_configuracao.attr("style") == "display: none") {
            	//alert("esta none");
                // Apresenta div de configurações
                UIS.div_configuracao.attr("style", "display: block");
                UIS.array_Divs[UIS.array_Divs.length - 1].attr("style", "display: none");
            }
            else {
            	//alert("esta block")
                // Esconde div de configuração
                UIS.div_configuracao.attr("style", "display: none");
                UIS.array_Divs[UIS.array_Divs.length - 1].attr("style", "display: block");
                // Verifica se houve atualização de dados
                if (BANCODADOS.bUpdated) {
                   // BANCODADOS.bUpdated = false;
                    // Houve atualização de dados, volta para a tela de metas por status
                   // //console.log("Dados atualizados. Volta para a tela de metas por status");
                   // UIS.resetDivStack();

                }
            }
	},

     // Recebe dados de retorno da consulta ao banco e prepara lista simples de dados
    prepareShowListaMetas: function(dadosBanco) {
        //alert("prepareShowListaMetas - tamanho dos dados = " + dadosBanco.rows.length);
        // prepara lista simples para showListaMetas
        var listaMetas = [];
        for (var i = 0; i < dadosBanco.rows.length; i++) {
            var s = {
                META_ID: dadosBanco.rows.item(i).ID_META,
                NAME_META: dadosBanco.rows.item(i).NAME_META,
                STATUS_META: dadosBanco.rows.item(i).STATUS_META,
                ACOMPANHAMENTO_META: dadosBanco.rows.item(i).ACOMPANHAMENTO_META
            };
            listaMetas.push(s);
        }
        //alert(listaMetas);
        UIS.showListaMetas(listaMetas, true);
    },

    // Mostra lista de metas, dados na forma de array simples
    showListaMetas: function(dados, navegaListaMetas) {
        //alert("showListaMetas - tamanho dos dados = " + dados.length);

        // Atualizar header - tipo da meta
        $("#listaMetas").empty();
        $("#listaMetas").append(UIS.tipoMeta);

        // Preenche os dados e apresenta
        var nodes = "";
        var nodesListaMetas = "";

        // Limpa a lista de metas antes de preencher
        for(var i = 0; i < UIS.varListaMetas.length; i++) {
            UIS.varListaMetas.pop();
        }

        for (var i = 0; i < dados.length; i++) {
            idDaMeta = dados[i].META_ID;
            nodes += "<li class='li_metas'><div class='meta_valor' idMeta='" +
                        idDaMeta +
                        "'><h4 idMeta='"+idDaMeta+"'>META " +
                        idDaMeta +
                        "</h4><p idMeta='"+idDaMeta+"'>" +
                        this.txtStatusMetas[dados[i].STATUS_META] +
                        "</p><h1 class='gray_3' idMeta='"+
                        idDaMeta+
                        "'>" +
                        dados[i].ACOMPANHAMENTO_META +
                        "</h1></div><div class='meta_discricao'><p idMeta='"+idDaMeta+"'>" +
                        dados[i].NAME_META +
                        "</p></div></li>";

            // monta a lista de metas para combobox
            UIS.varListaMetas.push(idDaMeta);
        }
        //alert(nodes);
        UIS.ul_ListaMetas.empty();

        UIS.ul_ListaMetas.append(nodes);

		if (navegaListaMetas == true) {
			showTela(div_listaMetas);
			UIS.pushDiv(UIS.div_listaMetas);
		}
    },


//     // Mostra lista de metas
// 	showListaMetas: function(dados) {
// 	    //alert("showListaMetas");
// 	    // Preenche os dados e apresenta
// 	    var nodes = "";
// 	    var idDaMeta ="";
// 	    for (var i = 0; i < dados.rows.length; i++) {
// 	        //nodes += "<li class='descricao_andamento'><div idMeta='" + dados.rows.item(i).ID_META + "'>" + dados.rows.item(i).NAME_META + "</div></li>";

// 	        idDaMeta = dados.rows.item(i).ID_META;

//             nodes += "<li class='li_metas'><div class='meta_valor' idMeta='" +
//             			idDaMeta +
//             			"'><h4 idMeta='"+idDaMeta+"'>META " +
//             			idDaMeta +
//             			"</h4><p idMeta='"+idDaMeta+"'>com benefício à população</p><h1 class='gray_3' idMeta='"+idDaMeta+"'>51,0%</h1></div><div class='meta_discricao'><p idMeta='"+idDaMeta+"'>" + 
//             			dados.rows.item(i).NAME_META +
//             			"</p></div></li>";
//         }
// //	    //alert(nodes);
// 	    UIS.ul_ListaMetas.empty();
// 	    UIS.ul_ListaMetas.append(nodes);

//         showTela(div_listaMetas);
// 	    UIS.pushDiv(UIS.div_listaMetas);
// 	},

    // Mostra detalhes da meta
	showDetalhesMetas: function (dados, projetos) {
	    //alert("showDetalhesMetas");
	    // Preenche os dados e apresenta
	    var nodes = "";
        var listaTiposProjetos = "";
        var projetosDistintos = [];
        var EncontrouProjeto = false;

        // Atualizar header - tipo da meta
        $("#detalhesMeta").empty();
        $("#detalhesMeta").append(UIS.tipoMeta);
        // Atualizar header - subprefeitura selecionada
        $("#status_local").empty();
        $("#status_local").append(UIS.subprefSelecionada);

        // Elimina projetos repetidos
        for (var i = 0; i < projetos.rows.length; i++) {
            EncontrouProjeto = false;
            for (var j = 0; j < projetosDistintos.length; j++) {
                if (projetos.rows.item(i).TIPO_PROJETO == projetosDistintos[j]) {
                    // Projeto já se encontra na lista projetosDistintos
                    EncontrouProjeto = true;
                    break;
                }
            }
            if (EncontrouProjeto == false) {
                // Insere projeto na lista projetosDistintos
                projetosDistintos.push(projetos.rows.item(i).TIPO_PROJETO);
            }
        }
        //alert(projetosDistintos);
        // Lista de tipos de projeto
        for (var j = 0; j < projetosDistintos.length; j++) {
            listaTiposProjetos += UIS.txtTipoProjeto[projetosDistintos[j]];
            if (j < projetosDistintos.length - 1)
                listaTiposProjetos += "<br>";
        }

	    for (var i = 0; i < dados.rows.length; i++) {
	       /* nodes += "<li><div idProjeto='" + dados.rows.item(i).ID_META + "'>" +
                        "<p>Meta: " + dados.rows.item(i).ID_META +
                        "</p><p>Status: " + UIS.txtStatusMetas[dados.rows.item(i).STATUS_META] +
                        "</p><p>Percentual: " + dados.rows.item(i).ACOMPANHAMENTO_META +
                        "</p><p>Nome: " + dados.rows.item(i).NAME_META +
                        "</p><p>Objetivo: " + dados.rows.item(i).NAME_OBJETIVO +
                        "</p><p>Articulação: " + dados.rows.item(i).NAME_ARTICULACAO +
                        "</p><p>QP1: " + dados.rows.item(i).QP1_META +
                        "</p><p>QP2: " + dados.rows.item(i).QP2_META +
                        "</p><p>QP3: " + dados.rows.item(i).QP3_META +
                        "</p><p>QP4: " + dados.rows.item(i).QP4_META +
                        "</p><p>QP5: " + dados.rows.item(i).QP5_META +
                        "</p><p>QP6: " + dados.rows.item(i).QP6_META +
                        "</p><p>Previsto: " + dados.rows.item(i).PREVISTO_META +
                        "</p><p>Executado: " + dados.rows.item(i).EXECUTADO_META +
                        "</p></div></li>";*/

                        
                        nodes+=
                        "<li class=''>"+
                            "<div class='col-50-l  marg-b-16'>" +
                                "<span class='header-verm'>META "+
                                    dados.rows.item(i).ID_META+
                                "</span><br />" +
                                "<span class='cor_cz87'>" +
                                    //"COM BENEFÍCIO À POPULAÇÃO" +
                                    UIS.txtStatusMetas[dados.rows.item(i).STATUS_META] +
                                "</span>" +
                            "</div>" +
                            "<div class='col-50-r font-4-em  marg-b-16 cor_cz3e font-b lettr-spacing-tit-pct'>" +
                                //"100%" +
                                dados.rows.item(i).ACOMPANHAMENTO_META +
                            "</div>"+
                            "<div class='hspacer-line '>" +
                            "</div>"+
                            "<p class='clear-bth marg-t-16'>" +
                                "<span class='gray_4'>"+
                                    dados.rows.item(i).NAME_META+
                                "</span>" +
                            "</p>" +
                        "</li>"+

                        "<li class='cor_cz'>" +
                            "<span class='header-verm font-15'>" +
                                "OBJETIVO" +
                            "</span><br />"+
                            dados.rows.item(i).NAME_OBJETIVO+
                        "</li>"+

                        "<li class='cor_cz'>" +
                            "<span class='header-verm font-15'>" +
                                "ARTICULAÇÃO" +
                            "</span><br />"+
                            dados.rows.item(i).NAME_ARTICULACAO+
                        "</li>"+
                        "<li class='cor_cz'>"+
                            "<span class='header-verm font-15'>" +
                                "TIPOS DE PROJETO" +
                            "</span><br />" +
                            //"listaTiposProjetos" +
                            listaTiposProjetos +
                        "</li>"+
                        "<li class='cor_cz'>" +
                            "<span class='header-verm font-15'>" +
                                "ANDAMENTO QUANTITATIVO" +
                            "</span><br />" +
                            dados.rows.item(i).QP1_META + "<br>" +
                            "<div class='hspacer-line marg-t-16 marg-b-16'>" +
                            "</div>" +
                            dados.rows.item(i).QP2_META + "<br>" +
                        "</li>"+
                        "<li  class='overfl-hdd'>"+
                            "<span class='header-verm font-15'>" +
                                "ANDAMENTO QUALITATIVO" +
                            "</span><br />" +
                            //"Para calcular o incremento bruto de beneficiários no Programa Bolsa família, devemos utilizar como referência o marco zero (janeiro de 2013) e subtrair os demais períodos de levantamento da informação. Para termos o total de inclusão, soma-se os incrementos.<br/><br/>"+
                            dados.rows.item(i).QP3_META + 
                            "<div class='hspacer-line marg-t-16 marg-b-16'>" +
                            "</div>" +
                            dados.rows.item(i).QP4_META + 
                            "<div class='hspacer-line marg-t-16 marg-b-16'>" +
                            "</div>" +
                            dados.rows.item(i).QP5_META + 
                            "<div class='hspacer-line marg-t-16 marg-b-16'>" +
                            "</div>" +
                            dados.rows.item(i).QP6_META + "<br>" +
                            "<div class='col-50-l overfl-hdd bg-cor_czf5 padd-10'>"+
                                "<span class='header-verm font-15'>" +
                                    "PREVISTO" +
                                "</span><br />"+
                                dados.rows.item(i).PREVISTO_META+
                            "</div>"+
                            "<div class='col-50-r overfl-hdd bg-cor_czf5 padd-10'>"+
                                "<span class='header-verm font-15'>" +
                                    "EXECUTADO" +
                                "</span><br />"+
                                dados.rows.item(i).EXECUTADO_META+
                            "</div>	"+
                        "</li>"+
                        "<li>"+
                            "<span class='header-verm font-15'>" +
                                "PROJETOS" +
                            "</span>"
                        "</li>"

                            listaTiposProjetos = "";
                            for (var j = 0; j < projetos.rows.length; j++) {
                                listaTiposProjetos += "<li class='cor_cz' idProjeto='" +
                                                            projetos.rows.item(j).ID +
                                                            "'>" +
                                                            projetos.rows.item(j).NAME_PROJETO +
                                                        "</li>";
                            }

                            UIS.ul_listaProjetosDeMetas.empty();
                            UIS.ul_listaProjetosDeMetas.append(listaTiposProjetos);
                            /*
                            "<ul id='listaProjetosDeMetas'>"+
                            "<li class='border-t' onclick='UIS.fakeshowDetalhesProjeto()'>Projeto 1"+
                            "</li>"+
                            "<li onclick='UIS.fakeshowDetalhesProjeto()'>Projeto 2"+
                            "</li>"+
                            "<li onclick='UIS.fakeshowDetalhesProjeto()'>Projeto 3"+
                            "</li>"+
                            "<li onclick='UIS.fakeshowDetalhesProjeto()'>Projeto 4"+
                            "</li>"+
                            "<li onclick='UIS.fakeshowDetalhesProjeto()'>Projeto 5"+
                            "</li>"+
                             "<li onclick='UIS.fakeshowDetalhesProjeto()'>Projeto 6"+
                            "</li>"+
                            "</ul>"+
                            "</li>";
                            */


		//alert(nodes);
	    }
        // Preenche a combobox de lista de metas e seleciona a meta detalhada
        var nodesListaMetas = "";
        for (var i = 0; i < UIS.varListaMetas.length; i++) {
            if (dados.rows.item(0).ID_META == UIS.varListaMetas[i]) {
                UIS.metaSelecionada = "Meta " + UIS.varListaMetas[i];
                nodesListaMetas += "<option value='" + UIS.varListaMetas[i] + "' selected>" + "Meta " + UIS.varListaMetas[i] + "</option>";
            }
            else {
                nodesListaMetas += "<option value='" + UIS.varListaMetas[i] + "'>" + "Meta " + UIS.varListaMetas[i] + "</option>";
            }
        }
        // lista de metas para combobox
        UIS.listaMetasSelect.empty();
        UIS.listaMetasSelect.append(nodesListaMetas);

	    //alert(nodes);
	    UIS.ul_DetalhesMeta.empty();
	    UIS.ul_DetalhesMeta.append(nodes);

	    //movescroll para o top
	   //$('body').scrollTop(0);
       showTela(div_detalhesMeta);

	   UIS.pushDiv(UIS.div_detalhesMeta);

       UIS.hideTelaAguarde();
	},

    // Mostra detalhes do projeto da meta
	showDetalhesProjeto: function (dados, listaSubprefeiturasAtendidas, prjFase, dadosAcompanha) {
	    //alert("showDetalhesProjeto - dados.rows.length = " + dados.rows.length);
        //alert("showDetalhesProjeto - listaSubprefeiturasAtendidas.rows.length = " + listaSubprefeiturasAtendidas.rows.length);
        //alert("showDetalhesProjeto - prjFase = " + prjFase);
        //alert("showDetalhesProjeto - dadosAcompanha.rows.length = " + dadosAcompanha.rows.length);
	    // Preenche os dados e apresenta

        // Monta lista de subprefeituras
        var listaSub = "";
       
        for (var i = 0; i < listaSubprefeiturasAtendidas.rows.length; i++) {
            listaSub += listaSubprefeiturasAtendidas.rows.item(i).NAME;
            if ((i + 1) < listaSubprefeiturasAtendidas.rows.length) {
                listaSub += ", ";
            }
        }
        var fases = "";
        var acompanha = "";

        if (prjFase == true) {
            // Projeto por fase
            var i = 0
            var situacao = "";

            fases = "<li>" +
                        "<div class='box_info'>" +
                            "<h4 class='cor_3_red'>" +
                            "FASES" +
                            "</h4>" +
                            "<ul class='list_interna_proj'>";

            for (i = 0; i < dadosAcompanha.rows.length; i++) {
                //alert ("MARCO: " + dadosAcompanha.rows.item(i).MARCO + " - STATUS_MARCO: " + dadosAcompanha.rows.item(i).STATUS_MARCO);
                if (dadosAcompanha.rows.item(i).STATUS_MARCO > 0 && dadosAcompanha.rows.item(i).STATUS_MARCO < 100) {
                    situacao = "EM ANDAMENTO";
                }
                else if (dadosAcompanha.rows.item(i).STATUS_MARCO == 0) {
                    situacao = "NÃO INICIADA";
                }
                else {
                    situacao = "CONCLUÍDA";
                }
                fases += "<li>" +
                            "<div class='border_rigth'>" +
                                "<p class='gray_4'>" +
                                    UIS.txtNomeFases[dadosAcompanha.rows.item(i).MARCO - 1] +
                                "</p>" +
                            "</div>" +
                            "<p class='text_center gray_3'>" +
                                situacao +
                            "</p>" +
                        "</li>";
            }
            // todo: (revisar) verifica se alguma fase não foi retornada do banco de dados, inclui como "NÃO INICIADA"
            if (i < UIS.txtNomeFases.length) {
                // Faltaram fases
                for (var j = i; j < UIS.txtNomeFases.length; j++) {
                    fases += "<li>" +
                                "<div class='border_rigth'>" +
                                    "<p class='gray_4'>" +
                                        UIS.txtNomeFases[j] +
                                    "</p>" +
                                "</div>" +
                                "<p class='text_center gray_3'>" +
                                    "NÃO INICIADA" +
                                "</p>" +
                            "</li>";
                }
            }

            fases +=
                                            "</ul>" +
                                        "</div>" +
                                    "</li>";

           //alert ("Fases: " + fases);
        }
        else {
            // Projeto por progresso mensal
            var ano = [];
            var acumuladoAno = [];
            var auxAno = "";
            for (var i = 0; i < dadosAcompanha.rows.length; i ++) {
                //alert ("MES_ANO: " + dadosAcompanha.rows.item(i).MES_ANO + " - VALOR_MENSAL: " + dadosAcompanha.rows.item(i).VALOR_MENSAL);
                // Armazena ano
                if (auxAno != dadosAcompanha.rows.item(i).MES_ANO.substring(0, 4)) {
                    ano.push(auxAno = dadosAcompanha.rows.item(i).MES_ANO.substring(0, 4));
                    acumuladoAno.push(0);
                }
                // Soma valor mensal
                acumuladoAno[acumuladoAno.length - 1] += parseInt(dadosAcompanha.rows.item(i).VALOR_MENSAL, 10);
            }
            // Monta html
            acompanha +=
                                    "<li>" +
                                        "<div class='box_info'>" +
                                            "<h4 class='cor_3_red'>" +
                                                "ACOMPANHAMENTO" +
                                            "</h4>";
            for (var i = 0; i < ano.length; i++) {
                acompanha +=
                                            "<h4 class='cor_3_red padding_t_10'>" +
                                                ano[i] + " - "
                                            "</h4>" +
                                            "<p class='padding_t_10 gray_3 padd-l-16 line-cz'><strong>" +
                                                acumuladoAno[i] +
                                                "</strong>" +
                                                "Fam&iacute;lias beneficiadas com o Programa Bolsa Fam&iacute;lia" +
                                            "</p>";

            }
            acompanha +=
                                        "</div>" +
                                    "</li>";
            /*
            var alerta = "";
            for (var i = 0; i < ano.length; i++) {
                alerta += "Ano: " + ano[i] + " - Acumulado: " + acumuladoAno[i] + "\r\n";
            }
            alert(alerta);
            */
        }

	    var nodes = "";
        for (var i = 0; i < dados.rows.length; i++) {
            //tipoProj = dados.rows.item(i).TIPO_PROJETO;
            //alert(dados.rows.item(i).TIPO_PROJETO);
            //alert(UIS.txtTipoProjeto[dados.rows.item(i).TIPO_PROJETO]);
	        nodes += "<div class='cor-cz-1 container-tit-subtit2'>" +
                        "<div class='box-titulo line-cz'>" +
                        // todo: dados.rows.item(i).NAME_PROJETO +
                        //"METAS J&Aacute; BENEFICIAM POPULA&Ccedil;&Atilde;O" +
                       UIS.tipoMeta +
                        "</div>" +
                        "<div  class='box-titulo line-cz''>" +
                        UIS.subprefSelecionada +
                        "</div>" +
                         "<div id='status_local' class='cor-cz-2 w-100-pct box-subtitulo line-cz'>" +
                         UIS.metaSelecionada+
                         "</div>" +
                    "</div>" +
                    "<div class='list-style reset-marg reset-padd'>" +
                            "<ul class='listaDetalheProjeto'>" +
                                "<li>" +
                                    "<div class='box_info'>" +
                                        "<div class='titulo_projetos'>" +
                                            "<h3 class='cor_3_red uppercase'>" +
                                                "Projeto" +
                                            "</h3>" +
                                            " <p class='padding_t_10 gray_1'>" +
                                                dados.rows.item(i).NAME_PROJETO +
                                            "</p>" +
                                        "</div>" +
                                        "<h4 class='cor_3_red'>" +
                                        "TIPO" +
                                        "</h4>" +
                                        "<p class='padding_t_10 gray_3'>" +
                                        UIS.txtTipoProjeto[dados.rows.item(i).TIPO_PROJETO] +
                                        "</p>"+
                                    "</div>" +
                                "</li>" +
                                "<li>" +
                                    "<div class='box_info'>" +
                                        "<h4 class='cor_3_red uppercase'>" +
                                        "Status do projeto" +
                                        "</h4>" +
                                        "<h1 class='pct_projeto'>" +
                                        dados.rows.item(i).ACOMPANHAMENTO_PROJETO +
                                        "</h1>"+
                                    "</div>" +
                                "</li>" +
                                //subprefeituras atendidas
                                "<li>" +
                                    "<div class='box_info'>" +
                                        "<h4 class='cor_3_red'>" +
                                            "SUBPREFEITURAS ATENDIDAS" +
                                        "</h4>" +
                                        "<p class='padding_t_10 gray_3'>" +
    
                                                //"Aricanduva/Formosa/Carr&atilde;o, Butant&atilde;, Campo Limpo, Capela do Socorro, Casa Verde/Cachoeirinha, Cidade Ademar, Cidade Tiradentes, Ermelino Matarazzo, Freguesia/Brasil&acirc;ndia, Guaianases, Ipiranga, Itaim Paulista, Itaquera, Jabaquara, Ja&ccedil;an&atilde;/Trememb&eacute;, Lapa, M&#039;Boi Mirim, Mooca, Parelheiros, Penha, Perus, Pinheiros, Pirituba, Santana/Tucuruvi, Santo Amaro, S&atilde;o Mateus, S&atilde;o Miguel, Sapopemba, S&eacute;, Supra-regional, Vila Maria/Vila Guilherme, Vila Mariana, Vila Prudente" +
                                                listaSub +
    
                                            "</p>" +
                                        "</div>" +
                                    "</li>" +
    
                                    "<li>" +
                                       "<div class='box_info'>" +
                                          "<h4 class='cor_3_red uppercase'>" +
                                          "Distrito" +
                                          "</h4>" +
                                          "<p class='padding_t_10 gray_3'>" +
                                          dados.rows.item(i).DISTRITO_PROJETO +
                                          "</p>" +
                                       "</div>" +
                                    "</li>" +
    
                                // Acompanhamento
                                    acompanha +
                                    /*
                                    "<li>" +
                                        "<div class='box_info'>" +
                                            "<h4 class='cor_3_red'>" +
                                                "ACOMPANHAMENTO" +
                                            "</h4>" +
                                            "<h4 class='cor_3_red padding_t_10'>" +
                                                "2013" +
                                            "</h4>" +
                                            "<p class='padding_t_10 gray_3 padd-l-16 line-cz'><strong>" +
                                                "369.852" +
                                                "</strong>" +
                                                "Fam&iacute;lias beneficiadas com o Programa Bolsa Fam&iacute;lia" +
                                            "</p>" +
                                                "<h4 class='cor_3_red padding_t_10'>" +
                                                    "2014" +
                                                "</h4>" +
                                            "<p class='padding_t_10 gray_3 padd-l-16'>" +
                                                "<strong>" +
                                                    "698.991" +
                                                "</strong>" +
                                                    "Fam&iacute;lias beneficiadas com o Programa Bolsa Fam&iacute;lia" +
                                            "</p>" +
                                        "</div>" +
                                    "</li>" +
                                    */
                                        //fases
                                    /*"<li>" +
                                        "<div class='box_info'>" +
                                            "<h4 class='cor_3_red'>" +
                                            "FASES" +
                                            "</h4>" +
                                            "<ul class='list_interna_proj'>" +
                                                "<li>" +
                                                    "<div class='border_rigth'>" +
                                                        "<p class='gray_4'>" +
                                                            "Defini&ccedil;&atilde;o de Terreno (10%)" +
                                                        "</p>" +
                                                    "</div>" +
                                                    "<p class='text_center gray_3'>" +
                                                        "CONCLU&Iacute;DA" +
                                                    "</p>" +
                                                "</li>" + */
                                                fases + 
                                    /*        "</ul>" +
                                        "</div>" +
                                    "</li>" +*/
                                        //andamento qualitativo
                                    "<li>" +
                                        "<div class='box_info'>" +
                                            "<h4 class='cor_3_red pad_b_10px'>" +
                                                "ANDAMENTO QUALITATIVO" +
                                            "</h4>" +
                                            "<p>" +
                                                //"lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean euismod bibendum laoreet. Proin gravida dolor sit amet lacus accumsan et viverra justo commodo." +
                                                (dados.rows.item(i).Q1_PROJETO != "" ? dados.rows.item(i).Q1_PROJETO : "") +
                                                (dados.rows.item(i).Q2_PROJETO != "" ? " - " + dados.rows.item(i).Q2_PROJETO : "") +
                                                (dados.rows.item(i).Q3_PROJETO != "" ? " - " + dados.rows.item(i).Q3_PROJETO : "") +
                                                (dados.rows.item(i).Q4_PROJETO != "" ? " - " + dados.rows.item(i).Q4_PROJETO : "") +
                                                (dados.rows.item(i).Q5_PROJETO != "" ? " - " + dados.rows.item(i).Q5_PROJETO : "") +
                                                (dados.rows.item(i).Q6_PROJETO != "" ? " - " + dados.rows.item(i).Q6_PROJETO : "") +
                                                // dados.rows.item(i).Q2_PROJETO + " - " +
                                                // dados.rows.item(i).Q3_PROJETO + " - " +
                                                // dados.rows.item(i).Q4_PROJETO + " - " +
                                                // dados.rows.item(i).Q5_PROJETO + " - " +
                                                // dados.rows.item(i).Q6_PROJETO +
                                            "</p>" +
                                        "</div>" +
                                    "</li>" +
                                    "<li>" +
                                        "<div class='box_info'>" +
                                            "<h4 class='cor_3_red'>" +
                                                "EXECU&Ccedil;&Atilde;O OR&Ccedil;AMENT&Aacute;RIA" +
                                            "</h4>" +
                                            "<ul>" +
                                                "<li>" +
                                                    "<h4 class='cor_3_red'>" +
                                                        "2013" +
                                                    "</h4>" +
                                                    "<p class='padding_t_10 gray_3'>" +
                                                        (dados.rows.item(i).B13_PROJETO == "0" ? "Sem execução orçamentária" : "R$ " + UIS.formatoMonetario (dados.rows.item(i).B13_PROJETO)) +
                                                    "</p>" +
                                                "</li>" +
                                            "</ul>" +
                                            "<ul>" +
                                                "<li>" +
                                                    "<h4 class='cor_3_red'>" +
                                                        "2014" +
                                                    "</h4>" +
                                                    "<p class='padding_t_10 gray_3'>" +
                                                        (dados.rows.item(i).B14_PROJETO == "0" ? "Sem execução orçamentária" : "R$ " + UIS.formatoMonetario (dados.rows.item(i).B14_PROJETO)) +
                                                    "</p>" +
                                                "</li>" +
                                            "</ul>" +
                                            "<ul>" +
                                                "<li>" +
                                                    "<h4 class='cor_3_red'>" +
                                                        "2015" +
                                                    "</h4>" +
                                                    "<p class='padding_t_10 gray_3'>" +
                                                        (dados.rows.item(i).B15_PROJETO == "0" ? "Sem execução orçamentária" : "R$ " + UIS.formatoMonetario (dados.rows.item(i).B15_PROJETO)) +
                                                    "</p>" +
                                                "</li>" +
                                            "</ul>" +
                                            "<ul>" +
                                                "<li>" +
                                                    "<h4 class='cor_3_red'>" +
                                                        "2016" +
                                                    "</h4>" +
                                                    "<p class='padding_t_10 gray_3'>" +
                                                        (dados.rows.item(i).B16_PROJETO == "0" ? "Sem execução orçamentária" : "R$ " + UIS.formatoMonetario (dados.rows.item(i).B16_PROJETO)) +
                                                    "</p>" +
                                                "</li>" +
                                            "</ul>" +
                                        "</div>" +
                                    "</li>" +
                                "</ul>" +
                        "</div>";
        }

	    //alert(nodes);
	    $("#ulDetalhesProjeto").empty();
	    $("#ulDetalhesProjeto").append(nodes);

	    //movescroll para o top
	    $('body').scrollTop(0);
        showTela(div_detalhesProjeto);
	    UIS.pushDiv(UIS.div_detalhesProjeto);
	},

	// fakeshowDetalhesProjeto: function (){
	// 	//console.log("FAKE SHOW");
	// 	//movescroll para o top
 //        showTela(div_detalhesProjeto);
	//     UIS.pushDiv(UIS.div_detalhesProjeto);
	// },

     // Atualiza lista de metas por status, metas por objetivo e lista de metas se for a tela ativa, por meio da lista de metas filtrada por subprefeitura (lista em memória)
    fillDivGoalsPrefecture: function (dados, listaStatus, listaObjetivos, idStatus, idObjective) {
        console.log("fillDivGoalsPrefecture");
        var nodes = "";
        // Atualização de metas por status
        var count = 0;
        for (var i = 0; i < listaStatus.length; i++) {
            count = 0;
            for (var j = 0; j < dados.length; j++) {
                if (dados[j].STATUS_META == listaStatus[i]) {
                    count++;
                }
            }

            // Monta nodes
            //nodes += "<li><div idRegistro='" + listaStatus[i] + "'>" + "Status = " + UIS.txtStatusMetas[listaStatus[i]] + " - Qtd = " + count + "</div></li>";
             nodes += "<div idRegistro='' class='metas_andamento divide_meta'>" +
                        "<div idRegistro='" + listaStatus[i] + "' class='descricao_andamento  gray_4'>" +
                        this.txtStatusMetas[listaStatus[i]] +
                        "</div>" +
                        "<div idRegistro='" + listaStatus[i] + "' class='valor_andamento cor_valor_meta'>" +
                        count +
                        "</div>" +
                      "</div>";
        }
        console.log ("Nodes de metas por status: " + nodes);
        UIS.ul_ListaMetasStatus.empty();
        UIS.ul_ListaMetasStatus.append(nodes);

        // Atualização de metas por objetivo
        nodes = "";
        for (var i = 0; i < listaObjetivos.length; i++) {
            count = 0;
            for (var j = 0; j < dados.length; j++) {
                if (dados[j].NAME_OBJETIVO == listaObjetivos[i]) {
                    count++;
                }
            }
            // Monta nodes
            //nodes += "<li><div idRegistro='" + listaObjetivos[i] + "'>" + "Qtd = " + count + " - Objetivo = " + listaObjetivos[i] + "</div></li>";
            nodes += "<div class='item_objetivo border_bottom_gray' idRegistro='" + listaObjetivos[i]+ "'>" +
                        "<div class='desc_objetivo' idRegistro='" + listaObjetivos[i]+ "'>" + listaObjetivos[i] + "</div>" +
                        "<div class='valor_objetivo' idRegistro='" + listaObjetivos[i]+ "'>" + count + "</div>" +
                     "</div>";
        }
        //alert("Nodes de metas por objetivo: " + nodes);
        UIS.ul_listaObjetivos.empty();
        UIS.ul_listaObjetivos.append(nodes);

        // Atualização da tela de lista de metas, se for a tela ativa
        if (UIS.array_Divs[UIS.array_Divs.length - 1].attr("id") == UIS.div_listaMetas.attr("id")) {
            // A lista de metas é a tela ativa, atualiza
            UIS.showListaMetasPrefecture(dados, idStatus, idObjective, false);
        }
        UIS.hideTelaAguarde();
    },

    // Apresenta a lista de metas, por status ou objetivo, por meio da lista de metas filtrada por subprefeitura (lista em memória)
    showListaMetasPrefecture: function(dados, idStatus, idObjective, navegaListaMetas) {
        console.log("showListaMetasPrefecture");
        var listaMetas = [];
        if (idStatus != null) {
            // Lista de metas por status, por prefeitura
//            var listaMetas = [];
            for (var i = 0; i < dados.length; i++) {
                if(dados[i].STATUS_META == idStatus) {
                    var s = {
                        META_ID: dados[i].META_ID,
                        NAME_META: dados[i].NAME_META,
                        STATUS_META: dados[i].STATUS_META,
                        ACOMPANHAMENTO_META: dados[i].ACOMPANHAMENTO_META
                    };
                    listaMetas.push(s);
                }
            }
        }
        else { // (idObjective != null)
            // Lista de metas por objetivo, por prefeitura
//            var listaMetas = [];
            for (var i = 0; i < dados.length; i++) {
                if(dados[i].NAME_OBJETIVO == idObjective) {
                    var s = {
                        META_ID: dados[i].META_ID,
                        NAME_META: dados[i].NAME_META,
                        STATUS_META: dados[i].STATUS_META,
                        ACOMPANHAMENTO_META: dados[i].ACOMPANHAMENTO_META
                    };
                    listaMetas.push(s);
                }
            }
        }
        UIS.showListaMetas(listaMetas, navegaListaMetas);
    },


    // Preenche os dados na div de metas por status
	fillDivStatusGoals: function(dados) {
	    //alert("fillDivStatusGoals");
	    var nodes = "";
	    for (var i = 0; i < dados.rows.length; i++) {
            nodes += "<div idRegistro='' class='metas_andamento divide_meta'>" +
                        "<div idRegistro='" + dados.rows.item(i).STATUS_META + "' class='descricao_andamento  gray_4'>" +
                        this.txtStatusMetas[dados.rows.item(i).STATUS_META] +
                        "</div>" +
                        "<div idRegistro='" + dados.rows.item(i).STATUS_META + "' class='valor_andamento cor_valor_meta'>" +
                        dados.rows.item(i).QTD +
                        "</div>" +
                      "</div>";
	        //nodes += "<div><div class='descricao_andamento' idRegistro='" + dados.rows.item(i).STATUS_META + "'>" + UIS.txtStatusMetas[dados.rows.item(i).STATUS_META]+"</div>"+"<div class='valor_andamento'>" +  dados.rows.item(i).QTD + "</div></div>";
	    }
		//alert(nodes);
	    UIS.ul_ListaMetasStatus.empty();
	    UIS.ul_ListaMetasStatus.append(nodes);
	   //console.log(dados.rows.length);
       UIS.hideTelaAguarde();
	},

    // Preenche os dados na div de metas por objetivo
	fillDivObjectivesGoals: function(dados) {
	    //alert("fillDivObjectivesGoals");
	    var nodes = "";
	    for (var i = 0; i < dados.rows.length; i++) {
	    	// nodes += "<li class='list-style list_objetivos'><div class='list_objetivos_itens' idRegistro='" + dados.rows.item(i).NAME_OBJETIVO + "'>" + "Qtd = " + dados.rows.item(i).QTD + " - Objetivo = " + dados.rows.item(i).NAME_OBJETIVO + "</div></li>";
	        nodes += "<div class='item_objetivo border_bottom_gray' idRegistro='" + dados.rows.item(i).NAME_OBJETIVO + "'>" +
	        		 	"<div class='desc_objetivo' idRegistro='" + dados.rows.item(i).NAME_OBJETIVO + "'>" + dados.rows.item(i).NAME_OBJETIVO + "</div>" +
	        		 	"<div class='valor_objetivo' idRegistro='" + dados.rows.item(i).NAME_OBJETIVO + "'>" + dados.rows.item(i).QTD + "</div>" +
	        		 "</div>";
	    }
	    //alert(nodes);

	    UIS.ul_listaObjetivos.empty();
	    UIS.ul_listaObjetivos.append(nodes);
	},

    // Preenche a div (combobox) de subprefeituras
	fillDivPrefectures: function(dados) {
	    //alert("fillDivPrefectures");
	    //var nodes = "<select dir='rtl' name='distritos'>";
        var nodes = "";
        // Insere opção "São Paulo" (não filtra por subprefeitura)
        nodes += "<option value='" + "Sao Paulo" + "' selected>" + "São Paulo" + "</option>";
        UIS.subprefSelecionada = "São Paulo";
	    for (var i = 0; i < dados.rows.length; i++) {
	        nodes += "<option value='" + dados.rows.item(i).ID + "'>" + dados.rows.item(i).NAME + "</option>";
	    }
        //nodes += "</select>";
	    //alert(nodes);
	    $("#selectListaSubprefeituras").empty();
        $("#selectListaSubprefeituras").append(nodes);
        $("#listaSubprefeituras_metas").empty();
	    $("#listaSubprefeituras_metas").append(nodes);

	},

    // Controle de divs
	showDiv: function () {
	    //console.log("showDiv: array_Divs.length = " + UIS.array_Divs.length);
	    for (var i = 0; i < UIS.array_Divs.length - 1; i++) {
	        UIS.array_Divs[i].attr("style", "display: none");
	    }
	    UIS.array_Divs[UIS.array_Divs.length - 1].attr("style", "display: block");
	    // Verifica se deve mostrar botões para seleção de tipos de lista de metas
	    if (UIS.array_Divs.length == 1) {
	        UIS.div_footer.attr("style", "display: block");
	    }
	    else {
	        UIS.div_footer.attr("style", "display: none");
	    }
	},

    // Reseta a pilha e apresenta div de metas por status
	resetDivStack: function () {
	    //console.log("resetDivStack");
	    while (UIS.array_Divs.length) {
	        UIS.array_Divs.pop().attr("style", "display: none");
	    }
	    UIS.pushDiv(UIS.div_metasStatus);
    },

    // Insere uma div na pilha
	pushDiv: function (obj) {
	    ////console.log("pushDiv: array_Divs.length = " + UIS.array_Divs.length);
        console.log("==>>pushDIV:",obj.attr("id"))
        var id2check = obj.attr("id");
        var divexists = false;

        for(var i =0; i< UIS.array_Divs.length; i++){
            if(UIS.array_Divs[i].attr("id") == id2check){
                divexists = true;
                break;
            }
        }


        if (!divexists){
            UIS.array_Divs.push(obj);
        }

	   //UIS.showDiv();
	},

    // Remove uma div da pilha
	popDiv: function () {
	    ////console.log("popDiv: array_Divs.length = " + UIS.array_Divs.length);
	    UIS.array_Divs.pop().attr("style", "display: none");
	    UIS.showDiv();
	},

    // Salva data e hora da última atualização de dados
	saveLastUpdateDate: function () {
	    //console.log("saveLastUpdateDate");
	    var now = new Date();
	    var mes = (now.getMonth() + 1) < 10 ? "0" + (now.getMonth() + 1) : now.getMonth();
        var minuto = now.getMinutes() < 10 ? "0" + now.getMinutes() : now.getMinutes();
        var date = now.getDate() + "/" + mes + "/" + now.getFullYear() + " - " + now.getHours() + ":" + minuto;
	    this.div_ultima_atualizacao.html(date);
	    localStorage.setItem("lastUpdateDate", date);
	},

	formatoMonetario: function (numValor) {
	    var strValor = numValor.toString();
	    // Invert a string
	    var strInvertida = "";
	    for (var i = strValor.length - 1; i >= 0; i--) strInvertida += strValor[i];
	    // Insere vírgula e pontos dos milhares
	    var retString = "";
	    var proximoPonto = 5;
	    for (var i = 0; i < strInvertida.length; i++) {
	        if (i == 2) retString += ",";
	        else if (i == proximoPonto && ((i+1) < strInvertida.length)) {
	            retString += strInvertida[i];
	            retString += ".";
	            proximoPonto += 3;
	        }
	        else retString += strInvertida[i];
	    }
	    // Desinverte a string
	    strValor = "";
	    for (var i = retString.length - 1; i >= 0; i--) strValor += retString[i];
//	    //alert(strValor);
	    return strValor;
	}
};

//animação telas

var transitionsevents = 'webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend'; 

    function showTela(tela){
        console.log("SHOWTELA(): ",UIS.array_Divs.length );
        //console.log("showTela", UIS.array_Divs.length -1);

        $(tela).removeClass('hideme');
        $(tela).removeClass('box-escondido');
        $(tela).addClass('box-ativo');
        $(tela).addClass('showme').one(transitionsevents,function(){

            if (((UIS.array_Divs.length - 1) == 1) && (UIS.array_Divs[0] === UIS.div_metasObjetivos)) {
                //oculta a tela metas por objetivos transição para lista de metas
                UIS.div_metasObjetivos.attr("style", "display: none");
                console.log("div_metasObjetivos - none");
            }

            console.log("Mostra a tela!!");

            // Libera uso do click
            UIS.aguardaTransicaoTela = false;
            console.log("Liberando click!!!");
        });
    }

    function voltar(){
        console.log("VOLTAR() - Entrada: ",UIS.array_Divs.length );

        //tela para voltar
        if (UIS.array_Divs.length == 1){
             return;
        }else{

            UIS.animandovoltar = true;
             //excluir tela atual da lista

            if (((UIS.array_Divs.length - 1) == 1) && (UIS.array_Divs[0] === UIS.div_metasObjetivos)) {
                //mostra a tela metas por objetivos na volta da lista de metas
                UIS.div_metasObjetivos.attr("style", "display: block");
                console.log("div_metasObjetivos - block");
            }


            UIS.array_Divs[UIS.array_Divs.length -1].removeClass('showme');
            UIS.array_Divs[UIS.array_Divs.length -1].addClass('hideme').one(transitionsevents,function(){

                UIS.array_Divs[UIS.array_Divs.length -1].addClass('box-escondido');
                UIS.array_Divs[UIS.array_Divs.length -1].removeClass('box-ativo');

                UIS.array_Divs.pop();
                console.log("VOLTAR() - Apos pop: ",UIS.array_Divs.length );

                //se clicou voltar de tela de metas para a home, esconde o div container relativo
                if(UIS.array_Divs.length == 1){
                    $('#container_relativo').css({"height":"0"});
                }

                UIS.animandovoltar = false;

           });


        }

        //    function voltar(){
        // //console.log("entrou", UIS.array_Divs.length -2);
        // //tela para voltar
        // UIS.array_Divs[UIS.array_Divs.length -2];

        // //excluir tela atual da lista
        // UIS.array_Divs.pop();
        // //console.log("removeu")

        // UIS.array_Divs[UIS.array_Divs.length -2].removeClass('showme');
        // UIS.array_Divs[UIS.array_Divs.length -2].addClass('hideme').one(transitionsevents,function(){
        // UIS.array_Divs[UIS.array_Divs.length -2].removeClass('box-ativo');
        // UIS.array_Divs[UIS.array_Divs.length -2].addClass('box-escondido');
        // });
        console.log("VOLTAR() - Saida: ",UIS.array_Divs.length );
    }

