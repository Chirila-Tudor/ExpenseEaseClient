const API_URL = "http://localhost:8080/savings";

export async function addMoneyIntoPiggyBank(piggyBankRequestDTO: any) {
  const response = await fetch(`${API_URL}/addPiggyBankAmount`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(piggyBankRequestDTO),
  });

  if (!response.ok) {
    throw new Error("Failed to add money into piggy bank");
  }
  return await response.json();
}

export async function updatePiggyBankAmount(
  id: number,
  piggyBankUpdateRequestDTO: any
) {
  const response = await fetch(`${API_URL}/updatePiggyBank?id=${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(piggyBankUpdateRequestDTO),
  });

  if (!response.ok) {
    throw new Error("Failed to update piggy bank");
  }
  return await response.json();
}

export async function deletePiggyBank(id: number) {
  const response = await fetch(`${API_URL}/deletePiggyBank?id=${id}`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
  });

  if (!response.ok) {
    throw new Error("Failed to delete piggy bank");
  }
  return response;
}

export async function getPiggyBankById(id: number) {
  const response = await fetch(`${API_URL}/getSaving?savingId=${id}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch piggy bank by ID");
  }
  return await response.json();
}

export async function getAllSavings() {
  const response = await fetch(`${API_URL}/getAllSavings`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch all piggy banks");
  }
  return await response.json();
}

export async function getTotalSavingsAmount() {
  const response = await fetch(`${API_URL}/totalSavings`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch total savings amount");
  }
  return await response.json();
}
