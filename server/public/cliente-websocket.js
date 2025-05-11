const wsUrlInput = document.getElementById('wsUrl');
const conectarBtn = document.getElementById('conectarWs');
const desconectarBtn = document.getElementById('desconectarWs');
const statusConexaoEl = document.getElementById('statusConexao');
const pingInput = document.getElementById('pingInput');
const enviarPingBtn = document.getElementById('enviarPing');
const nomeUsuarioInput = document.getElementById('nomeUsuario');
const mensagemInput = document.getElementById('mensagemInput');
const enviarMensagemBtn = document.getElementById('enviarMensagem');
const logMensagensEl = document.getElementById('logMensagens');

let socket;

function logMensagem(origem, dados) {
    const p = document.createElement('p');
    const timestamp = new Date().toLocaleTimeString();
    p.innerHTML = `<strong>[${timestamp}] ${origem}:</strong> ${JSON.stringify(dados)}`;
    logMensagensEl.appendChild(p);
    logMensagensEl.scrollTop = logMensagensEl.scrollHeight; // Auto-scroll
}

function atualizarStatusConexao(conectado) {
    if (conectado) {
        statusConexaoEl.textContent = 'Conectado';
        statusConexaoEl.className = 'conectado';
        conectarBtn.disabled = true;
        desconectarBtn.disabled = false;
        enviarPingBtn.disabled = false;
        enviarMensagemBtn.disabled = false;
    } else {
        statusConexaoEl.textContent = 'Desconectado';
        statusConexaoEl.className = 'desconectado';
        conectarBtn.disabled = false;
        desconectarBtn.disabled = true;
        enviarPingBtn.disabled = true;
        enviarMensagemBtn.disabled = true;
        if (socket) {
            socket.close(); // Garante que o socket seja fechado
            socket = null;
        }
    }
}

conectarBtn.addEventListener('click', () => {
    if (socket && socket.readyState === WebSocket.OPEN) {
        logMensagem('Cliente', 'Já conectado.');
        return;
    }

    const url = wsUrlInput.value;
    logMensagem('Cliente', `Tentando conectar a: ${url}`);
    socket = new WebSocket(url);

    socket.onopen = () => {
        logMensagem('Cliente', 'Conexão WebSocket estabelecida!');
        atualizarStatusConexao(true);
    };

    socket.onmessage = (evento) => {
        try {
            const mensagemServidor = JSON.parse(evento.data);
            logMensagem(`Servidor (evento: ${mensagemServidor.evento || 'desconhecido'})`, mensagemServidor.dados);

            // Exemplo de tratamento específico de evento no cliente
            if (mensagemServidor.evento === 'novaMensagem') {
                // Poderia atualizar uma UI de chat aqui
                console.log('Nova mensagem de chat recebida:', mensagemServidor.dados);
            }

        } catch (e) {
            logMensagem('Servidor (erro parse)', evento.data);
            console.error("Erro ao parsear mensagem do servidor:", e);
        }
    };

    socket.onerror = (erro) => {
        logMensagem('Cliente', 'Erro na conexão WebSocket.');
        console.error('Erro no WebSocket:', erro);
        atualizarStatusConexao(false);
    };

    socket.onclose = (evento) => {
        logMensagem('Cliente', `Conexão WebSocket fechada. Código: <span class="math-inline">\{evento\.code\}, Motivo\: "</span>{evento.reason || 'N/A'}"`);
        atualizarStatusConexao(false);
    };
});

desconectarBtn.addEventListener('click', () => {
    if (socket) {
        socket.close();
    }
    // O evento 'onclose' tratará a atualização do status
});

enviarPingBtn.addEventListener('click', () => {
    if (socket && socket.readyState === WebSocket.OPEN) {
        const dadosPing = pingInput.value || "Olá Servidor!";
        const mensagem = {
            evento: 'pingCliente',
            dados: dadosPing
        };
        socket.send(JSON.stringify(mensagem));
        logMensagem('Cliente (enviado)', mensagem);
        pingInput.value = '';
    } else {
        logMensagem('Cliente', 'Não conectado para enviar ping.');
    }
});

enviarMensagemBtn.addEventListener('click', () => {
    if (socket && socket.readyState === WebSocket.OPEN) {
        const usuario = nomeUsuarioInput.value.trim();
        const texto = mensagemInput.value.trim();

        if (!usuario) {
            alert('Por favor, insira seu nome.');
            nomeUsuarioInput.focus();
            return;
        }
        if (!texto) {
            alert('Por favor, digite uma mensagem.');
            mensagemInput.focus();
            return;
        }

        const mensagem = {
            evento: 'mensagemUsuario',
            dados: {
                usuario: usuario,
                texto: texto
            }
        };
        socket.send(JSON.stringify(mensagem));
        logMensagem('Cliente (enviado)', mensagem);
        mensagemInput.value = ''; // Limpa o campo de mensagem após enviar
    } else {
        logMensagem('Cliente', 'Não conectado para enviar mensagem.');
    }
});

// Inicializa o status
atualizarStatusConexao(false);