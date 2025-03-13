let dadosCSV = [];

document.getElementById("abrir").addEventListener("change", (event) => {
    const file = event.target.files[0];
    if (file) {
        const fileType = file.type.toLowerCase();
        const fileName = file.name.toLowerCase();

        // Verificando tipo e extensão do arquivo
        if ((fileType === "text/csv" || fileName.endsWith(".csv"))) {
            const reader = new FileReader();
            reader.onload = () => {
                const texto = reader.result;
                dadosCSV = parseCSV(texto);
                exibirTabela(dadosCSV);
            };
            reader.readAsText(file);
        } else {
            alert("Por favor, selecione um arquivo CSV válido.");
        }
    }
});

// Função para fazer o parse do CSV para um array de objetos
function parseCSV(texto) {
    const linhas = texto.split("\n").filter(linha => linha.trim() !== "");
    const cabecalho = linhas[0].split(",").map(col => col.trim()); // Garantir que os cabeçalhos não tenham espaços extras
    const dados = linhas.slice(1).map(linha => {
        const valores = linha.split(",").map(val => val.trim()); // Remover espaços dos valores
        let objeto = {};
        cabecalho.forEach((coluna, index) => {
            objeto[coluna] = valores[index] || ""; // Valor vazio se não houver correspondente
        });
        return objeto;
    });
    return dados;
}

// Função para exibir os dados na tabela
function exibirTabela(dados) {
    const tabela = document.getElementById("tabela");
    const cabecalho = tabela.querySelector("thead tr");
    const corpo = tabela.querySelector("tbody");

    // Limpar tabela
    cabecalho.innerHTML = "";
    corpo.innerHTML = "";

    if (dados.length > 0) {
        const colunas = Object.keys(dados[0]);
        // Criar cabeçalho da tabela
        colunas.forEach(coluna => {
            const th = document.createElement("th");
            th.textContent = coluna;
            cabecalho.appendChild(th);
        });

        // Criar as linhas da tabela
        dados.forEach(linha => {
            const tr = document.createElement("tr");
            colunas.forEach(coluna => {
                const td = document.createElement("td");
                td.textContent = linha[coluna];
                tr.appendChild(td);
            });
            corpo.appendChild(tr);
        });
    } else {
        corpo.innerHTML = "<tr><td colspan='100%' style='text-align:center;'>Nenhum dado encontrado.</td></tr>";
    }
}

// Função de filtragem
function filtrarCSV() {
    const colunaIndex = parseInt(document.getElementById("coluna").value, 10);
    const filtro = document.getElementById("filtro").value.toLowerCase();

    if (isNaN(colunaIndex) || colunaIndex < 0) {
        alert("Por favor, selecione uma coluna válida.");
        return;
    }

    // Filtrando os dados com base na coluna e no valor
    const dadosFiltrados = dadosCSV.filter(linha => {
        const valores = Object.values(linha);
        return valores[colunaIndex]?.toLowerCase().includes(filtro);
    });

    exibirTabela(dadosFiltrados);
}
