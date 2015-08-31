/* 
 * Controle de interfaces 
 http://stackoverflow.com/questions/1554893/google-maps-api-v3-infowindow-not-sizing-correctly
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


    configListeners: function () {
        // Texto para status de metas
        this.txtStatusMetas[1] = "Metas não iniciadas";
        this.txtStatusMetas[2] = "Metas em andamento";
        this.txtStatusMetas[3] = "Metas em andamento com benefícios à população";
        this.txtStatusMetas[4] = "Metas concluídas";
        this.txtStatusMetas[5] = "Metas superadas";

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

	    this.ul_ListaMetas = $("#ulListaMetas");
	    this.ul_listaObjetivos = $("#ulListaObjetivos");
	    this.ul_ListaMetasStatus = $("#ulListaMetasStatus");
	    this.ul_DetalhesMeta = $("#ulDetalhesMeta");
	    this.ul_listaProjetosDeMetas = $("#listaProjetosDeMetas li");

	    console.log("****",this.ul_listaProjetosDeMetas)

	    this.bt_showMetasObjetivos = $("#bt_showMetasObjetivos");
	    this.bt_showMetasStatus = $("#bt_showMetasStatus");
	    this.bt_Voltar = $("#bt_Voltar");
	    this.bt_Configure = $("#bt_Configure");
	    this.atualizacaoDados = $("#atualizacaoDados");
	    this.termosUso = $("#termosUso");
	    this.desenvolvimento = $("#desenvolvimento");
	    this.atualizacao_Automatica = $("#atualizacao_Automatica");
	    this.bt_Subprefeituras = $("#bt_Subprefeituras");

	    this.bodyPM = $("body");

        // Recupera a data da última atualização
	    if (localStorage.getItem("lastUpdateDate") == null) {
	        // Não há data da última atualização, deixa em branco
	        console.log("Não há data da última atualização");
	    }
	    else {
	        console.log("Data da última atualização = " + localStorage.lastUpdateDate);
	        this.div_ultima_atualizacao.html(localStorage.lastUpdateDate);
        }

        // Recupera flag de atualização automática
	    if (localStorage.getItem("autoUpdate") == null) {
            console.log("Não há flag autoUpdate")
	        this.atualizacao_Automatica.prop("checked", false);
	        localStorage.setItem("autoUpdate", 0);
	    }
	    else {
	        console.log("autoUpdate armazenado = " + localStorage.autoUpdate);
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
	        console.log("Checkbox onchange = " + UIS.atualizacao_Automatica.prop("checked"));
	        // Armazena o estado do flag
	        localStorage.setItem("autoUpdate", UIS.atualizacao_Automatica.prop("checked") == false ? 0 : 1);
	    }).bind(this));

        // Botão da combobox de subprefeituras
        // todo: apenas para testes
	    this.bt_Subprefeituras.bind("touchend mouseup", (function () {
	        if (UIS.div_listaSubprefeituras.attr("style") == "display: block") {
	            // combobox aberta, fecha
	            //UIS.div_listaSubprefeituras.attr("style", "display: none");
	        }
	        else {
	            //UIS.div_listaSubprefeituras.attr("style", "display: block");
	        }
	    }).bind(this));

	    // Botão voltar
	    this.bt_Voltar.bind("touchend mouseup", (function () {
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
	        if (UIS.array_Divs.length == 1)
	            return;
	        UIS.popDiv();
	    }).bind(this));

	    // Botão para visualização de metas por objetivo
	    this.bt_showMetasObjetivos.bind("touchend mouseup", (function () {
	    	// insere borda de ativo
	    	UIS.bt_showMetasObjetivos.addClass("bt_border_ativo");
	    	// remove a borda de ativo
	    	UIS.bt_showMetasStatus.removeClass("bt_border_ativo");
            //anima transição
            UIS.div_metasObjetivos.addClass("container_show");
            UIS.div_metasObjetivos.addClass("mostrar");
            UIS.div_metasObjetivos.removeClass("container_hide");
            UIS.div_metasObjetivos.removeClass("esconder");

            UIS.div_metasStatus.removeClass("container_show");
            UIS.div_metasStatus.removeClass("mostrar");
            UIS.div_metasStatus.addClass("container_hide");
            UIS.div_metasStatus.addClass("esconder");
            //mostra a div
            //UIS.div_metasStatus.attr("style", "display: none");
            //UIS.div_metasObjetivos.attr("style", "display: block");
            UIS.array_Divs[0] = UIS.div_metasObjetivos;
        }).bind(this));

        // Botão para visualização de metas por status
	    this.bt_showMetasStatus.bind("touchend mouseup", (function () {
	    	// insere borda de ativo
	    	UIS.bt_showMetasStatus.addClass("bt_border_ativo");
            //anima transição 
            UIS.div_metasStatus.addClass("mostrar");
            UIS.div_metasStatus.addClass("container_show");
            UIS.div_metasStatus.removeClass("container_hide");
            UIS.div_metasStatus.removeClass("esconder");

            UIS.div_metasObjetivos.addClass("container_hide");
            UIS.div_metasObjetivos.addClass("esconder");
            UIS.div_metasObjetivos.removeClass("container_show");
	    	UIS.div_metasObjetivos.removeClass("mostrar");

            // remove a borda de ativo            
	    	UIS.bt_showMetasObjetivos.removeClass("bt_border_ativo");

	        //UIS.div_metasObjetivos.attr("style", "display: none");
	       // UIS.div_metasStatus.attr("style", "display: block");
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
                    console.log("Dados atualizados. Volta para a tela de metas por status");
                    UIS.resetDivStack();
                    console.log("clicou")
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
	    this.ul_ListaMetasStatus.bind("touchend mouseup", (function (event) {
	        //alert("Lista de metas por status");
	        //alert("idRegistro = " + event.target.getAttribute('idRegistro'));
	        console.log("++++++ idRegistro = " + event.target.getAttribute('idRegistro'))
	        
	        if(this.dragging == false) {
	        	BANCODADOS.getStatusGoalsList(event.target.getAttribute('idRegistro'), null, UIS.showListaMetas, null);
	    	}
	    }).bind(this));
	    // Navegação da tela de metas por objetivo para a tela de lista de metas
	    this.ul_listaObjetivos.bind("touchend mouseup", (function (event) {
	        //alert("Lista de metas por objetivo");
	        ////alert("Lista de Objetivos \nidObjetivo: " + event.target.getAttribute('idRegistro'));
	        if(this.dragging == false) {
	        	BANCODADOS.getObjectivesGoalsList(event.target.getAttribute('idRegistro'), null, UIS.showListaMetas, null);
	    	}
	    }).bind(this));

	    // Navegação da tela de lista de metas para a tela de detalhes da meta
	    this.ul_ListaMetas.bind("touchend mouseup", (function (event) {
	        //alert("Lista de metas");
	        ////alert("Detalhes da Meta: \nidMeta: " + event.target.getAttribute('idMeta'));
	        if(this.dragging == false) {
	        	BANCODADOS.getGoalDetails(event.target.getAttribute('idMeta'), UIS.showDetalhesMetas, null);
	    	}
	    }).bind(this));

	    // Navegação da tela de detalhes da meta para a tela de detalhes de um projeto
	    //this.ul_DetalhesMeta.bind("touchend mouseup", (function (event) {
	    //this.ul_listaProjetosDeMetas.bind("touchend mouseup", (function (event) {
	        //alert("Detalhes da meta");
	        ////alert("Detalhes do Projeto \nidProjeto: " + event.target.getAttribute('idProjeto'));
	        
	      //  console.log("++++++ this.ul_DetalhesMeta.bind")

//==>>	        
			//UIS.pushDiv(UIS.div_detalhesProjeto);

	        //if(this.dragging == false) {
	        //	BANCODADOS.getProjectDetails(event.target.getAttribute('idProjeto'), UIS.showDetalhesProjeto, null);
	    	//}
	    //}).bind(this));
	},

	fakeShowHideConfiguracoes:function(){
		
		console.log("++++ FAKE!!!")


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
                   // console.log("Dados atualizados. Volta para a tela de metas por status");
                   // UIS.resetDivStack();
                    
                }
            }
	},

    // Mostra lista de metas
	showListaMetas: function(dados) {
	    //alert("showListaMetas");
	    // Preenche os dados e apresenta
	    var nodes = "";
	    var idDaMeta ="";
	    for (var i = 0; i < dados.rows.length; i++) {
	        //nodes += "<li class='descricao_andamento'><div idMeta='" + dados.rows.item(i).ID_META + "'>" + dados.rows.item(i).NAME_META + "</div></li>";
            
	        idDaMeta = dados.rows.item(i).ID_META;

            nodes += "<li class='li_metas'><div class='meta_valor' idMeta='" + 
            			idDaMeta + 
            			"'><h4 idMeta='"+idDaMeta+"'>META " + 
            			idDaMeta + 
            			"</h4><p idMeta='"+idDaMeta+"'>com benefício à população</p><h1 class='gray_3' idMeta='"+idDaMeta+"'>51,0%</h1></div><div class='meta_discricao'><p idMeta='"+idDaMeta+"'>" + 
            			dados.rows.item(i).NAME_META + 
            			"</p></div></li>";
        }
//	    //alert(nodes);
	    UIS.ul_ListaMetas.empty();
	    UIS.ul_ListaMetas.append(nodes);
	    UIS.pushDiv(UIS.div_listaMetas);
	},

    // Mostra detalhes da meta
	showDetalhesMetas: function (dados) {
	    //alert("showDetalhesMetas");
	    // Preenche os dados e apresenta
	    var nodes = "";
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

                        nodes+="<li class='overfl-hdd'>"+
                        "<div class='col-50-l  marg-b-16'><span class='header-verm'>META "+dados.rows.item(i).ID_META+"</span><br /><span class='cor_cz87'>COM BENEFÍCIO À POPULAÇÃO</span></div><div class='col-50-r font-4-em  marg-b-16 cor_cz3e font-b lettr-spacing-tit-pct'>100%</div>"+	
                       "<div class='hspacer-line '></div>"+
                        "<p class='clear-bth marg-t-16'><span class='gray_4'>"+dados.rows.item(i).NAME_META+"</span></p></li>"+	
                        "<li class='cor_cz'><span class='header-verm font-15'>OBJETIVO</span><br />"+dados.rows.item(i).NAME_OBJETIVO+"</li>"+
                        "<li class='cor_cz'><span class='header-verm font-15'>ARTICULAÇÃO</span><br />"+dados.rows.item(i).NAME_ARTICULACAO+"</li>"+
                        "<li class='cor_cz'><span class='header-verm font-15'>TIPOS DE PROJETO</span><br />Novos serviços ou benefícios</li>"+
                        "<li class='cor_cz'><span class='header-verm font-15'>ANDAMENTO QUANTITATIVO</span><br /><span class='txt-b cor_cz40'>348.472</span> famílias beneficiadas com o programa Bolsa Família<div class='hspacer-line marg-t-16 marg-b-16'></div><span class='txt-b cor_cz40'>80.736</span> novas famílias beneficiadas com o Programa Bolsa Família - Concessão acumulada</li>"+
                        
                        "<li  class='overfl-hdd'>"+
                        "<span class='header-verm font-15'>ANDAMENTO QUALITATIVO</span><br />Para calcular o incremento bruto de beneficiários no Programa Bolsa família, devemos utilizar como referência o marco zero (janeiro de 2013) e subtrair os demais períodos de levantamento da informação. Para termos o total de inclusão, soma-se os incrementos.<br/><br/>"+
                        "<div class='col-50-l overfl-hdd bg-cor_czf5 padd-10'>"+
                        "<span class='header-verm font-15'>PREVISTO</span><br />"+dados.rows.item(i).PREVISTO_META+
                        "</div>"+
                        "<div class='col-50-r overfl-hdd bg-cor_czf5 padd-10'>"+
                        "<span class='header-verm font-15'>EXECUTADO</span><br />"+dados.rows.item(i).EXECUTADO_META+
                        "</div>	"+
                        "</li>"+
                        "<li>"+
                        "<br /><span class='header-verm font-15'>PROJETOS</span><br />"+
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



		//alert(nodes);
	    }
//	    //alert(nodes);
	    UIS.ul_DetalhesMeta.empty();
	    UIS.ul_DetalhesMeta.append(nodes);

	    //movescroll para o top
	   $('body').scrollTop(0);

	    UIS.pushDiv(UIS.div_detalhesMeta);
	},

    // Mostra detalhes do projeto da meta
	showDetalhesProjeto: function (dados) {
	    //alert("showDetalhesProjeto");
	    // Preenche os dados e apresenta
	    var nodes = "";
	    for (var i = 0; i < dados.rows.length; i++) {
	        nodes += "<li><div>" + dados.rows.item(i).name + "</div></li>";
	    }
	    ////alert(nodes);
	    $("#ulDetalhesProjeto").empty();
	    $("#ulDetalhesProjeto").append(nodes);

	    //movescroll para o top
	    $('body').scrollTop(0);
	    UIS.pushDiv(UIS.div_detalhesProjeto);
	},

	fakeshowDetalhesProjeto: function (){
		console.log("FAKE SHOW");
		//movescroll para o top
	    $('body').scrollTop(0);
	    UIS.pushDiv(UIS.div_detalhesProjeto);
	},

    // Preenche os dados na div de metas por status
	fillDivStatusGoals: function(dados) {
	    //alert("fillDivStatusGoals");
	    var nodes = "";
	    for (var i = 0; i < dados.rows.length; i++) {
	        nodes += "<div><div class='descricao_andamento' idRegistro='" + dados.rows.item(i).STATUS_META + "'>" + UIS.txtStatusMetas[dados.rows.item(i).STATUS_META]+"</div>"+"<div class='valor_andamento'>" +  dados.rows.item(i).QTD + "</div></div>";
	    }
		//alert(nodes);
	    UIS.ul_ListaMetasStatus.empty();
	    UIS.ul_ListaMetasStatus.append(nodes);
	   console.log(dados.rows.length)
	},

    // Preenche os dados na div de metas por objetivo
	fillDivObjectivesGoals: function(dados) {
	    //alert("fillDivObjectivesGoals");
	    var nodes = "";
	    for (var i = 0; i < dados.rows.length; i++) {
	    	// nodes += "<li class='list-style list_objetivos'><div class='list_objetivos_itens' idRegistro='" + dados.rows.item(i).NAME_OBJETIVO + "'>" + "Qtd = " + dados.rows.item(i).QTD + " - Objetivo = " + dados.rows.item(i).NAME_OBJETIVO + "</div></li>";
	        nodes += "<div class='item_objetivo border_bottom_gray' idRegistro='" + dados.rows.item(i).NAME_OBJETIVO + "'>" +
	        		 	"<div class='desc_objetivo'>" + dados.rows.item(i).NAME_OBJETIVO + "</div>" +
	        		 	"<div class='valor_objetivo'>" + dados.rows.item(i).QTD + "</div>" +
	        		 "</div>";
	    }
	    //alert(nodes);
	    UIS.ul_listaObjetivos.empty();
	    UIS.ul_listaObjetivos.append(nodes);
	},

    // Preenche a div (combobox) de subprefeituras
	fillDivPrefectures: function(dados) {
	    //alert("fillDivPrefectures");
	    var nodes = "";
	    for (var i = 0; i < dados.rows.length; i++) {
	        nodes += "<li><div idRegistro='" + dados.rows.item(i).idText + "'>" + dados.rows.item(i).name + "</div></li>";
	    }
	    ////alert(nodes);
	    $("#ulListaSubprefeituras").empty();
	    $("#ulListaSubprefeituras").append(nodes);
	},

    // Controle de divs
	showDiv: function () {
	    console.log("showDiv: array_Divs.length = " + UIS.array_Divs.length);
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
	    console.log("resetDivStack");
	    while (UIS.array_Divs.length) {
	        UIS.array_Divs.pop().attr("style", "display: none");
	    }
	    UIS.pushDiv(UIS.div_metasStatus);
    },

    // Insere uma div na pilha
	pushDiv: function (obj) {
	    console.log("pushDiv: array_Divs.length = " + UIS.array_Divs.length);
	    UIS.array_Divs.push(obj);
	    UIS.showDiv();
	},

    // Remove uma div da pilha
	popDiv: function () {
	    console.log("popDiv: array_Divs.length = " + UIS.array_Divs.length);
	    UIS.array_Divs.pop().attr("style", "display: none");
	    UIS.showDiv();
	},

    // Salva data e hora da última atualização de dados
	saveLastUpdateDate: function () {
	    console.log("saveLastUpdateDate");
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

