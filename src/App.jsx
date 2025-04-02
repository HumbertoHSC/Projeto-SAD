// Importação de bibliotecas e componentes necessários
import React, { useState } from 'react';
import { 
  MdClose,
  MdAdd,
  MdAnalytics,
  MdOutlineDataThresholding, 
} from 'react-icons/md'; // Importa ícones da biblioteca Material Design

// Componente principal da aplicação
export default function App() {
  // Estados para armazenar as alternativas e a nova alternativa sendo digitada
  const [alternativas, setAlternativas] = useState(["Alternativa 1", "Alternativa 2"]);
  const [novaAlternativa, setNovaAlternativa] = useState("");
  
  // Estados para armazenar os critérios e o novo critério sendo digitado
  const [criterios, setCriterios] = useState(["Critério 1", "Critério 2"]);
  const [novoCriterio, setNovoCriterio] = useState("");
  
  // Estado para armazenar a matriz de performance (valores numéricos para cada alternativa-critério)
  const [matrizPerformance, setMatrizPerformance] = useState(
    alternativas.reduce((acc, alt) => {
      acc[alt] = criterios.map(() => 0); // Inicializa com zeros
      return acc;
    }, {})
  );
  
  // Estado para armazenar se cada critério deve ser maximizado ou minimizado
  const [otimizacao, setOtimizacao] = useState(
    criterios.reduce((acc, crit) => {
      acc[crit] = "Maximizar"; // Padrão é maximizar
      return acc;
    }, {})
  );
  
  // Estado para armazenar os pesos de cada critério
  const [pesos, setPesos] = useState(
    criterios.reduce((acc, crit) => {
      acc[crit] = ""; // Inicialmente vazio
      return acc;
    }, {})
  );

  // Dados mockados (simulados) para os resultados da análise
  const resultadosMockados = {
    ranking: [
      { nome: "Alternativa 2", score: 0.85 },
      { nome: "Alternativa 1", score: 0.72 }
    ],
    pesosNormalizados: [
      { nome: "Critério 1", valor: 0.58 },
      { nome: "Critério 2", valor: 0.42 }
    ]
  };

  // Função para adicionar uma nova alternativa
  const adicionarAlternativa = () => {
    if (novaAlternativa.trim()) { // Verifica se não está vazio
      setAlternativas([...alternativas, novaAlternativa]); // Adiciona à lista
      // Atualiza a matriz de performance com a nova alternativa
      setMatrizPerformance({
        ...matrizPerformance,
        [novaAlternativa]: criterios.map(() => 0) // Inicializa com zeros
      });
      setNovaAlternativa(""); // Limpa o campo de input
    }
  };

  // Função para adicionar um novo critério
  const adicionarCriterio = () => {
    if (novoCriterio.trim()) { // Verifica se não está vazio
      setCriterios([...criterios, novoCriterio]); // Adiciona à lista
      // Configura otimização padrão para o novo critério
      setOtimizacao({ ...otimizacao, [novoCriterio]: "Maximizar" });
      // Inicializa o peso do novo critério como vazio
      setPesos({ ...pesos, [novoCriterio]: "" });
      
      // Atualiza a matriz de performance para incluir o novo critério
      const novaMatriz = {};
      Object.keys(matrizPerformance).forEach(alt => {
        novaMatriz[alt] = [...matrizPerformance[alt], 0]; // Adiciona zero para o novo critério
      });
      setMatrizPerformance(novaMatriz);
      
      setNovoCriterio(""); // Limpa o campo de input
    }
  };

  // Função para remover uma alternativa
  const removerAlternativa = (alt) => {
    setAlternativas(alternativas.filter(a => a !== alt)); // Filtra a alternativa removida
    const novaMatriz = { ...matrizPerformance };
    delete novaMatriz[alt]; // Remove a alternativa da matriz
    setMatrizPerformance(novaMatriz);
  };

  // Função para remover um critério
  const removerCriterio = (crit) => {
    const index = criterios.indexOf(crit);
    setCriterios(criterios.filter(c => c !== crit)); // Filtra o critério removido
    
    // Atualiza a matriz de performance removendo os valores do critério
    const novaMatriz = {};
    Object.keys(matrizPerformance).forEach(alt => {
      novaMatriz[alt] = matrizPerformance[alt].filter((_, i) => i !== index);
    });
    setMatrizPerformance(novaMatriz);
    
    // Remove as configurações de otimização e peso do critério
    const novasOtimizacoes = { ...otimizacao };
    delete novasOtimizacoes[crit];
    setOtimizacao(novasOtimizacoes);
    
    const novosPesos = { ...pesos };
    delete novosPesos[crit];
    setPesos(novosPesos);
  };

  // Função para atualizar um valor na matriz de performance
  const handleMatrizChange = (alt, critIndex, valor) => {
    setMatrizPerformance({
      ...matrizPerformance,
      [alt]: matrizPerformance[alt].map((v, i) => 
        i === critIndex ? parseFloat(valor) || 0 : v // Converte para número ou mantém zero
      )
    });
  };

  // Função para alterar a configuração de maximizar/minimizar de um critério
  const handleOtimizacaoChange = (crit, valor) => {
    setOtimizacao({ ...otimizacao, [crit]: valor });
  };

  // Função para alterar o peso de um critério
  const handlePesoChange = (crit, valor) => {
    setPesos({ ...pesos, [crit]: valor });
  };

  const handleFlexibilidadeChange = (valor) => {
    if (valor >= 0 && valor <= 1) {
      setFlexibilidade(valor); // Atualiza o estado do parâmetro de flexibilidade
    } else {
      // Lidar com o caso de valor fora do intervalo
      alert("O valor deve estar entre 0 e 1.");
    }
  };

  // Renderização do componente
  return (
    <div className="container-principal">
      {/* Cabeçalho da página */}
      <h1 className="titulo-pagina">Método Multicritério WFRIM</h1>
      <p className="subtitulo-pagina">Interface de simulação - Dados mockados</p>

      {/* Seção de entrada de dados */}
      <div className="secao-entrada">
        <div className="container-titulo-entrada">
          <h2 className="titulo-secao-entrada">
            <MdOutlineDataThresholding size={24} />
            <span>Dados de Entrada</span>
          </h2>
        </div>

        {/* Seção de alternativas */}
        <div className="container-alternativas">
          <label className="titulos-secoes">Alternativas</label>
          <div className="container-tags">
            {/* Lista as alternativas como tags */}
            {alternativas.map((alt, index) => (
              <div key={index} className="tag">
                <span className="texto-tag">{alt}</span>
                {/* Botão para remover alternativa */}
                <button onClick={() => removerAlternativa(alt)} className="icone-remover">
                  <MdClose size={14} />
                </button>
              </div>
            ))}
          </div>
          {/* Input para adicionar nova alternativa */}
          <div className="container-input">
            <input
              type="text"
              className="input"
              placeholder="Adicionar alternativa"
              value={novaAlternativa}
              onChange={(e) => setNovaAlternativa(e.target.value)}
            />
            <button onClick={adicionarAlternativa} className="botao-adicionar">
              <MdAdd size={14} />
            </button>
          </div>
        </div>

        {/* Seção de critérios (similar à de alternativas) */}
        <div className="container-criterios">
          <label className="titulos-secoes">Critérios</label>
          <div className="container-tags">
            {criterios.map((crit, index) => (
              <div key={index} className="tag-criterios">
                <span className="texto-tag">{crit}</span>
                <button onClick={() => removerCriterio(crit)} className="icone-remover">
                  <MdClose size={14} />
                </button>
              </div>
            ))}
          </div>
          <div className="container-input">
            <input
              type="text"
              className="input"
              placeholder="Adicionar critério"
              value={novoCriterio}
              onChange={(e) => setNovoCriterio(e.target.value)}
            />
            <button onClick={adicionarCriterio} className="botao-adicionar">
              <MdAdd size={13} />
            </button>
          </div>
        </div>

        {/* Matriz de performance (tabela de valores) */}
        <div className="container-matriz-performance">
          <label className="titulos-secoes">Matriz de Performance</label>
          <div className="scroll-matriz">
            <div className="matriz">
              {/* Cabeçalho da matriz */}
              <div className="linha">
                <span className="celula cabeçalho-linha cabeçalho-vazio"></span>
                {criterios.map((crit, index) => (
                  <span key={index} className="celula cabeçalho-coluna">
                    {crit}
                  </span>
                ))}
              </div>

              {/* Linhas da matriz para cada alternativa */}
              {alternativas.map((alt, altIndex) => (
                <div key={altIndex} className="linha">
                  <span className="celula cabeçalho-linha">{alt}</span>
                  {/* Inputs para os valores de cada critério */}
                  {criterios.map((crit, critIndex) => (
                    <div key={critIndex} className="input-container">
                      <input
                        type="number"
                        className="input-matriz"
                        value={matrizPerformance[alt][critIndex] || 0}
                        onChange={(e) => handleMatrizChange(alt, critIndex, e.target.value)}
                      />
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Configuração de maximizar/minimizar para cada critério */}
        <div className="container-otimizacao">
          <label className="titulos-secoes">Maximizar ou Minimizar</label>
          <div className="container-criterio">
            {criterios.map((crit, index) => (
              <div key={index} className="linha-criterio">
                <span className="rotulo-criterio">{crit}</span>
                <select
                  className="seletor"
                  value={otimizacao[crit]}
                  onChange={(e) => handleOtimizacaoChange(crit, e.target.value)}
                >
                  <option value="Maximizar">Maximizar</option>
                  <option value="Minimizar">Minimizar</option>
                </select>
              </div>
            ))}
          </div>
        </div>

        {/* Configuração de pesos para cada critério */}
        <div className="container-pesos">
          <label className="titulos-secoes">Pesos</label>
          <div className="container-criterio">
            {criterios.map((crit, index) => (
              <div key={index} className="linha-criterio">
                <span className="rotulo-criterio">{crit}</span>
                <input
                  type="number"
                  className="input-peso"
                  value={pesos[crit] || ""}
                  onChange={(e) => handlePesoChange(crit, e.target.value)}
                  placeholder="0-100"
                  min="0"
                />
              </div>
            ))}
          </div>
        </div>
        
        {/* Configuração do parâmetro de Flexibilidade */}
        <div className="container-pesos">
          <label className="titulos-secoes">Parâmetro de flexibilidade</label>
          <div className="container-criterio">
            <div className="linha-criterio">
            <span className="rotulo-criterio">Flexibilidade</span>
            <input
              type="number"
              className="input-peso"
              max="1"
              min="0"
              placeholder="0-1"
              step="0.01"
              onChange={(e) => handleFlexibilidadeChange(e.target.value)}
            />
            </div>
          </div>
        </div>

        {/* Botão para calcular resultados (simulação) */}
        <button className="botao-calcular" onClick={() => alert("Simulação: Os dados serão processados visualmente")}>
          Calcular Resultados
        </button>
      </div>

      {/* Seção de resultados (dados mockados) */}
      <div className="secao-resultados">
        <div className="container-titulo-entrada">
          <h2 className="titulo-secao-entrada">
            <MdAnalytics size={24} />
            <span>Resultados</span>
          </h2>
        </div>

        {/* Ranking final */}
        <h3 className="rotulo-secao-resultado">
          Ranking Final
        </h3>
        <div className="container-conteudo-resultado">
          <div className="lista-ranking">
            {resultadosMockados.ranking.map((item, index) => (
              <div key={index} className="item-ranking">
                <span className="nome-alternativa">{item.nome}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Gráfico de scores por alternativa */}
        <h3 className="rotulo-secao-resultado">
          Scores por Alternativa
        </h3>
        <div className="container-conteudo-resultado">
          {resultadosMockados.ranking.map((item, index) => (
            <div key={index} className="container-barra">
              <div className="label-barra">
                <span>{item.nome}</span>
                <span>{item.score.toFixed(2)}</span>
              </div>
              <div className="barra-progresso">
                <div 
                  className="barra-progresso-preenchida" 
                  style={{ width: `${item.score * 100}%` }} 
                />
              </div>
            </div>
          ))}
        </div>

        {/* Gráfico de pesos normalizados */}
        <h3 className="rotulo-secao-resultado">
          Pesos Normalizados
        </h3>
        <div className="container-conteudo-resultado">
          {resultadosMockados.pesosNormalizados.map((item, index) => (
            <div key={index} className="container-barra">
              <div className="label-barra">
                <span>{item.nome}</span>
                <span>{(item.valor)}</span>
              </div>
              <div className="barra-progresso">
                <div 
                  className="barra-progresso-preenchida" 
                  style={{ width: `${item.valor * 100}%` }} 
                />
              </div>
            </div>
          ))}
        </div>

        {/* Botão para exportar resultados (simulação) */}
        <button className="botao-exportar" onClick={() => alert("Simulação: Exportar dados")}>
          Exportar Resultados
        </button>
      </div>
    </div>
  );
}
