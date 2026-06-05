-- ====================================================================
-- INSTRUÇÕES DE BANCO DE DADOS - LIBERAR EXCLUSÃO DE CONVIDADOS E PRESENTES
-- ====================================================================
--
-- O Supabase possui segurança em nível de linha (Row Level Security - RLS)
-- ativada por padrão nas tabelas. Por padrão, a chave pública (anon) não tem 
-- permissão para deletar registros no banco.
--
-- Para que você consiga excluir convidados e presentes recebidos diretamente 
-- do seu painel administrativo, siga os passos abaixo no console do Supabase:
--
-- 1. Acesse o painel do seu projeto no Supabase (https://supabase.com).
-- 2. No menu lateral esquerdo, clique em "SQL Editor".
-- 3. Clique em "+ New query" para abrir uma aba em branco.
-- 4. Copie e cole os comandos SQL abaixo no editor:
--

-- Liberar exclusão de convidados
CREATE POLICY "Allow public delete on guests" ON "public"."guests" FOR DELETE USING (true);

-- Liberar exclusão de presentes/contribuições
CREATE POLICY "Allow public delete on gifts" ON "public"."gifts" FOR DELETE USING (true);

--
-- 5. Clique no botão "Run" (ou aperte Ctrl+Enter / Cmd+Enter).
--
-- Pronto! Agora as exclusões funcionarão na hora no painel dos noivos,
-- atualizando os totais instantaneamente sem precisar recarregar.
