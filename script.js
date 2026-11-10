function abrirLogin() {
    document.getElementById('loginModal').style.display = 'flex';
}

function fecharLogin() {
    document.getElementById('loginModal').style.display = 'none';
}

function realizarLogin(event) {
    event.preventDefault();
    const usuario = document.getElementById('loginUser').value.trim();
    const senha = document.getElementById('loginPass').value.trim();

    // Verificando se é um login de hotel/empresa cadastrado por vocês (ex: começa com "adm:")
    if (usuario.startsWith("adm:")) {
        alert(`Bem-vindo ao painel corporativo do hotel: ${usuario.replace("adm:", "")}! Redirecionando para a gestão de quartos e ofertas...`);
        // Aqui você direcionaria para a página de gerenciamento da empresa
        window.location.href = "#painel-empresa";
    } else {
        // Login de cliente comum
        alert(`Login efetuado com sucesso para o cliente: ${usuario}! Redirecionando para a busca de reservas...`);
        window.location.href = "#painel-cliente";
    }
    
    fecharLogin();
}

function pesquisarHoteis() {
    const destino = document.getElementById('destino').value;
    if(destino === "") {
        alert("Por favor, informe a cidade ou hotel desejado.");
    } else {
        alert(`Buscando as melhores ofertas em ${destino}...`);
    }
}
