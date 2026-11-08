
import test from "node:test";
import assert from "node:assert/strict";

const BASE_URL = "http://localhost:3000";

const USER_ID = "11111111-1111-4111-8111-111111111111";

// Teste 1: funcionamento da API
test("API deve responder ao health check", async () => {
  const response = await fetch(`${BASE_URL}/health`);
  const data = await response.json();

  assert.equal(response.status, 200);
  assert.equal(data.success, true);
});

// Teste 2: bloquear listagem sem JWT
test("Deve bloquear acesso sem JWT", async () => {
  const response = await fetch(`${BASE_URL}/users`);
  const data = await response.json();

  assert.equal(response.status, 401);
  assert.equal(data.error.code, "UNAUTHORIZED");
});

// Teste 3: rejeitar token inválido
test("Deve rejeitar token inválido", async () => {
  const response = await fetch(`${BASE_URL}/users`, {
    headers: {
      Authorization: "Bearer token-invalido",
    },
  });

  const data = await response.json();

  assert.equal(response.status, 401);
  assert.equal(data.error.code, "INVALID_TOKEN");
});

// Teste 4: proteger consulta individual
test("Deve bloquear consulta sem JWT", async () => {
  const response = await fetch(
    `${BASE_URL}/users/${USER_ID}`
  );

  const data = await response.json();

  assert.equal(response.status, 401);
  assert.equal(data.error.code, "UNAUTHORIZED");
});

// Teste 5: proteger atualização
test("Deve bloquear atualização sem JWT", async () => {
  const response = await fetch(
    `${BASE_URL}/users/${USER_ID}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: "Teste Sem Autorizacao",
      }),
    }
  );

  const data = await response.json();

  assert.equal(response.status, 401);
  assert.equal(data.error.code, "UNAUTHORIZED");
});

// Teste 6: proteger exclusão
test("Deve bloquear exclusão sem JWT", async () => {
  const response = await fetch(
    `${BASE_URL}/users/${USER_ID}`,
    {
      method: "DELETE",
    }
  );

  const data = await response.json();

  assert.equal(response.status, 401);
  assert.equal(data.error.code, "UNAUTHORIZED");
});

// Teste 7: proteger alteração de senha
test("Deve bloquear alteração de senha sem JWT", async () => {
  const response = await fetch(
    `${BASE_URL}/users/me/password`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        currentPassword: "SenhaFicticiaAtual123!",
        newPassword: "SenhaFicticiaNova456!",
      }),
    }
  );

  const data = await response.json();

  assert.equal(response.status, 401);
  assert.equal(data.error.code, "UNAUTHORIZED");
});
