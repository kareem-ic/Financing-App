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