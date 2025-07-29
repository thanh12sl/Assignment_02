'use strict';
// Animation
const sidebarTitleEl = document.getElementById('sidebar-title');
const sidebarEl = document.getElementById('sidebar');
sidebarTitleEl.addEventListener('click', function() {
    sidebarEl.classList.toggle('active');
});
// Export
function downloadJSON(data, filename = 'pet-data.json') {
    const jsonStr = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();

    URL.revokeObjectURL(url);
}
document.getElementById('export-btn').addEventListener('click', function() {
    const petArr = JSON.parse(localStorage.getItem('petArr')) || [];

    if (petArr.length === 0) {
        alert('Không có dữ liệu thú cưng để xuất!');
        return;
    }

    downloadJSON(petArr, 'pet-data.json');
});
// Import
function handleFileImport(event) {
    const file = event.target.files[0];
    if (!file) {
        alert('Vui lòng chọn file JSON!');
        return;
    }

    const reader = new FileReader();

    reader.onload = function(e) {
        try {
            const importedData = JSON.parse(e.target.result);
            if (!Array.isArray(importedData)) {
                alert('File không đúng định dạng danh sách thú cưng!');
                return;
            }
            const existingPets = JSON.parse(localStorage.getItem('petArr')) || [];
            const petMap = new Map();
            existingPets.forEach(pet => petMap.set(pet.id, pet));
            importedData.forEach(pet => petMap.set(pet.id, pet));
            const updatedPetArr = Array.from(petMap.values());
            localStorage.setItem('petArr', JSON.stringify(updatedPetArr));

            alert('Import dữ liệu thành công! Bạn có thể quay lại danh sách thú cưng để kiểm tra.');
        } catch (err) {
            console.error('Lỗi khi đọc file JSON:', err);
            alert('File không hợp lệ hoặc bị lỗi!');
        }
    };

    reader.readAsText(file);
}
document.getElementById('import-btn').addEventListener('click', function() {
    const fileInput = document.getElementById('input-file');
    if (!fileInput.files.length) {
        alert('Vui lòng chọn file JSON để import!');
        return;
    }

    handleFileImport({ target: fileInput });
});