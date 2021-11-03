const { default: axios } = require('axios');
const { urlencoded } = require('express');
const express = require('express');
const { executeFile } = require('./execFile');
const cors = require('cors');
const mongoose = require('mongoose');
const Question = require('../models/Question');
const fs = require('fs');
const path = require('path');
require('dotenv');

const PORT = process.env.SERVER_PORT || 9200;

mongoose.connect('mongodb://localhost/eduhack-coding-service', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}, (err) => {
    err && console.error(err);
    console.log("Successfully connected to MongoDB Database");
})

const app = express();

app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(cors());

const paths = {
    runCode: '/api/coding/run/code',
    nodeServer: 'http://localhost:10200/api/code/server/node/run',
    pythonServer: 'http://localhost:10300/api/code/server/python/run',
    getStatus: '/api/coding/status/:language/:jobId',
    addQuestion: '/api/coding/add/question',
    getQuestion: '/api/coding/get/question',
    getAllQuestions: '/api/coding/get/all/questions',
    getDefaultFile: '/api/coding/get/defaultfile/:language'
    // getPythonStatus: 'http://localhost:10300/api/code/server/status/:jobId',
}

const serverMapping = {
    javascript : {
        port: 10200,
        paths: paths['nodeServer']
    },
    python: {
        port: 10300,
        paths: paths['pythonServer']
    }
}

app.get(`${paths['getStatus']}`, async (req, res) => {
    
    const jobId = req.params.jobId;
    const language = req.params.language.toLowerCase();

    if(language == "javascript"){
        
        paths["getNodeStatus"] = `http://localhost:10200/api/code/server/status/${jobId}`;
        await axios.get(`${paths['getNodeStatus']}`, {})
            .then((response) => {
                console.log("Resp from Node Server", response.data);
                return res.status(200).json({success: true, ...response.data});
            }).catch((err) => {
                console.error("Error connecting to server")
                return res.status(400).json({success: false, error: 'Error connecting to server!'})
            });

    } else {
        
        paths["getPythonStatus"] = `http://localhost:10300/api/code/server/status/${jobId}`;
        await axios.get(`${paths["getPythonStatus"]}`)
            .then((responses)=> {
                console.log("Resp from Python Server", responses.data);
                return res.status(200).send({success: true, ...responses.data});
            }).catch((err) => {
                console.log("Error connecting to Python server");
                return res.status(400).json({success: false, error: "Error connecting to python server!"});
            });
            
    }

    
    
})

app.post(`${paths['runCode']}`, async (req, res) => {
    
    console.log("Request to Main Gateway")
    
    let { language, content, userEmail, questionId } = req.body;
    
    try{

        if(content === undefined){
            return res.status(400).json({success: false, error: "Empty code body"})
        }

        await axios.post(`${serverMapping[language.toLowerCase()].paths}`, {
            content: content,
            userEmail: userEmail,
            questionId: questionId
        }).then((response) => {
            return res.status(200).send({...response.data});
        }).catch(err => {
            console.log(err.response.data.err.stderr)
            const resp = err.response.data.err.stderr
            return res.status(400).json({resp})
        })
    } catch(err){
        return res.status(400).send({err})
    }
    
});

app.post(`${paths["addQuestion"]}`, async (req, res) => {
    
    let { title, description, concepts, score, inputDescription, inputExample, outputDescription, outputExample, testCases, functionName, numberOfParams, parameters, maxExecutionInSec } = req.body;
    
    if(!title || !description || !concepts || !score || !inputDescription || !inputExample || !outputDescription || !outputExample || !testCases || !functionName || !numberOfParams || !maxExecutionInSec){
        console.log("Request BODY :: ", req.body);
        return res.status(400).send({success: false, message: "Please add all necessary field"});
    }

    let question;
    try{
        question = await new Question({...req.body}).save();
        return res.status(200).json({success: true, question});
    } catch(err){
        console.error("ERROR :: ", err);
    }
});

app.get(`${paths["getQuestion"]}`, async (req, res) => {
    let questionId = req.query.id;
    let question;
    console.log("Question ID", questionId);
    try{
        question = await Question.find({_id: questionId}).exec();
    } catch(err){
        console.error("Failed Getting Question from DB");
        return res.status(400).json({success: false, error: err});
    }
    return res.status(200).json({success: true, questionData: question});
});

app.get(`${paths["getAllQuestions"]}`, async (req, res) => {
    let category = req.query.category;

    console.log("Req question category", req.query);
    let allQuestions;
    try{
        allQuestions = await Question.find({category: category}).exec();
    } catch(err){
        console.log("Error fetching all questions from DB", err);
        return res.status(400).json({success: false, error: err});
    }
    return res.status(200).json({success: true, questions: allQuestions});
});

app.get(`${paths["getDefaultFile"]}`, async (req, res) => {
    let defaultContent = "";
    let language = req.params.language.toString().toLowerCase();
    console.log("Received default file request")
    let filePath;
    switch(req.params.language.toString().toLowerCase()){
        case 'javascript':
            filePath = path.join(__dirname, `../defaultFiles/${language}.js`)
            break;
        
        case 'python': 
            filePath = path.join(__dirname, `../defaultFiles/${language}.py`)
            break;
        default:
            break;   
    }

    try{
        let fileContent = await fs.readFileSync(filePath, {encoding:'utf8', flag:'r'})
        console.log("File readed", fileContent);
        return res.status(200).json({success: true, content: fileContent})
    } catch(err){
        return res.status(500).json({success: false, error: err});
    }
});

app.listen(PORT, () => {
    console.log(`Coding Gateway listening on ${PORT}`);
});

