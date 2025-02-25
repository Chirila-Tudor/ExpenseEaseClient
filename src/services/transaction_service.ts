const API_URL = "http://localhost:8080/transactions";

export async function addTransaction(transactionRequestDTO) {
  const response = await fetch(`${API_URL}/addTransaction`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(transactionRequestDTO),
  });

  if (!response.ok) {
    throw new Error("Failed to add transaction");
  }
  return await response.json();
}

export async function updateTransaction(
  id: number,
  transactionUpdateRequestDTO
) {
  const response = await fetch(`${API_URL}/updateTransaction?id=${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(transactionUpdateRequestDTO),
  });

  if (!response.ok) {
    throw new Error("Failed to update transaction");
  }
  return await response.json();
}

export async function deleteTransaction(id: number) {
  const response = await fetch(`${API_URL}/deleteTransaction?id=${id}`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
  });

  if (!response.ok) {
    throw new Error("Failed to delete transaction");
  }
  return response;
}

export async function getAllTransactions() {
  const response = await fetch(`${API_URL}/getAllTransactions`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch transactions");
  }
  return await response.json();
}

export async function getTransactionById(id: number) {
  const response = await fetch(
    `${API_URL}/getTransaction?transactionId=${id}`,
    {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch transaction by ID");
  }
  return await response.json();
}

export async function getTotalTransactionAmount() {
  const response = await fetch(`${API_URL}/totalTransactions`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch total transaction amount");
  }
  return await response.json();
}
