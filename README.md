# WFRIM - Sistema de Apoio à Decisão Multicritério

Este projeto implementa o **Weighted Fuzzy Reference Ideal Method (W-FRIM)**, uma abordagem multicritério baseada em lógica fuzzy para auxiliar na **avaliação e ranqueamento de alternativas** considerando pesos de critérios, referências ideais e estruturas de preferência.

## Como Funciona

Envia um único arquivo JSON contendo:

- **Critérios**
- **Alternativas** com valores fuzzy por critério
- **Faixas de valores esperados** por critério
- **Referências ideais fuzzy**
- **Estrutura de preferência (λ)** por critério
- **Pesos fuzzy** por critério

Recebe um único arquivo JSON do BackEnd contendo:

- Dados Normalizados dos valores fuzzy com base nas referências ideais;
- Valores normalizados usando os pesos dos critérios;
- Resultados dos índices relativos de cada alternativa;
- Ranqueamento das alternativas.
  
## Recursos Principais
- Interface visual para apresentação do método WFRIM
- Interface web interativa para facilitar o uso
- Integração com **Pyodide** para execução de código Python diretamente no navegador
- Código aberto e colaborativo, permitindo customizações conforme necessário

## Status do Projeto
Atualmente, este projeto se concentra apenas no **desenvolvimento da interface gráfica (front-end)**. A implementação do método WFRIM e suas funcionalidades analíticas ainda não foram incorporadas. No momento, o objetivo é fornecer uma plataforma visual funcional que possa ser integrada a um backend no futuro.

## Link para Demonstração:
- [Acesse aqui](https://codesandbox.io/p/sandbox/kg723m)
  
## Autores
- Humberto Campos - hhsc@cin.ufpe.br
- Izack Angelo - ias5@cin.ufpe.br
