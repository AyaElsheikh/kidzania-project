<template>
  <nav class="custom-pagination d-flex justify-content-center my-4">
    <ul class="pagination align-items-center gap-2 mb-0">
      
      <!-- Prev -->
      <li class="page-item" :class="{ disabled: currentPage === 1 }">
        <a 
          class="page-link arrow" 
          href="#" 
          aria-label="Previous"
          @click.prevent="changePage(currentPage - 1)"
        >
          &laquo;
        </a>
      </li>

      <!-- Pages -->
      <li 
        v-for="page in totalPages" 
        :key="page" 
        class="page-item" 
        :class="{ active: currentPage === page }"
      >
        <a 
          class="page-link" 
          href="#"
          @click.prevent="changePage(page)"
        >
          {{ page }}
        </a>
      </li>

      <!-- Next -->
      <li class="page-item" :class="{ disabled: currentPage === totalPages }">
        <a 
          class="page-link arrow" 
          href="#" 
          aria-label="Next"
          @click.prevent="changePage(currentPage + 1)"
        >
          &raquo;
        </a>
      </li>

    </ul>
  </nav>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue';

const props = defineProps({
  currentPage: {
    type: Number,
    required: true
  },
  totalPages: {
    type: Number,
    required: true
  }
});

const emit = defineEmits(['page-change']);

const changePage = (page) => {
  if (page >= 1 && page <= props.totalPages) {
    emit('page-change', page);
  }
};
</script>

<style scoped>
.custom-pagination .pagination {
  background: #f5f9fc;
  padding: 8px 14px;
  border-radius: 30px;
}

/* common */
.custom-pagination .page-link {
  border: none;
  background: transparent;
  color: #6c757d;
  font-weight: 500;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  cursor: pointer;
}

/* active */
.custom-pagination .page-item.active .page-link {
  background-color: #1ec1f3;
  color: #fff;
  box-shadow: 0 4px 10px rgba(30, 193, 243, 0.4);
}

/* hover */
.custom-pagination .page-link:hover {
  background-color: #e7f6fd;
  color: #1ec1f3;
}

/* arrows */
.custom-pagination .page-link.arrow {
  font-size: 18px;
  color: #1ec1f3;
}

.page-item.disabled .page-link {
  color: #ccc;
  cursor: not-allowed;
  background-color: transparent;
}
</style>
