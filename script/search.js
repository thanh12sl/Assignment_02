'use strict';
const btnFind = document.getElementById("find-btn");
const inputId = document.getElementById("input-id");
const inputName = document.getElementById("input-name");
const inputType = document.getElementById("input-type");
const inputBreed = document.getElementById("input-breed");
const inputVaccinated = document.getElementById("input-vaccinated");
const inputDewormed = document.getElementById("input-dewormed");
const inputSterilized = document.getElementById("input-sterilized");
const tableBodyEl = document.getElementById("tbody");
const sidebarTitleEl = document.getElementById('sidebar-title');
const sidebarEl = document.getElementById('sidebar');
sidebarTitleEl.addEventListener('click', function() {
    sidebarEl.classList.toggle('active');
});
const petArr = getFromStorage("petArr", []);
const breedArr = getFromStorage("breedArr", []);

function renderBreedOptions() {
    inputBreed.innerHTML = '<option>Select Breed</option>';
    breedArr.forEach(breed => {
        const option = document.createElement("option");
        option.value = breed.name;
        option.textContent = breed.name;
        inputBreed.appendChild(option);
    });
}
renderBreedOptions();
btnFind.addEventListener("click", function() {
    const idVal = inputId.value.trim().toLowerCase();
    const nameVal = inputName.value.trim().toLowerCase();
    const typeVal = inputType.value;
    const breedVal = inputBreed.value;
    const isVaccinated = inputVaccinated.checked;
    const isDewormed = inputDewormed.checked;
    const isSterilized = inputSterilized.checked;

    const result = petArr.filter(pet => {
        return (
            (idVal === "" || pet.id.toLowerCase().includes(idVal)) &&
            (nameVal === "" || pet.name.toLowerCase().includes(nameVal)) &&
            (typeVal === "Select Type" || pet.type === typeVal) &&
            (breedVal === "Select Breed" || pet.breed === breedVal) &&
            (!isVaccinated || pet.vaccinated === true) &&
            (!isDewormed || pet.dewormed === true) &&
            (!isSterilized || pet.sterilized === true)
        );
    });

    renderTable(result);
});

function renderTable(petList) {
    tableBodyEl.innerHTML = "";
    petList.forEach(pet => {
        const row = document.createElement("tr");
        row.innerHTML = `
      <td>${pet.id}</td>
      <td>${pet.name}</td>
      <td>${pet.age}</td>
      <td>${pet.type}</td>
      <td>${pet.weight}</td>
      <td>${pet.length}</td>
      <td>${pet.breed}</td>
      <td><i class="bi bi-square-fill" style="color: ${pet.color}"></i></td>
      <td><i class="bi ${pet.vaccinated ? 'bi-check-circle-fill' : 'bi-x-circle-fill'}"></i></td>
      <td><i class="bi ${pet.dewormed ? 'bi-check-circle-fill' : 'bi-x-circle-fill'}"></i></td>
      <td><i class="bi ${pet.sterilized ? 'bi-check-circle-fill' : 'bi-x-circle-fill'}"></i></td>
      <td>${pet.date}</td>
    `;
        tableBodyEl.appendChild(row);
    });
}

function getFromStorage(key, defaultVal = []) {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : defaultVal;
}