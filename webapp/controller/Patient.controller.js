sap.ui.define([
    "sap/ui/core/mvc/Controller"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller) {
        "use strict";

        return Controller.extend("ui5fhirleistungserfassung.controller.Patient", {
            onInit: function () {

            },
            onPatientSearch: function(oEvent) {
                const patientId = this.byId("patient-id").getValue();
                this.getView().bindElement("/Patient/"+patientId);
            },
            fnToDate: function(sString) {
                return new Date(sString);
            }
        });
    });
