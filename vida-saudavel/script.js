
const CHAVE = "vidaMaisRegistros";
const CHAVE_AGUA = "vidaMaisAgua";

const hoje = () => {
  const agora = new Date();
  const local = new Date(
    agora.getTime() - agora.getTimezoneOffset() * 60000
  );
  return local.toISOString().slice(0, 10);
};

let registros = JSON.parse(
  localStorage.getItem(CHAVE) || "[]"
);

let agua = JSON.parse(
  localStorage.getItem(CHAVE_AGUA) || "{}"
);

document.getElementById("data").value = hoje();

function adicionarAgua() {
  const data = hoje();
  agua[data] = (agua[data] || 0) + 250;

  localStorage.setItem(CHAVE_AGUA, JSON.stringify(agua));
  atualizarPainel();
}

document.getElementById("formSaude")
  .addEventListener("submit", function(evento) {
    evento.preventDefault();

    const data = document.getElementById("data").value;
    const peso = document.getElementById("peso").value;
    const sono = document.getElementById("sono").value;
    const exercicio = document.getElementById("exercicio").value;
    const humor = document.getElementById("humor").value;
    const alimentacao = document.getElementById("alimentacao").value;

    if (data > hoje()) {
      alert("Não é possível registrar uma data futura.");
      return;
    }

    const registro = {
      data,
      peso: peso === "" ? null : Number(peso),
      sono: sono === "" ? null : Number(sono),
      exercicio: exercicio === "" ? null : Number(exercicio),
      humor,
      alimentacao
    };

    // Um registro por data: atualiza quando já existe.
    registros = registros.filter(item => item.data !== data);
    registros.push(registro);
    registros.sort((a, b) => b.data.localeCompare(a.data));

    localStorage.setItem(CHAVE, JSON.stringify(registros));

    alert("Registro salvo com sucesso!");
    this.reset();
    document.getElementById("data").value = hoje();

    atualizarPainel();
    mostrarHistorico();
  });

function atualizarPainel() {
  const registroHoje = registros.find(
    item => item.data === hoje()
  );

  const ultimoPeso = registros.find(
    item => item.peso !== null
  );

  document.getElementById("aguaTotal").textContent =
    (agua[hoje()] || 0) + " ml";

  document.getElementById("pesoAtual").textContent =
    ultimoPeso ? ultimoPeso.peso + " kg" : "-- kg";

  document.getElementById("sonoAtual").textContent =
    registroHoje?.sono != null
      ? registroHoje.sono + " h"
      : "-- h";

  document.getElementById("exercicioAtual").textContent =
    (registroHoje?.exercicio ?? 0) + " min";
}

function mostrarHistorico() {
  const lista = document.getElementById("listaHistorico");
  lista.replaceChildren();

  if (registros.length === 0) {
    lista.textContent = "Nenhum registro realizado ainda.";
    return;
  }

  registros.forEach(item => {
    const div = document.createElement("div");
    div.className = "registro";

    const titulo = document.createElement("h3");
    const [ano, mes, dia] = item.data.split("-");
    titulo.textContent = `${dia}/${mes}/${ano}`;
    div.appendChild(titulo);

    const dados = [
      ["Peso", item.peso == null ? "--" : item.peso + " kg"],
      ["Sono", item.sono == null ? "--" : item.sono + " h"],
      ["Exercícios", item.exercicio == null
        ? "--" : item.exercicio + " min"],
      ["Humor", item.humor],
      ["Alimentação", item.alimentacao || "Não informada"]
    ];

    dados.forEach(([nome, valor]) => {
      const p = document.createElement("p");
      p.textContent = `${nome}: ${valor}`;
      div.appendChild(p);
    });

    lista.appendChild(div);
  });
}

atualizarPainel();
mostrarHistorico();
