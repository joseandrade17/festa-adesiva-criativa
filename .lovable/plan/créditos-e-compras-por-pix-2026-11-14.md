# Créditos e compras por Pix

## Resultado
- Cada cliente terá o primeiro adesivo gratuito.
- Depois, cada adesivo criado com sucesso consumirá um crédito.
- Pacotes: **20 créditos por R$ 19,90** ou **40 créditos por R$ 29,90**.
- Mostrar saldo, opção de compra e situação do pagamento junto à criação de adesivos.

## Antes de implementar
- Conectar o Supabase **já existente** em Configurações → Geral → External Supabase → Connect. Os Secrets estão cadastrados, mas a conexão não foi validada.
- Confirmar se a conta precisa de dados de perfil além do acesso e saldo. Não criar perfis sem essa decisão.
- Examinar as tabelas e permissões existentes antes de propor adições ao mesmo banco. Não criar outro banco nem apagar arquivos.
- Escolher e confirmar um serviço que aceite Pix em reais, suas taxas e a autorização para configurá-lo. Stripe é o candidato indicado pela análise de pagamentos, mas a disponibilidade de Pix para a conta precisa ser verificada. A opção integrada exige plano Pro; a alternativa com conta própria pode ser avaliada sem trocar o plano Lovable, mas também pode cobrar taxas por venda.
- Nenhum serviço pago, pagamento real ou mudança de plano será ativado sem autorização. A geração por IA continua consumindo uso do serviço, inclusive no adesivo gratuito; estes preços não garantem margem de lucro.

## Implementação
1. Adicionar acesso à conta para identificar cada cliente e preservar saldo entre dispositivos. Limitar a cortesia a uma geração bem-sucedida por conta; isso não garante uma cortesia por pessoa se ela criar várias contas.
2. Guardar saldo, uso da cortesia e histórico de movimentações no banco existente, aproveitando estruturas adequadas que já existam.
3. Proteger as duas opções de geração: por tema e por imagem enviada. Reservar a cortesia/crédito antes da geração para impedir uso simultâneo acima do saldo; confirmar o consumo após sucesso e liberar a reserva em caso de falha.
4. Criar compra Pix com os valores definidos no servidor, apresentando QR Code, código copiável e situação pendente, paga ou expirada conforme o serviço escolhido.
5. Liberar 20 ou 40 créditos apenas após confirmação válida do serviço de pagamento. Recarregar a página, retornar do pagamento ou clicar em “paguei” não libera créditos.
6. Testar o fluxo em ambiente de teste antes de habilitar vendas reais.

## Detalhes técnicos
- Ler os Secrets somente em execução no servidor; nunca enviar chaves privadas ao navegador. Validar seu uso e preferir os clientes gerados pela conexão externa.
- Impor autenticação e controle de saldo nos dois endpoints existentes, sem depender de bloqueios visuais.
- Usar operações atômicas e movimentações únicas para reservas e créditos; tratar requisições simultâneas, falhas e reservas abandonadas.
- Receber notificações em `/api/public/`, verificar assinatura/autenticidade, pedido, valor, moeda e estado pago, e impedir crédito duplicado pelo mesmo pagamento.
- Restringir cada cliente aos próprios dados; alterações de saldo e confirmação de pagamento somente por operações autorizadas no servidor.
- Testes concretos: primeira geração grátis; segunda sem saldo bloqueada; pacotes de 1990 centavos/20 créditos e 2990 centavos/40 créditos; um crédito por sucesso; falha sem consumo; confirmação duplicada sem crédito extra; isolamento entre contas.

## Limites desta etapa
Este é apenas o plano: nenhuma conta, tabela ou cobrança foi criada. A implementação depende da conexão ao banco existente e das decisões sobre perfil e taxas Pix.