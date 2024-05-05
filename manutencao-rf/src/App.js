import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [media, setMedia] = useState(0);
  const [proximaManutencao, setProximaManutencao] = useState({
    trocaOleo: 0,
    revisaoFreios: 0,
    trocaPneus: 0,
    inspecaoGeral: 0
  });

  useEffect(() => {
    obterProximaManutencao();
  }, []); // Executa apenas uma vez, quando o componente é montado inicialmente

  const configurarMedia = () => {
    axios.post('http://localhost:5000/api/configurarMedia', { media })
      .then(() => console.log('Média configurada com sucesso!'))
      .catch(err => console.error('Erro ao configurar a média:', err));
  };

  const obterProximaManutencao = () => {
    axios.get('http://localhost:5000/api/obterProximaManutencao')
      .then(res => {
        const proximaManutencaoAtualizada = {...res.data};
        // Verificando se algum valor é menor que zero e ajustando para zero
        for (const key in proximaManutencaoAtualizada) {
          if (proximaManutencaoAtualizada.hasOwnProperty(key)) {
            proximaManutencaoAtualizada[key] = Math.max(0, proximaManutencaoAtualizada[key]);
          }
        }
        setProximaManutencao(proximaManutencaoAtualizada);
        verificarManutencao(proximaManutencaoAtualizada);
      })
      .catch(err => console.error('Erro ao obter próxima manutenção:', err));
  };

  const realizarManutencao = (tipoManutencao) => {
    axios.post('http://localhost:5000/api/realizarManutencao', { tipoManutencao })
        .then(res => {
            // Atualiza o estado local para refletir as mudanças
            setProximaManutencao(res.data);
        })
        .catch(err => console.error('Erro ao marcar a manutenção como realizada:', err));
};


  const verificarManutencao = (proximaManutencao) => {
    if (proximaManutencao.trocaOleo <= 0) {
      alert("Você precisa fazer a troca de óleo!");
    }
    if (proximaManutencao.revisaoFreios <= 0) {
      alert("Você precisa fazer a revisão dos freios!");
    }
    if (proximaManutencao.trocaPneus <= 0) {
      alert("Você precisa fazer a troca de pneus!");
    }
    if (proximaManutencao.inspecaoGeral <= 0) {
      alert("Você precisa fazer a inspeção geral!");
    }
  };

  return (
    <div>
      <h1>Mini Programa de Manutenção</h1>
      <input type="number" placeholder="Insira a média de km por dia" value={media} onChange={e => setMedia(e.target.value)} />
      <button onClick={configurarMedia}>Configurar Média</button>
      <button onClick={obterProximaManutencao}>Próximo Dia</button>
      <button onClick={() => realizarManutencao('trocaOleo')}>Realizar Troca de Óleo</button>
      <button onClick={() => realizarManutencao('revisaoFreios')}>Realizar Revisão de Freios</button>
      <button onClick={() => realizarManutencao('trocaPneus')}>Realizar Troca de Pneus</button>
      <button onClick={() => realizarManutencao('inspecaoGeral')}>Realizar Inspeção Geral</button>
      <div>
        <h2>Próximas Manutenções</h2>
        <p>Troca de Óleo: {proximaManutencao.trocaOleo} km restantes</p>
        <p>Revisão de Freios: {proximaManutencao.revisaoFreios} km restantes</p>
        <p>Troca de Pneus: {proximaManutencao.trocaPneus} km restantes</p>
        <p>Inspeção Geral: {proximaManutencao.inspecaoGeral} km restantes</p>
      </div>
    </div>
  );
}

export default App;
