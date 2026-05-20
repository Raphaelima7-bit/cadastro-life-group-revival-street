
const form = document.getElementById("formCadastro");

let pessoas = JSON.parse(localStorage.getItem("pessoas")) || [];

/* =========================
   ELEMENTOS
========================= */
const telefonePessoal = document.getElementById("telefonePessoal");
const telefoneEmergencia = document.getElementById("telefoneEmergencia");
const cepInput = document.getElementById("cep");
const nascimentoInput = document.getElementById("nascimento");

/* =========================
   MÁSCARAS
========================= */

telefonePessoal.addEventListener("input", function (e) {
    let valor = e.target.value.replace(/\D/g, "");
    valor = valor.replace(/^(\d{2})(\d)/g, "($1) $2");
    valor = valor.replace(/(\d{5})(\d)/, "$1-$2");
    e.target.value = valor;
});

telefoneEmergencia.addEventListener("input", function (e) {
    let valor = e.target.value.replace(/\D/g, "");
    valor = valor.replace(/^(\d{2})(\d)/g, "($1) $2");
    valor = valor.replace(/(\d{5})(\d)/, "$1-$2");
    e.target.value = valor;
});

cepInput.addEventListener("input", function (e) {
    let valor = e.target.value.replace(/\D/g, "");
    valor = valor.replace(/^(\d{5})(\d)/, "$1-$2");
    e.target.value = valor;
});

nascimentoInput.addEventListener("input", function (e) {

    let valor = e.target.value.replace(/\D/g, "");

    if (valor.length > 2) {
        valor = valor.replace(/^(\d{2})(\d)/, "$1/$2");
    }

    if (valor.length > 5) {
        valor = valor.replace(/^(\d{2})\/(\d{2})(\d)/, "$1/$2/$3");
    }

    e.target.value = valor;
});

/* =========================
   VALIDAÇÃO DATA
========================= */
nascimentoInput.addEventListener("blur", function () {

    const regex = /^\d{2}\/\d{2}\/\d{4}$/;

    if (!regex.test(this.value)) {
        alert("Digite a data no formato dd/mm/aaaa");
        this.value = "";
    }
});

/* =========================
   SUBMIT
========================= */
form.addEventListener("submit", function (event) {

    event.preventDefault();

    const pessoa = {
        nome: document.getElementById("nome").value,
        nascimento: nascimentoInput.value.split("-").reverse().join("-"),
        endereco: document.getElementById("endereco").value,
        cep: cepInput.value,
        email: document.getElementById("email").value,
        telefonePessoal: telefonePessoal.value,
        contatoEmergencia: document.getElementById("contatoEmergencia").value,
        telefoneEmergencia: telefoneEmergencia.value,

        acompanhamentoInicial: document.getElementById("acompanhamentoInicial").value,
        novaCriatura: document.getElementById("novaCriatura").value,
        dna1: document.getElementById("dna1").value,
        dna2: document.getElementById("dna2").value,
        expresso1: document.getElementById("expresso1").value,
        expresso2: document.getElementById("expresso2").value,

        pizzaPastor: document.getElementById("pizzaPastor").value,
        voluntario: document.getElementById("voluntario").value,
        batizado: document.getElementById("batizado").value,
        encontroDeus: document.getElementById("encontroDeus").value,
        volts: document.getElementById("volts").value
    };

    /* =========================
       BLOQUEIO EMAIL DUPLICADO
    ========================= */
    const emailJaExiste = pessoas.some(p =>
        p.email.toLowerCase() === pessoa.email.toLowerCase()
    );

    if (emailJaExiste) {
        alert("Este e-mail já foi cadastrado.");
        return;
    }

    /* =========================
       SALVAR LOCAL
    ========================= */
    pessoas.push(pessoa);
    localStorage.setItem("pessoas", JSON.stringify(pessoas));

    /* =========================
       ENVIAR PARA PLANILHA (EXCEL)
    ========================= */
fetch("https://script.google.com/macros/s/AKfycbxEIhkZwXWdKwytAFePVujDZ65JxT7tn4a_AFFMyhwURTVbIlO2xT-fX0oRZboK2SkD/exec", {
    method: "POST",
    mode: "no-cors",
    headers: {
        "Content-Type": "text/plain;charset=utf-8"
    },
    body: JSON.stringify(pessoa)
})
.then(() => {

    console.log("Enviado para planilha!");

})
.catch(err => {

    console.log("Erro:", err);

});

    /* =========================
       EMAIL
    ========================= */
    emailjs.send(
        "service_eksn26d",
        "template_3rc9fsk",
        pessoa
    )
    .then(function () {
        form.reset();
        alert("Cadastro realizado com sucesso!");
    })
    .catch(function (error) {
        console.log("ERRO EMAIL:", error);
        alert("Erro ao enviar e-mail");
    });

});