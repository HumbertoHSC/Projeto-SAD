// Importação de bibliotecas e componentes necessários
import React, { useState, useEffect } from "react";
import {
  MdClose,
  MdAdd,
  MdAnalytics,
  MdOutlineDataThresholding,
} from "react-icons/md"; // Importa ícones da biblioteca Material Design
import "./styles.css";
import dadosJson from "./resultados.json"; // Importando o arquivo JSON

// Componente principal da aplicação
export default function App() {
  const [alternativas, setAlternativas] = useState([
    "Alternativa 1",
    "Alternativa 2",
  ]);
  const [novaAlternativa, setNovaAlternativa] = useState("");

  const [criterios, setCriterios] = useState(["Critério 1", "Critério 2"]);
  const [novoCriterio, setNovoCriterio] = useState("");

  const [matrizPerformance, setMatrizPerformance] = useState(
    alternativas.reduce((acc, alt) => {
      acc[alt] = criterios.map(() => 0);
      return acc;
    }, {})
  );

  const [otimizacao, setOtimizacao] = useState(
    criterios.reduce((acc, crit) => {
      acc[crit] = "Maximizar";
      return acc;
    }, {})
  );

  const [pesos, setPesos] = useState(
    criterios.reduce((acc, crit) => {
      acc[crit] = "";
      return acc;
    }, {})
  );

  const [flexibilidade, setFlexibilidade] = useState(0.5);

  const [dados, setDados] = useState(null);
  useEffect(() => {
    setDados(dadosJson.results);
  }, []);

  const gerarJsonWFRIM = () => {
    const criteriosKeys = criterios.map((crit, idx) => "C" + (idx + 1));
    const alternativasKeys = alternativas.map((alt, idx) => "A" + (idx + 1));

    const performance_matrix = alternativasKeys.map((altKey, altIdx) => {
      const values = {};
      criteriosKeys.forEach((critKey, critIdx) => {
        values[critKey] = [
          parseFloat(matrizPerformance[alternativas[altIdx]][critIdx]) || 0,
          parseFloat(matrizPerformance[alternativas[altIdx]][critIdx]) || 0,
          parseFloat(matrizPerformance[alternativas[altIdx]][critIdx]) || 0,
        ];
      });
      return {
        name: altKey,
        values: values,
      };
    });

    const weights = {};
    criteriosKeys.forEach((critKey, idx) => {
      weights[critKey] = [
        parseFloat(pesos[criterios[idx]]) || 0,
        parseFloat(pesos[criterios[idx]]) || 0,
        parseFloat(pesos[criterios[idx]]) || 0,
      ];
    });

    const preferences = {};
    criteriosKeys.forEach((critKey, idx) => {
      preferences[critKey] =
        otimizacao[criterios[idx]] === "Maximizar" ? 1 : -1;
    });

    const jsonFinal = {
      method: "W-FRIM",
      parameters: {
        criteria: criteriosKeys,
        performance_matrix: performance_matrix,
        range: {},
        reference_ideal: {},
        preferences: preferences,
        weights: weights,
        flexibility: parseFloat(flexibilidade),
      },
    };

    console.log("JSON W-FRIM gerado:", JSON.stringify(jsonFinal, null, 2));
    return jsonFinal;
  };

  const adicionarAlternativa = () => {
    if (novaAlternativa.trim()) {
      setAlternativas([...alternativas, novaAlternativa]);
      setMatrizPerformance({
        ...matrizPerformance,
        [novaAlternativa]: criterios.map(() => 0),
      });
      setNovaAlternativa("");
    }
  };

  const adicionarCriterio = () => {
    if (novoCriterio.trim()) {
      setCriterios([...criterios, novoCriterio]);
      setOtimizacao({ ...otimizacao, [novoCriterio]: "Maximizar" });
      setPesos({ ...pesos, [novoCriterio]: "" });

      const novaMatriz = {};
      Object.keys(matrizPerformance).forEach((alt) => {
        novaMatriz[alt] = [...matrizPerformance[alt], 0];
      });
      setMatrizPerformance(novaMatriz);

      setNovoCriterio("");
    }
  };

  const removerAlternativa = (alt) => {
    setAlternativas(alternativas.filter((a) => a !== alt));
    const novaMatriz = { ...matrizPerformance };
    delete novaMatriz[alt];
    setMatrizPerformance(novaMatriz);
  };

  const removerCriterio = (crit) => {
    const index = criterios.indexOf(crit);
    setCriterios(criterios.filter((c) => c !== crit));

    const novaMatriz = {};
    Object.keys(matrizPerformance).forEach((alt) => {
      novaMatriz[alt] = matrizPerformance[alt].filter((_, i) => i !== index);
    });
    setMatrizPerformance(novaMatriz);

    const novasOtimizacoes = { ...otimizacao };
    delete novasOtimizacoes[crit];
    setOtimizacao(novasOtimizacoes);

    const novosPesos = { ...pesos };
    delete novosPesos[crit];
    setPesos(novosPesos);
  };

  const handleMatrizChange = (alt, critIndex, valor) => {
    setMatrizPerformance({
      ...matrizPerformance,
      [alt]: matrizPerformance[alt].map((v, i) =>
        i === critIndex ? parseFloat(valor) || 0 : v
      ),
    });
  };

  const handleOtimizacaoChange = (crit, valor) => {
    setOtimizacao({ ...otimizacao, [crit]: valor });
  };

  const handlePesoChange = (crit, valor) => {
    setPesos({ ...pesos, [crit]: valor });
  };

  const handleFlexibilidadeChange = (valor) => {
    if (valor >= 0 && valor <= 1) {
      setFlexibilidade(valor);
    } else {
      alert("O valor deve estar entre 0 e 1.");
    }
  };

  return (
    <div className="container-principal">
      <h1 className="titulo-pagina">Método Multicritério WFRIM</h1>
      <p className="subtitulo-pagina">
        Interface de simulação - Dados mockados
      </p>

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
                <button
                  onClick={() => removerAlternativa(alt)}
                  className="icone-remover"
                >
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
        <button
          className="botao-calcular"
          onClick={() =>
            alert("Simulação: Os dados serão processados visualmente")
          }
        >
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

        {/* Ranking Final */}
        <h3 className="rotulo-secao-resultado">Ranking Final</h3>
        <div className="container-conteudo-resultado">
          <div className="lista-ranking">
            {dados &&
              dados.ranking.map((item, index) => (
                <div key={index} className="item-ranking">
                  <span className="nome-alternativa">{item}</span>
                </div>
              ))}
          </div>
        </div>

        {/* Gráfico de Scores por Alternativa */}
        <h3 className="rotulo-secao-resultado">Scores por Alternativa</h3>
        <div className="container-conteudo-resultado">
          {dados &&
            dados.ranking.map((item, index) => (
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

        {/* Gráfico de Pesos Normalizados */}
        <h3 className="rotulo-secao-resultado">Pesos Normalizados</h3>
        <div className="container-conteudo-resultado">
          {dados &&
            dados.ranking.map((item, index) => {
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

      {/* Botão para exportar resultados (simulação) */}
      <button
        className="botao-exportar"
        onClick={() => alert("Simulação: Exportar dados")}
      >
        Exportar Resultados
      </button>
    </div>
  );
}
