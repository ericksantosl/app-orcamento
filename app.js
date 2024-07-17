class Despesa {
    constructor(ano, mes, dia, tipo, descricao, valor) {
        this.ano = ano
        this.mes = mes
        this.dia = dia
        this.tipo = tipo
        this.descricao = descricao
        this.valor = valor
    }

    validarDados() {
        for (let i in this) {
            if(this[i] == undefined || this[i] == '' || this[i] == null) {
                return false
            } else {
                return true
            }
        }
    }
}

class Bd {
    constructor() {
        let id = localStorage.getItem('id')

        if (id === null) {
            localStorage.setItem('id', 0)
        }
    }


    getProximoId() {
        let proximoId = localStorage.getItem('id')
        return parseInt(proximoId) + 1
    }

    gravar(d) {
        let id = this.getProximoId()

        localStorage.setItem(id, JSON.stringify(d))

        localStorage.setItem('id', id)
    }

    recuperarTodosRegistros() {
        //array de despesa
        let despesas = []

        let id = localStorage.getItem('id')

        //recuperar todas as despesas de local storage
        for (let i = 1; i <= id; i++){
            
            //recuperar a despesa
            let despesa = JSON.parse(localStorage.getItem(i))


            if (despesa === null) {
                continue
            }

            despesa.id = i
            despesas.push(despesa)
        }

        return despesas
    }

    pesquisar(despesa) {

        let despesasFiltradas = []

        despesasFiltradas = this.recuperarTodosRegistros()

        
        //console.log(despesa)

        //ano
        if (despesa.ano != '') {
            despesasFiltradas = despesasFiltradas.filter(d => d.ano == despesa.ano)
        }
        
        //mes
        if (despesa.mes != '') {
            despesasFiltradas = despesasFiltradas.filter(d => d.mes == despesa.mes)
        }

        //dia
        if (despesa.dia != '') {
            despesasFiltradas = despesasFiltradas.filter(d => d.dia == despesa.dia)
        }

        //tipo
        if (despesa.tipo != '') {
            despesasFiltradas = despesasFiltradas.filter(d => d.tipo == despesa.tipo)
        }

        //descricao
        if (despesa.descricao != '') {
            despesasFiltradas = despesasFiltradas.filter(d => d.descricao == despesa.descricao)
        }

        //valor
        if (despesa.valor != '') {
            despesasFiltradas = despesasFiltradas.filter(d => d.valor == despesa.valor)
        }

        return despesasFiltradas

    }

    remover(id) {
        localStorage.removeItem(id)
    }
}

let bd = new Bd()

function cadastrarDespesa() {
    let ano = document.getElementById('ano')
    let mes = document.getElementById('mes')
    let dia = document.getElementById('dia')
    let tipo = document.getElementById('tipo')
    let descricao = document.getElementById('descricao')
    let valor = document.getElementById('valor')

    let despesa = new Despesa(ano.value, mes.value, dia.value, tipo.value, descricao.value, valor.value)

    if (despesa.validarDados()) {
        bd.gravar(despesa)
        
        document.getElementById('exampleModalLabel').innerText = 'Registro inserido com sucesso'
        document.getElementById('exampleModalLabel').className = 'modal-title text-success'
        document.getElementById('textoModal').innerText = 'Despesa foi cadastrada com sucesso.'
        document.getElementById('buttonModal').innerText = 'Voltar'
        document.getElementById('buttonModal').className = 'btn btn-success'

        $('#modalRegistrarDespesa').modal('show')
        ano.value = ''
        mes.value = ''
        dia.value = ''
        tipo.value = ''
        descricao.value = ''
        valor.value = ''
    } else {
        document.getElementById('exampleModalLabel').innerText = 'Erro na gravação'
        document.getElementById('exampleModalLabel').className = 'modal-title text-danger'
        document.getElementById('textoModal').innerText = 'Existem campos obrigatórios que não foram preenchidos'
        document.getElementById('buttonModal').innerText = 'Voltar e corrigir'
        document.getElementById('buttonModal').className = 'btn btn-danger'

        $('#modalRegistrarDespesa').modal('show')
    }
}

function carregarListaDespesas(despesas = [], filtro = false) {

    if (despesas.length == 0 && filtro == false) {
        despesas = bd.recuperarTodosRegistros()
    }

    let listaDespesas = document.getElementById('listaDespesas')
    listaDespesas.innerHTML = ''

    //percorrer o array despesas, listando cada despesa
    despesas.forEach(element => {
        
        //criando a linhha (tr)
        let linha = listaDespesas.insertRow()

        //criar as colunas (td)
        linha.insertCell(0).innerHTML = `${element.dia}/${element.mes}/${element.ano}`

        //ajustando tipo
        switch (element.tipo) {
            case '1': 
                element.tipo = 'Alimentação'
                break;
            case '2': 
                element.tipo = 'Educação'
                break;
            case '3': 
                element.tipo = 'Lazer'
                break;
            case '4': 
                element.tipo = 'Saúde'
                break;
            case '5': 
                element.tipo = 'Transporte'
                break;
        }

        linha.insertCell(1).innerHTML = element.tipo
        linha.insertCell(2).innerHTML = element.descricao
        linha.insertCell(3).innerHTML = element.valor

        //criar o botão de exclusão
        let btn = document.createElement('button')

        btn.className = 'btn btn-danger'
        btn.innerHTML = '<i class="fas fa-times"></i>'
        btn.id = `id_despesa_${element.id}`
        btn.onclick = function() {
            //remover a despesa
            let id = this.id.replace('id_despesa_' ,'')

            bd.remover(id)

            window.location.reload()
        }

        linha.insertCell(4).append(btn)

    });
}

function pesquisarDespesa() {
    let ano = document.getElementById('ano').value
    let mes = document.getElementById('mes').value
    let dia = document.getElementById('dia').value
    let tipo = document.getElementById('tipo').value
    let descricao = document.getElementById('descricao').value
    let valor = document.getElementById('valor').value

    let despesa = new Despesa(ano, mes, dia, tipo, descricao, valor)

    let despesas = bd.pesquisar(despesa)

    carregarListaDespesas(despesas, true)
}