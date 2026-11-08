
import { prisma } from "../lib/prisma.js";

async function main() {
  const totalUsuarios = await prisma.user.count();

  console.log("Conexão com PostgreSQL realizada com sucesso!");
  console.log(`Total de usuários cadastrados: ${totalUsuarios}`);
}

main()
  .catch((error) => {
    console.error("Erro ao consultar o banco:", error.message);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
