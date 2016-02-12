/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */



            //app.initialize();

            document.addEventListener("deviceready", function () {
                console.log("in deviceready");
                //navigator.splashscreen.show();
                UIS.configListeners();
                UIS.pushDiv($("#div_metasStatus"));
                initDB();

            });

             console.log("db iniciou");
            $(document).ready(function () {
                console.log("in ready");
            });

            function checkConnections() {
                console.log("checkConnections");
                CheckGPSWifiPlugin.checkWifi(wifiok, wifiNotok);
            }

            function wifiok(data) {
                console.log("wifi OK");
                lgetDataGoals();
            }

            function wifiNotok(data) {
                console.log("Wifi Not OK")
            }

            /********************* INICIALIZAÇÃO DO BANCO DE DADOS ************************/
            function openDBSuccess() {
                console.log("openDBSuccess");
                // A inicialização do banco de dados ocorreu com sucesso
                this.lgetDataGoals();
            }

            function openDBFail() {
                console.log("openDBFail");
                // Houve falha na inicialização do banco de dados
            }

            function initDB() {
                console.log("initDB");
                BANCODADOS.openDB(this.openDBSuccess, this.openDBFail);
            }
            /********************* INICIALIZAÇÃO DO BANCO DE DADOS ************************/
            /********************* INICIALIZAÇÃO DAS METAS POR STATUS/OBJETIVO*************/
            function lgetDataGoals() {
                console.log("Iniciando busca de dados do sistema...");
                // Verifica atualização automática
                if (atualizacao_Automatica.checked) {
                    // Efetua a atualização dos dados
                    //alert("Verifica se há dados para atualizar");
                    BANCODADOS.updateDataGoals(automatic_didUpdate, automatic_didNotUpdate, automatic_failUpdate);
                }
                else {
                    // todo: Busca metas, revisar preenchimento das divs de metas por status, metas por objetivo e subprefeituras
                    getGoals();
                }
            }

            function getGoals() {
                // Obtém as metas
                console.log("Buscando metas")
				UIS.showTelaAguarde("Carregando dados do banco...");
                BANCODADOS.initGetStatusGoals(true, null, getGoalsSuccess, getGoalsFail);
            }

            function getGoalsSuccess() {
                console.log("getGoalsSuccess");
                // As metas foram obtidas com sucesso
                UIS.hideTelaAguarde();
            }

            function getGoalsFail(err) {
                console.log("getGoalsFail - Erro: " + err);
                // todo: Houve falha na obtenção das metas
                UIS.hideTelaAguarde();

                // Libera uso do click
                UIS.aguardaTransicaoTela = false;
                UIS.showTelaAlert("Houve falha já aplicativo: \r\n " + err + ". Por favor, reinicie o aplicativo.", "Fechar");
            }
            /********************* INICIALIZAÇÃO DAS METAS POR STATUS/OBJETIVO*************/
            /********************* RETORNO DE ATUALIZAÇÃO (AUTOMÁTICA E MANUAL)************/
            function bt_didNotUpdate() {
                console.log("bt_didNotUpdate");
                UIS.hideTelaAguarde();

               	UIS.showTelaAlert("Os dados já estão atualizados!", "Fechar");
                // Atualiza a data da última atualização
                UIS.saveLastUpdateDate();
            }

            function bt_didUpdate() {
                console.log("bt_didUpdate");
                UIS.hideTelaAguarde();

                UIS.showTelaAlert("Atualização efetuada com sucesso!", "Fechar");
                // Atualiza a data da última atualização
                UIS.saveLastUpdateDate();
            }

            function bt_failUpdate() {
                console.log("bt_failUpdate");
                UIS.hideTelaAguarde();

                // Libera uso do click
                UIS.aguardaTransicaoTela = false;
                UIS.showTelaAlert("Houve falha na atualização dos dados.", "Fechar");
            }

            function automatic_didNotUpdate() {
                console.log("automatic_didNotUpdate");
                UIS.hideTelaAguarde();

                UIS.showTelaAlert("Os dados já estão atualizados!", "Fechar");
                getGoals();
            }

            function automatic_didUpdate() {
                console.log("automatic_didUpdate");
                UIS.hideTelaAguarde();

                UIS.showTelaAlert("Atualização efetuada com sucesso!", "Fechar");
                // Atualiza a data da última atualização
                UIS.saveLastUpdateDate();
            }

            function automatic_failUpdate() {
                console.log("automatic_failUpdate");
                UIS.hideTelaAguarde();

                // Libera uso do click
                UIS.aguardaTransicaoTela = false;
                UIS.showTelaAlert("Houve falha na atualização dos dados.", "Fechar");
            }
            /********************* RETORNO DE ATUALIZAÇÃO (AUTOMÁTICA E MANUAL)************/
        