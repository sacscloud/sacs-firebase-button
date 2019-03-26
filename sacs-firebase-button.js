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
        account: {
            type: String,
            value: "myAccount"
        },
        api: {
            type: String,
            value: "myApi"
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

        if (!this._validateInput(value)) {
            return;
        }

        const db = firebase.database().ref(`/accounts/${this.account}`).child(this.api);

        const objData = {
            inventoryCount: value, 
            uid: firebase.auth().currentUser.uid,
            created:Date.now(),
            modified:Date.now()
        };


        db.push(objData);


    },

    _validateInput: function (value) {

        return (value === "" || value === null || value === undefined) ? false : true;
    }

});

