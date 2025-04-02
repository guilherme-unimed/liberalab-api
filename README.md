# liberalab-api

API para integração Notus/Shift

## Uso

### /setconfig (POST)

Endpoint direcionada para configurações do sistema.

```json
{
    "url": "URL de integração",
    "user": "Username disponibilizado",
    "pw": "Palavra passe",
    "idhospital": "ID do estabelecimento para integração",
    "key": "Chave de integração"
}
```

### /getconfig (GET)

Retorna os dados de configuração do sistema.

### /criaordem (POST)

Endpoint de envio de dados para abertura de Ordem de Serviço

```json
{
    "pedido":{
        "convenio": "10",
        "observacao": "Texto Livre",
        "carteirinha": "00810000001112223",
        "guia": "100100000001",
        "emissaoguia": "2025-03-31",
        "acidente": "9",
        "atendimentorn": "N",
        "regatendimento": "01"
    },
    "paciente": {
        "codigo": "08455599923",
        "nome": "TESTE PACIENTE",
        "sexo": "M",
        "dtnasc": "1990-09-05",
        "cpf": "08455599923"
    },
    "medico": {
        "nome": "TESTE MEDICO",
        "crm": "111111",
        "conselho": "CRM",
        "uf": "PR"
    },
    "exames": [{
        "codigo": "40304361",
        "urgente": "0"
    }]
}
```