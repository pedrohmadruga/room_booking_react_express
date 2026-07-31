import api from "./api.ts";

export async function register(payload: {
  name: string;
  email: string;
  password: string;
  cpf: string;
  phone?: string | null;
  address: {
    street: string;
    number: string;
    complement?: string | null;
    neighborhood: string;
    cep: string;
    city: string;
    state: string;
  };
}) {
  const { data } = await api.post("/register", payload);
  return data;
}

export async function login(payload: {
  email: string;
  password: string;
}) {
  const { data } = await api.post("/login", payload);
  return data;
}