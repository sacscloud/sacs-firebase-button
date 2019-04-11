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

        this.__saveInputsData();
    },

    __saveInputsData: function () {

        const objData = {
            uid: firebase.auth().currentUser.uid,
            created: Date.now(),
            modified: Date.now()
        };

        let objFinal = this.__saveInputProperty(objData);

        const db = firebase.database().ref(`/accounts/${this.account}`).child(this.api);
        db.push(objFinal);
    },

    __saveInputProperty: function (obj) {

        for (let inputs of this.fields) {

            const value = this.parentNode.querySelector(inputs.input).value

            if (!this._validateInput(value)) {
                return;
            }

            try {
                Object.defineProperty(obj, inputs.path, 
                    { 
                     enumerable: true,
                     value 
                    }
                );

            } catch (err) {
                console.log("[Error al definir property]", err);
            }

        }

        return obj;
    },

    _validateInput: function (value) {

        return (value === "" || value === null || value === undefined) ? false : true;
    }

});

