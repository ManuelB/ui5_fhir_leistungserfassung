sap.ui.define([
    "sap/ui/core/mvc/Controller"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller) {
        "use strict";

        return Controller.extend("ui5fhirleistungserfassung.controller.Leistungserfassung", {
            onInit: function () {

            },
            onPatientPress: function(oEvent) {
                this.getOwnerComponent().getRouter().navTo("Patient");
            }
        });
    });
