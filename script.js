document.getElementById('year').textContent = new Date().getFullYear();

// منوی موبایل
const menuToggle=document.getElementById('menuToggle');
const primaryNav=document.getElementById('primaryNav');
if(menuToggle&&primaryNav){
  menuToggle.addEventListener('click',()=>{
    const isOpen=primaryNav.classList.toggle('open');
    menuToggle.setAttribute('aria-expanded',String(isOpen));
  });
}

// تغییر تم
const themeToggle=document.getElementById('themeToggle');
if(themeToggle){
  themeToggle.addEventListener('click',()=>{
    const isDark=document.documentElement.dataset.theme==='dark';
    document.documentElement.dataset.theme=isDark?'light':'dark';
    if(!isDark){
      document.body.style.setProperty('--bg','#0b0b10');
      document.body.style.setProperty('--fg','#e5e7eb');
      document.body.style.setProperty('--card','#11121a');
      document.body.style.setProperty('--border','#27272a');
    }else{
      document.body.style.setProperty('--bg','#ffffff');
      document.body.style.setProperty('--fg','#1b1b1f');
      document.body.style.setProperty('--card','#f6f6f7');
      document.body.style.setProperty('--border','#e5e7eb');
    }
  });
}

// لود محصولات از فایل JSON و جستجو/فیلتر
const grid=document.getElementById('productGrid');
const searchInput=document.getElementById('searchInput');
const categoryFilter=document.getElementById('categoryFilter');
const searchBtn=document.getElementById('searchBtn');

let allProducts=[];

async function loadProducts(){
  try{
    const res=await fetch('products.json');
    const data=await res.json();
    allProducts=data.products||[];
    render(allProducts);
  }catch(e){
    grid.innerHTML='<p>خطا در خواندن محصولات.</p>';
  }
}

function toTomans(n){
  try{ return new Intl.NumberFormat('fa-IR').format(n) + ' تومان'; }catch(e){ return n + ' تومان'; }
}

function cardTpl(p){
  return `<article class="card product-card" data-category="${p.category}">
    <img src="${p.image||'assets/placeholder.jpg'}" alt="${p.title}">
    <h3>${p.title}</h3>
    <div class="badge">${p.brand}</div>
    <div class="price">${toTomans(p.price)}</div>
    <p>${p.specs||''}</p>
    <div>
      <a class="btn primary" href="https://wa.me/989051526381?text=${encodeURIComponent('سلام، برای '+p.title+' موجودی و قیمت؟')}" target="_blank" rel="noopener">سفارش در واتساپ</a>
    </div>
  </article>`;
}

function render(list){
  if(!list.length){ grid.innerHTML='<p>محصولی یافت نشد.</p>'; return; }
  grid.innerHTML=list.map(cardTpl).join('');
}

function applyFilters(){
  const q=(searchInput.value||'').trim().toLowerCase();
  const cat=(categoryFilter.value||'').trim();
  const filtered=allProducts.filter(p=>{
    const text=(p.title+' '+(p.specs||'')+' '+(p.brand||'')+' '+(p.category||'')).toLowerCase();
    const matchQ=q?text.includes(q):true;
    const matchCat=cat? (p.category===cat):true;
    return matchQ && matchCat;
  });
  render(filtered);
}

searchBtn.addEventListener('click',applyFilters);
searchInput.addEventListener('keydown',e=>{ if(e.key==='Enter'){ applyFilters(); } });
categoryFilter.addEventListener('change',applyFilters);

loadProducts();
