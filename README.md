# Dashboard de Vendas — JavaScript

Painel analítico **interativo** feito com JavaScript puro e Chart.js. Ele lê uma base de
pedidos, calcula os indicadores e desenha os gráficos no navegador — com um filtro de
categoria que atualiza tudo em tempo real. É o meu lado front-end / visualização de dados.

🔗 **[Ver o dashboard ao vivo](https://anapaula-galdino.github.io/dashboard-vendas-js/)**

## O que ele mostra

- **KPIs:** faturamento, número de pedidos, ticket médio e categorias.
- **Faturamento por mês** (linha) — tendência ao longo de 2025.
- **Faturamento por categoria** (barras) — onde está a receita.
- **Formas de pagamento** (rosca) — cartão lidera com ~54%.
- **Top 8 produtos** (barras horizontais) — os campeões de receita.

Tudo recalcula quando você troca a categoria no seletor — sem recarregar a página.

## Números da base

650 pedidos de 2025, somando **R$ 1,18 milhão**, com ticket médio de **R$ 1.820**.
Eletrônicos respondem por **58%** do faturamento.

## Como funciona (técnico)

- **JavaScript puro** (sem framework): manipulação de dados com `reduce`, `map`, `Set` e
  `Object.entries`, e formatação de moeda com `Intl.NumberFormat`.
- **Chart.js** para os gráficos (linha, barras, rosca).
- **Interatividade:** o seletor refiltra os dados e redesenha os gráficos.
- **Sem build:** é só abrir o `index.html` no navegador (ou publicar no GitHub Pages).

## Estrutura

```
dashboard-vendas-js/
├── index.html      # estrutura + estilos
├── app.js          # lógica: agrega os dados e desenha os gráficos
├── data.js         # base de pedidos (dados de demonstração)
└── README.md
```

## Rodar localmente

```bash
# basta abrir o index.html no navegador, ou servir a pasta:
python3 -m http.server   # depois acesse http://localhost:8000
```

---

Feito por **Ana Paula Galdino** · [GitHub](https://github.com/AnaPaula-Galdino) · [LinkedIn](https://linkedin.com/in/galdinoana/)
