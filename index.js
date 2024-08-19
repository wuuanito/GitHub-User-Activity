const https = require('https');

// Función para obtener los eventos de GitHub de un usuario
function getGithubEvents(username) {
    const options = {
        hostname: 'api.github.com',
        path: `/users/${username}/events`,
        method: 'GET',
        headers: {
            'User-Agent': 'node.js'
        }
    };

    const req = https.request(options, (res) => {
        let data = '';

        // Acumular datos a medida que llegan
        res.on('data', (chunk) => {
            data += chunk;
        });

        // Procesar los datos una vez que toda la respuesta haya llegado
        res.on('end', () => {
            if (res.statusCode === 200) {
                const events = JSON.parse(data);

                // Imprimir los eventos en la consola
                events.forEach(event => {
                    switch (event.type) {
                        case 'PushEvent':
                            console.log(`Pushed ${event.payload.commits.length} commits to ${event.repo.name}`);
                            break;
                        case 'IssuesEvent':
                            console.log(`Opened a new issue in ${event.repo.name}`);
                            break;
                        case 'WatchEvent':
                            console.log(`Starred ${event.repo.name}`);
                            break;
                        default:
                            console.log(`${event.type} in ${event.repo.name}`);
                    }
                });
            } else {
                console.error(`Error: ${res.statusCode} - ${res.statusMessage}`);
            }
        });
    });

    req.on('error', (e) => {
        console.error(`Error: ${e.message}`);
    });

    req.end();
}

// Obtener el nombre de usuario desde la línea de comandos
const username = process.argv[2];
if (!username) {
    console.error('Por favor, proporciona un nombre de usuario de GitHub.');
    process.exit(1);
}

getGithubEvents(username);
