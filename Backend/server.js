const app = require('./app')
TurnoZen.listen(process.env.PORT,()=>{
    console.log('LISTENING THE PORT',process.env.PORT)
});