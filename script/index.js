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
async function loadTrees(){
    showLoading();
    const res=await fetch("https://openapi.programming-hero.com/api/plants");
    const data=await res.json();
    displayTrees(data.plants);
    console.log(data.plants);
    hideLoading();

}
function displayTrees(trees){
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
                            <button class="btn btn-soft btn-success rounded-[100px]">Add to Cart</button>
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
loadCatagories();
loadTrees();

