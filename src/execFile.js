const { exec } = require('child_process')
const fs = require('fs');
const path = require('path');

const executeFile = () => {
    return new Promise((resolve, reject) => {
        console.log()
        let currentPath = path.join(__dirname, 'demoProgram.py')
        exec(`python ${currentPath}`, 
            (error, stdout, stderr) => {
                if(error){
                    console.log("REJECT ERROR ::", error);
                    reject({error, stderr})
                }

                if(stderr){
                    console.log("REJECT STDERROR ::", stderr);
                    reject(stderr);
                }

                resolve(stdout)
            })
    })
}


module.exports = {
    executeFile,
}