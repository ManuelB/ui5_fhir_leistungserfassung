sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageToast",
    "sap/m/MessageBox"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, JSONModel, MessageToast, MessageBox) {
        "use strict";

        return Controller.extend("ui5fhirleistungserfassung.controller.Group", {
            onInit: function () {
                this.oAccountModel = new JSONModel({
                    "Accounts": [
                        {
                            "name": "Manuel Blechschmidt",
                            "birthDate": "1986-07-16",
                            "accountNumber": "0020550837"
                        }
                    ],
                    "ChargeItems": [
                        {
                            "code": { "text": "PT_Trainingstherapie" },
                            "occurrenceDateTime": new Date(),
                            "performer": { "actor": "000123456" },
                            "definitionCanonical": "MP0013"
                        }
                    ]
                }, true);
                this.getView().setModel(this.oAccountModel, "Accounts");
            },
            onOpenCaseScanDialog: function (oEvent) {
                this.byId("accountScanner").open();
            },
            onOpenChargeItemScanDialog: function (oEvent) {
                this.byId("chargeItemScanner").open();
            },
            onAccountScanned: function (oEvent) {
                const sBarCode = oEvent.getParameter("value");
                this.getView().getModel().sendGetRequest("/Account/" + sBarCode, {
                    "success": (oData) => {
                        const oAccounts = this.oAccountModel.getProperty("/Accounts");
                        oAccounts.push({
                            "name": oData.name,
                            "birthDate": "Test",
                            "accountNumber": "Test"
                        });
                        this.oAccountModel.setProperty("/Accounts", oAccounts);
                    }
                });
            },
            onChargeItemScanned: function (oEvent) {
                const sBarCode = oEvent.getParameter("value");
                this.getView().getModel().sendGetRequest("/ChargeItemDefinition/"+sBarCode, {
                    "success": (oData) => {
                        const oChargeItems = this.oAccountModel.getProperty("/ChargeItems");
                        oChargeItems.push({
                            "code": { "text": oData.description },
                            "occurrenceDateTime": new Date(),
                            "performer": { "actor": "000123456" },
                            "definitionCanonical": oData.id
                        });
                        this.oAccountModel.setProperty("/ChargeItems", oChargeItems);
                    }
                });
            },
            onSave: function(oEvent) {
                const oAccounts = this.oAccountModel.getProperty("/Accounts");
                const oChargeItems = this.oAccountModel.getProperty("/ChargeItems");
                const oFhirModel = this.getView().getModel();
                for(let oAccount of oAccounts) {
                    for(let oChargeItem of oChargeItems) {
                        oFhirModel.create("ChargeItem", {
                            "account": [{"reference": "Account/"+oAccount.accountNumber}],
                            "occurrenceDateTime": oChargeItem.occurrenceDateTime.toISOString(),
                            "performer": [{
                                "actor": {"reference": "Practitioner/"+oChargeItem.performer.actor}
                            }],
                            "status": "billable",
                            "code" : {
                                "coding" : [{
                                  "code" : oChargeItem.definitionCanonical
                                }]
                              },
                              "subject" : {
                                "reference" : "Patient/"+oAccount.patientNumber
                              },
                        })
                    }
                }
                oFhirModel.submitChanges(undefined,
                    () => {
                        MessageToast.show("Leistungen erfolgreich angelegt.");
                    },
                    () => {
                        MessageBox.error("Fehler beim anlegen der Leistungen.");
                    }
                );

            }
        });
});