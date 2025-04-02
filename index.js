const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const port = 3030;
const fetch = require('node-fetch');
const fs = require('fs');

app.use((req, res, next)=>{
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader("Access-Control-Allow-Headers","Access-Control-Allow-Headers, Origin, Accept, X-Requested-With, Content-Type, authorization, Access-Control-Request-Method, Access-Control-Request-Headers");
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));

app.post('/setconfig', async (req, res)=>{
    const url = req.body.url;
    const user = req.body.user;
    const pw = req.body.pw;
    const idhospital = req.body.idhospital;
    const key = req.body.key;
  
    fs.readFile("./config/setup.json", "utf8", (err, data)=>{
        if(err){
            console.log("Erro ao ler arquivo" + err);
            res.json({msg: "Erro ao ler arquivo" + err});
            return
        }
    
        var jsonData = JSON.parse(data);

        jsonData.url = url;
        jsonData.user = user;
        jsonData.pw = pw;
        jsonData.idhospital = idhospital;
        jsonData.key = key;

        fs.writeFile("./config/setup.json", JSON.stringify(jsonData, null, 2), (err) =>{
            if(err){
                console.log("Erro ao escrever arquivo" + err);
                res.json({msg: "Erro ao escrever arquivo" + err});
                return
            }
    
            res.json({msg: "Arquivo atualizado"});

        });
    });
});

app.get('/getconfig', (req, res) =>{
    fs.readFile("./config/setup.json", "utf8", (err, data)=>{
        if(err){
            console.log("Erro ao ler arquivo" + err);
            res.json({msg: "Erro ao ler arquivo" + err});
            return
        }
    
        let jsonData = JSON.parse(data);
        res.json(jsonData);
    });
});

app.post('/criaordem', async (req, res) =>{

    const p_convenio = req.body.pedido.convenio;
    const p_observacao = req.body.pedido.observacao;
    const p_carteirinha = req.body.pedido.carteirinha;
    const p_guia = req.body.pedido.guia;
    const p_emissaoguia = req.body.pedido.emissaoguia;
    const p_acidente = req.body.pedido.acidente
    const p_atendimentorn = req.body.pedido.atendimentorn;
    const p_regatendimento = req.body.pedido.regatendimento;
    const pa_codigo = req.body.paciente.codigo;
    const pa_nome = req.body.paciente.nome;
    const pa_sexo = req.body.paciente.sexo;
    const pa_dtnasc = req.body.paciente.dtnasc;
    const pa_cpf = req.body.paciente.cpf;
    const m_nome = req.body.medico.nome
    const m_crm = req.body.medico.crm;
    const m_conselho = req.body.medico.conselho;
    const m_uf = req.body.medico.uf;
    const exames = req.body.exames;

    let comp_exames = '';

    for(let i=0; i<exames.length;i++){
        comp_exames = comp_exames + `
            <exame>
                <codigo>${exames[i].codigo}</codigo>
                <medicos>
                    <medico>
                        <nome>${m_nome}</nome>
                        <crm>${m_crm}</crm>
                        <conselho>${m_conselho}</conselho>
                        <uf>${m_uf}</uf>
                    </medico>
                </medicos>
                <urgente>${exames[i].urgente}</urgente>
                <codigoSolicitacaoExame></codigoSolicitacaoExame>
            </exame>`;
    }

    var xml = `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:shif="http://www.shift.com.br">
        <soapenv:Header/>
        <soapenv:Body>
            <shif:ImportaPedido>
                <shif:idHospital>HSHIS</shif:idHospital>
                <shif:pedidoLab><![CDATA[
    <pedidoLab>
        <pedido>
            <codigo></codigo>
            <ordemServico></ordemServico>
            <posto>1</posto>
            <convenio>${p_convenio}</convenio>
            <observacao>${p_observacao}</observacao>
            <dadosCadastrais>
                <dadoCadastral>
                    <codigo>1</codigo>
                    <valor>${p_carteirinha}</valor>
                </dadoCadastral>
                <dadoCadastral>
                    <codigo>11</codigo>
                    <valor>${p_guia}</valor>
                </dadoCadastral>
                <dadoCadastral>
                    <codigo>5</codigo>
                    <valor>${p_guia}</valor>
                </dadoCadastral>
                <dadoCadastral>
                    <codigo>6</codigo>
                    <valor>${p_emissaoguia}</valor>
                </dadoCadastral>
                <dadoCadastral>
                    <codigo>26</codigo>
                    <valor>${p_acidente}</valor>
                </dadoCadastral>
                <dadoCadastral>
                    <codigo>25</codigo>
                    <valor>${p_atendimentorn}</valor>
                </dadoCadastral>
                <dadoCadastral>
                    <codigo>38</codigo>
                    <valor>${p_regatendimento}</valor>
                </dadoCadastral>
            </dadosCadastrais>
        </pedido>
        <paciente>
        	<codigo>${pa_codigo}</codigo>
		    <nome>${pa_nome}</nome>
		    <sexo>${pa_sexo}</sexo>
		    <dtNascimento>${pa_dtnasc}</dtNascimento>
            <cpf>${pa_cpf}</cpf>
        </paciente>
        <exames>
        ${comp_exames}
        </exames>
    </pedidoLab>
    ]]>
                </shif:pedidoLab>
            </shif:ImportaPedido>
        </soapenv:Body>
    </soapenv:Envelope> `

   

    fetch('https://integracao.shiftcloud.com.br/shift/integracao/unimedparanagua/wshis/shift.bs.WSHIS.cls', {
        method: 'post',
        body: xml,
        headers: {'Content-Type': 'application/xml',
            'SOAPAction': 'http://www.shift.com.br/shift.bs.WSHIS.ImportaPedido'
        }
    }).then(data=>{
        data.text().then(text => {
            console.log(text);
        })
    });

    res.send(xml);
});

app.listen(port);
console.log("API iniciada");