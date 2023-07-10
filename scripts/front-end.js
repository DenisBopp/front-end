/******************************************************************************
  Função para adicionar um novo cliente
******************************************************************************/
const addClient = async () => {

  // Carrega os dados do formulário html nas variáveis do js
  let nome = document.getElementById("nome").value;
  let cpf = document.getElementById("cpf").value;
  let celular = document.getElementById("celular").value;
  let email = document.getElementById("email").value;

  //retirar os carcteres especiais do cpf e do telefone
  cpf = cpf.replace(/[\.\-]/g, '');
  celular = celular.replace(/[\(\)\-\s]/g, '');

  //console.log(cpf, celular);

  // Verifica que todos os dados foram digitados
  // Não é verificada a veracidade do cpf
  if (nome === '') {
    alert("O nome do cliente é obrigatório!");
  } else if (cpf === '') {
    alert("O cpf do cliente é obrigatório!");
  } else if (!validarCPF(cpf)) {
    alert('CPF inválido: ' + cpf);
  } else if (celular === '') {
    alert(" celular do cliente é obrigatório!")
  } else if (!validaTelefone(celular)) {
    alert("Número de telefone inválido!")
  } else if (email === '') {
    alert("Um EMAIL VÁLIDO é obrigatório: " + email)
  } else {

    // Envia os dados para o cadastramento e aguarda a resposta do servidor
    const { res_status, message } = await postClient(nome, cpf, celular, email);
    if (res_status === 409) { // CPF já cadastrado
      // Se houver erro
      console.log(res_status, message);
      alert(`Este cpf já foi cadastrado: STATUS: ${res_status} TEXT: ${message}`);
      document.getElementById("cpf").focus;
    }
    else {
      // Caso contrário envia o cliente para a lista de clientes
      showClients(nome, cpf, celular, email);
      alert("Cliente cadastrado com sucesso!");
    }
  }
}
/******************************************************************************
  Função para obter a lista existente do servidor via requisição GET
******************************************************************************/
const getList = async () => {
  let url = 'http://127.0.0.1:8000/clients';
  fetch(url, {
    method: 'get',
  })
    .then((response) => response.json())
    .then((data) => {
      data.clientes.forEach(item => showClients(item.nome, item.cpf, item.celular, item.email))
    })
    .catch((error) => {
      console.error('Error:', error);
    });
}

/******************************************************************************
  Chamada da função para carregamento inicial dos dados
******************************************************************************/
getList()

/******************************************************************************
  Função para cadastrar um cliente via requisição POST
******************************************************************************/
const postClient = async (nome, cpf, celular, email) => {
  const formData = new FormData();
  formData.append('nome', nome);
  formData.append('cpf', cpf);
  formData.append('celular', celular)
  formData.append('email', email);

  let url = 'http://127.0.0.1:8000/clients/insert';
  const response = await fetch(url, {
    method: 'post',
    body: formData
  })
  const result = await response.json();
  const res_status = response.status;
  const message = response.statusText;
  //console.log(res_status, message);
  return { res_status, message };
  
}

/******************************************************************************
  Função para atualizar dados do cliente via requisição PUT
******************************************************************************/
const putClient = async (nome, cpf, celular, email) => {
  const formData = new FormData();
  formData.append('nome', nome);
  formData.append('cpf', cpf);
  formData.append('celular', celular)
  formData.append('email', email);

  let url = 'http://127.0.0.1:8000/clients/update';
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

/******************************************************************************
  Função para deletar um item da lista do servidor via requisição DELETE
 ******************************************************************************/
const deleteClient = (data) => {
  console.log(data);
  const formData = new FormData();
  formData.append('cpf', data);
  console.log(formData);

  let url = 'http://127.0.0.1:8000/clients/delete';

  fetch(url, {
    method: 'delete',
    body: formData
  })
    .then((response) => response.json())
    .catch((error) => {
      console.error('Error:', error);
    });
}

/******************************************************************************
  Função para criar um botão delete para cada item da lista
******************************************************************************/
const insertButtonDelete = (parent) => {
  let span_delete = document.createElement("span");
  let txt_delete = document.createTextNode("🅧"); /* \u00D7 */
  span_delete.className = "bt-excluir";
  span_delete.title = "Exluir cliente!";
  span_delete.appendChild(txt_delete);
  parent.appendChild(span_delete);

}

/******************************************************************************
  Função para criar um botão update para cada item da lista
******************************************************************************/
const insertButtonUpdate = (parent) => {
  let span_update = document.createElement("span");
  let txt_update = document.createTextNode("✔");
  span_update.className = "bt-editar";
  span_update.title="Editar dados do cliente!";
  span_update.appendChild(txt_update);
  parent.appendChild(span_update);
}

/******************************************************************************
  Função para remover um item da lista de acordo com o click no botão delete
******************************************************************************/
const removeElement = () => {
  let close = document.getElementsByClassName("bt-excluir");
  let i;
  for (i = 0; i < close.length; i++) {
    close[i].onclick = function () {
      let div = this.parentElement.parentElement;
      let cpf = div.getElementsByTagName('td')[1].innerHTML
      cpf = cpf.replace(/[\.\-]/g, '');
      console.log("cpf: " + cpf);
      if (confirm("Você tem certeza?")) {
        div.remove();
        deleteClient(cpf); // Remove o cliente do cadastro
        alert("Removido!");
      }
    }
  }
}

/******************************************************************************
  Função para remover um item da lista de acordo com o click no botão close
******************************************************************************/
const editElement = () => {
  let close = document.getElementsByClassName("bt-editar");
  let i;
  for (i = 0; i < close.length; i++) {
    close[i].onclick = function () {

      // Carrga os dados no formulário
      let div = this.parentElement.parentElement;
      let nome = div.getElementsByTagName('td')[0].innerHTML
      let cpf = div.getElementsByTagName('td')[1].innerHTML
      let celular = div.getElementsByTagName('td')[2].innerHTML
      let email = div.getElementsByTagName('td')[3].innerHTML
      
      document.getElementById("nome").value = nome;
      document.getElementById("cpf").value = cpf;
      document.getElementById("celular").value = celular;
      document.getElementById("email").value = email;

      cpf = cpf.replace(/[\.\-]/g, '');
      console.log("cpf: " + cpf);
      
      document.getElementById("salvar").style.display = "none";
      document.getElementById("atualizar").style.display = "flex";

      if (confirm("Você tem certeza?")) {
        vaiCadastro();
      }
    }
  }
}

/******************************************************************************
  Função para atualizar os dados de um cliente
******************************************************************************/
const updateClient = async () => {

  // Carrega os dados do formulário html nas variáveis do js
  let nome = document.getElementById("nome").value;
  let cpf = document.getElementById("cpf").value;
  let celular = document.getElementById("celular").value;
  let email = document.getElementById("email").value;

  //retirar os carcteres especiais do cpf e do telefone
  cpf = cpf.replace(/[\.\-]/g, '');
  celular = celular.replace(/[\(\)\-\s]/g, '');

  // Verifica que todos os dados foram digitados
  // Não é verificada a veracidade do cpf
  if (nome === '') {
    alert("O nome do cliente é obrigatório!");
  } else if (cpf === '') {
    alert("O cpf do cliente é obrigatório!");
  } else if (!validarCPF(cpf)) {
    alert('CPF inválido: ' + cpf);
  } else if (celular === '') {
    alert(" celular do cliente é obrigatório!")
  } else if (!validaTelefone(celular)) {
    alert("Número de telefone inválido!")
  } else if (email === '') {
    alert("Um EMAIL VÁLIDO é obrigatório: " + email)
  } else {

    // Envia os dados para o cadastramento e aguarda a resposta do servidor
    const { res_status, message } = await putClient(nome, cpf, celular, email);

    console.log(res_status, message);

    if (res_status !=201) { 
      // Se houver erro
      console.log(res_status, message);
      alert(`Erro ao atualizar dados do clinete: STATUS: ${res_status} TEXT: ${message}`);
    }
    else {
      // Caso contrário envia o cliente para a lista de clientes
      document.getElementById("salvar").style.display = "flex";
      document.getElementById("atualizar").style.display = "none";      
    }
  }
  return { res_status, message };
}

/******************************************************************************
  Função para inserir items na lista apresentada 
******************************************************************************/
const showClients = (nome, cpf, celular, email) => {

  // Dados do cadastro de clientes
  // Insere as mascaras de cpf e celular para melhor visualização
  var cpf_ = cpf.replace(/(\d{3})?(\d{3})?(\d{3})?(\d{2})/, "$1.$2.$3-$4");
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
  insertButtonDelete(row.insertCell(-1))
  // insertButtonUpdate(row.insertCell(-1))

  // Limpa os campos de formulário
  //document.getElementById("id").value = "";
  document.getElementById("nome").value = "";
  document.getElementById("cpf").value = "";
  document.getElementById("celular").value = "";
  document.getElementById("email").value = "";

  // Insere o botão de exclusão
  removeElement();
  // Insere o botão de edição
  editElement();

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

/******************************************************************************
  Função para validar o cpf
******************************************************************************/
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
      console.log("cpf falso");
      return false;
      
    }
    console.log("cpf verdadeiro");
    return true;
  }
};

function validaTelefone(telefone){
    //retira todos os caracteres menos os numeros
    telefone = telefone.replace(/\D/g,'');
    
    //verifica se tem a qtde de numero correto
    if(!(telefone.length >= 10 && telefone.length <= 11)) return false;
    
    //Se tiver 11 caracteres, verificar se começa com 9 o celular
    if (telefone.length == 11 && parseInt(telefone.substring(2, 3)) != 9) return false;
      
    //verifica se não é nenhum numero digitado errado (propositalmente)
    for(var n = 0; n < 10; n++){
    	//um for de 0 a 9.
      //estou utilizando o metodo Array(q+1).join(n) onde "q" é a quantidade e n é o 	  
      //caractere a ser repetido
    	if(telefone == new Array(11).join(n) || telefone == new Array(12).join(n)) return false;
      }
      //DDDs validos
      var codigosDDD = [11, 12, 13, 14, 15, 16, 17, 18, 19,
    21, 22, 24, 27, 28, 31, 32, 33, 34,
    35, 37, 38, 41, 42, 43, 44, 45, 46,
    47, 48, 49, 51, 53, 54, 55, 61, 62,
    64, 63, 65, 66, 67, 68, 69, 71, 73,
    74, 75, 77, 79, 81, 82, 83, 84, 85,
    86, 87, 88, 89, 91, 92, 93, 94, 95,
    96, 97, 98, 99];
      //verifica se o DDD é valido (sim, da pra verificar rsrsrs)
      if(codigosDDD.indexOf(parseInt(telefone.substring(0, 2))) == -1) return false;
      
			//  E por ultimo verificar se o numero é realmente válido. Até 2016 um celular pode 
      //ter 8 caracteres, após isso somente numeros de telefone e radios (ex. Nextel)
      //vão poder ter numeros de 8 digitos (fora o DDD), então esta função ficará inativa
      //até o fim de 2016, e se a ANATEL realmente cumprir o combinado, os numeros serão
      //validados corretamente após esse período.
      //NÃO ADICIONEI A VALIDAÇÂO DE QUAIS ESTADOS TEM NONO DIGITO, PQ DEPOIS DE 2016 ISSO NÃO FARÁ DIFERENÇA
      //Não se preocupe, o código irá ativar e desativar esta opção automaticamente.
      //Caso queira, em 2017, é só tirar o if.
      //if(new Date().getFullYear() < 2017) return true;
      if (telefone.length == 10 && [2, 3, 4, 5, 7].indexOf(parseInt(telefone.substring(2, 3))) == -1) return false;

			//se passar por todas as validações acima, então está tudo certo
      return true;
  
}
/*
$(function(){
$('#btn-telefone').click(function(){
		$('#resposta').html('');
    if(telefone_validation($('#telefone').val())){
	    $('#resposta').html('Telefone Correto');
    }else{
    	$('#resposta').html('Algo está errado com o telefone (ou com a validação)');
    }
});
});
*/