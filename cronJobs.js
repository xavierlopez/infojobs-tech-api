const gs = require('./services/generalService');
const cron = require('node-cron');

// execute cron task (Database feeding)
cron.schedule('* * * * *', async () => {
    console.log('Ejecutando tarea cada minuto');
    await gs.databasefeed();
});
