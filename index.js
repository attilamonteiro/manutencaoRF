const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');

app.use(bodyParser.json());
app.use(cors());

let mediaQuilometrosPorDia = 0;
let quilometrosPercorridos = {
    trocaOleo: 0,
    revisaoFreios: 0,
    trocaPneus: 0,
    inspecaoGeral: 0
};

const trocaDeOleoIntervalo = 10000; // Troca de óleo a cada 10.000 km
const revisaoDeFreiosIntervalo = 20000; // Revisão de freios a cada 20.000 km
const trocaDePneusIntervalo = 50000; // Troca de pneus a cada 50.000 km
const inspecaoGeralIntervalo = 30000; // Inspeção geral a cada 30.000 km

app.post('/api/configurarMedia', (req, res) => {
    mediaQuilometrosPorDia = req.body.media;
    res.status(200).send('Média configurada com sucesso!');
});

app.get('/api/obterProximaManutencao', (req, res) => {
    for (const key in quilometrosPercorridos) {
        quilometrosPercorridos[key] += parseFloat(mediaQuilometrosPorDia);
    }
    const proximaManutencao = calcularProximaManutencao();
    res.status(200).json(proximaManutencao);
});

app.post('/api/realizarManutencao', (req, res) => {
    const tipoManutencao = req.body.tipoManutencao;

    if (!(tipoManutencao in quilometrosPercorridos)) {
        res.status(400).send('Tipo de manutenção inválido!');
        return;
    }

    quilometrosPercorridos[tipoManutencao] = 0; // Reinicia a contagem para o tipo de manutenção
    const proximaManutencao = calcularProximaManutencao();
    res.status(200).json(proximaManutencao); // Retorna a próxima manutenção atualizada
});

function calcularProximaManutencao() {
    const proximaManutencao = {
        trocaOleo: Math.max(trocaDeOleoIntervalo - quilometrosPercorridos.trocaOleo, 0),
        revisaoFreios: Math.max(revisaoDeFreiosIntervalo - quilometrosPercorridos.revisaoFreios, 0),
        trocaPneus: Math.max(trocaDePneusIntervalo - quilometrosPercorridos.trocaPneus, 0),
        inspecaoGeral: Math.max(inspecaoGeralIntervalo - quilometrosPercorridos.inspecaoGeral, 0)
    };

    return proximaManutencao;
}

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
