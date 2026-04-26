const catagoriesContainer=document.getElementById("catagoriesContainer");
const treesContainer=document.getElementById("treesContainer");
const loadSpinner=document.getElementById("loadSpinner");
const allTreesbtn=document.getElementById("allTreesbtn");
const treeDetailsModal=document.getElementById("tree-details-modal");
const modalImage = document.getElementById("modalImage");
const modalCategory = document.getElementById("modalCategory");
const modalDescription = document.getElementById("modalDescription");
const modalPrice = document.getElementById("modalPrice");
const modalTitle = document.getElementById("modalTitle");
let cart = JSON.parse(localStorage.getItem("cart")) || [];
const cartContainer = document.getElementById("cartContainer");
const totalPrice = document.getElementById("totalPrice");
const emptyCartMessage = document.getElementById("emptyCartMessage");
let allTrees = [];

async function loadCatagories(){
    const res=await fetch("https://openapi.programming-hero.com/api/categories");
    const data=await res.json();
    data.categories.forEach((category)=>{
        const btn=document.createElement("button");
        btn.className="btn btn-outline w-full";
        btn.textContent=category.category_name;
        btn.onclick=()=>selectCatagories(category.id, btn); 
        catagoriesContainer.appendChild(btn);
    });
    
}
async function selectCatagories(categoryId, button){
        showLoading();
        const allbuttons=document.querySelectorAll("#catagoriesContainer button, #allTreesbtn");
        allbuttons.forEach((btn)=>{
            btn.classList.remove("btn-success");
            btn.classList.add("btn-outline");
        });
        button.classList.add("btn-success");
        button.classList.remove("btn-outline");
        const res = await fetch(`https://openapi.programming-hero.com/api/category/${categoryId}`);
      const data = await res.json();

    displayTrees(data.plants);
    hideLoading();
    }

function showLoading() {
  loadSpinner.classList.remove("hidden");
  loadSpinner.classList.add("flex"); 
  treesContainer.innerHTML = "";
}
function hideLoading() {
  loadSpinner.classList.add("hidden");
  loadSpinner.classList.remove("flex");
}
allTreesbtn.addEventListener("click", () => {
  // Update active button style
  const allButtons = document.querySelectorAll(
    "#catagoriesContainer button, #allTreesbtn",
  );
  //   console.log(allButtons);
  allButtons.forEach((btn) => {
    btn.classList.remove("btn-success");
    btn.classList.add("btn-outline");
  });

  allTreesbtn.classList.add("btn-success");
  allTreesbtn.classList.remove("btn-outline");

  loadTrees();
});
async function loadTrees() {
  try {
    showLoading();

    const res = await fetch("https://openapi.programming-hero.com/api/plants");
    const data = await res.json();
    allTrees = data.plants;
    displayTrees(allTrees);

  } catch (err) {
    console.log("Error loading trees:", err);
  } finally {
    hideLoading();
  }
}
function displayTrees(trees){
    if (trees.length === 0) {
  treesContainer.innerHTML = `
    <p class="text-center col-span-full text-gray-500">
      No trees found 😢
    </p>
  `;
  return;
}
    treesContainer.innerHTML = "";
    trees.forEach((tree)=>{
        const card=document.createElement("div");
        card.className="card bg-white shadow-sm";
        card.innerHTML=`
        <figure>
                    <img class="w-full h-48 object-cover" src="${tree.image}" alt="${tree.name}" onclick="openTreeModal(${tree.id})" />
                </figure>
                <div class="card-body">
                    <h2 class="card-title cursor-pointer hover:text-[#4ade80]" onclick="openTreeModal(${tree.id})">${tree.name}</h2>
                    <p class="line-clamp-2">${tree.description}</p>
                    <div class="flex justify-between mt-3 mb-3">
                            <button 
  class="btn btn-soft btn-success rounded-full"
  onclick="addToCart(${tree.id}, '${tree.name}', ${tree.price}, this)"
>
  Add to Cart
</button>
                        <div class="font-bold">$${tree.price}</div>
                    </div>
                    <div class="card-actions justify-end">
                        <button class="btn btn-success w-full text-[#FFFF] rounded-[100px]">Buy Now</button>
                    </div>
                </div>
        `
        treesContainer.appendChild(card);
    });
}
async function openTreeModal(treeId){
     const res = await fetch(
    `https://openapi.programming-hero.com/api/plant/${treeId}`,
  );
  const data = await res.json();
  const plantDetails = data.plants;
  modalTitle.textContent = plantDetails.name;
  modalImage.src = plantDetails.image;
  modalCategory.textContent = plantDetails.category;
  modalDescription.textContent = plantDetails.description;
  modalPrice.textContent = plantDetails.price;
  treeDetailsModal.showModal();
}
function addToCart(id, name, price, btn) {
  const existingItem = cart.find((item) => item.id === id);

  if (existingItem) {
    existingItem.quantity++;
  } else {
    cart.push({ id, name, price, quantity: 1 });
  }

  btn.textContent = "Added ✓";
  btn.disabled = true;

  setTimeout(() => {
    btn.textContent = "Add to Cart";
    btn.disabled = false;
  }, 1500);

  updateCart();
}
function updateCart() {
  cartContainer.innerHTML = "";

  if (cart.length === 0) {
    emptyCartMessage.classList.remove("hidden");
    totalPrice.textContent = `$0`;
    return;
  }

  emptyCartMessage.classList.add("hidden");

  let total = 0;

  cart.forEach((item) => {
    total += item.price * item.quantity;

    const div = document.createElement("div");
    div.className = "card card-body bg-slate-100";

    div.innerHTML = `
      <div class="flex justify-between items-center">
        <div>
          <h2 class="font-bold">${item.name}</h2>
          <p>$${item.price}</p>
        </div>

        <div class="flex items-center gap-2">
          <button class="btn btn-sm" onclick="changeQty(${item.id}, -1)">-</button>
          <span>${item.quantity}</span>
          <button class="btn btn-sm" onclick="changeQty(${item.id}, 1)">+</button>
        </div>

        <button class="btn btn-ghost text-red-500" onclick="removeFromCart(${item.id})">✕</button>
      </div>
    `;

    cartContainer.appendChild(div);
  });

  totalPrice.textContent = `$${total}`;

  // save to localStorage
  localStorage.setItem("cart", JSON.stringify(cart));
}

function changeQty(id, amount) {
  const item = cart.find((i) => i.id === id);
  if (!item) return;

  item.quantity += amount;

  if (item.quantity <= 0) {
    cart = cart.filter((i) => i.id !== id);
  }

  updateCart();
}

function removeFromCart(treeId) {
  const updatedCartElements = cart.filter((item) => item.id != treeId);
  cart = updatedCartElements;
  updateCart();
}
const searchInput = document.getElementById("searchInput");

searchInput.addEventListener("input", () => {
  const value = searchInput.value.toLowerCase();

  const filtered = allTrees.filter(tree =>
    tree.name.toLowerCase().includes(value)
  );

  displayTrees(filtered);
});

const counters = document.querySelectorAll(".counter");

counters.forEach(counter => {
  const update = () => {
    const target = +counter.getAttribute("data-target");
    const current = +counter.innerText;

    const increment = target / 100;

    if (current < target) {
      counter.innerText = Math.ceil(current + increment);
      setTimeout(update, 20);
    } else {
      counter.innerText = target.toLocaleString() + "+";
    }
  };

  update();
});
const form = document.getElementById("donationForm");
const successMsg = document.getElementById("successMsg");

form.addEventListener("submit", (e) => {
  e.preventDefault();

  successMsg.classList.remove("hidden");

  form.reset();

  setTimeout(() => {
    successMsg.classList.add("hidden");
  }, 3000);
});
const paymentModal = document.getElementById("paymentModal");
const paymentStatus = document.getElementById("paymentStatus");

function openPaymentModal() {
  paymentModal.showModal();
}

function processPayment() {
  paymentStatus.classList.remove("hidden");

  setTimeout(() => {
    paymentStatus.textContent = "🎉 Payment Completed Successfully!";
  }, 1000);

  setTimeout(() => {
    paymentModal.close();
    paymentStatus.classList.add("hidden");
  }, 2500);
}


loadCatagories();
loadTrees();
updateCart();

