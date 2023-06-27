


/*
  --------------------------------------------------------------------------------------
  Função para obter a lista existente do servidor via requisição GET
  --------------------------------------------------------------------------------------
*/

const getList = async () => {
  let url = 'http://127.0.0.1:8000/clientes';
  fetch(url, {
    method: 'get',
  })
    .then((response) => response.json())
    .then((data) => {
      data.clientes.forEach(item => exibeCliente(item.nome, item.cpf, item.celular, item.email))
    })
    .catch((error) => {
      console.error('Error:', error);
    });
}

/*
  --------------------------------------------------------------------------------------
  Chamada da função para carregamento inicial dos dados
  --------------------------------------------------------------------------------------
*/
getList()

var _id = 0;
/*
  --------------------------------------------------------------------------------------
  Função para colocar um item na lista do servidor via requisição POST
  --------------------------------------------------------------------------------------
*/
const cadastraCliente = async (nome, cpf, celular, email) => {
  const formData = new FormData();
  formData.append('nome', nome);
  formData.append('cpf', cpf);
  formData.append('celular', celular)
  formData.append('email', email);

  let url = 'http://127.0.0.1:8000/cliente';
  const response = await fetch(url, {
    method: 'put',
    body: formData
  })
  const result = await response.json();
  const res_status = response.status;
  const message = response.statusText;
  //console.log(res_status, message);
  return { res_status, message };
  
}


/*
  --------------------------------------------------------------------------------------
  Função para criar um botão close para cada item da lista
  --------------------------------------------------------------------------------------
*/
const insertButton = (parent) => {
  let span = document.createElement("span");
  let txt = document.createTextNode("X"); /* \u00D7 */
  span.className = "bt-excluir";
  span.title="Exluir cliente!";
  span.appendChild(txt);
  parent.appendChild(span);
}


/*
  --------------------------------------------------------------------------------------
  Função para remover um item da lista de acordo com o click no botão close
  --------------------------------------------------------------------------------------
*/
const removeElement = () => {
  let close = document.getElementsByClassName("bt-excluir");
  let i;
  for (i = 0; i < close.length; i++) {
    close[i].onclick = function () {
      let div = this.parentElement.parentElement;
      const cpf = div.getElementsByTagName('td')[1].innerHTML
      console.log("cpf: " + cpf);
      if (confirm("Você tem certeza?")) {
        div.remove()
        deleteItem(cpf) //trocar para ID
        alert("Removido!")
      }
    }
  }
}

/*
  --------------------------------------------------------------------------------------
  Função para deletar um item da lista do servidor via requisição DELETE
  --------------------------------------------------------------------------------------
*/
const deleteItem = (item) => {
  console.log(item)
  let url = 'http://127.0.0.1:8000/cliente?cpf=' + item;
  console.log(url)
  fetch(url, {
    method: 'delete'
  })
    .then((response) => response.json())
    .catch((error) => {
      console.error('Error:', error);
    });
}

/*
  --------------------------------------------------------------------------------------
  Função para adicionar um novo item com nome, quantidade e valor 
  --------------------------------------------------------------------------------------
*/
const novoCliente = async () => {

  let nome = document.getElementById("nome").value;
  let cpf = document.getElementById("cpf").value;
  let celular = document.getElementById("celular").value;
  let email = document.getElementById("email").value;

  //retirar os carcteres especiais do cpf e do telefone
  cpf = cpf.replace(/[\.\-]/g, '');
  celular = celular.replace(/[\(\)\-\s]/g, '');

  console.log(cpf, celular);

  // Verifica que todos os dados foram digitados
  // Não é verificada a veracidade do cpf
  if (nome === '') {
    alert("O nome do cliente é obrigatório!");
  } else if (cpf === '') {
    alert("O cpf do cliente é obrigatório!");  
  } else if (validarCPF(cpf)) {
    alert('CPF inválido: ' + cpf);
  } else if (celular === ''){
    alert(" celular do cliente é obrigatório!")
  }else if (email === '') {
    alert("Um EMAIL VÁLIDO é obrigatório: " + email)
  } else {

    const { res_status, message }  = await cadastraCliente(nome, cpf, celular, email);
    if (res_status === 409) {
      console.log(res_status, message);
      alert(`Este cpf já foi cadastrado: STATUS: ${res_status} TEXT: ${message}`);
      document.getElementById("cpf").focus;
    }
    else {
      exibeCliente(nome, cpf, celular, email);
      alert("Cliente cadastrado com sucesso!");
    }
  }
}

/*
  --------------------------------------------------------------------------------------
  Função para inserir items na lista apresentada
  --------------------------------------------------------------------------------------
*/
const exibeCliente = (nome, cpf, celular, email) => {

  // Dados do cadastro de clientes
  var cpf_ = cpf.replace(/(\d{3})?(\d{3})?(\d{3})?(\d{2})/,"$1.$2.$3-$4");
  var celular_ = celular.replace(/(\d{2})?(\d{5})?(\d{4})/, "($1) $2-$3")
  var cliente = [nome, cpf_, celular_, email]
  
  // Selectiona a tabela de clientes cadastrados
  var table = document.getElementById('tbl-clientes');
  
  // Cria uma nova linha na tabela
  var row = table.insertRow();

  // Insere uma nova coluna para cada campo da tabela de cadastro
  for (var i = 0; i < cliente.length; i++) {
    var cel = row.insertCell(i);
    cel.textContent = cliente[i];
  }

  // Insere o botão de exclusão do cadastro
  insertButton(row.insertCell(-1))

  // Limpa os campos de formulário
  //document.getElementById("id").value = "";
  document.getElementById("nome").value = "";
  document.getElementById("cpf").value = "";
  document.getElementById("celular").value = "";
  document.getElementById("email").value = "";

  removeElement()
}

// Carrega o cadastro
function vaiCadastro(){
    document.getElementById("cadastro").style.display="flex";
    document.getElementById("lista").style.display="none";

    document.getElementById("span-cadastro").style.textDecoration = "underline";
    document.getElementById("span-lista").style.textDecoration ="none";

    const div = document.getElementsByClassName("container");
    div[0].style.width = "600px";
    //div[1].style.width = "900px";
  
    return false;
}

// Carrega a lista de clientes
function vaiLista(){
    document.getElementById("cadastro").style.display="none";
    document.getElementById("lista").style.display="flex";

    document.getElementById("span-cadastro").style.textDecoration = "none";
    document.getElementById("span-lista").style.textDecoration = "underline";

    const div = document.getElementsByClassName("container");
    //div[0].style.width = "600px";
    div[1].style.width = "900px";

    return false;
}

function validarCPF(mcpf){
  
  var cpf = mcpf.replace(/[^0-9]/g, '').toString();

  if (cpf.length == 11) {
    var v = [];

    //Calcula o primeiro dígito de verificação.
    v[0] = 1 * cpf[0] + 2 * cpf[1] + 3 * cpf[2];
    v[0] += 4 * cpf[3] + 5 * cpf[4] + 6 * cpf[5];
    v[0] += 7 * cpf[6] + 8 * cpf[7] + 9 * cpf[8];
    v[0] = v[0] % 11;
    v[0] = v[0] % 10;

    //Calcula o segundo dígito de verificação.
    v[1] = 1 * cpf[1] + 2 * cpf[2] + 3 * cpf[3];
    v[1] += 4 * cpf[4] + 5 * cpf[5] + 6 * cpf[6];
    v[1] += 7 * cpf[7] + 8 * cpf[8] + 9 * v[0];
    v[1] = v[1] % 11;
    v[1] = v[1] % 10;

    //Retorna Verdadeiro se os dígitos de verificação são os esperados.
    if ((v[0] != cpf[9]) || (v[1] != cpf[10])) {
      $('#cpf').val('');
      return true;
    }
    return false;
  }
};
