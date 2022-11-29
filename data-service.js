
const Sequelize = require('sequelize');

var sequelize = new Sequelize('lfwgjgul', 'lfwgjgul', 'EqNyNvHdSgYf6ytpDvsT5SLCQjRh08LL', {
   host: 'peanut.db.elephantsql.com',
   dialect: 'postgres',
   port: 5432,
   dialectOptions: {
   ssl: true
   },
   query:{raw: true} 
   });

sequelize.authenticate().then(()=> console.log('Connection success.')) .catch((err)=>console.log("Unable to connect to DB.", err));


var Employee = sequelize.define('Employee', {
    employeeNum: {

        type: Sequelize.INTEGER,
        primaryKey: true, 
        autoIncrement: true 
    },
    firstName: Sequelize.STRING,
    lastName: Sequelize.STRING,
    email: Sequelize.STRING,
    SSN: Sequelize.STRING,
    addressStreet: Sequelize.STRING,
    addressCity: Sequelize.STRING,
    addressState: Sequelize.STRING,
    addressPostal: Sequelize.STRING,
    maritalStatus: Sequelize.STRING,
    isManager: Sequelize.BOOLEAN,
    employeeManagerNum: Sequelize.INTEGER,
    status: Sequelize.STRING,
    department: Sequelize.INTEGER,
    hireDate: Sequelize.STRING
});

var Department = sequelize.define('Department', {
    departmentId: {

        type: Sequelize.INTEGER,
        primaryKey: true, 
        autoIncrement: true 
    },
    departmentName: Sequelize.STRING,
});


function initialize (){


    return new Promise(function (resolve, reject) {
        // sequelize.sync().then(()=>{
        //     resolve();
        // }).catch(()=>{
        //     reject("unable to sync the database");
        // })
        resolve();
        });
   
}

function getAllEmployees(){

    return new Promise(function (resolve, reject) {
        
        Employee.findAll().then(function(data){ 
            resolve(data);
        }).catch(()=>{
            reject("no results returned");
        })


        });


}

function getDepartments(){


    return new Promise(function (resolve, reject) {
    
        Department.findAll().then(function(data){ 
            resolve(data);
        }).catch(()=>{
            reject("no results returned");
        })
        
    });

}


function updateEmployee(employeeData){

    employeeData.isManager = (employeeData.isManager) ? true : false;

    for(const property in employeeData){
        if(employeeData[property] == ""){employeeData[property] = null;}
    }

    return new Promise(function (resolve, reject) {

        Employee.update(employeeData, {where: {employeeNum: employeeData.employeeNum}}).then(()=>{
            resolve();
        }).catch(()=>{
            reject("unable to create employee");
        })
        
    });


}


function addEmployee(employeeData){

    employeeData.isManager = (employeeData.isManager) ? true : false;

    for(const property in employeeData){
        if(employeeData[property] == ""){employeeData[property] = null;}
    }

    return new Promise(function (resolve, reject) {
           
        Employee.create(employeeData).then(()=>{
            resolve();
        }).catch(()=>{
            reject("unable to create employee");
        })

    });


}

function getEmployeesByStatus(status_type){


    return new Promise(function (resolve, reject) {

        Employee.findAll({where:{status: status_type}}).then(function(data){ 
            resolve(data);
        }).catch(()=>{
            reject("no results returned");
        })
        
    });
}


function getEmployeesByDepartment(department_num){

    return new Promise(function (resolve, reject) {
    
        Employee.findAll({where:{department: department_num}}).then(function(data){ 
            resolve(data);
        }).catch(()=>{
            reject("no results returned");
        })
        
    });

}

function getEmployeesByManager(manager){

    return new Promise(function (resolve, reject) {
        
        Employee.findAll({where:{employeeManagerNum: manager}}).then(function(data){ 
            resolve(data);
        }).catch(()=>{
            reject("no results returned");
        })
        
    });

}

function getEmployeeByNum(num){

    return new Promise(function (resolve, reject) {
        
        Employee.findAll({where:{employeeNum: num}}).then(function(data){ 
            resolve(data[0]);
        }).catch(()=>{
            reject("no results returned");
        })

    });
}


function updateDepartment(departmentData){


    for(const property in departmentData){
        if(departmentData[property] == ""){departmentData[property] = null;}
    }

    return new Promise(function (resolve, reject) {

        Department.update(departmentData, {where: {departmentId: departmentData.departmentId}}).then(()=>{
            resolve();
        }).catch(()=>{
            reject("unable to update department");
        })
        
    });


}


function addDepartment(departmentData){


    for(const property in departmentData){
        if(departmentData[property] == ""){departmentData[property] = null;}
    }

    return new Promise(function (resolve, reject) {
           
        Department.create(departmentData).then(()=>{
            resolve();
        }).catch(()=>{
            reject("unable to create department");
        })

    });
}

function getDepartmentById(id){

    return new Promise(function (resolve, reject) {
        
        Department.findAll({where:{departmentId: id}}).then(function(data){ 
            resolve(data[0]);
        }).catch(()=>{
            reject("no results returned");
        })

    });
}

function deleteEmployeeByNum(empNum){

    return new Promise(function (resolve, reject) {

        Employee.destroy({
            where:{employeeNum: empNum}
        }).then(()=>{
            resolve();
        }).catch(()=>{
            reject("unable to remove");
        })
        
    });
}


exports.deleteEmployeeByNum = deleteEmployeeByNum;
exports.updateDepartment = updateDepartment;
exports.addDepartment = addDepartment;
exports.getDepartmentById = getDepartmentById;
exports.getEmployeeByNum = getEmployeeByNum;
exports.getEmployeesByManager = getEmployeesByManager;
exports.getEmployeesByDepartment = getEmployeesByDepartment;
exports.getEmployeesByStatus = getEmployeesByStatus;
exports.addEmployee = addEmployee;
exports.getDepartments = getDepartments;
exports.getAllEmployees = getAllEmployees;
exports.initialize = initialize;
exports.updateEmployee = updateEmployee;