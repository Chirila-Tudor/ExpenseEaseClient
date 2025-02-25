<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { useRouter } from "vue-router";
import { getAllSavings, deletePiggyBank } from "../services/piggyBank_service";
import CustomModal from "../components/CustomModal.vue";

interface Saving {
  id: number;
  amount: number;
  date: string;
}

const router = useRouter();

const savings = ref<Saving[]>([]);
const currentPage = ref<number>(1);
const savingsPerPage = 3;
const showConfirmModal = ref(false);
const currentSavingId = ref<number | null>(null);

onMounted(async () => {
  await loadSavings();
});

const loadSavings = async (): Promise<void> => {
  try {
    savings.value = await getAllSavings();
  } catch (error) {
    console.error("Failed to fetch savings", error);
  }
};

const currentSavings = computed(() => {
  const startIndex = (currentPage.value - 1) * savingsPerPage;
  return savings.value.slice(startIndex, startIndex + savingsPerPage);
});

const goToAddSaving = (): void => {
  router.push("/add-savings");
};

const redirectToUpdate = (id: number) => {
  router.push({ name: "updateSaving", params: { id } });
};

const showDeleteModal = (id: number): void => {
  currentSavingId.value = id;
  showConfirmModal.value = true;
};

const deleteSavingConfirm = async (): Promise<void> => {
  if (currentSavingId.value !== null) {
    try {
      await deletePiggyBank(currentSavingId.value);
      await loadSavings();
      closeConfirmModal();
    } catch (error) {
      console.error("Failed to delete saving", error);
    }
  }
};

const closeConfirmModal = (): void => {
  showConfirmModal.value = false;
  currentSavingId.value = null;
};

const formatDate = (date: string): string => {
  const d = new Date(date);
  return d.toLocaleDateString();
};

const goHome = (): void => {
  router.push("/expenses");
};

const nextPage = (): void => {
  if (currentPage.value * savingsPerPage < savings.value.length) {
    currentPage.value++;
  }
};

const prevPage = (): void => {
  if (currentPage.value > 1) {
    currentPage.value--;
  }
};
</script>

<template>
  <div class="container">
    <div class="card">
      <div class="header">
        <i class="fa fa-home home-icon" @click="goHome"></i>
        <h1 class="title">Piggy Bank</h1>
      </div>

      <button class="add-button" @click="goToAddSaving">Add Saving</button>

      <div v-if="currentSavings.length > 0" class="saving-list">
        <div
          v-for="saving in currentSavings"
          :key="saving.id"
          class="saving-item"
        >
          <div class="saving-info">
            <span><strong>Amount:</strong> {{ saving.amount }} RON</span>
            <span><strong>Date:</strong> {{ formatDate(saving.date) }}</span>
          </div>

          <div class="actions">
            <button class="update-button" @click="redirectToUpdate(saving.id)">
              Update
            </button>

            <button class="delete-button" @click="showDeleteModal(saving.id)">
              Delete
            </button>
          </div>
        </div>
      </div>

      <div v-if="savings.length > savingsPerPage" class="pagination">
        <button
          class="pagination-button"
          @click="prevPage"
          :disabled="currentPage === 1"
        >
          Prev
        </button>
        <span
          ><strong>{{ currentPage }}</strong></span
        >
        <button
          class="pagination-button"
          @click="nextPage"
          :disabled="currentPage * savingsPerPage >= savings.length"
        >
          Next
        </button>
      </div>
    </div>

    <CustomModal
      v-if="showConfirmModal"
      :title="'Are you sure?'"
      :message="'Do you really want to delete this saving?'"
      @confirm="deleteSavingConfirm"
      @cancel="closeConfirmModal"
    />
  </div>
</template>

<style scoped>
.container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background: #f4f7fc;
  font-family: "Arial", sans-serif;
}

.card {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 800px;
  text-align: center;
}

.header {
  display: flex;
  align-items: center;
  justify-content: center;
}

.home-icon {
  font-size: 2rem;
  cursor: pointer;
  margin-right: 10px;
}

.title {
  font-size: 1.8rem;
  margin-bottom: 1.5rem;
  color: #333;
  font-weight: bold;
}

.add-button {
  padding: 10px 20px;
  background: linear-gradient(135deg, #007bff, #00c6ff);
  color: white;
  font-weight: bold;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  margin-bottom: 20px;
  transition: background-color 0.3s ease, transform 0.2s ease;
}

.add-button:hover {
  background: linear-gradient(135deg, #005bb5, #00a0ff);
}

.add-button:active {
  transform: scale(0.98);
}

.saving-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 100%;
}

.saving-item {
  padding: 1rem;
  border-radius: 10px;
  background: #f9f9f9;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.saving-item:hover {
  background: #eef3f9;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.saving-info {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 15px;
}

.actions {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  margin-top: 10px;
}

.update-button,
.delete-button {
  padding: 0.5rem;
  font-weight: bold;
  font-size: 0.9rem;
  background: linear-gradient(135deg, #007bff, #00c6ff);
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.2s ease;
  width: 48%;
}

.update-button:hover,
.delete-button:hover {
  background: linear-gradient(135deg, #005bb5, #00a0ff);
}

.update-button:active,
.delete-button:active {
  transform: scale(0.98);
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
}

.pagination-button {
  padding: 10px 16px;
  font-weight: bold;
  margin-right: 5px;
  margin-left: 5px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.pagination-button:hover {
  background-color: #0056b3;
}

.pagination-button:disabled {
  background-color: #ddd;
  cursor: not-allowed;
}
</style>
