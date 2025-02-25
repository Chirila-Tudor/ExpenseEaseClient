const API_URL = "http://localhost:8080/expenses";

export async function addExpense(expenseRequestDTO: any) {
  const response = await fetch(`${API_URL}/addExpense`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(expenseRequestDTO),
  });

  if (!response.ok) {
    throw new Error("Failed to add expense");
  }
  return await response.json();
}

export async function getAllExpenses() {
  const response = await fetch(`${API_URL}/getAllExpenses`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch expenses");
  }
  return await response.json();
}

export async function updateExpense(id: number, expenseRequestDTO: any) {
  const response = await fetch(`${API_URL}/updateExpenses?id=${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(expenseRequestDTO),
  });

  if (!response.ok) {
    throw new Error("Failed to update expense");
  }
  return await response.json();
}

export async function deleteExpense(id: number) {
  const response = await fetch(`${API_URL}/deleteExpense?id=${id}`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
  });

  if (!response.ok) {
    throw new Error("Failed to delete expense");
  }
  return response;
}

export async function getExpenseById(id: number) {
  const response = await fetch(`${API_URL}/getExpense?expenseId=${id}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch expense by ID");
  }
  return await response.json();
}

export async function getTotalExpensesAmount() {
  const response = await fetch(`${API_URL}/totalExpenses`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch total expenses amount");
  }
  return await response.json();
}
