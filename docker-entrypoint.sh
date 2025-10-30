#!/bin/sh
set -e

echo "=========================================="
echo "Inicializando aplicação Overzone..."
echo "=========================================="

# Verificar se o banco de dados já existe
if [ ! -f "./prisma/dev.db" ]; then
  echo "Banco de dados não encontrado. Criando..."

  # Executar migrations
  echo "Aplicando migrations..."
  npx prisma migrate deploy

  # Popular banco com dados iniciais
  echo "Populando banco com dados iniciais..."
  npx prisma db seed

  echo "Banco de dados criado e populado com sucesso!"
else
  echo "Banco de dados já existe. Verificando migrations..."
  npx prisma migrate deploy
fi

echo "=========================================="
echo "Aplicação pronta!"
echo "Acesse: http://localhost:3000"
echo "=========================================="
echo ""
echo "Credenciais de teste:"
echo "Admin: admin@overzone.com / admin123"
echo "Cliente: joao@email.com / senha123"
echo "=========================================="

# Executar comando passado como argumento
exec "$@"
