const catagoriesContainer=document.getElementById("catagoriesContainer");
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
loadCatagories();

