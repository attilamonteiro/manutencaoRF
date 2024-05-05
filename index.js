// Importando as bibliotecas necessárias
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');

// Configuração para o Express usar o bodyParser e o CORS
app.use(bodyParser.json());
app.use(cors());

// Variáveis para armazenar os dados de quilometragem
let mediaQuilometrosPorDia = 0;
let quilometrosPercorridos = {
    trocaOleo: 0,
    revisaoFreios: 0,
    trocaPneus: 0,
    inspecaoGeral: 0
};

// Intervalos para cada tipo de manutenção
const trocaDeOleoIntervalo = 10000; // Troca de óleo a cada 10.000 km
const revisaoDeFreiosIntervalo = 20000; // Revisão de freios a cada 20.000 km
const trocaDePneusIntervalo = 50000; // Troca de pneus a cada 50.000 km
const inspecaoGeralIntervalo = 30000; // Inspeção geral a cada 30.000 km

// Rota para configurar a média de quilometragem por dia
app.post('/api/configurarMedia', (req, res) => {
    mediaQuilometrosPorDia = req.body.media;
    res.status(200).send('Média configurada com sucesso!');
});

// Rota para obter a próxima manutenção
app.get('/api/obterProximaManutencao', (req, res) => {
    // Atualiza a quilometragem percorrida para cada tipo de manutenção
    for (const key in quilometrosPercorridos) {
        quilometrosPercorridos[key] += parseFloat(mediaQuilometrosPorDia);
    }
    // Calcula e envia a próxima manutenção
    const proximaManutencao = calcularProximaManutencao();
    res.status(200).json(proximaManutencao);
});

// Rota para realizar uma manutenção
app.post('/api/realizarManutencao', (req, res) => {
    const tipoManutencao = req.body.tipoManutencao;

    // Verifica se o tipo de manutenção é válido
    if (!(tipoManutencao in quilometrosPercorridos)) {
        res.status(400).send('Tipo de manutenção inválido!');
        return;
    }

    // Reinicia a contagem para o tipo de manutenção
    quilometrosPercorridos[tipoManutencao] = 0;
    // Calcula e envia a próxima manutenção atualizada
    const proximaManutencao = calcularProximaManutencao();
    res.status(200).json(proximaManutencao);
});

// Função para calcular a próxima manutenção
function calcularProximaManutencao() {
    const proximaManutencao = {
        trocaOleo: Math.max(trocaDeOleoIntervalo - quilometrosPercorridos.trocaOleo, 0),
        revisaoFreios: Math.max(revisaoDeFreiosIntervalo - quilometrosPercorridos.revisaoFreios, 0),
        trocaPneus: Math.max(trocaDePneusIntervalo - quilometrosPercorridos.trocaPneus, 0),
        inspecaoGeral: Math.max(inspecaoGeralIntervalo - quilometrosPercorridos.inspecaoGeral, 0)
    };

    return proximaManutencao;
}

// Configura a porta do servidor
const PORT = process.env.PORT || 5000;
// Inicia o servidor na porta especificada
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
