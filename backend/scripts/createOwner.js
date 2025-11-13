// backend/scripts/createOwner.js
require("dotenv").config();
const bcrypt = require("bcrypt");
const sequelize = require("../config/db");
const Usuario = require("../models/Usuario");

async function main() {
  try {
    console.log("🔌 Conectando ao banco...");
    await sequelize.authenticate();
    console.log("✅ Conexão OK");

    const OWNER_EMAIL = (process.env.OWNER_EMAIL || "").trim();
    const OWNER_PASSWORD = process.env.OWNER_PASSWORD || "123456";

    if (!OWNER_EMAIL) {
      console.error("🛑 Defina OWNER_EMAIL no .env antes de rodar o script.");
      process.exit(1);
    }

    console.log(`👑 Usando OWNER_EMAIL = ${OWNER_EMAIL}`);

    let usuario = await Usuario.findOne({ where: { email: OWNER_EMAIL } });

    if (!usuario) {
      console.log("➕ Owner não existe ainda, criando...");

      const senhaHash = await bcrypt.hash(OWNER_PASSWORD, 10);

      usuario = await Usuario.create({
        nome: null,
        sobrenome: null,
        email: OWNER_EMAIL,
        senha: senhaHash,
        data_nascimento: null,
        genero: null,
        altura: null,
        peso: null,
        objetivo: null,
        isAdmin: true,
        isOwner: true,
        fotoUrl: null,
        tokenRecuperacao: null,
        tokenExpiraEm: null,
      });

      console.log(
        `✅ Owner criado com sucesso (id=${usuario.id}). ` +
          `Use o email ${OWNER_EMAIL} e a senha configurada em OWNER_PASSWORD.`
      );
    } else {
      console.log(
        `ℹ️ Já existe um usuário com esse email (id=${usuario.id}). Atualizando flags...`
      );

      const updateData = {
        isAdmin: true,
        isOwner: true,
      };

      // Se quiser forçar atualizar a senha, use OWNER_FORCE_PASSWORD=1
      if (process.env.OWNER_FORCE_PASSWORD === "1") {
        const senhaHash = await bcrypt.hash(OWNER_PASSWORD, 10);
        updateData.senha = senhaHash;
        console.log("🔐 Senha do owner foi atualizada (OWNER_FORCE_PASSWORD=1).");
      }

      await usuario.update(updateData);

      console.log(
        `✅ Usuário marcado como admin/owner. ` +
          `Login: ${OWNER_EMAIL} (senha só muda se OWNER_FORCE_PASSWORD=1).`
      );
    }

    console.log("🏁 Script finalizado.");
  } catch (err) {
    console.error("🛑 Erro no script createOwner:", err);
  } finally {
    await sequelize.close();
    process.exit(0);
  }
}

main();

