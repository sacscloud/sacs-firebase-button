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
        const key = db.push(objFinal).key;
         //var key = "FADGA";
        this.__pushPerformInventory(key);



    },

    __pushPerformInventory: function (keyFather) {

        Promise.all([this.__getWarehouse(), this.__getBranchOffice()])
        .then( values => {
            
            const [warehouses, branchOffices] = values;
    
            this.__filterProducts(warehouses, branchOffices, keyFather);
        });
         
    },

    __filterProducts: function(warehouses, branchOffices, keyFather){

        const existenceDB = firebase.database().ref(`/accounts/${this.account}/existenciasproductos`);
        const performDB = firebase.database().ref(`/accounts/${this.account}/performinventorycount`);
        const products = this.parentNode.querySelector('sacs-list-items').value;
        const counted = 0;
        const created = Date.now();
        const modified = Date.now();
        const uid = firebase.auth().currentUser.uid;


        existenceDB.on('value', snapshot => {

            const arrayExistence = this.__snapshotToArray(snapshot);

            products.map(productObj => {

                const { nombre: producto, costo, sku } = productObj;
                let existencia = null;

                for (let objExistence of arrayExistence) {
                    for (let key in objExistence) {
                
                        if (key === "producto" && objExistence.producto === productObj.$key) {
                    
                            existencia = (typeof objExistence.existencia === 'string') ? parseInt(objExistence.existencia) : objExistence.existencia;
                            
                            const almacen = this.__getNameWarehouse(warehouses, objExistence.almacen);
                            const sucursal = this.__getNameBranchOffice(branchOffices, objExistence.nombre_sucursal);


                             if(almacen === this.parentNode.querySelector("#almacen").value && sucursal === this.parentNode.querySelector("#outlet").value){
                                const product = {
                                    costo,
                                    counted,
                                    created,
                                    existencia,
                                    modified,
                                    producto,
                                    key_padre:keyFather,
                                    almacen,
                                    sucursal,
                                    sku,
                                    uid
                                }

                                performDB.push(product);

                             }

                        }
                    }
                }

            });



        });
    },

    __getNameWarehouse: function(array, key){

        return array.filter(element => element.$key === key)[0].almacen;
      

    },

    __getNameBranchOffice: function(array, key){

        return array.filter(element => element.$key === key)[0].nombre_sucursal;
     
    },

    __getWarehouse: function(){
        const warehouseDB = firebase.database().ref(`/accounts/${this.account}/almacenes`);

        return warehouseDB.once('value').then( snapshot =>{
             return this.__snapshotToArray(snapshot);
        })
    },

    __getBranchOffice:function(){
        const branchOfficeDB = firebase.database().ref(`/accounts/${this.account}/sucursales`);
        return branchOfficeDB.once('value').then( snapshot =>{
            return this.__snapshotToArray(snapshot);
       })

    },

    __snapshotToArray: function (snapshot) {
        var returnArr = [];

        snapshot.forEach(function (childSnapshot) {
            const item = childSnapshot.val();
            item.$key = childSnapshot.key;

            returnArr.push(item);
        });

        return returnArr;
    },

    __saveInputProperty: function (obj) {

        let data = this.__createDataInput(obj);

        return data;
    },

    _validateInput: function (value) {

        return (value === "" || value === null || value === undefined) ? false : true;
    },

    __createDataInput: function (obj) {


        let value = null;

        for (let data of this.fields) {


            switch (data.type) {
                case "text":
                    value = this.parentNode.querySelector(data.input).value;
                    break;
                case "number":
                    value = this.parentNode.querySelector(data.input).value;
                    break;
                case "check":
                    value = this.parentNode.querySelector(data.input).checked;
                    break;
                case "select":
                    value = this.parentNode.querySelector(data.input).value;
                    break;

            }

            if (!this._validateInput(value)) {
                return;
            }


            try {
                Object.defineProperty(obj, data.path,
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


    }
});

