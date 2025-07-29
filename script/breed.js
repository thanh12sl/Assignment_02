'use strict';
const inputBreed = document.getElementById('input-breed');
const inputType = document.getElementById('input-type');
const submitBtn = document.getElementById('submit-btn');
const tbody = document.getElementById('tbody');
const sidebarTitleEl = document.getElementById('sidebar-title');
const sidebarEl = document.getElementById('sidebar');
sidebarTitleEl.addEventListener('click', function() {
    sidebarEl.classList.toggle('active');
});
let breedArr = JSON.parse(localStorage.getItem('breedArr')) || [];

function saveToStorage() {
    localStorage.setItem('breedArr', JSON.stringify(breedArr));
}

function renderBreedTable() {
    tbody.innerHTML = '';
    breedArr.forEach((breed, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
      <th scope="row">${index + 1}</th>
      <td>${breed.name}</td>
      <td>${breed.type}</td>
      <td>
        <button class="btn btn-danger btn-sm" onclick="deleteBreed(${index})">Delete</button>
      </td>
    `;
        tbody.appendChild(row);
    });
}
submitBtn.addEventListener('click', function() {
    const breedName = inputBreed.value.trim();
    const breedType = inputType.value;
    if (breedName === '' || breedType === 'Select Type') {
        alert('Vui lòng nhập đầy đủ thông tin Breed và Type!');
        return;
    }
    const newBreed = {
        name: breedName,
        type: breedType
    };
    breedArr.push(newBreed);
    saveToStorage();
    renderBreedTable();
    inputBreed.value = '';
    inputType.value = 'Select Type';
});

function deleteBreed(index) {
    if (confirm('Bạn có chắc muốn xóa breed này không?')) {
        breedArr.splice(index, 1);
        saveToStorage();
        renderBreedTable();
    }
}
renderBreedTable();