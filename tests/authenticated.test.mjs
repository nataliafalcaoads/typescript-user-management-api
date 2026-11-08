
import test from "node:test";
import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import jwt from "jsonwebtoken";

const BASE_URL = "http://localhost:3000";

async function autenticar() {
  const email = process.env.TEST_USER_EMAIL;
  const password = process.env.TEST_USER_PASSWORD;

  assert.ok(email && password, "Informe as credenciais de teste");

  const response = await fetch(`${BASE_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  assert.equal(response.status, 200);

  const data = await response.json();
  const token = data.data?.accessToken;

  assert.ok(token, "JWT não foi gerado");

  const payload = jwt.decode(token);
  const userId = payload?.sub;

  assert.equal(typeof userId, "string");

  return { token, userId };
}

function outroIdentificador(userId) {
  let id = randomUUID();

  while (id === userId) {
    id = randomUUID();
  }

  return id;
}

test("JWT válido permite consultar apenas a própria conta", async () => {
  const { token, userId } = await autenticar();

  const response = await fetch(`${BASE_URL}/users/${userId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  assert.equal(response.status, 200);

  const data = await response.json();
  assert.equal(data.data?.id, userId);

  const forbidden = await fetch(
    `${BASE_URL}/users/${outroIdentificador(userId)}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  assert.equal(forbidden.status, 403);

  const result = await forbidden.json();
  assert.equal(result.error?.code, "FORBIDDEN");
});

test("JWT válido não permite alterar outra conta", async () => {
  const { token, userId } = await autenticar();

  const response = await fetch(
    `${BASE_URL}/users/${outroIdentificador(userId)}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        name: "Alteracao Nao Autorizada",
      }),
    }
  );

  assert.equal(response.status, 403);

  const data = await response.json();
  assert.equal(data.error?.code, "FORBIDDEN");
});

test("JWT válido não permite excluir outra conta", async () => {
  const { token, userId } = await autenticar();

  const response = await fetch(
    `${BASE_URL}/users/${outroIdentificador(userId)}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  assert.equal(response.status, 403);

  const data = await response.json();
  assert.equal(data.error?.code, "FORBIDDEN");
});
