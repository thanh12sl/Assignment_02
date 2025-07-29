'use strict';
document.addEventListener('DOMContentLoaded', function() {
    let petArr = JSON.parse(localStorage.getItem('petArr')) || [];
    let healthyPetArr = [];
    let healthyCheck = false;
    const healthyBtn = document.getElementById('healthy-btn');
    const submitBtn = document.getElementById("submit-btn");
    const idInput = document.getElementById("input-id");
    const nameInput = document.getElementById("input-name");
    const ageInput = document.getElementById("input-age");
    const typeInput = document.getElementById("input-type");
    const weightInput = document.getElementById("input-weight");
    const lengthInput = document.getElementById("input-length");
    const colorInput = document.getElementById("input-color-1");
    const breedInput = document.getElementById("input-breed");
    const vaccinatedInput = document.getElementById("input-vaccinated");
    const dewormedInput = document.getElementById("input-dewormed");
    const sterilizedInput = document.getElementById("input-sterilized");
    const tableBodyEl = document.getElementById('tbody');
    const calbtn = document.getElementById('cal-btn');
    const breedSelect = document.getElementById('input-breed');
    // Validate dữ liệu
    function validateData(data) {
        let isValid = true;
        let errorMsg = '';
        console.log('Validating data:', data);
        if (!data.id) {
            errorMsg += 'ID must not be empty!\n';
            isValid = false;
        } else if (petArr.some(pet => pet.id === data.id)) {
            errorMsg += 'ID must be unique!\n';
            console.log('ID already exists in petArr:', data.id, 'petArr:', petArr);
            isValid = false;
        }

        if (!data.name) {
            errorMsg += 'Name must not be empty!\n';
            isValid = false;
        }

        if (isNaN(data.age) || data.age < 1 || data.age > 15) {
            errorMsg += 'Age must be between 1 and 15!\n';
            console.log('Age validation failed:', data.age);
            isValid = false;
        }

        if (data.type === 'Select Type') {
            errorMsg += 'Please select Type!\n';
            isValid = false;
        }

        if (isNaN(data.weight) || data.weight < 1 || data.weight > 15) {
            errorMsg += 'Weight must be between 1 and 15!\n';
            isValid = false;
        }

        if (isNaN(data.length) || data.length < 1 || data.length > 100) {
            errorMsg += 'Length must be between 1 and 100!\n';
            isValid = false;
        }

        if (data.breed === 'Select Breed') {
            errorMsg += 'Please select Breed!\n';
            isValid = false;
        }

        if (!data.color) {
            errorMsg += 'Color must not be empty!\n';
            isValid = false;
        }

        if (!isValid) {
            alert(errorMsg);
        }

        return isValid;
    }
    // Hiển thị danh sách thú cưng
    function renderTableData(petList) {
        if (!tableBodyEl) {
            console.error('tableBodyEl is null. Check if element with id="tbody" exists in HTML.');
            return;
        }

        console.log('Rendering table with petList:', petList);
        tableBodyEl.innerHTML = '';

        petList.forEach(pet => {
            const row = document.createElement('tr');
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
                <td>${pet.bmi ?? "?"}</td>
                <td>${pet.dateAdded}</td>
                <td><button class="btn btn-danger">Delete</button></td>
            `;
            const deleteBtn = row.querySelector('button');
            deleteBtn.addEventListener('click', () => deletePet(pet.id));
            tableBodyEl.appendChild(row);
        });
    }
    // Xóa dữ liệu trong form
    const clearInput = () => {
        idInput.value = '';
        nameInput.value = '';
        ageInput.value = '';
        typeInput.value = 'Select Type';
        weightInput.value = '';
        lengthInput.value = '';
        colorInput.value = '#000000';
        breedInput.value = 'Select Breed';
        vaccinatedInput.checked = false;
        dewormedInput.checked = false;
        sterilizedInput.checked = false;
    };
    // Xoá thú cưng
    const deletePet = (petId) => {
        if (confirm('Are you sure?')) {
            const index = petArr.findIndex(pet => pet.id === petId);
            if (index !== -1) {
                petArr.splice(index, 1);
                localStorage.setItem('petArr', JSON.stringify(petArr));
                alert('Pet deleted successfully!');
                if (healthyCheck) {
                    healthyPetArr = petArr.filter(pet => pet.vaccinated && pet.dewormed && pet.sterilized);
                    renderTableData(healthyPetArr);
                } else {
                    renderTableData(petArr);
                }
            } else {
                console.log('Pet with ID', petId, 'not found in petArr');
            }
        }
    };

    function calculateBMI() {
        petArr.forEach(pet => {
            if (pet.weight && pet.length && !pet.bmi) {
                let bmi;
                if (pet.type.toLowerCase() === 'dog') {
                    bmi = (pet.weight * 703) / (pet.length ** 2);
                } else if (pet.type.toLowerCase() === 'cat') {
                    bmi = (pet.weight * 886) / (pet.length ** 2);
                }
                pet.bmi = bmi ? parseFloat(bmi.toFixed(2)) : '?';
            }
        });
        localStorage.setItem('petArr', JSON.stringify(petArr));
        if (healthyCheck) {
            healthyPetArr = petArr.filter(pet => pet.vaccinated && pet.dewormed && pet.sterilized);
            renderTableData(healthyPetArr);
        } else {
            renderTableData(petArr);
        }
    }
    submitBtn.addEventListener('click', function() {

        const data = {
            id: idInput.value.trim(),
            name: nameInput.value.trim(),
            age: parseInt(ageInput.value),
            type: typeInput.value,
            weight: parseFloat(weightInput.value),
            length: parseFloat(lengthInput.value),
            color: colorInput.value,
            breed: breedInput.value,
            vaccinated: vaccinatedInput.checked,
            dewormed: dewormedInput.checked,
            sterilized: sterilizedInput.checked,
            bmi: '?',
            dateAdded: new Date().toLocaleDateString('en-GB')
        };
        console.log('Data:', data);
        const validate = validateData(data);
        console.log('Validate result:', validate);
        if (validate) {
            petArr.push(data);
            saveToStorage('petArr', JSON.stringify(petArr));
            renderTableData(petArr);
            console.log('petArr after push:', petArr);
            clearInput();
            console.log('Form cleared');
            if (healthyCheck) {
                healthyPetArr = petArr.filter(pet => pet.vaccinated && pet.dewormed && pet.sterilized);
                renderTableData(healthyPetArr);
            } else {
                renderTableData(petArr);
            }
        }
    });
    healthyBtn.addEventListener('click', function() {
        healthyCheck = !healthyCheck;
        if (healthyCheck) {
            healthyPetArr = petArr.filter(pet => pet.vaccinated && pet.dewormed && pet.sterilized);
            healthyBtn.textContent = 'Show All Pet';
            renderTableData(healthyPetArr);
        } else {
            healthyBtn.textContent = 'Show Healthy Pet';
            renderTableData(petArr);
        }
    });
    calbtn.addEventListener('click', function() {
        calculateBMI();
    });
    if (healthyCheck) {
        healthyPetArr = petArr.filter(pet => pet.vaccinated && pet.dewormed && pet.sterilized);
        renderTableData(healthyPetArr);
    } else {
        renderTableData(petArr);
    }
    // Animation for side bar
    const sidebarTitleEl = document.getElementById('sidebar-title');
    const sidebarEl = document.getElementById('sidebar');
    sidebarTitleEl.addEventListener('click', function() {
        sidebarEl.classList.toggle('active');
    });

    function renderBreed(breedList) {
        const breedInput = document.getElementById('input-breed');
        breedInput.innerHTML = '<option>Select Breed</option>';
        breedList.forEach(breed => {
            const option = document.createElement('option');
            option.innerText = breed.name;
            option.value = breed.name;
            breedInput.appendChild(option);
        });
    }

    typeInput.addEventListener('change', function() {
        const selectedType = this.value;
        const breedArr = JSON.parse(localStorage.getItem('breedArr')) || [];
        const filteredBreeds = breedArr.filter(breed => breed.type === selectedType);
        renderBreed(filteredBreeds);
    });


    if (typeInput.value !== 'Select Type') {
        const breedArr = JSON.parse(localStorage.getItem('breedArr')) || [];
        const filteredBreeds = breedArr.filter(breed => breed.type === typeInput.value);
        renderBreed(filteredBreeds);
    }
});