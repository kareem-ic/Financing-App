// Retrieve the "Calculate" button element by its ID and assign it to the variable `submitBtn`
let submitBtn = document.getElementById("submit-btn");
submitBtn.addEventListener("click", submitForm1);



// Function to handle the calculation of budget allocations (Needs, Wants, and Savings)
function submitForm1(event){
    event.preventDefault();

 // Retrieve the user's monthly income input by its ID and store it in the variable `incomeElem`
    let incomeElem = document.getElementById("income");

// Get the value from the income input field and store it in the variable `income`
    let income = incomeElem.value;

// Calculate and display the amount allocated for Needs (50% of income)
    let needs = document.getElementById("needs_txt");
    needs.innerHTML = `$${Math.round((income / 2) * 100)/100}`;

// Calculate and display the amount allocated for Wants (30% of income)
    let wants = document.getElementById("wants_txt");
    wants.innerHTML = `$${Math.round((income * 0.3) * 100)/100}`;

// Calculate and display the amount allocated for Savings (20% of income)
    let savings = document.getElementById("savings_txt");
    savings.innerHTML = `$${Math.round((income * 0.2) * 100)/100}`;


}






///THIS IS FOR THE GOALS SECTION////
// Retrieve the "Add Item" button element by its ID and assign it to the variable `checkBtn`
let checkBtn = document.getElementById("submit-btn_2");

// Retrieve the input field for the price of the item by its ID and assign it to the variable `n1Elem`
let n1Elem = document.getElementById("price_stuff");

// Retrieve the element that displays the total cost and assign it to the variable `totalCost`
let totalCost = document.getElementById("total_cost");

// Retrieve the "Update Cost" button element by its ID and add an event listener to trigger `submitForm2` when clicked
let submit = document.getElementById("submit-btn_3");
submit.addEventListener("click", submitForm2);

// Retrieve the "Reset Cost" button element by its ID and add an event listener to trigger `submitForm3` when clicked
let reset_global = document.getElementById("submit-btn_4");
reset_global.addEventListener("click", submitForm3);

// Add an event listener to the price input field that triggers the `updateValue` function whenever the input changes
n1Elem.addEventListener('change', updateValue);

// Initialize a global variable to keep track of the running total of costs
let reset_variable = 0;


// Function to update the displayed total cost when the price of an item changes
function updateValue(e) {
    totalCost.textContent = e.target.value;
}




checkBtn.onclick = (event) => {
    event.preventDefault();

// Retrieve the value of the item the user wants to buy and its price
    let stuffElem = document.querySelector("#stuff");
    let priceStuffElem = document.querySelector("#price_stuff");


    let formData = {
        stuff: stuffElem.value,
        priceStuff: priceStuffElem.value,
    }


    let addedUser = new User(formData.stuff, formData.priceStuff);
    let userElem = addedUser.makeHTML();


    let userContainer = document.getElementById("user-container");
    userContainer.append(userElem);
}



// Class to represent a User's goal item
class User {
    constructor(stuff, priceStuff) {
        this.stuff = stuff;
        this.priceStuff = priceStuff;
    }

// Function to generate HTML structure for the user's goal item
    makeHTML() {
        let parentDiv = document.createElement("div");
        parentDiv.classList.add("user-item");


        let h2Elem = document.createElement("h2");
        h2Elem.classList.add("sub_item");
        h2Elem.innerHTML = this.stuff;


        parentDiv.append(h2Elem);


        let h2Elem2 = document.createElement("h2");
        h2Elem2.classList.add("sub_item_2");
        h2Elem2.innerHTML = "Price: $" + this.priceStuff;


        parentDiv.append(h2Elem2);




        return parentDiv;
    }
}





// Function to update the total cost by adding the new item price to the existing total
function submitForm2(event) {
    event.preventDefault();


    let user_item = document.getElementsByClassName("sub_item")


    reset_variable = 0;  


    let stuffElem = document.querySelector("#stuff");
    let stuff = stuffElem.value;
   
        for (let i = 0; i < user_item.length; i++) {
            let n1 = n1Elem.value;
            let n2 = Number(n1)




            totalCost.innerHTML = `$${(n2 + reset_variable)}`;
            reset_variable = n2 + reset_variable;
        }

// If the item name is not empty, update the total cost
     if(stuff != stuff) {
        for (let i = 0; i < user_item.length; i++) {
            let n1 = n1Elem.value;
            let n2 = Number(n1)


            totalCost.innerHTML = `$${(n2 + reset_variable)}`;
            reset_variable = n2 + reset_variable;
        }
    }
 
 
}


function submitForm3(event) {
    event.preventDefault();


    reset_variable = 0;
    totalCost.innerHTML = 0;
}

// Budget Calculator
document.addEventListener('DOMContentLoaded', function() {
    const budgetForm = document.getElementById('budget-form');
    const loanForm = document.getElementById('loan-form');

    if (budgetForm) {
        budgetForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const income = parseFloat(document.getElementById('income').value);
            
            if (isNaN(income) || income <= 0) {
                alert('Please enter a valid income amount');
                return;
            }

            const needs = income * 0.5;
            const wants = income * 0.3;
            const savings = income * 0.2;

            document.getElementById('needs-amount').textContent = formatCurrency(needs);
            document.getElementById('wants-amount').textContent = formatCurrency(wants);
            document.getElementById('savings-amount').textContent = formatCurrency(savings);
        });
    }

    if (loanForm) {
        loanForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const loanAmount = parseFloat(document.getElementById('loan-amount').value);
            const interestRate = parseFloat(document.getElementById('interest-rate').value) / 100;
            const loanTerm = parseFloat(document.getElementById('loan-term').value);

            if (isNaN(loanAmount) || isNaN(interestRate) || isNaN(loanTerm) || 
                loanAmount <= 0 || interestRate <= 0 || loanTerm <= 0) {
                alert('Please enter valid values for all fields');
                return;
            }

            // Calculate monthly payment using the loan payment formula
            const monthlyRate = interestRate / 12;
            const numberOfPayments = loanTerm * 12;
            const monthlyPayment = (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) / 
                                 (Math.pow(1 + monthlyRate, numberOfPayments) - 1);
            
            const totalCost = monthlyPayment * numberOfPayments;
            const totalInterest = totalCost - loanAmount;

            document.getElementById('monthly-payment').textContent = formatCurrency(monthlyPayment);
            document.getElementById('total-interest').textContent = formatCurrency(totalInterest);
            document.getElementById('total-cost').textContent = formatCurrency(totalCost);
        });
    }
});

// Helper function to format currency
function formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(amount);
}

// Goals Tracking
document.addEventListener('DOMContentLoaded', function() {
    const goalForm = document.getElementById('goal-form');
    const goalsContainer = document.getElementById('goals-container');
    const filterButtons = document.querySelectorAll('.filter-btn');
    
    // Load goals from localStorage
    let goals = JSON.parse(localStorage.getItem('goals')) || [];
    
    if (goalForm) {
        goalForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const newGoal = {
                id: Date.now(),
                name: document.getElementById('goal-name').value,
                targetAmount: parseFloat(document.getElementById('goal-amount').value),
                currentAmount: 0,
                deadline: document.getElementById('goal-deadline').value,
                category: document.getElementById('goal-category').value,
                createdAt: new Date().toISOString()
            };
            
            goals.push(newGoal);
            saveGoals();
            renderGoals();
            goalForm.reset();
        });
    }
    
    // Filter buttons functionality
    if (filterButtons.length > 0) {
        filterButtons.forEach(button => {
            button.addEventListener('click', function() {
                const filter = this.dataset.filter;
                
                // Update active button
                filterButtons.forEach(btn => btn.classList.remove('active'));
                this.classList.add('active');
                
                // Filter goals
                const filteredGoals = filter === 'all' 
                    ? goals 
                    : goals.filter(goal => goal.category === filter);
                
                renderGoals(filteredGoals);
            });
        });
    }
    
    // Render goals
    function renderGoals(goalsToRender = goals) {
        if (!goalsContainer) return;
        
        goalsContainer.innerHTML = '';
        const template = document.getElementById('goal-template');
        
        goalsToRender.forEach(goal => {
            const goalElement = template.content.cloneNode(true);
            
            // Set goal details
            goalElement.querySelector('.goal-name').textContent = goal.name;
            goalElement.querySelector('.goal-category').textContent = goal.category;
            goalElement.querySelector('.goal-deadline').textContent = `Target: ${formatDate(goal.deadline)}`;
            
            // Set progress
            const progress = (goal.currentAmount / goal.targetAmount) * 100;
            goalElement.querySelector('.progress-fill').style.width = `${Math.min(progress, 100)}%`;
            goalElement.querySelector('.current-amount').textContent = formatCurrency(goal.currentAmount);
            goalElement.querySelector('.target-amount').textContent = `of ${formatCurrency(goal.targetAmount)}`;
            
            // Add event listeners
            const updateBtn = goalElement.querySelector('.update-progress-btn');
            const deleteBtn = goalElement.querySelector('.delete-goal-btn');
            
            updateBtn.addEventListener('click', () => updateGoalProgress(goal.id));
            deleteBtn.addEventListener('click', () => deleteGoal(goal.id));
            
            goalsContainer.appendChild(goalElement);
        });
    }
    
    // Update goal progress
    function updateGoalProgress(goalId) {
        const goal = goals.find(g => g.id === goalId);
        if (!goal) return;
        
        const newAmount = prompt('Enter new amount saved:', goal.currentAmount);
        if (newAmount === null) return;
        
        const amount = parseFloat(newAmount);
        if (isNaN(amount) || amount < 0) {
            alert('Please enter a valid amount');
            return;
        }
        
        goal.currentAmount = amount;
        saveGoals();
        renderGoals();
    }
    
    // Delete goal
    function deleteGoal(goalId) {
        if (confirm('Are you sure you want to delete this goal?')) {
            goals = goals.filter(g => g.id !== goalId);
            saveGoals();
            renderGoals();
        }
    }
    
    // Save goals to localStorage
    function saveGoals() {
        localStorage.setItem('goals', JSON.stringify(goals));
    }
    
    // Format date
    function formatDate(dateString) {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }
    
    // Initial render
    renderGoals();
});