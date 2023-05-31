/*global QUnit*/

sap.ui.define([
	"ui5_fhir_leistungserfassung/controller/Leistungserfassung.controller"
], function (Controller) {
	"use strict";

	QUnit.module("Leistungserfassung Controller");

	QUnit.test("I should test the Leistungserfassung controller", function (assert) {
		var oAppController = new Controller();
		oAppController.onInit();
		assert.ok(oAppController);
	});

});
