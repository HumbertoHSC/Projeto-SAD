// Importação de bibliotecas necessárias
import React, { useState, useEffect } from "react";
import {
  MdClose,
  MdAdd,
  MdAnalytics,
  MdOutlineDataThresholding,
} from "react-icons/md"; // Ícones da Material Design
import "./styles.css"; // Estilos CSS
import dadosJson from "./resultados.json"; // Dados mockados

// Componente principal da aplicação
export default function App() {
  // Estados para gerenciamento das alternativas
  const [alternativas, setAlternativas] = useState([
    "Alternativa 1",
    "Alternativa 2",
  ]);
  const [novaAlternativa, setNovaAlternativa] = useState("");

  // Estados para gerenciamento dos critérios
  const [criterios, setCriterios] = useState(["Critério 1", "Critério 2"]);
  const [novoCriterio, setNovoCriterio] = useState("");

  // Estado para armazenar a matriz de performance (valores numéricos)
  const [matrizPerformance, setMatrizPerformance] = useState(
    alternativas.reduce((acc, alt) => {
      acc[alt] = criterios.map(() => 0); // Inicializa com zeros
      return acc;
    }, {})
  );

  // Estado para armazenar preferências de otimização (max/min) para cada critério
  const [otimizacao, setOtimizacao] = useState(
    criterios.reduce((acc, crit) => {
      acc[crit] = "Maximizar"; // Valor padrão
      return acc;
    }, {})
  );

  // Estado para armazenar os pesos dos critérios
  const [pesos, setPesos] = useState(
    criterios.reduce((acc, crit) => {
      acc[crit] = ""; // Inicializa vazio
      return acc;
    }, {})
  );

  // Estado para o parâmetro de flexibilidade
  const [flexibilidade, setFlexibilidade] = useState(0.5);

  // Estado para armazenar dados dos resultados (mockados)
  const [dados, setDados] = useState(null);
  useEffect(() => {
    // Carrega dados mockados ao montar o componente
    setDados(dadosJson.results);
  }, []);

  // Função para gerar o JSON no formato exigido pelo método W-FRIM
  const gerarJsonWFRIM = () => {
    // Mapeia critérios e alternativas para chaves (C1, C2... A1, A2...)
    const criteriosKeys = criterios.map((crit, idx) => "C" + (idx + 1));
    const alternativasKeys = alternativas.map((alt, idx) => "A" + (idx + 1));

    // Construção da matriz de performance no formato exigido
    const performance_matrix = alternativasKeys.map((altKey, altIdx) => {
      const values = {};
      criteriosKeys.forEach((critKey, critIdx) => {
        values[critKey] = [
          parseFloat(matrizPerformance[alternativas[altIdx]][critIdx]) || 0,
          parseFloat(matrizPerformance[alternativas[altIdx]][critIdx]) || 0,
          parseFloat(matrizPerformance[alternativas[altIdx]][critIdx]) || 0,
        ];
      });
      return { name: altKey, values };
    });

    // Construção dos pesos com valores triplos (exigência do método)
    const weights = {};
    criteriosKeys.forEach((critKey, idx) => {
      weights[critKey] = [
        parseFloat(pesos[criterios[idx]]) || 0,
        parseFloat(pesos[criterios[idx]]) || 0,
        parseFloat(pesos[criterios[idx]]) || 0,
      ];
    });

    // Mapeamento das preferências (1 para max, -1 para min)
    const preferences = {};
    criteriosKeys.forEach((critKey, idx) => {
      preferences[critKey] =
        otimizacao[criterios[idx]] === "Maximizar" ? 1 : -1;
    });

    // Estrutura final do JSON
    const jsonFinal = {
      method: "W-FRIM",
      parameters: {
        criteria: criteriosKeys,
        performance_matrix,
        range: {},
        reference_ideal: {},
        preferences,
        weights,
        flexibility: parseFloat(flexibilidade),
      },
    };

    console.log("JSON gerado:", JSON.stringify(jsonFinal, null, 2));
    return jsonFinal;
  };

  // Funções para manipulação da interface
  // Adiciona nova alternativa à lista
  const adicionarAlternativa = () => {
    if (novaAlternativa.trim()) {
      setAlternativas([...alternativas, novaAlternativa]);
      // Atualiza matriz com nova linha de zeros
      setMatrizPerformance({
        ...matrizPerformance,
        [novaAlternativa]: criterios.map(() => 0),
      });
      setNovaAlternativa("");
    }
  };

  // Adiciona novo critério à lista
  const adicionarCriterio = () => {
    if (novoCriterio.trim()) {
      setCriterios([...criterios, novoCriterio]);
      // Atualiza estados relacionados com valores padrão
      setOtimizacao({ ...otimizacao, [novoCriterio]: "Maximizar" });
      setPesos({ ...pesos, [novoCriterio]: "" });
      // Adiciona nova coluna na matriz
      const novaMatriz = {};
      Object.keys(matrizPerformance).forEach((alt) => {
        novaMatriz[alt] = [...matrizPerformance[alt], 0];
      });
      setMatrizPerformance(novaMatriz);
      setNovoCriterio("");
    }
  };

  // Remove alternativa da lista
  const removerAlternativa = (alt) => {
    setAlternativas(alternativas.filter((a) => a !== alt));
    // Remove linha correspondente da matriz
    const novaMatriz = { ...matrizPerformance };
    delete novaMatriz[alt];
    setMatrizPerformance(novaMatriz);
  };

  // Remove critério da lista
  const removerCriterio = (crit) => {
    const index = criterios.indexOf(crit);
    setCriterios(criterios.filter((c) => c !== crit));
    // Remove coluna correspondente da matriz
    const novaMatriz = {};
    Object.keys(matrizPerformance).forEach((alt) => {
      novaMatriz[alt] = matrizPerformance[alt].filter((_, i) => i !== index);
    });
    setMatrizPerformance(novaMatriz);
    // Atualiza estados relacionados
    const novasOtimizacoes = { ...otimizacao };
    delete novasOtimizacoes[crit];
    setOtimizacao(novasOtimizacoes);
    const novosPesos = { ...pesos };
    delete novosPesos[crit];
    setPesos(novosPesos);
  };

  // Manipuladores de eventos
  const handleMatrizChange = (alt, critIndex, valor) => {
    // Atualiza valor específico na matriz
    setMatrizPerformance({
      ...matrizPerformance,
      [alt]: matrizPerformance[alt].map((v, i) =>
        i === critIndex ? parseFloat(valor) || 0 : v
      ),
    });
  };

  const handleOtimizacaoChange = (crit, valor) => {
    // Atualiza preferência de otimização
    setOtimizacao({ ...otimizacao, [crit]: valor });
  };

  const handlePesoChange = (crit, valor) => {
    // Atualiza peso do critério
    setPesos({ ...pesos, [crit]: valor });
  };

  const handleFlexibilidadeChange = (valor) => {
    // Valida e atualiza flexibilidade
    if (valor >= 0 && valor <= 1) {
      setFlexibilidade(valor);
    } else {
      alert("Valor deve estar entre 0 e 1");
    }
  };

  // Renderização do componente
  return (
    <div className="container-principal">
      {/* Cabeçalho */}
      <h1 className="titulo-pagina">Método Multicritério WFRIM</h1>
      <p className="subtitulo-pagina">
        Interface de simulação - Dados mockados
      </p>

      {/* Seção de entrada de dados */}
      <div className="secao-entrada">
        <div className="container-titulo-entrada">
          <h2 className="titulo-secao-entrada">
            <MdOutlineDataThresholding size={24} />
            <span>Dados de Entrada</span>
          </h2>
        </div>

        {/* Subseção de Alternativas */}
        <div className="container-alternativas">
          <label className="titulos-secoes">Alternativas</label>
          <div className="container-tags">
            {alternativas.map((alt, index) => (
              <div key={index} className="tag">
                <span className="texto-tag">{alt}</span>
                <button
                  onClick={() => removerAlternativa(alt)}
                  className="icone-remover"
                >
                  <MdClose size={14} />
                </button>
              </div>
            ))}
          </div>
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

        {/* Subseção de Critérios */}
        <div className="container-criterios">
          <label className="titulos-secoes">Critérios</label>
          <div className="container-tags">
            {criterios.map((crit, index) => (
              <div key={index} className="tag-criterios">
                <span className="texto-tag">{crit}</span>
                <button
                  onClick={() => removerCriterio(crit)}
                  className="icone-remover"
                >
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

        {/* Matriz de Performance */}
        <div className="container-matriz-performance">
          <label className="titulos-secoes">Matriz de Performance</label>
          <div className="scroll-matriz">
            <div className="matriz">
              <div className="linha">
                <span className="celula cabeçalho-linha cabeçalho-vazio"></span>
                {criterios.map((crit, index) => (
                  <span key={index} className="celula cabeçalho-coluna">
                    {crit}
                  </span>
                ))}
              </div>
              {alternativas.map((alt, altIndex) => (
                <div key={altIndex} className="linha">
                  <span className="celula cabeçalho-linha">{alt}</span>
                  {criterios.map((crit, critIndex) => (
                    <div key={critIndex} className="input-container">
                      <input
                        type="number"
                        className="input-matriz"
                        max="1"
                        min="0"
                        step="0.01"
                        value={matrizPerformance[alt][critIndex] || 0}
                        onChange={(e) =>
                          handleMatrizChange(alt, critIndex, e.target.value)
                        }
                      />
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Configurações de Otimização */}
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

        {/* Configuração de Pesos */}
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
                  placeholder="0-1"
                  min="0"
                  step="0.01"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Configuração de Flexibilidade */}
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

        {/* Botão de cálculo */}
        <button
          className="botao-calcular"
          onClick={() => alert("Simulação: Processamento visual")}
        >
          Calcular Resultados
        </button>
      </div>

      {/* Seção de Resultados */}
      <div className="secao-resultados">
        <div className="container-titulo-entrada">
          <h2 className="titulo-secao-entrada">
            <MdAnalytics size={24} />
            <span>Resultados</span>
          </h2>
        </div>

        {/* Ranking Final */}
        <h3 className="rotulo-secao-resultado">Ranking Final</h3>
        <div className="container-conteudo-resultado">
          <div className="lista-ranking">
            {dados?.ranking.map((item, index) => (
              <div key={index} className="item-ranking">
                <span className="nome-alternativa">{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Gráfico de Scores */}
        <h3 className="rotulo-secao-resultado">Scores por Alternativa</h3>
        <div className="container-conteudo-resultado">
          {dados?.ranking.map((item, index) => (
            <div key={index} className="container-barra">
              <div className="label-barra">
                <span>{item}</span>
                <span>{dados.scores[item].toFixed(2)}</span>
              </div>
              <div className="barra-progresso">
                <div
                  className="barra-progresso-preenchida"
                  style={{ width: `${dados.scores[item] * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Pesos Normalizados */}
        <h3 className="rotulo-secao-resultado">Pesos Normalizados</h3>
        <div className="container-conteudo-resultado">
          {dados?.ranking.map((item, index) => {
            const pesos = dados.normalized_weights[item];
            return (
              <div key={index} className="container-barra">
                <h4>{item}</h4>
                {Object.keys(pesos).map((criterio, idx) => (
                  <div key={idx} className="label-barra">
                    <span>
                      {criterio}: {pesos[criterio].toFixed(2)}
                    </span>
                    <div className="barra-progresso">
                      <div
                        className="barra-progresso-preenchida"
                        style={{ width: `${pesos[criterio] * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      </div>

      {/* Botão de Exportação */}
      <button
        className="botao-exportar"
        onClick={() => alert("Simulação: Exportação")}
      >
        Exportar Resultados
      </button>
    </div>
  );
}
