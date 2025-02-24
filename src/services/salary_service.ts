const API_URL = "http://localhost:8080/salaries";

export async function addSalary(salaryRequestDTO) {
  const response = await fetch(`${API_URL}/addSalary`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(salaryRequestDTO),
  });

  if (!response.ok) {
    throw new Error("Failed to add salary");
  }
  return await response.json();
}

export async function updateSalary(id, salaryUpdateRequestDTO) {
  const response = await fetch(`${API_URL}/updateSalary?id=${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(salaryUpdateRequestDTO),
  });

  if (!response.ok) {
    throw new Error("Failed to update salary");
  }
  return await response.json();
}

export async function deleteSalary(id) {
  const response = await fetch(`${API_URL}/deleteSalary?id=${id}`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
  });

  if (!response.ok) {
    throw new Error("Failed to delete salary");
  }
  return response;
}

export async function getAllSalaries() {
  const response = await fetch(`${API_URL}/getAllSalaries`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch salaries");
  }
  return await response.json();
}

export async function getSalaryById(id: number) {
  const response = await fetch(`${API_URL}/getSalary?salaryId=${id}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch salary by ID");
  }
  return await response.json();
}
