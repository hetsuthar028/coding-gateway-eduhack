const { default: axios } = require('axios');
const { urlencoded } = require('express');
const express = require('express');
const { executeFile } = require('./execFile');
const cors = require('cors');

require('dotenv');

const PORT = process.env.SERVER_PORT || 9200;

const app = express();

app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(cors());

const path = {
    mainGateway: '/api/coding/run/code',
    nodeServer: 'http://localhost:10200/api/code/server/node/run',
    pythonServer: 'http://localhost:10300/api/code/server/python/run',
    getStatus: '/api/coding/status/:language/:jobId',
    
    // getPythonStatus: 'http://localhost:10300/api/code/server/status/:jobId',
}

const serverMapping = {
    javascript : {
        port: 10200,
        path: path['nodeServer']
    },
    python: {
        port: 10300,
        path: path['pythonServer']
    }
}

app.get(`${path['getStatus']}`, async (req, res) => {
    
    const jobId = req.params.jobId;
    const language = req.params.language.toLowerCase();

    if(language == "javascript"){
        
        path["getNodeStatus"] = `http://localhost:10200/api/code/server/status/${jobId}`;
        await axios.get(`${path['getNodeStatus']}`, {})
            .then((response) => {
                console.log("Resp from Node Server", response.data);
                return res.status(200).json({success: true, ...response.data});
            }).catch((err) => {
                console.error("Error connecting to server")
                return res.status(400).json({success: false, error: 'Error connecting to server!'})
            });

    } else {
        
        path["getPythonStatus"] = `http://localhost:10300/api/code/server/status/${jobId}`;
        await axios.get(`${path["getPythonStatus"]}`)
            .then((responses)=> {
                console.log("Resp from Python Server", responses.data);
                return res.status(200).send({success: true, ...responses.data});
            }).catch((err) => {
                console.log("Error connecting to Python server");
                return res.status(400).json({success: false, error: "Error connecting to python server!"});
            });
            
    }

    
    
})

app.post(`${path['mainGateway']}`, async (req, res) => {
    
    console.log("Request to Main Gateway")
    
    let { language, content } = req.body;
    try{

        if(content === undefined){
            return res.status(400).json({success: false, error: "Empty code body"})
        }

        await axios.post(`${serverMapping[language.toLowerCase()].path}`, {
            content: content
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

app.listen(PORT, () => {
    console.log(`Coding Gateway listening on ${PORT}`);
});

