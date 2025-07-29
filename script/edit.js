'use strict';
const tableBodyEl = document.getElementById("tbody");
const formEl = document.getElementById("container-form");
const btnSubmit = document.getElementById("submit-btn");
const sidebarTitleEl = document.getElementById('sidebar-title');
const sidebarEl = document.getElementById('sidebar');
sidebarTitleEl.addEventListener('click', function() {
    sidebarEl.classList.toggle('active');
});
const petArr = getFromStorage("petArr", []);
const breedArr = getFromStorage("breedArr", []);
renderTable(petArr);

function renderTable(petList) {
    tableBodyEl.innerHTML = "";
    petList.forEach(pet => {
        const row = document.createElement("tr");
        row.innerHTML = `
      <td>${pet.id}</td>
      <td>${pet.name}</td>
      <td>${pet.age}</td>
      <td>${pet.type}</td>
      <td>${pet.weight} kg</td>
      <td>${pet.length} cm</td>
      <td>${pet.breed}</td>
      <td><i class="bi bi-square-fill" style="color: ${pet.color};"></i></td>
      <td><i class="bi ${pet.vaccinated ? 'bi-check-circle-fill' : 'bi-x-circle-fill'}"></i></td>
      <td><i class="bi ${pet.dewormed ? 'bi-check-circle-fill' : 'bi-x-circle-fill'}"></i></td>
      <td><i class="bi ${pet.sterilized ? 'bi-check-circle-fill' : 'bi-x-circle-fill'}"></i></td>
      <td>${pet.date}</td>
      <td><button class="btn btn-warning btn-sm" onclick="startEditPet('${pet.id}')">Edit</button></td>
    `;
        tableBodyEl.appendChild(row);
    });
}

function startEditPet(petId) {
    const pet = petArr.find(p => p.id === petId);
    if (!pet) return;

    formEl.classList.remove("hide");
    document.getElementById("input-id").value = pet.id;
    document.getElementById("input-name").value = pet.name;
    document.getElementById("input-age").value = pet.age;
    document.getElementById("input-type").value = pet.type;
    document.getElementById("input-weight").value = pet.weight;
    document.getElementById("input-length").value = pet.length;
    document.getElementById("input-color-1").value = pet.color;
    document.getElementById("input-vaccinated").checked = pet.vaccinated;
    document.getElementById("input-dewormed").checked = pet.dewormed;
    document.getElementById("input-sterilized").checked = pet.sterilized;
    renderBreedOptions(pet.type);
    document.getElementById("input-breed").value = pet.breed;
    currentEditingId = pet.id;
}
document.getElementById("input-type").addEventListener("change", function() {
    renderBreedOptions(this.value);
});

function renderBreedOptions(type) {
    const breedInput = document.getElementById("input-breed");
    breedInput.innerHTML = "<option>Select Breed</option>";

    const filtered = breedArr.filter(breed => breed.type === type);
    filtered.forEach(breed => {
        const option = document.createElement("option");
        option.value = breed.name;
        option.textContent = breed.name;
        breedInput.appendChild(option);
    });
}
let currentEditingId = null;

btnSubmit.addEventListener("click", function() {
    const name = document.getElementById("input-name").value;
    const age = +document.getElementById("input-age").value;
    const type = document.getElementById("input-type").value;
    const weight = +document.getElementById("input-weight").value;
    const length = +document.getElementById("input-length").value;
    const color = document.getElementById("input-color-1").value;
    const breed = document.getElementById("input-breed").value;
    const vaccinated = document.getElementById("input-vaccinated").checked;
    const dewormed = document.getElementById("input-dewormed").checked;
    const sterilized = document.getElementById("input-sterilized").checked;

    if (!name || type === "Select Type" || breed === "Select Breed") {
        alert("Vui lòng nhập đầy đủ thông tin.");
        return;
    }
    if (age < 1 || age > 15 || weight < 1 || weight > 15 || length < 1 || length > 100) {
        alert("Giá trị tuổi, cân nặng, chiều dài không hợp lệ.");
        return;
    }
    const index = petArr.findIndex(p => p.id === currentEditingId);
    if (index !== -1) {
        petArr[index] = {
            ...petArr[index],
            name,
            age,
            type,
            weight,
            length,
            color,
            breed,
            vaccinated,
            dewormed,
            sterilized,
            date: petArr[index].date || new Date().toLocaleDateString()
        };

        saveToStorage("petArr", petArr);
        alert("Cập nhật thành công!");
        formEl.classList.add("hide");
        currentEditingId = null;
        renderTable(petArr);
    }
});

function saveToStorage(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
}

function getFromStorage(key, defaultVal = []) {
    const str = localStorage.getItem(key);
    return str ? JSON.parse(str) : defaultVal;
}