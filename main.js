const foodMap = {};
const mealItems = [];

// DOM Elements
const foodSelect = document.getElementById('food-select');
const weightContainer = document.getElementById('weight-input-container');
const portionInput = document.getElementById('portion-weight');
const addFoodBtn = document.getElementById('add-food-btn');
const selectedFoodsList = document.getElementById('selected-foods-list');

// Populate Select Dropdown from foodDatabase (from foods.js)
document.addEventListener('DOMContentLoaded', () => {
    foodDatabase.forEach(item => {
        foodMap[item.key] = item;
        const option = document.createElement('option');
        option.value = item.key;
        option.textContent = item.name;
        foodSelect.appendChild(option);
    });
});

// Handle Food Selection
foodSelect.addEventListener('change', () => {
    const selectedKey = foodSelect.value;
    if (selectedKey && foodMap[selectedKey]) {
        const basePortion = foodMap[selectedKey].portion;
        portionInput.placeholder = basePortion;
        portionInput.value = basePortion;
        weightContainer.classList.remove('hidden');
    }
});

// Add Item to Meal
addFoodBtn.addEventListener('click', () => {
    const selectedKey = foodSelect.value;
    if (!selectedKey) return;

    const baseFood = foodMap[selectedKey];
    const weight = parseFloat(portionInput.value) || baseFood.portion;

    const mealItem = {
        key: selectedKey,
        name: baseFood.name,
        weight: weight,
        basePortion: baseFood.portion,
        baseCalories: baseFood.calories,
        baseProtein: baseFood.protein,
        baseCarbs: baseFood.carbs,
        baseFat: baseFood.fat
    };

    mealItems.push(mealItem);
    renderMeal();

    // Reset Selector Form
    foodSelect.value = "";
    weightContainer.classList.add('hidden');
});

// Render Meal List & Recalculate Outcome
function renderMeal() {
    selectedFoodsList.innerHTML = '';

    let totalCal = 0, totalProt = 0, totalCarb = 0, totalFat = 0;

    mealItems.forEach((item, index) => {
        const factor = item.weight / item.basePortion;
        const cal = item.baseCalories * factor;
        const prot = item.baseProtein * factor;
        const carb = item.baseCarbs * factor;
        const fat = item.baseFat * factor;

        totalCal += cal;
        totalProt += prot;
        totalCarb += carb;
        totalFat += fat;

        const li = document.createElement('li');
        li.innerHTML = `
            <div>
                <strong>${item.name}</strong> - 
                <input type="number" value="${item.weight}" min="0" data-index="${index}" class="edit-weight-input"> g
            </div>
            <div>
                <small>(${cal.toFixed(1)} kcal | P: ${prot.toFixed(1)}g | C: ${carb.toFixed(1)}g | F: ${fat.toFixed(1)}g)</small>
                <button class="remove-btn" onclick="removeItem(${index})">Remove</button>
            </div>
        `;
        selectedFoodsList.appendChild(li);
    });

    // Update Totals
    document.getElementById('total-calories').textContent = totalCal.toFixed(1);
    document.getElementById('total-protein').textContent = totalProt.toFixed(1);
    document.getElementById('total-carbs').textContent = totalCarb.toFixed(1);
    document.getElementById('total-fat').textContent = totalFat.toFixed(1);

    // Dynamic Edit Listeners
    document.querySelectorAll('.edit-weight-input').forEach(input => {
        input.addEventListener('input', (e) => {
            const idx = e.target.getAttribute('data-index');
            const newWeight = parseFloat(e.target.value) || 0;
            mealItems[idx].weight = newWeight;
            renderMeal();
        });
    });
}

// Remove Item Function
function removeItem(index) {
    mealItems.splice(index, 1);
    renderMeal();
}