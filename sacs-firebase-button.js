/**
 * `sacs-firebase-button`
 * push data of inputs in firebase
 *
 * @customElement
 * @polymer
 * @demo demo/index.html
 */

'use strict';

Polymer({
    is: 'sacs-firebase-button',
    properties: {

        label: {
            type: String,
            value: "Submit"
        },
        path: {
            type: String,
            value: "data"
        },
        fields: {
            type: Array,
            value: function () {
                return [];
            }
        }
    },

    listeners: {
        'button.click': '_listenerClick'
    },

    _listenerClick: function (e) {

        for (let inputs of this.fields) {

            this.__saveInputData(inputs);
        }

    },
    __saveInputData: function (inputs) {

        const value = this.parentNode.querySelector(inputs.input).value
        const path = inputs.path;


        if (!this._validateInput(value)) {
            return;
        }

        const db = firebase.database().ref(this.path).child(path);



        const objData = {
            input: inputs.input,
            type: inputs.type,
            value: value
        };


        db.push(objData);


    },

    _validateInput: function (value) {

        return (value === "" || value === null || value === undefined) ? false : true;
    }

});

