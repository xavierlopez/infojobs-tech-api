const gs = require('./services/generalService');


// execute cron task (Database feeding)
async function executeservice() {
    
    console.log('Ejecutando tarea cada minuto');
    await gs.databasefeed();
}

executeservice();