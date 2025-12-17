require('dotenv').config();

const checkApiKey = (req,res,next) => {
    const apikey = req.headers['x-api-key'];

    if(apikey && apikey === process.env.API_KEY){
        next();
    } 
    
    else{
        res.status(401).json({ message: 'API Key invalida o faltante'})
    }

};

module.exports = checkApiKey;