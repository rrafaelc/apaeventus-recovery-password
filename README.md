# ApaEventus: Página de Recuperação de Senha

Esta é uma página estática para recuperação de senha do sistema ApaEventus. A página é projetada para ser hospedada no GitHub Pages ou qualquer outro serviço de hospedagem estática.

## Funcionalidades

- Interface moderna e responsiva
- Validação de código de 6 dígitos com campos separados
- Indicador de força de senha em tempo real
- Validação de requisitos de senha forte
- Feedback visual para todas as ações
- Suporte a dispositivos móveis
- Integração com a API do ApaEventus

## Requisitos de Senha

A senha deve atender aos seguintes requisitos:
- Mínimo de 8 caracteres
- Pelo menos uma letra maiúscula
- Pelo menos uma letra minúscula
- Pelo menos um número
- Pelo menos um caractere especial

## Como Usar

1. A página espera receber um parâmetro `data` na URL contendo o email criptografado:
   ```
   http://seu-dominio.com/index.html?data=5a35b1efbbfd79de5c97157a95fb7563b2f6ea9db69ebd8e3e830699ce9023eb
   ```

2. O usuário deve inserir o código de 6 dígitos recebido por email
3. Após validar o código, o usuário pode definir uma nova senha
4. A senha é validada em tempo real com feedback visual
5. Após redefinir a senha com sucesso, o usuário pode fechar a página

## Configuração

1. Clone este repositório
2. Atualize a URL da API no arquivo `script.js`:
   ```javascript
   const API_BASE_URL = 'http://sua-api.com';
   ```
3. Faça deploy para o GitHub Pages ou seu serviço de hospedagem preferido

## Endpoints da API

A página se integra com os seguintes endpoints:

- `POST /recover-password/validate` - Valida o código de recuperação
- `POST /recover-password/reset` - Redefine a senha

## Tecnologias Utilizadas

- HTML5
- CSS3
- JavaScript (ES6+)
- Bootstrap 5
- Fetch API

## Hospedagem

Para hospedar no GitHub Pages:

1. Crie um novo repositório no GitHub
2. Faça push dos arquivos para o repositório
3. Vá em Settings > Pages
4. Selecione a branch principal como fonte
5. A página estará disponível em `https://seu-usuario.github.io/nome-do-repositorio`

## Segurança

- A página não armazena dados localmente
- Todas as comunicações são feitas via HTTPS
- O email é sempre enviado criptografado
- A senha é validada tanto no cliente quanto no servidor

## Suporte

Para suporte ou dúvidas, entre em contato com a equipe de desenvolvimento do ApaEventus. 