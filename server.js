const net = require('net');
const dotenv = require('dotenv');

dotenv.config();

NUM_PORTA = process.env.PORT || 3333;

const bdProdutos = [
    {
        id : 1,
        nome: "Água_Sanitária",
        valor: 4.45,
    },
    {
        id : 2,
        nome: "Amaciante",
        valor: 15.50,
    },
    {
        id : 3,
        nome: "Desodorante",
        valor: 10.0,
    },
    {
        id : 4,
        nome: "Sabão_em_Pó_5KG",
        valor: 20.50,
    }];
const carrinho = [];
// Criar o objeto servidor e registrar a função principal de manipulação da conexão
const server = net.createServer(connectionListener);

server.listen(NUM_PORTA, "0.0.0.0", () => {
    console.log(`Servidor iniciado! Escutando na porta ${NUM_PORTA}`);
});

function connectionListener(socket) {
    socket.on("data", (data) => {
        const dataString = data.toString().trim();

        const params = dataString.split(" ");

        console.log(params);

        switch (params[0]) {
            case "ADICIONAR":
                carrinho.push({
                    id: params[1],
                    nome: params[2],
                    quantidade: params[3],
                });
                socket.write("PRODUTO ADICIONADO\n");
                break;

            case "LISTAR":
                let carrinho = "";

                carrinho.forEach((produto) => {
                    result += produto.id + " " + produto.nome + " " + produto.quantidade + "\n";
                });

                socket.write(carrinho);
                break;

            case "ESTOQUE":
                let estoque = "Itens Disponíveis:\n";

                bdProdutos.forEach((produto) => {
                    result += produto.id + " " + produto.nome + " " + produto.valor + "\n";
                });

                socket.write(estoque);
                break;
            
            case "REMOVER":
                let resultRemove = "";
                quantidadeRemover = params[3];
                carrinho[params[1]].quantidade -= quantidadeRemover;
                resultRemove += produto.id + " " + produto.nome + " " + produto.quantidade + "\n";
                socket.write("Removido:\n" + quantidadeRemover + " " + params[2] + "\n");
                break;

            case "PAGAR":
                let resultPagar = "";
                let total = 0;
                carrinho.forEach((produto) => {
                    total += produto.valor * produto.quantidade;
                })
                resultPagar += "Total: " + total + "\n";
                socket.write(resultPagar);
                socket.write("Liberado para solicitar entrega!\n");
                break;
            
            case "ENTREGAR":
                socket.write("Em sepração!\n");
                socket.write("Entrega liberada!\n");
                socket.write("Enviado!\n Obrigado por utilizar o supermercado\n Fernandes e Familia\n");
                break;
            case "SAIR":
                console.log("Desconectado");
                socket.end();
                break;

            default:
                socket.write("-ERRO Comando não reconhecido\n");

        }
    });
}