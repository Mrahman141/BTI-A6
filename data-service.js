

const res = require('express/lib/response');
const { json } = require('express/lib/response');
const fs = require('fs');
const { resolve } = require('node:path');

var employee = [];
var departments = [];


function initialize (){

    return new Promise((resolve,reject) => {
        fs.readFile('data/employees.json', (err,emp) => {

            if(err){
                reject("Unable to read the file");
            }
            else{
                employee = JSON.parse(emp);
    
                fs.readFile('data/departments.json', (er,dept) => {
                    if(er){
                        reject("Unable to read the file");
                    }
                    else{
                        departments = JSON.parse(dept);
                        resolve();
                    }
                })
            }
        })
    })
   
}

function getAllEmployees(){

    return new Promise((resolve, reject) => {
        
        if(employee.length == 0){
            reject("No results Returned");
        }
        else{
            resolve(employee);
        }

    })


}

function getDepartments(){


    return new Promise((resolve, reject) => {
        
        if(departments.length == 0){
            reject("No results Returned");
        }
        else{
            resolve(departments);
        }


    })

}

function getManagers(){

    var isManagers = [];

    return new Promise((resolve,reject) => {
        for(let i=0; i < employee.length; i++){
            if(employee[i].isManager){
                isManagers.push(employee[i]);
            }
        }

        if(isManagers.length == 0){
            reject("No results Returned");
        }
        else {
            resolve(isManagers);
        }
    })


}

function updateEmployee(employeeData){
    console.log(employeeData)
    return new Promise((resolve,reject)=>{
        for(let i=0; i < employee.length; i++){
            if(employee[i].employeeNum == employeeData.employeeNum){
                employee[i] = employeeData;
            }
        }

        resolve();

    })


}


function addEmployee(employeeData){

    return new Promise((resolve,reject)=>{

        employeeData.employeeNum = (employee.length+1);
        if(employeeData.isManager == undefined){
            employeeData.isManager = false;
        }
        else{
            employeeData.isManager = true;
        }

        employee.push(employeeData);

        resolve();

    })


}

function getEmployeesByStatus(status){


    var employ = [];

        return new Promise ((resolve,reject) =>{

            for(let i=0; i < employee.length; i++){
                if(employee[i].status==status){
                    employ.push(employee[i]);
                }
            }
    
            if(employ.length == 0){
                reject("No results Returned");
            }
            else {
                resolve(employ);
            }


        })
}


function getEmployeesByDepartment(department){

    var depart = [];

    return new Promise ((resolve,reject) =>{

        for(let i=0; i < employee.length; i++){
            if(employee[i].department==department){
                depart.push(employee[i]);
            }
        }

        if(depart.length == 0){
            reject("No results Returned");
        }
        else {
            resolve(depart);
        }


    })

}

function getEmployeesByManager(manager){


var mang = [];

    return new Promise ((resolve,reject) =>{

        for(let i=0; i < employee.length; i++){
            if(employee[i].employeeManagerNum==manager){
                mang.push(employee[i]);
            }
        }

        if(mang.length == 0){
            reject("No results Returned");
        }
        else {
            resolve(mang);
        }


    })

}

function getEmployeeByNum(num){

    return new Promise ((resolve,reject) =>{

        for(let i=0; i < employee.length; i++){
            if(employee[i].employeeNum==num){
                resolve(employee[i]);
            }
        }
        reject("No results Returned");
    })
}

exports.getEmployeeByNum = getEmployeeByNum;
exports.getEmployeesByManager = getEmployeesByManager;
exports.getEmployeesByDepartment = getEmployeesByDepartment;
exports.getEmployeesByStatus = getEmployeesByStatus;
exports.addEmployee = addEmployee;
exports.getManagers = getManagers;
exports.getDepartments = getDepartments;
exports.getAllEmployees = getAllEmployees;
exports.initialize = initialize;
exports.updateEmployee = updateEmployee;