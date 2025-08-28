document.addEventListener('DOMContentLoaded', () => {
  // Elementos da DOM
  const form = document.querySelector("form")
  const textTemplate = document.querySelector(".text-template")
  const registerItens = document.querySelectorAll("form > div.register")
  const btn_logar = document.querySelector("#btn_logar")
  const btn_criar = document.querySelector("#btn_criar")

  // Controle de estado
  const modo = () => form.getAttribute("modo")
  const setMode = (mode) => form.setAttribute("modo", mode)
  const textoTemplate = ["CADASTRO", "LOGIN"]

  let clickCount = 0
  let ultimoBotaoClicado = null

  // Atualiza a exibição da tela
  const atualizarTela = () => {
    textTemplate.textContent = modo() === "cadastro" ? "CADASTRO" : "LOGIN"

    registerItens.forEach(item => {
      item.style.display = modo() === "cadastro" ? "flex" : "none"
    })
  }

  // Validações forms
  const validarLogin = () => {
    if (!form.username.value.trim()) {
      alert("Username é obrigatório!")
      return false
    }

    if (!form.password.value.trim()) {
      alert("Senha é obrigatória!")
      return false
    }

    return true
  }

  const validarCadastro = () => {
    // Valida campos comuns (username e senha)
    if (!validarLogin()) return false

    // Validações específicas do cadastro
    if (!form.name.value.trim()) {
      alert("Nome completo é obrigatório!")
      return false
    }

    const emailValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.value)
    if (!emailValido) {
      alert("Insira um e-mail válido!")
      return false
    }

    if (form.password.value.length < 6) {
      alert("A senha deve ter pelo menos 6 caracteres!")
      return false
    }

    if (form.password.value !== form.co_password.value) {
      alert("As senhas não coincidem!")
      return false
    }

    if (!/^\d{10,11}$/.test(form.phone.value)) {
      alert("Telefone deve ter 10 ou 11 dígitos!")
      return false
    }

    return true
  }

  // Comunicação com o backend
  const enviarDados = async (rota) => {
    const dados = { // CREATE DADOS
      username: form.username.value,
      password: form.password.value
    }

    if (rota === "cadastro") { // ASSIGN DADOS
      Object.assign(dados, {
        name: form.name.value,
        email: form.email.value,
        phone: form.phone.value,
        co_password: form.co_password.value
      })
    }

    try {
      // Envio de DADOS
      const response = await fetch(`/${rota}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dados)
      })

      // Verifica se a resposta é válida
      const jsonResponse = await response.json()

      if (response.ok) {
        // Redireciona para a URL recebida no JSON
        window.location.href = `${window.location.origin}${jsonResponse.url}`
      } else {
        alert(jsonResponse.message || "Erro ao processar solicitação")
      }
    } catch (error) {
      console.error("Erro:", error)
      alert(error.message || "Erro ao processar solicitação")
    }
  }

  // Lógica dos botões
  const handleBotao = (botao) => {
    const modoAtual = modo()
    const ehMesmoBotao = ultimoBotaoClicado === botao

    if (!ehMesmoBotao || clickCount === 0) {
      // Primeiro clique ou clique em botão diferente
      clickCount = 1
      ultimoBotaoClicado = botao
      setMode(botao.id === "btn_logar" ? "login" : "cadastro")
      atualizarTela()
      return
    }

    // Segundo clique no mesmo botão - envia dados
    clickCount = 0

    if (modoAtual === "login") {
      if (validarLogin()) enviarDados("login")
    } else {
      if (validarCadastro()) enviarDados("cadastro")
    }
  }

  // Event Listeners
  btn_logar.addEventListener("click", () => handleBotao(btn_logar))
  btn_criar.addEventListener("click", () => handleBotao(btn_criar))
  form.addEventListener("submit", (e) => e.preventDefault())

  // Inicialização
  atualizarTela()
})