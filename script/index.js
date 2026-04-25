const catagoriesContainer=document.getElementById("catagoriesContainer");
const treesContainer=document.getElementById("treesContainer");
async function loadCatagories(){
    const res=await fetch("https://openapi.programming-hero.com/api/categories");
    const data=await res.json();
    data.categories.forEach((category)=>{
        const btn=document.createElement("button");
        btn.className="btn btn-outline w-full";
        btn.innerHTML=category.category_name;
        catagoriesContainer.appendChild(btn);
    });
}
async function loadTrees(){
    const res=await fetch("https://openapi.programming-hero.com/api/plants");
    const data=await res.json();
    displayTrees(data.plants);

}
function displayTrees(trees){
    trees.forEach((tree)=>{
        const card=document.createElement("div");
        card.className="card bg-white shadow-sm";
        card.innerHTML=`
        <figure>
                    <img class="w-full h-48 object-cover" src="${tree.image}" alt="${tree.name}" />
                </figure>
                <div class="card-body">
                    <h2 class="card-title">${tree.name}</h2>
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
loadCatagories();
loadTrees();

