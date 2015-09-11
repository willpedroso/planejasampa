/* 
 *Controle de interfaces 
 http://stackoverflow.com/questions/1554893/google-maps-api-v3-infowindow-not-sizing-correctly
 */

var UIS = {

	/* Busca medicamentos */
	cachedmenuesq: null,
	submenu_pins_esq: null,
	div_submenu_pins_esq: null,
	div_selecione_localizacao_esq: null,
	voltar_div_submenu_pins_esq: null,
	voltar_div_selecione_localizacao_esq: null,
	principio_ativo: null,
	principio_ativo_esq: null,
	tipo_localidade_busca_medicamento: null,
	selecione_localizacao_esq: null,
	bt_menu_lateral_esq: null,
	bt_findMedicamento: null,
	inpt_principio_ativo_esq: null,
	/* Busca medicamentos */

	mapCanvas: null,
	divResults: null,
	cachedmenu: null,
	btbusca: null,
	btShow: null,
	btopcoes: null,
	endereco: null,
	flag: false,
	menu_pins: null,
	submenu_pins: null,

	div_submenu_pins: null,
	div_selecione_localizacao: null,

	voltar_div_submenu_pins: null,
	voltar_div_selecione_localizacao: null,

	seu_endereco: null,
	fechar_box_endereco: null,
	bt_findAddress: null,
	form_endereco: null,
	selecione_localizacao: null,
	tipo_selecionado: 0,
	subtipo_selecionado: 0,
	bt_menu_lateral: null,
	div_options: null,
	div_abertura: null,
	div_sobreApp: null,
	div_carregaMapa: null,
	h3_lb_cont_carrega_mapa: null,

	//bts rotas
	bt_rotas_bike: null,
	bt_rotas_carro: null,
	bt_rotas_onibus: null,
	bt_rotas_ape: null,

	//touchenevts
	touchStartEvent :null,
	touchEndEvent :null,


	addMarkers: function() {

	},
	blurForm: function()
	{
		document.activeElement.blur();
		var inputs = document.querySelectorAll('input');
		for (var i = 0; i < inputs.length; i++)
		{
			inputs[i].blur();
		}
	},
	configListeners: function()
	{

		window.localStorage.setItem("first_buid", "0");

		//objs cacheados
		/* Busca medicamentos */
		this.cachedmenuesq = $("#menu_lateral_esq");
		this.submenu_pins_esq = $("#submenu_pins_esq");
		this.div_submenu_pins_esq = $("#div_submenu_pins_esq");
		this.div_selecione_localizacao_esq = $("#div_selecione_localizacao_esq");
		this.voltar_div_submenu_pins_esq = $("#voltar_div_submenu_pins_esq");
		this.voltar_div_selecione_localizacao_esq = $("#voltar_div_selecione_localizacao_esq");
		this.principio_ativo = $("#principio_ativo");
		this.principio_ativo_esq = $("#principio_ativo_esq");
		this.selecione_localizacao_esq = $("#selecione_localizacao_esq");
		this.bt_menu_lateral_esq = $("#bt_menu_lateral_esq");
		this.bt_findMedicamento = $("#bt_findMedicamento");
		this.inpt_principio_ativo_esq = $("#principio_ativo_esq");
		/* Busca medicamentos */

		this.cachedmenu = $("#menu_lateral");
		this.mapCanvas = $("#map_canvas");
		this.divResults = $("#results");
		this.btbusca = $("#btbusca");
		this.btShow = $("#btShow");
		this.btopcoes = $("#btopcoes");
		this.endereco = $("#endereco");
		this.menu_pins = $("#menu_pins");
		this.submenu_pins = $("#submenu_pins");

		this.div_submenu_pins = $("#div_submenu_pins");
		this.div_selecione_localizacao = $("#div_selecione_localizacao");

		this.voltar_div_submenu_pins = $("#voltar_div_submenu_pins");
		this.voltar_div_selecione_localizacao = $("#voltar_div_selecione_localizacao");
		this.fechar_box_endereco = $("#fechar_box_endereco");

		this.seu_endereco = $("#seu_endereco");
		this.bt_findAddress = $("#bt_findAddress");
		this.form_endereco = $("#form_endereco");
		this.selecione_localizacao = $("#selecione_localizacao");
		this.bt_menu_lateral = $("#bt_menu_lateral");
		this.div_options = $("#menu_opcoes");
		this.div_sobreApp = $("#sobre_app");
		this.div_abertura = $("#abertura");
		this.flag = false;
		this.scope = this;

		this.bt_rotas_bike = $("#bt_rotas_bike");
		this.bt_rotas_carro = $("#bt_rotas_carro");
		this.bt_rotas_onibus = $("#bt_rotas_onibus");
		this.bt_rotas_ape = $("#bt_rotas_ape");

		this.div_carregaMapa = $("#carrega_mapa");

		this.h3_lb_cont_carrega_mapa = $("#lb_cont_carrega_mapa");

		//calcula altura da tela
		var alt = ($(document).height()) - (48 + 40 + 56);

		//adiciona uma altura à lista de medicamentos
		document.getElementById("container_list_medicamentos").style.height = alt + "px";

		var alt2 = ($(document).height()) - (48 + 40);
		//adiciona altura ao submenu da lista direita
		document.getElementById("submenu_dir_scroll").style.height = alt2 + "px";


		//adiciona os tipos de touch ou click events
		
		this.touchStartEvent = ('ontouchstart' in window ? 'touchstart' : 'mousedown');
		this.touchEndEvent = ('ontouchstart' in window ? 'touchend' : 'mouseup');

		console.log("EVENTOS TOUCH: ", this.touchStartEvent,this.touchEndEvent)
		//clicks tipos de rotas
		this.bt_rotas_bike.bind(this.touchStartEvent, (function()
		{
			if (!this.flag)
			{
				this.flag = true;


				setTimeout((function()
				{

					this.flag = false;
					// console.log("TIME OUT",this);
				}).bind(this), 100);
				//console.log(event.target.getAttribute('data-tipo'),event.currentTarget);
				this.blurForm();
				CoreGeoloc.calculateRouteByType("BICYCLING");


			}
			return false;

		}).bind(this));


		this.bt_rotas_carro.bind(this.touchStartEvent, (function()
		{
			if (!this.flag)
			{
				this.flag = true;


				setTimeout((function()
				{

					this.flag = false;
					// console.log("TIME OUT",this);
				}).bind(this), 100);
				//console.log(event.target.getAttribute('data-tipo'),event.currentTarget);
				this.blurForm();
				CoreGeoloc.calculateRouteByType("DRIVING");

				if (this.bt_rotas_carro.hasClass('img-bt-rotas-carro-disabled'))
				{
					this.bt_rotas_carro.removeClass('img-bt-rotas-carro-disabled');
					this.bt_rotas_carro.addClass('img-bt-rotas-carro-active');
				}

				if (this.bt_rotas_onibus.hasClass('img-bt-rotas-bus-active'))
				{
					this.bt_rotas_onibus.removeClass('img-bt-rotas-bus-active');
					this.bt_rotas_onibus.addClass('img-bt-rotas-bus-disabled');

				}

				if (this.bt_rotas_ape.hasClass('img-bt-rotas-ape-active'))
				{
					this.bt_rotas_ape.removeClass('img-bt-rotas-ape-active');
					this.bt_rotas_ape.addClass('img-bt-rotas-ape-disabled');

				}

			}
			return false;

		}).bind(this));


		this.bt_rotas_onibus.bind(this.touchStartEvent, (function()
		{
			if (!this.flag)
			{
				this.flag = true;


				setTimeout((function()
				{

					this.flag = false;
					// console.log("TIME OUT",this);
				}).bind(this), 100);
				//console.log(event.target.getAttribute('data-tipo'),event.currentTarget);
				this.blurForm();
				CoreGeoloc.calculateRouteByType("TRANSIT");

				if (this.bt_rotas_onibus.hasClass('img-bt-rotas-bus-disabled'))
				{
					this.bt_rotas_onibus.removeClass('img-bt-rotas-bus-disabled');
					this.bt_rotas_onibus.addClass('img-bt-rotas-bus-active');
				}

				if (this.bt_rotas_carro.hasClass('img-bt-rotas-carro-active'))
				{
					this.bt_rotas_carro.removeClass('img-bt-rotas-carro-active');
					this.bt_rotas_carro.addClass('img-bt-rotas-carro-disabled');

				}

				if (this.bt_rotas_ape.hasClass('img-bt-ape-active'))
				{
					this.bt_rotas_ape.removeClass('img-bt-ape-active');
					this.bt_rotas_ape.addClass('img-bt-ape-disabled');

				}

			}
			return false;

		}).bind(this));


		this.bt_rotas_ape.bind(this.touchStartEvent, (function()
		{
			if (!this.flag)
			{
				this.flag = true;


				setTimeout((function()
				{

					this.flag = false;
					// console.log("TIME OUT",this);
				}).bind(this), 100);
				//console.log(event.target.getAttribute('data-tipo'),event.currentTarget);
				this.blurForm();
				CoreGeoloc.calculateRouteByType("WALKING");

				if (this.bt_rotas_ape.hasClass('img-bt-rotas-ape-disabled'))
				{
					this.bt_rotas_ape.removeClass('img-bt-rotas-ape-disabled');
					this.bt_rotas_ape.addClass('img-bt-rotas-ape-active');

				}


				if (this.bt_rotas_onibus.hasClass('img-bt-rotas-bus-active'))
				{
					this.bt_rotas_onibus.removeClass('img-bt-rotas-bus-active');
					this.bt_rotas_onibus.addClass('img-bt-rotas-bus-disabled');
				}

				if (this.bt_rotas_carro.hasClass('img-bt-rotas-carro-active'))
				{
					this.bt_rotas_carro.removeClass('img-bt-rotas-carro-active');
					this.bt_rotas_carro.addClass('img-bt-rotas-carro-disabled');

				}






			}
			return false;

		}).bind(this));



		//click achar seu endereco
		this.bt_findAddress.bind(this.touchStartEvent, (function(event)
		{


			if (!this.flag)
			{
				this.flag = true;


				setTimeout((function()
				{

					this.flag = false;
					// console.log("TIME OUT",this);
				}).bind(this), 100);
				//console.log(event.target.getAttribute('data-tipo'),event.currentTarget);
				var endereco = $("#seu_endereco").val();



				CoreGeoloc.findAddres(endereco);
				this.blurForm();

			}
			return false;



		}).bind(this));

		/* Busca medicamentos */

		//click achar medicamento
		this.bt_findMedicamento.bind(this.touchStartEvent, (function(event)
		{

			//console.log("1 - busca princípio ativo");

			if (!this.flag)
			{
				this.flag = true;

				setTimeout((function()
				{
					this.flag = false;
				}).bind(this), 100);

				this.findMedicamentos();
				//console.log("4 - busca princípio ativo");
				return false;
			}
		}).bind(this));
		/* Busca medicamentos */

		//click nos filtros

		this.selecione_localizacao.bind(this.touchStartEvent, (function(event)
		{
			if (!this.flag)
			{
				this.flag = true;

				//esconde o sub menu mostra escolha de local

				this.menu_pins.toggleClass('dspl-nn');
				this.div_selecione_localizacao.toggleClass('dspl-nn');
				this.showHideFilters();

				console.log("CLICK DATA TIPO", event.target.getAttribute('data-tipo'), event.target);

				if (event.target.getAttribute('data-tipo') == "residencia")
				{
					this.setGeoreferencePoint("residencia");
				}
				else
				{
					this.setGeoreferencePoint("atual");
				}

				this.hideRotas();
				this.createUbsMarkersByTipoAndSubtipo(this.tipo_selecionado, this.subtipo_selecionado);
				this.resetFiltersState();
				//this.setGeoreferencePoint()
				//this.createUbsMarkersByTipoAndSubtipo(this.tipo_selecionado,this.subtipo_selecionado)
				setTimeout((function()
				{

					this.flag = false;
					//console.log("TIME OUT",this);
				}).bind(this), 100);
				//

			}
			event.preventDefault();

		}).bind(this));

		/* Busca medicamentos */
		this.selecione_localizacao_esq.bind(this.touchStartEvent, (function(event)
		{
			//console.log("localização medicamentos");

			this.tipo_localidade_busca_medicamento = event.target.getAttribute('data-tipo');
			/*
		    if (event.target.getAttribute('data-tipo') == "residencia") {
		        console.log("residencia");
		    } else {
		        console.log("localização atual");
		    }
            */
			if (!this.flag)
			{
				this.flag = true;

				this.div_selecione_localizacao_esq.toggleClass('dspl-nn');
				this.div_submenu_pins_esq.toggleClass('dspl-nn');

				setTimeout((function()
				{

					this.flag = false;
				}).bind(this), 100);
			}
			event.preventDefault();

		}).bind(this));
		/* Busca medicamentos */

		this.menu_pins.bind(this.touchStartEvent, (function(event)
		{


			if (!this.flag)
			{
				this.flag = true;

				//esconde o menu e mostra o sub menu
				this.menu_pins.toggleClass('dspl-nn');

				this.div_submenu_pins.toggleClass('dspl-nn');

				setTimeout((function()
				{

					this.flag = false;
					//console.log("TIME OUT",this);
				}).bind(this), 100);
				//console.log(event.target.getAttribute('data-tipo'),event.currentTarget);

				//filtra a lista de subtipos que aparece depois do click
				this.filterUbsSubItens(event.target.getAttribute('data-tipo'));

				//this.createUbsMarkersByTipo(event.target.getAttribute('data-tipo'));
			}
			return false;
		}).bind(this));

//precisa ser touch end pq temos scroll
		this.submenu_pins.bind(this.touchEndEvent, (function(event)
		{
			if (!this.flag)
			{
				this.flag = true;

				console.log("click submenu_pins")

				//esconde o sub menu e mostra o menu
				//this.menu_pins.toggleClass('dspl-nn');
				this.div_submenu_pins.toggleClass('dspl-nn');
				this.div_selecione_localizacao.toggleClass('dspl-nn');

				setTimeout((function()
				{

					this.flag = false;
					// console.log("TIME OUT",this);
				}).bind(this), 100);

				//cria os markers
				//this.createUbsMarkersByTipoAndSubtipo(event.target.getAttribute('data-tipo'),event.target.getAttribute('data-subtipo'));
				//this.showHideFilters();

				this.tipo_selecionado = event.target.getAttribute('data-tipo');
				this.subtipo_selecionado = event.target.getAttribute('data-subtipo');



			}
			return false;
		}).bind(this));

		/* Busca medicamentos */
		// click no medicamento - busca de UBSs próximas
		this.submenu_pins_esq.bind(this.touchEndEvent, (function(event)
		{
			if (!this.flag)
			{
				this.flag = true;


				this.alertWaitmedicamento(event.target.innerText);

				var attBuscaMedicamento = event.target.getAttribute("codigo-material");

				if (attBuscaMedicamento != null)
				{
					API.GetUBSsMedicamento(event.target.getAttribute('codigo-material'), this.tipo_localidade_busca_medicamento);
				}

				setTimeout((function()
				{
					this.flag = false;
				}).bind(this), 100);
				// 
			}
			return false;
		}).bind(this));
		/* Busca medicamentos */



		// click voltar filtros
		this.voltar_div_submenu_pins.bind(this.touchStartEvent, (function(event)
		{
			if (!this.flag)
			{
				this.flag = true;

				//escode o div atual
				this.div_submenu_pins.toggleClass('dspl-nn');

				//mostra o primeiro nivel
				this.menu_pins.toggleClass('dspl-nn');

				setTimeout((function()
				{

					this.flag = false;
					// console.log("TIME OUT",this);
				}).bind(this), 100);

			}
			return false;
		}).bind(this));

		/* Busca medicamentos */
		this.voltar_div_submenu_pins_esq.bind(this.touchStartEvent, (function(event)
		{
			if (!this.flag)
			{
				this.flag = true;
				//console.log("voltar da busca de princípio ativo");
				// limpa e escode o div atual
				$("#submenu_pins_esq").empty(); // limpa a lista de medicamentos
				$("#principio_ativo_esq").val("");
				this.div_submenu_pins_esq.toggleClass('dspl-nn'); // esconde

				//mostra o primeiro nivel
				this.div_selecione_localizacao_esq.toggleClass('dspl-nn');

				setTimeout((function()
				{

					this.flag = false;
				}).bind(this), 100);

			}
			return false;
		}).bind(this));
		/* Busca medicamentos */

		this.voltar_div_selecione_localizacao.bind(this.touchStartEvent, (function(event)
		{
			if (!this.flag)
			{
				this.flag = true;

				;

				//mostra o primeiro nivel
				this.div_selecione_localizacao.toggleClass('dspl-nn');

				//escode o div atual
				this.div_submenu_pins.toggleClass('dspl-nn')

				setTimeout((function()
				{

					this.flag = false;
					// console.log("TIME OUT",this);
				}).bind(this), 100);

			}
			return false;
		}).bind(this));



		//click Botoes

		this.btShow.bind(this.touchStartEvent, function()
		{
			if (!this.flag)
			{
				this.flag = true;
				setTimeout(function()
				{
					this.flag = false;
				}, 100);
				checkGeolocation();
			}
			return false;
		});

		/* Busca medicamentos */
		this.bt_menu_lateral_esq.bind(this.touchStartEvent, (function()
		{

			if (!this.cachedmenuesq)
			{
				this.cachedmenuesq = $("#menu_lateral_esq");
			}

			// Se estiver na busca de princípio ativo, volta antes
			if (!this.div_submenu_pins_esq.hasClass('dspl-nn'))
			{
				this.div_submenu_pins_esq.addClass('dspl-nn');
				this.div_selecione_localizacao_esq.removeClass('dspl-nn');
			}

			//console.log("Menu lateral esquerdo");

			if (!this.flag)
			{
				this.flag = true;

				setTimeout((function()
				{

					this.flag = false;
				}).bind(this), 100);

				this.showHideMedicamentos();

			}
			return false;
		}).bind(this));
		/* Busca medicamentos */

		this.bt_menu_lateral.bind(this.touchStartEvent, (function()
		{

			if (!this.cachedmenu)
			{
				this.cachedmenu = $("#menu_lateral");
			}
			//console.log("CLICK OPCOES",this);

			if (!this.flag)
			{
				this.flag = true;

				setTimeout((function()
				{

					this.flag = false;
					// console.log("TIME OUT",this);
				}).bind(this), 100);

				this.showHideFilters()

			}
			return false;
		}).bind(this));

		this.btopcoes.bind(this.touchStartEvent, (function()
		{


			console.log("CLICK OPCOES");

			if (!this.flag)
			{
				this.flag = true;

				setTimeout((function()
				{

					this.flag = false;
					// console.log("TIME OUT",this);
				}).bind(this), 100);

				this.showHideOptions()

			}
			return false;
		}).bind(this));

		//input medicamentos

		this.inpt_principio_ativo_esq.keyup(function(e)
		{
			if (e.which == 13)
			{
				if (!UIS.flag)
				{
					UIS.flag = true;
					setTimeout(function()
					{
						UIS.flag = false;
					}, 100);


					if (this.value != "" && this.value != undefined && this.value != " ")
					{
						//CoreGeoloc.addNewPosition();
						UIS.findMedicamentos();
					}
					else
					{
						alert("Preencha seu endereço!")
					}
				}
			}

		});

		this.endereco.keyup(function(e)
		{

			if (e.which == 13)
			{

				if (!UIS.flag)
				{
					UIS.flag = true;
					setTimeout(function()
					{
						UIS.flag = false;
					}, 100);

					//CoreGeoloc.calculateRoute();
					//e.stopImmediatePropagation();
					if (this.value != "" && this.value != undefined && this.value != " ")
					{
						CoreGeoloc.addNewPosition();
					}
					else
					{
						alert("Preencha seu endereço!")
					}

				}
			}
		});


		this.seu_endereco.keyup(function(e)
		{

			if (e.which == 13)
			{

				if (!UIS.flag)
				{
					UIS.flag = true;
					setTimeout(function()
					{
						UIS.flag = false;
					}, 100);

					if (this.value != "" && this.value != undefined && this.value != " ")
					{
						CoreGeoloc.findAddres(this.value);
					}
					else
					{
						alert("Preencha seu endereço!")
					}

					//CoreGeoloc.calculateRoute();
					//e.stopImmediatePropagation();
				}
			}
		});




	},

	//reseta o estado dos filtros
	resetFiltersState: function()
	{
		if (!this.div_selecione_localizacao.hasClass("dspl-nn"))
		{
			this.div_selecione_localizacao.toggleClass("dspl-nn");
		}

		if (this.menu_pins.hasClass("dspl-nn"))
		{
			this.menu_pins.toggleClass("dspl-nn");
		}

		if (!this.div_submenu_pins.hasClass("dspl-nn"))
		{
			this.div_submenu_pins.toggleClass("dspl-nn");
		}

	},
	//seleciona o ponto de referencia pra marcar as UBSs residencia || ATUAL
	setGeoreferencePoint: function(point)
	{


		if (point == "residencia")
		{
			API.lat = window.localStorage.getItem("endereco_Lat");
			API.longi = window.localStorage.getItem("endereco_Longi");
			console.log("PONTO CASA", API.lat, API.longi)
			CoreGeoloc.currentPosition = new google.maps.LatLng(API.lat, API.longi);
		}
		else
		{

			API.lat = CoreGeoloc.pontoAtual.lat();
			API.longi = CoreGeoloc.pontoAtual.lng();
			console.log("PONTO ATUAL", API.lat, API.longi)

			CoreGeoloc.currentPosition = new google.maps.LatLng(API.lat, API.longi);
		}

		CoreGeoloc.centerMymap();
	},
	//esconde ou mostra opcoes
	showHideOptions: function()
	{
		//this.hideRotas();
		//this.resetFiltersState();

		var idx = window.localStorage.getItem("first_buid");

		AJUDA.reset();

		console.log("showHideOptions", idx)
			//if(parseInt(idx)>0){

		if (this.div_options.hasClass("anima-opcoes-show"))
		{
			//console.log("HIDE")
			this.div_options.removeClass("anima-opcoes-show");
			this.div_options.addClass("anima-opcoes-hide");

		}
		else
		{
			//console.log("SHOW")
			this.div_options.removeClass("anima-opcoes-hide");
			this.div_options.addClass("anima-opcoes-show");
			this.hideRotas();
			//this.resetFiltersState();

			if (this.cachedmenu.hasClass("anima-menu-show"))
			{
				this.showHideFilters()
			}
			/* Busca medicamentos */
			if (this.cachedmenuesq.hasClass("anima-menuesq-show"))
			{
				this.showHideMedicamentos()
			}
			/* Busca medicamentos */

		}
		//}else{
		//	window.localStorage.setItem("first_buid","2");
		/}/

		this.blurForm();


	},
	showRotasCarregandoMapas: function()
	{
		var elem = $("#carrega_mapa");

		if (elem.hasClass('dspl-nn'))
		{
			console.log("habilita o mapa")
				//this.h3_lb_cont_carrega_mapa.text("Aguarde, carregando mapas.");
			elem.toggleClass('dspl-nn');
		}
	},

	//esconde alerta de carregando mapa
	hideCarregandoMapas: function()
	{

		if (!this.div_carregaMapa.hasClass('dspl-nn'))
		{
			console.log("habilita o mapa")
			this.h3_lb_cont_carrega_mapa.text("Aguarde, carregando mapas.");
			this.div_carregaMapa.addClass('dspl-nn');
		}
	},

	//esconde ou mostra filtros
	showHideFilters: function()
	{
		this.hideRotas();
		this.resetFiltersState();
		if (this.cachedmenu.hasClass("anima-menu-show"))
		{
			//console.log("HIDE")
			this.cachedmenu.removeClass("anima-menu-show");
			this.cachedmenu.addClass("anima-menu-hide");
			this.bt_menu_lateral.removeClass('img-bt-lateral-fechar')
			this.bt_menu_lateral.addClass('img-bt-lateral-abrir')

		}
		else
		{
			//console.log("SHOW")
			this.cachedmenu.removeClass("anima-menu-hide");
			this.cachedmenu.addClass("anima-menu-show");
			this.bt_menu_lateral.removeClass('img-bt-lateral-abria')
				/* Busca medicamentos */
			this.bt_menu_lateral.addClass('img-bt-lateral-fechar')

			if (this.div_options.hasClass("anima-opcoes-show"))
			{
				this.showHideOptions()
			}
			if (this.cachedmenuesq.hasClass("anima-menuesq-show"))
			{
				this.showHideMedicamentos()
			}
			/* Busca medicamentos */
		}
	},

	/* Busca medicamentos */
	//esconde ou mostra filtros
	showHideMedicamentos: function()
	{
		this.hideRotas();
		this.resetFiltersState();
		if (this.cachedmenuesq.hasClass("anima-menuesq-show"))
		{
			//console.log("HIDE")
			this.cachedmenuesq.removeClass("anima-menuesq-show");
			this.cachedmenuesq.addClass("anima-menuesq-hide");
			this.bt_menu_lateral_esq.removeClass('img-bt-lateral-medc-abrir');
			this.bt_menu_lateral_esq.addClass('img-bt-lateral-medc-fechar');

			$("#principio_ativo_esq").val("");
			$("#submenu_pins_esq").empty(); // limpa a lista de medicamentos
		}
		else
		{
			//console.log("SHOW")
			this.cachedmenuesq.removeClass("anima-menuesq-hide");
			this.cachedmenuesq.addClass("anima-menuesq-show");
			this.bt_menu_lateral_esq.removeClass('img-bt-lateral-medc-fechar')
			this.bt_menu_lateral_esq.addClass('img-bt-lateral-medc-abrir')

			if (this.div_options.hasClass("anima-opcoes-show"))
			{
				this.showHideOptions();
			}
			if (this.cachedmenu.hasClass("anima-menu-show"))
			{
				this.showHideFilters();
			}
		}
	},

	findMedicamentos: function()
	{
		var principioAtivoEsq = $("#principio_ativo_esq").val();

		console.log("ENVIA REQ MEDICAMENTOS", principioAtivoEsq)

		if (principioAtivoEsq.length > 5)
		{
			console.log("ENVIA REQ MEDICAMENTOS")
			API.GetMedicamentos(principioAtivoEsq);

		}
		else
		{
			alert("Por favor, digite pelo menos 6 caracteres para o princípio ativo.");
		}

		this.blurForm();

	},
	/* Busca medicamentos */

	//esconde rotas
	hideRotas: function()
	{

		if (this.divResults.hasClass('anima-rota-show'))
		{
			this.mapCanvas.removeClass("h-48-pct");
			this.mapCanvas.addClass("h-100-pct");

			var center = CoreGeoloc.map.getCenter();
			google.maps.event.trigger(CoreGeoloc.map, "resize");
			CoreGeoloc.map.setCenter(center);

			//limpa a rota do mapa
			CoreGeoloc.directionsDisplay.setMap(null);

			this.divResults.removeClass("anima-rota-show");
			this.divResults.addClass("anima-rota-hide");

			if (this.bt_rotas_carro.hasClass('img-bt-rotas-carro-disabled'))
			{
				this.bt_rotas_carro.removeClass('img-bt-rotas-carro-disabled');
				this.bt_rotas_carro.addClass('img-bt-rotas-carro-active');
			}

			if (this.bt_rotas_onibus.hasClass('img-bt-rotas-bus-active'))
			{
				this.bt_rotas_onibus.removeClass('img-bt-rotas-bus-active');
				this.bt_rotas_onibus.addClass('img-bt-rotas-bus-disabled');
			}

			if (this.bt_rotas_ape.hasClass('img-bt-rotas-ape-active'))
			{
				this.bt_rotas_ape.removeClass('img-bt-rotas-ape-active');
				this.bt_rotas_ape.addClass('img-bt-rotas-ape-disabled');

			}

		}

	},

	removeRotas: function()
	{
		var center = CoreGeoloc.map.getCenter();
		google.maps.event.trigger(CoreGeoloc.map, "resize");
		CoreGeoloc.map.setCenter(center);

		//limpa a rota do mapa
		CoreGeoloc.directionsDisplay.setMap(null);

		document.getElementById("directions").innerHTML = "";

	},

	hideAll: function()
	{

		//esconde menus
		if (this.cachedmenu.hasClass("anima-menu-show"))
		{
			this.cachedmenu.removeClass("anima-menu-show");
			this.cachedmenu.addClass("anima-menu-hide");
			this.bt_menu_lateral.removeClass('img-bt-lateral-fechar')
			this.bt_menu_lateral.addClass('img-bt-lateral-abrir')
		}


		//esconde opcoes
		if (this.div_options.hasClass("anima-opcoes-show"))
		{
			this.div_options.removeClass("anima-opcoes-show");
			this.div_options.addClass("anima-opcoes-hide");
		}

	},

	//mostra rotas
	showRotas: function()
	{
		this.mapCanvas.removeClass("h-100-pct");
		this.mapCanvas.addClass("h-48-pct");
		this.divResults.addClass("anima-rota-show");
		this.divResults.removeClass("anima-rota-hide");
		CoreGeoloc.infowindow.close();
	},

	hideOndeMora: function()
	{
		this.form_endereco.toggleClass('dspl-nn');
	},
	showOndeMora: function(showExitButton)
	{
		if (showExitButton)
		{
			this.fechar_box_endereco.removeClass('dspl-nn');
		}
		else
		{
			this.fechar_box_endereco.addClass('dspl-nn');
		}
		this.form_endereco.toggleClass('dspl-nn');
	},

	showUBSData: function() {

	},
	hideUBSData: function() {

	},

	/* Busca medicamentos */
	//cria o menu de medicamentos
	createMedicamentoItens: function()
	{
		var nodes = "";
		//console.log("****** createMedicamentoItens")

		// limpa a lista atual
		$("#submenu_pins_esq").empty();

		var i = 1;
		$.each(API.listaMedicamentos, function(i)
		{
			nodes += "<li class=''><a href='#' codigo-material='" + this.Cod_Mate_Saude + "' >" + this.Descricao + "</a></li>";
			//nodes += "<li ontouchstart='javascript:console.log(1)' class='min-h-40 w-280 font-1-5-em bg-verm' >" + this.Descricao + "</li>";
			i++;
		});
		this.submenu_pins_esq.append(nodes);
		//console.log("createMedicamentoItens = " + nodes);

		this.div_submenu_pins_esq.removeClass('dspl-nn');

		/*  var obj = null;
	    $("#submenu_pins_esq li").each(function () {
	        obj = $(this);
	
	            obj.removeClass('dspl-nn');

	    });*/
	},
	/* Busca medicamentos */

	//cria o meu de tipos
	createUbsItens: function()
	{
		var nodes = "";
		console.log("****** createUbsItens", API.tiposUBS)
		var i = 1;
		$.each(API.tiposUBS, function(i)
		{
			nodes += "<li class='ico-pin0" + i + "'><a href='#' data-tipo='" + this.Codigo + "' >" + this.Descricao + "</a></li>";
			UIS.createUbsSubItens(this.Codigo, this.SubTipos);
			i++;
		});
		//console.log("createUbsItens",nodes)
		$("#menu_pins").append(nodes);

	},

	//cria o menu de subtipos
	createUbsSubItens: function(tipoID, subtipos)
	{
		var nodes = "";
		$.each(subtipos, function()
		{
			nodes += "<li data-tipo='" + tipoID + "'><a href='#' data-tipo='" + tipoID + "' data-subtipo='" + this.Codigo + "' >" + this.Descricao + "</a></li>";
		});
		$("#submenu_pins").append(nodes);
	},

	//filtra a lista de subtipos do menu
	filterUbsSubItens: function(tipoID)
	{

		var obj = null;


		$("#submenu_pins li").each(function()
		{

			obj = $(this);
			//console.log("filterUbsSubItens", tipoID, obj)

			if (obj.attr("data-tipo") == tipoID)
			{

				obj.removeClass('dspl-nn');

			}
			else
			{
				obj.addClass('dspl-nn');
			}
		});

	},

	createUbsMarkersByTipo: function(tipoID)
	{
		console.log(API.getUBSByTipo(tipoID));
	},

	createUbsMarkersByTipoAndSubtipo: function(tipoID, subtiposID)
	{

		var dados = API.getUBSByTipoAndSubtipo(tipoID, subtiposID);

		CoreGeoloc.apiDataToMarkers(dados);
		//console.log(API.getUBSByTipoAndSubtipo(tipoID,subtiposID));
	},

	showHideSobreApp: function()
	{
		this.div_sobreApp.toggleClass('dspl-nn');
	},

	showHideAbertura: function()
	{
		this.div_abertura.toggleClass('dspl-nn');
		AJUDA.reset();
	},

	hideMenuMedicamentos: function()
	{
		this.div_submenu_pins_esq.toggleClass('dspl-nn');
		this.div_selecione_localizacao_esq.toggleClass('dspl-nn');
		this.showHideMedicamentos();
	},

	alertWaitmedicamento: function(txtmedicamento)
	{

		this.h3_lb_cont_carrega_mapa.text("Aguarde, procurando UBSs com o medicamento \"" + txtmedicamento + "\".");
		this.div_carregaMapa.toggleClass('dspl-nn');
	}


};
