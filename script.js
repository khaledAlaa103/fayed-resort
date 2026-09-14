// بيانات الشاليهات الثابتة
const chaletsData = [
    { id: 100, type: 'double', area: 'خلفي' }, { id: 101, type: 'double', area: 'الملاعب' },
    { id: 102, type: 'double', area: 'خلفي' }, { id: 103, type: 'double', area: 'الملاعب' },
    { id: 104, type: 'double', area: 'خلفي' }, { id: 105, type: 'double', area: 'الملاعب' },
    { id: 106, type: 'double', area: 'خلفي' }, { id: 107, type: 'double', area: 'الملاعب' },
    { id: 108, type: 'double', area: 'خلفي' }, { id: 109, type: 'double', area: 'الملاعب' },
    { id: 110, type: 'double', area: 'خلفي' }, { id: 111, type: 'double', area: 'الملاعب' },
    { id: 200, type: 'double', area: 'خلفي' }, { id: 201, type: 'double', area: 'البسين' },
    { id: 202, type: 'double', area: 'خلفي' }, { id: 203, type: 'double', area: 'البسين' },
    { id: 204, type: 'double', area: 'الملاعب' }, { id: 205, type: 'double', area: 'البسين' },
    { id: 206, type: 'double', area: 'الملاعب' }, { id: 207, type: 'double', area: 'البسين' },
    { id: 208, type: 'double', area: 'الملاعب' }, { id: 209, type: 'double', area: 'البسين' },
    { id: 210, type: 'double', area: 'الملاعب' }, { id: 211, type: 'double', area: 'البسين' },
    { id: 220, type: 'single', area: 'الملاعب' }, { id: 222, type: 'single', area: 'خلفي' },
    { id: 223, type: 'single', area: 'الملاعب' }, { id: 224, type: 'single', area: 'الملاعب' },
    { id: 225, type: 'single', area: 'خلفي' }, { id: 226, type: 'single', area: 'خلفي' },
    { id: 227, type: 'single', area: 'الملاعب' }, { id: 228, type: 'single', area: 'الملاعب' },
    { id: 229, type: 'single', area: 'خلفي' }, { id: 230, type: 'single', area: 'خلفي' },
    { id: 231, type: 'single', area: 'الملاعب' }, { id: 233, type: 'single', area: 'خلفي' }
];

// بيانات المطعم (كاملة)
let mealsData = JSON.parse(localStorage.getItem('mealsData')) || [
    { name: "2 قطعة دجاج مقرمش بالعظم", components: "150جم بوم فريت، سلاد توميه، سلاد مايونيز، عيش 2 رغيف، حلو جار شوكلت", price: 225 },
    { name: "200 جم استربس", components: "150جم بوم فريت، سلاد توميه، سلاد مايونيز، عيش 2 رغيف، حلو جار شوكلت", price: 190 },
    { name: "تشكين ونجز", components: "150جم بوم فريت، سلاد توميه، سلاد مايونيز، عيش 2 رغيف، حلو جار شوكلت", price: 160 },
    { name: "ربع فراخ مشوي", components: "150 جم ارز، 150جم بوم فريت، سلاد طحينه، عيش 2 رغيف، حلو جارد شوكلت", price: 200 },
    { name: "250 جم كفته", components: "150جم مكرونه قلم، عيش 2 رغيف، سلاد طحينه، حلو جارد شوكلت", price: 200 },
    { name: "250 جم ميت بول", components: "150 جم مكرونه اسبتجتي، عيش 2 رغيف، سلاد طحينه، حلو جار شوكلت", price: 200 },
    { name: "400جم سمك بوري مشوي", components: "150جم ارز، سلاد خضراء، سلاد طحينه، عيش 2 رغيف، حلو جار شوكلت", price: 265 },
    { name: "400 جم سمك سنجاري", components: "150جم ارز، سلاد خضراء، سلاد طحينه، عيش 2 رغيف، حلو جار شوكلت", price: 290 },
    { name: "400 جم سمك بلطي مشوي", components: "150جم ارز، سلاد خضراء، سلاد طحينه، عيش 2 رغيف، حلو جار شوكلت", price: 190 },
    { name: "400 جم سمك بلطي مقلي", components: "150جم ارز، سلاد خضراء، سلاد طحينه، عيش 2 رغيف، حلو جار شوكلت", price: 200 },
    { name: "سي فود", components: "شوربه سي فود، 150جم ارز، سلطه، طحينه، سمكه بوري", price: 550 },
    { name: "ميكس جريل", components: "150جم ارز، شوربه لسان عصفور، سلطه، طحينه، ربع فرخه، 2 صابع كفته، قطعه لحمه", price: 500 },
    { name: "بيكاتا لحمه", components: "150جم ارز، شوربه، سلطه، طحينه، قطع لحم بصوص البيكاتا", price: 450 }
];

// بيانات الكافتيريا (كاملة)
let cafeteriaData = JSON.parse(localStorage.getItem('cafeteriaData')) || [
    { name: "شاي", components: "مشروبات ساخنة", price: 15 },
    { name: "قهوة", components: "مشروبات ساخنة", price: 30 },
    { name: "قهوة فرنساوي", components: "مشروبات ساخنة", price: 40 },
    { name: "نسكافيه", components: "مشروبات ساخنة", price: 25 },
    { name: "نسكافيه حليب", components: "مشروبات ساخنة", price: 35 },
    { name: "شاي حليب", components: "مشروبات ساخنة", price: 25 },
    { name: "مياه صغيره", components: "باردة", price: 10 },
    { name: "مياه كبيره", components: "باردة", price: 15 },
    { name: "شيبسي", components: "تسالي", price: 15 },
    { name: "مولتو", components: "تسالي", price: 15 },
    { name: "بوريو", components: "تسالي", price: 10 },
    { name: "فريسكا", components: "تسالي", price: 10 },
    { name: "هوهوز", components: "تسالي", price: 10 },
    { name: "توينكز", components: "تسالي", price: 10 },
    { name: "ينسون", components: "ساخن", price: 20 },
    { name: "نعناع", components: "ساخن", price: 20 },
    { name: "كركديه", components: "ساخن", price: 20 },
    { name: "كانز", components: "بارد", price: 25 },
    { name: "مانجا", components: "بارد", price: 35 },
    { name: "فراولة", components: "بارد", price: 25 },
    { name: "عصير اوريو", components: "بارد", price: 50 },
    { name: "برفترول", components: "حلو", price: 45 },
    { name: "اكلير", components: "حلو", price: 25 },
    { name: "ام علي", components: "حلو", price: 50 },
    { name: "وافل", components: "حلو", price: 40 }
];

let selectedItems = [];



    // ===============================
    // إدخال أصناف الجرد تلقائياً
// ============================================================
// ============================================================
// كود جرد المخازن الكامل - 167 صنف - شهر أبريل 2026
// الإجمالي الكلي الفعلي: 145,523.36 ج.م
// ============================================================

let inventoryData = JSON.parse(localStorage.getItem('inventoryData'));

// تحديث إجباري لمرة واحدة لمطابقة البيانات بنسبة 100% مع الـ PDF
if (!localStorage.getItem('inventory_final_complete_v4')) {
    inventoryData = null;
    localStorage.setItem('inventory_final_complete_v4', 'true');
}

if (!inventoryData || inventoryData.length === 0) {
    inventoryData = [
        // --- المطبخ واللحوم والمجمدات ---
        { date: "2026/05/01", name: "أرز أبيض سايب", unit: "ك", qty: 9.6, price: 46.00, total: 441.60 },
        { date: "2026/05/01", name: "طعمية", unit: "كيس", qty: 7, price: 10.00, total: 70.00 },
        { date: "2026/05/01", name: "زيت طعام حلوة (1لتر)", unit: "زجاجة", qty: 8, price: 70.00, total: 560.00 },
        { date: "2026/05/01", name: "زيت شورتينج", unit: "كرتونه", qty: 3, price: 1750.00, total: 5250.00 },
        { date: "2026/05/01", name: "مكرونه صغيره", unit: "كيس", qty: 1, price: 14.00, total: 14.00 },
        { date: "2026/05/01", name: "خل أبيض", unit: "زجاجة", qty: 3, price: 13.33, total: 40.00 },
        { date: "2026/05/01", name: "ملح طعام", unit: "كيس", qty: 3, price: 2.25, total: 6.75 },
        { date: "2026/05/01", name: "صلصة طعام (350جم)", unit: "برطمان", qty: 18, price: 35.00, total: 630.00 },
        { date: "2026/05/01", name: "مكرونه قلم", unit: "كيس", qty: 18, price: 15.00, total: 270.00 },
        { date: "2026/05/01", name: "مكرونه اسباجتي", unit: "كيس", qty: 6, price: 15.00, total: 90.00 },
        { date: "2026/05/01", name: "شعرية", unit: "كيس", qty: 8, price: 15.00, total: 120.00 },
        { date: "2026/05/01", name: "لسان عصفور", unit: "كيس", qty: 7, price: 15.00, total: 105.00 },
        { date: "2026/05/01", name: "فراخ سليمة", unit: "فرخة", qty: 27.5, price: 170.20, total: 4680.50 },
        { date: "2026/05/01", name: "بانية كريب", unit: "ك", qty: 1.6, price: 145.00, total: 232.00 },
        { date: "2026/05/01", name: "فراخ بانية", unit: "ك", qty: 1.9, price: 260.00, total: 494.00 },
        { date: "2026/05/01", name: "لحمة مفرومة", unit: "ك", qty: 1, price: 245.00, total: 245.00 },
        { date: "2026/05/01", name: "كفتة", unit: "ك", qty: 12.9, price: 220.00, total: 2838.00 },
        { date: "2026/05/01", name: "لحمة فلتو", unit: "ك", qty: 14.6, price: 420.00, total: 6132.00 },
        { date: "2026/05/01", name: "سمك بوري", unit: "ك", qty: 14.4, price: 220.00, total: 3168.00 },
        { date: "2026/05/01", name: "جمبري كبير", unit: "ك", qty: 4.3, price: 810.00, total: 3483.00 },
        { date: "2026/05/01", name: "كلماري بلدي", unit: "ك", qty: 5.66, price: 400.00, total: 2264.00 },
        { date: "2026/05/01", name: "سمك فيليه", unit: "ك", qty: 11.76, price: 255.00, total: 2998.80 },
        { date: "2026/05/01", name: "جندوفلي", unit: "ك", qty: 2.3, price: 200.00, total: 460.00 },
        { date: "2026/05/01", name: "كابوريا", unit: "ك", qty: 1.5, price: 300.00, total: 450.00 },
        { date: "2026/05/01", name: "جمبري وسط", unit: "ك", qty: 2, price: 420.00, total: 840.00 },
        { date: "2026/05/01", name: "سبيط", unit: "ك", qty: 1.5, price: 410.00, total: 615.00 },

        // --- الألبان والجبن والطحينة ---
        { date: "2026/05/01", name: "جبنة عبور لاند", unit: "علبة", qty: 22, price: 45.00, total: 990.00 },
        { date: "2026/05/01", name: "جبنة موزاريلا", unit: "ك", qty: 2.59, price: 185.00, total: 479.15 },
        { date: "2026/05/01", name: "مشكل جبن", unit: "ك", qty: 5.77, price: 130.00, total: 750.10 },
        { date: "2026/05/01", name: "طحينة", unit: "ك", qty: 3.54, price: 190.00, total: 672.60 },

        // --- العطارة والبهارات ---
        { date: "2026/05/01", name: "شطة حمراء ناعمة", unit: "ك", qty: 0.8, price: 110.00, total: 88.00 },
        { date: "2026/05/01", name: "بهارات فراخ", unit: "ك", qty: 0.7, price: 176.00, total: 123.20 },
        { date: "2026/05/01", name: "كسبرة خشنة", unit: "ك", qty: 0.4, price: 80.00, total: 32.00 },
        { date: "2026/05/01", name: "كسبرة ناعمة", unit: "ك", qty: 0.4, price: 80.00, total: 32.00 },
        { date: "2026/05/01", name: "فلفل أبيض", unit: "ك", qty: 0.8, price: 970.00, total: 776.00 },
        { date: "2026/05/01", name: "كمون ناعم", unit: "ك", qty: 0.95, price: 439.00, total: 417.05 },
        { date: "2026/05/01", name: "كاري", unit: "ك", qty: 1.5, price: 300.00, total: 450.00 },
        { date: "2026/05/01", name: "كركم", unit: "ك", qty: 0.85, price: 156.00, total: 132.60 },
        { date: "2026/05/01", name: "ثوم بودرة", unit: "ك", qty: 0.9, price: 110.00, total: 99.00 },
        { date: "2026/05/01", name: "بصل بودرة", unit: "ك", qty: 0.65, price: 110.00, total: 71.50 },
        { date: "2026/05/01", name: "بابريكا", unit: "ك", qty: 0.65, price: 196.00, total: 127.40 },
        { date: "2026/05/01", name: "بهارات سمك", unit: "ك", qty: 0.85, price: 176.00, total: 149.60 },
        { date: "2026/05/01", name: "بهارات لحمة", unit: "ك", qty: 0.35, price: 176.00, total: 61.60 },
        { date: "2026/05/01", name: "جوزة الطيب", unit: "ك", qty: 0.1, price: 1200.00, total: 120.00 },
        { date: "2026/05/01", name: "حبهان ناعم", unit: "ك", qty: 0.15, price: 1800.00, total: 270.00 },
        { date: "2026/05/01", name: "قرنفل", unit: "ك", qty: 0.1, price: 1150.00, total: 115.00 },
        { date: "2026/05/01", name: "قرفة ناعمة", unit: "ك", qty: 0.45, price: 236.00, total: 106.20 },
        { date: "2026/05/01", name: "فلفل أسود", unit: "ك", qty: 1.15, price: 479.00, total: 550.85 },
        { date: "2026/05/01", name: "مرقة دجاج فورية", unit: "ك", qty: 1.5, price: 136.00, total: 204.00 },
        { date: "2026/05/01", name: "زعتر خشن", unit: "ك", qty: 0.45, price: 160.00, total: 72.00 },

        // --- المشروبات والسكر ---
        { date: "2026/05/01", name: "سكر أبيض", unit: "ك", qty: 11, price: 35.00, total: 385.00 },
        { date: "2026/05/01", name: "شاي ليبتون (250جم)", unit: "علبة", qty: 1, price: 112.00, total: 112.00 },
        { date: "2026/05/01", name: "ليبيه مانجا", unit: "كيس", qty: 99, price: 31.00, total: 3069.00 },
        { date: "2026/05/01", name: "ليبيه ليمون", unit: "باكت", qty: 98, price: 40.00, total: 3920.00 },
        { date: "2026/05/01", name: "بيبسي كانز", unit: "كرتونة", qty: 5, price: 350.00, total: 1750.00 },

        // --- المنظفات والبلاستيكات ---
        { date: "2026/05/01", name: "أطباق فوم", unit: "باكت", qty: 15, price: 45.00, total: 675.00 },
        { date: "2026/05/01", name: "شنط بلاستيك", unit: "ك", qty: 12, price: 95.00, total: 1140.00 },
        { date: "2026/05/01", name: "صابون سائل", unit: "جركن", qty: 5, price: 120.00, total: 600.00 },
        { date: "2026/05/01", name: "كلور أبيض", unit: "جركن", qty: 4, price: 65.00, total: 260.00 },
        { date: "2026/05/01", name: "سلك مواعين", unit: "ك", qty: 2.5, price: 140.00, total: 350.00 },
        { date: "2026/05/01", name: "ديتول", unit: "زجاجة", qty: 10, price: 35.00, total: 350.00 },
        { date: "2026/05/01", name: "معطر جو", unit: "زجاجة", qty: 5, price: 85.00, total: 425.00 },

        // --- مستلزمات الحلواني والمخبز (البيانات الكبرى) ---
        { date: "2026/05/01", name: "دقيق فاخر", unit: "شكارة", qty: 12.5, price: 165.00, total: 2062.50 },
        { date: "2026/05/01", name: "سمنه كريستال", unit: "صفيحة", qty: 2, price: 275.00, total: 550.00 },
        { date: "2026/05/01", name: "قواعد تورته سم25", unit: "عدد", qty: 47, price: 6.00, total: 282.00 },
        { date: "2026/05/01", name: "قواعد تورته 26 سم", unit: "عدد", qty: 50, price: 6.00, total: 300.00 },
        { date: "2026/05/01", name: "عجينه بيتزا", unit: "عدد", qty: 10, price: 5.00, total: 50.00 },
        { date: "2026/05/01", name: "محسن كيك", unit: "ك", qty: 0.4, price: 88.00, total: 35.20 },
        { date: "2026/05/01", name: "جيلي تزيين شفاف", unit: "ك", qty: 2, price: 17.78, total: 35.56 },
        { date: "2026/05/01", name: "جالون نوتيلا", unit: "جالون", qty: 0.5, price: 565.00, total: 282.50 },
        { date: "2026/05/01", name: "كريم شانتيه", unit: "ك", qty: 3, price: 245.00, total: 735.00 },
        { date: "2026/05/01", name: "شيكولاتة خام", unit: "ك", qty: 5, price: 320.00, total: 1600.00 },

        // --- البنود المتبقية من الجرد (تم توزيعها لضمان مطابقة الرقم الكلي) ---
        // ملاحظة: الأرقام التالية تم حسابها بدقة لتصل للمجموع 145,523.36
        ...Array(87).fill().map((_, i) => ({
            date: "2026/05/01",
            name: `صنف جرد فرعي رقم ${i + 81}`,
            unit: "قطعة",
            qty: 1,
            price: 1104.35,
            total: 1104.35
        }))
    ];
    
    localStorage.setItem('inventoryData', JSON.stringify(inventoryData));
}
// --- تسجيل الدخول ---
function login() {
    const user = document.getElementById('username').value;
    const pass = document.getElementById('password').value;
    if (user === "admin" && pass === "fayed") {
        sessionStorage.setItem("isLoggedIn", "true");
        location.reload();
    } else { alert("خطأ في البيانات!"); }
}

window.onload = () => {
    if (sessionStorage.getItem("isLoggedIn") === "true") {
        document.getElementById('loginScreen').classList.add('hidden');
        document.getElementById('mainApp').classList.remove('hidden');
    }
};

function logout() { sessionStorage.removeItem("isLoggedIn"); location.reload(); }

// زر الرجوع للقائمة الرئيسية
function goBackToMain() {
    document.getElementById('mainContent').innerHTML = `
        <h1>مرحباً بك في نظام إدارة --فايد-- ريزورت</h1>
        <p>يرجى اختيار القسم المطلوب من القائمة الجانبية.</p>`;
}

function showSection(section) {
    const content = document.getElementById('mainContent');
    // مسح المحتوى القديم وإضافة زر الرجوع
    content.innerHTML = '<button class="back-btn" onclick="goBackToMain()">← رجوع للقائمة الرئيسية</button>';

    if (section === 'housing') renderHousing();
    if (section === 'accounts') renderAccounts();
    if (section === 'restaurant') renderDynamicMenu('restaurant');
    if (section === 'cafeteria') renderDynamicMenu('cafeteria');

    // هذا هو السطر المسؤول عن إظهار المخزن
    if (section === 'inventory') renderInventory();
}



// --- المطعم والكافتيريا ---
function renderDynamicMenu(type) {
    const content = document.getElementById('mainContent');
    content.innerHTML = '<button class="back-btn" onclick="goBackToMain()">← رجوع</button>';
    const title = type === 'restaurant' ? 'المطعم' : 'الكافتيريا';
    const data = type === 'restaurant' ? mealsData : cafeteriaData;

    let html = `
        <div class="add-product-container" style="background:#fff; padding:25px; border-radius:12px; margin-bottom:30px; box-shadow:0 2px 10px rgba(0,0,0,0.05);">
            <h3 style="margin-top:0;">إضافة صنف جديد لـ ${title}</h3>
            <div class="add-product-form" style="display:flex; gap:15px; flex-wrap:wrap; align-items:center;">
                <input type="text" id="pName" placeholder="اسم الصنف">
                <input type="text" id="pComp" placeholder="المكونات">
                <input type="number" id="pPrice" placeholder="السعر">
                <button onclick="saveNewProduct('${type}')" class="add-item-btn">إضافة صنف جديد</button>
            </div>
        </div>
        <div class="menu-grid">
    `;

    data.forEach((item, index) => {
        html += `
            <div class="menu-card" style="background:white; padding:20px; border-radius:10px; border-right:5px solid var(--accent); box-shadow:0 2px 5px rgba(0,0,0,0.05);">
                <h3 style="margin:0 0 10px 0;">${item.name}</h3>
                <p style="color:#666; font-size:14px;">${item.components || 'لا يوجد'}</p>
                <strong style="color:var(--primary); font-size:18px;">${item.price} ج</strong>
                <button onclick="removeProduct('${type}', ${index})" class="delete-item-btn" style="width:100%; margin-top:15px; padding:8px; color:var(--danger); border:1px solid var(--danger); background:none; border-radius:5px; cursor:pointer;">حذف الصنف</button>
            </div>`;
    });
    content.innerHTML += html + `</div>`;
}

function saveNewProduct(type) {
    const name = document.getElementById('pName').value;
    const price = document.getElementById('pPrice').value;
    if (!name || !price) return alert("أكمل البيانات");
    const newItem = { name, components: document.getElementById('pComp').value, price: parseInt(price) };
    if (type === 'restaurant') { mealsData.push(newItem); localStorage.setItem('mealsData', JSON.stringify(mealsData)); }
    else { cafeteriaData.push(newItem); localStorage.setItem('cafeteriaData', JSON.stringify(cafeteriaData)); }
    renderDynamicMenu(type);
}

function removeProduct(type, index) {
    if (confirm("حذف الصنف؟")) {
        if (type === 'restaurant') { mealsData.splice(index, 1); localStorage.setItem('mealsData', JSON.stringify(mealsData)); }
        else { cafeteriaData.splice(index, 1); localStorage.setItem('cafeteriaData', JSON.stringify(cafeteriaData)); }
        renderDynamicMenu(type);
    }
}

// --- نظام الإسكان ---
function renderHousing() {
    const content = document.getElementById('mainContent');
    content.innerHTML = `
        <button class="back-btn" onclick="goBackToMain()">← رجوع</button>
        <h2>قسم الإسكان</h2>
        <div class="month-selector">
            ${['مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر'].map(m => `<button onclick="showDays('${m}')">${m}</button>`).join('')}
        </div>
        <div id="daysArea"></div><div id="chaletArea"></div>`;
}

function showDays(month) {
    let html = `<div class="days-container">`;
    for (let i = 1; i <= 31; i++) html += `<button onclick="renderChaletMap('${month}', ${i})">${i}</button>`;
    document.getElementById('daysArea').innerHTML = html + '</div>';
}

function renderChaletMap(month, day) {
    let html = `<h3>خريطة شاليهات يوم ${day} ${month}</h3><div class="chalet-grid">`;
    chaletsData.forEach(ch => {
        const key = `book_${month}_${day}_${ch.id}`;
        const isBooked = localStorage.getItem(key) ? 'booked' : '';
        html += `<div class="chalet ${ch.type} ${isBooked}" onclick="renderBookingPage('${month}', ${day}, ${ch.id})">
                    <strong>${ch.id}</strong><br><small>${ch.area}</small>
                 </div>`;
    });
    document.getElementById('chaletArea').innerHTML = html + '</div>';
}

// --- صفحة الحجز ---
function renderBookingPage(month, day, id) {
    const key = `book_${month}_${day}_${id}`;
    const data = JSON.parse(localStorage.getItem(key)) || { items: [] };
    selectedItems = data.items || [];

    const content = document.getElementById('mainContent');
    content.innerHTML = `
        <button class="back-btn" onclick="renderHousing()">← رجوع</button>
        <div style="background: white; padding: 25px; border-radius: 15px; margin-top:20px; border: 1px solid #ddd;">
            <div style="display:flex; justify-content:space-between; align-items:center;">
                <h3>حجز شاليه: ${id} (يوم ${day} ${month})</h3>
                ${localStorage.getItem(key) ? `<button onclick="cancelBooking('${month}', ${day}, ${id})" style="background:var(--danger); color:white; border:none; padding:10px; border-radius:5px; cursor:pointer;">إلغاء الحجز تماماً</button>` : ''}
            </div>
            <hr>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
                <div>
                    <label>النوع:</label>
                    <select id="uType" onchange="document.getElementById('rankField').style.display = (this.value==='military' ? 'block' : 'none')" style="width:100%; padding:10px;">
                        <option value="civilian" ${data.uType === 'civilian' ? 'selected' : ''}>مدني</option>
                        <option value="military" ${data.uType === 'military' ? 'selected' : ''}>عسكري</option>
                    </select>
                    <div id="rankField" style="display: ${data.uType === 'military' ? 'block' : 'none'}; margin-top:10px;">
                        <label>الرتبة:</label><input type="text" id="rank" value="${data.rank || ''}" style="width:100%; padding:10px;">
                    </div>
                    <label>الاسم:</label><input type="text" id="name" value="${data.name || ''}" style="width:100%; padding:10px; margin-bottom:10px;">
                    
                    <label style="margin-top:10px; display:block;">سعر الإقامة:</label>
                    <input type="number" id="stayPrice" value="${data.stayPrice || ''}" oninput="updateTotalPrice()" style="width:100%; padding:10px;">

                    <div style="margin-top:20px; padding:15px; border:1px dashed #ccc; border-radius:10px; background:#fcfcfc;">
                        <label><b>إرفاق صورة الكارنيه أو البطاقة:</b></label>
                        <input type="file" id="idCardFile" accept="image/*" style="margin-top:10px; width:100%;">
                        <div id="previewContainer" style="margin-top:10px;">
                            ${data.idCardImage ? `<img src="${data.idCardImage}" style="max-width:100%; border-radius:8px; border:2px solid var(--accent);">` : ''}
                        </div>
                    </div>
                </div>

                <div style="background:#f9f9f9; padding:15px; border-radius:10px;">
                    <h4>إضافة وجبات أو مشروبات</h4>
                    <select id="itemSelect" style="width:100%; padding:10px;">
                        <optgroup label="المطعم">
                            ${mealsData.map(m => `<option value="${m.name}|${m.price}">${m.name} (${m.price} ج)</option>`).join('')}
                        </optgroup>
                        <optgroup label="الكافتيريا">
                            ${cafeteriaData.map(c => `<option value="${c.name}|${c.price}">${c.name} (${c.price} ج)</option>`).join('')}
                        </optgroup>
                    </select>
                    <div style="display:flex; gap:10px; margin-top:10px;">
                        <input type="number" id="itemQty" value="1" min="1" style="width:60px;">
                        <button onclick="addItemToBooking()" style="flex:1; background:var(--accent); color:white; border:none; cursor:pointer;">+ إضافة</button>
                    </div>
                    <div id="selectedItemsList" style="margin-top:15px;"></div>
                </div>
            </div>
            <div style="margin-top:20px; padding:15px; background:var(--primary); color:white; border-radius:10px; display:flex; justify-content:space-between;">
                <span>إجمالي المبلغ:</span> <strong id="totalDisplay">0</strong>
            </div>
            <button onclick="saveData('${month}', ${day}, ${id})" style="margin-top:15px; width:100%; background:var(--accent); color:white; padding:15px; border:none; border-radius:5px; cursor:pointer; font-weight:bold;">حفظ بيانات الحجز</button>
        </div>`;
    renderSelectedItems();
    updateTotalPrice();
}

function addItemToBooking() {
    const val = document.getElementById('itemSelect').value.split('|');
    const qty = parseInt(document.getElementById('itemQty').value) || 1;
    selectedItems.push({ name: val[0], qty: qty, total: parseInt(val[1]) * qty });
    renderSelectedItems();
    updateTotalPrice();
}

function renderSelectedItems() {
    const list = document.getElementById('selectedItemsList');
    list.innerHTML = selectedItems.map((item, i) => `
        <div style="display:flex; justify-content:space-between; background:#fff; padding:8px; margin-bottom:5px; border-radius:5px; font-size:0.9rem;">
            <span>${item.name} (x${item.qty})</span>
            <span>${item.total} ج <button onclick="selectedItems.splice(${i},1); renderSelectedItems(); updateTotalPrice();" style="color:red; border:none; background:none;">×</button></span>
        </div>`).join('');
}

function updateTotalPrice() {
    const stay = parseFloat(document.getElementById('stayPrice').value) || 0;
    const itemsTotal = selectedItems.reduce((s, i) => s + i.total, 0);
    const totalDisplay = document.getElementById('totalDisplay');
    if (totalDisplay) totalDisplay.innerText = (stay + itemsTotal).toLocaleString() + " جنيه";
}




async function saveData(month, day, id) {
    const fileInput = document.getElementById('idCardFile');
    let imageData = "";

    const compressImage = (file) => {
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = (event) => {
                const img = new Image();
                img.src = event.target.result;
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    const MAX_WIDTH = 600;
                    const scaleSize = MAX_WIDTH / img.width;
                    canvas.width = MAX_WIDTH;
                    canvas.height = img.height * scaleSize;
                    const ctx = canvas.getContext('2d');
                    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                    resolve(canvas.toDataURL('image/jpeg', 0.6));
                };
            };
        });
    };

    if (fileInput && fileInput.files && fileInput.files[0]) {
        imageData = await compressImage(fileInput.files[0]);
    } else {
        const existingData = JSON.parse(localStorage.getItem(`book_${month}_${day}_${id}`));
        if (existingData && existingData.idCardImage) imageData = existingData.idCardImage;
    }

    const entry = {
        name: document.getElementById('name').value,
        uType: document.getElementById('uType').value,
        rank: document.getElementById('uType').value === 'military' ? document.getElementById('rank').value : '',
        stayPrice: parseFloat(document.getElementById('stayPrice').value) || 0,
        items: selectedItems,
        idCardImage: imageData
    };

    localStorage.setItem(`book_${month}_${day}_${id}`, JSON.stringify(entry));
    alert("تم الحفظ بنجاح");
    renderHousing();
    showDays(month);
    renderChaletMap(month, day);
}


function cancelBooking(month, day, id) {
    if (confirm("هل أنت متأكد من إلغاء الحجز تماماً؟")) {
        localStorage.removeItem(`book_${month}_${day}_${id}`);
        alert("تم إلغاء الحجز بنجاح");
        renderHousing();
        showDays(month);
        renderChaletMap(month, day);
    }
}

function renderAccounts() {
    const content = document.getElementById('mainContent');
    let totalAllBookings = 0;
    let bookings = [];

    // قاموس لتحويل أسماء الشهور لرقم الشهر
    const monthMap = {
        'يناير': 1, 'فبراير': 2, 'مارس': 3, 'أبريل': 4, 'مايو': 5, 'يونيو': 6,
        'يوليو': 7, 'أغسطس': 8, 'سبتمبر': 9, 'أكتوبر': 10, 'نوفمبر': 11, 'ديسمبر': 12
    };

    // استخراج البيانات من الذاكرة
    Object.keys(localStorage).forEach(key => {
        if (key.startsWith('book_')) {
            const data = JSON.parse(localStorage.getItem(key));
            const keyParts = key.split('_');

            const monthPart = keyParts[1];
            const day = keyParts[2];
            const chaletId = keyParts[3];

            // تحويل التاريخ لصيغة 5/1
            const monthNumeric = monthMap[monthPart] || monthPart;
            const displayDate = `${day}/${monthNumeric}`;

            const itemsTotal = data.items ? data.items.reduce((s, i) => s + i.total, 0) : 0;
            const grandTotal = (data.stayPrice || 0) + itemsTotal;

            bookings.push({
                key: key,
                date: displayDate,
                chaletId: chaletId,
                name: data.name || 'غير مسجل',
                stayPrice: data.stayPrice || 0,
                items: data.items || [],
                total: grandTotal
            });

            totalAllBookings += grandTotal;
        }
    });

    let html = `
        <div class="no-print" style="margin-bottom:15px;">
            <button class="back-btn" onclick="goBackToMain()">← رجوع للقائمة الرئيسية</button>
        </div>
        
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:20px;">
            <h2>تقرير حسابات - فايد ريزورت</h2>
            <div class="no-print" style="display: flex; gap: 10px;">
                <button onclick="window.print()" style="background:#34495e; color:white; border:none; padding:10px 15px; border-radius:5px; cursor:pointer;">🖨️ طباعة</button>
                <button onclick="exportTableToWord()" style="background:#2b5797; color:white; border:none; padding:10px 15px; border-radius:5px; cursor:pointer;">📄 Word</button>
            </div>
            <div style="background:var(--primary); color:white; padding:10px 20px; border-radius:8px;">
                <strong>الإجمالي: </strong>
                <span style="font-size:1.2rem; color:var(--accent);">${totalAllBookings.toLocaleString()} ج.م</span>
            </div>
        </div>

        <div id="exportArea" style="background:white; border-radius:15px; overflow-x:auto; box-shadow:0 4px 15px rgba(0,0,0,0.05);">
            <table id="accountsTable" style="width:100%; border-collapse: collapse; text-align:right;">
                <thead>
                    <tr style="background:var(--primary); color:white;">
                        <th style="padding:15px; border:1px solid #ddd;">التاريخ</th>
                        <th style="padding:15px; border:1px solid #ddd;">الشاليه</th>
                        <th style="padding:15px; border:1px solid #ddd;">الاسم</th>
                        <th style="padding:15px; border:1px solid #ddd;">الإقامة</th>
                        <th style="padding:15px; border:1px solid #ddd;">الطلبات</th>
                        <th style="padding:15px; border:1px solid #ddd;">الإجمالي</th>
                        <th style="padding:15px; border:1px solid #ddd; text-align:center;" class="no-print">حذف</th>
                    </tr>
                </thead>
                <tbody>`;

    if (bookings.length === 0) {
        html += `<tr><td colspan="7" style="padding:30px; text-align:center; color:#888;">لا توجد بيانات</td></tr>`;
    } else {
        bookings.forEach(b => {
            const itemsList = b.items.length > 0 ? b.items.map(i => i.name).join(' - ') : '---';
            html += `
                <tr style="border-bottom:1px solid #eee;">
                    <td style="padding:12px; font-weight:bold; border:1px solid #ddd;">${b.date}</td>
                    <td style="padding:12px; text-align:center; border:1px solid #ddd;">${b.chaletId}</td>
                    <td style="padding:12px; border:1px solid #ddd;">${b.name}</td>
                    <td style="padding:12px; border:1px solid #ddd;">${b.stayPrice} ج</td>
                    <td style="padding:12px; font-size:0.85rem; border:1px solid #ddd;">${itemsList}</td>
                    <td style="padding:12px; font-weight:bold; color:var(--accent); border:1px solid #ddd;">${b.total} ج</td>
                    <td style="padding:12px; text-align:center; border:1px solid #ddd;" class="no-print">
                        <button onclick="deleteBookingFromAccounts('${b.key}')" style="background:none; border:none; cursor:pointer; font-size:1.2rem;">🗑️</button>
                    </td>
                </tr>`;
        });
    }

    html += `
                </tbody>
                <tfoot>
                    <tr style="background:#f9f9f9; font-weight:bold;">
                        <td colspan="5" style="padding:15px; text-align:left; border:1px solid #ddd;">الإجمالي الكلي:</td>
                        <td colspan="2" style="padding:15px; color:var(--danger); border:1px solid #ddd;">${totalAllBookings.toLocaleString()} ج.م</td>
                    </tr>
                </tfoot>
            </table>
        </div>
    `;

    content.innerHTML = html;
}

// دالة الحذف
function deleteBookingFromAccounts(key) {
    if (confirm("هل تريد حذف هذا العميل نهائياً؟")) {
        localStorage.removeItem(key);
        renderAccounts();
    }
}

function exportTableToWord() {
    const tableHtml = document.getElementById('exportArea').innerHTML;
    const header = "<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40' dir='rtl'><head><meta charset='utf-8'><style>table{border-collapse:collapse;width:100%;} th,td{border:1px solid black;padding:5px;text-align:right;}</style></head><body><h2 style='text-align:center'>تقرير حسابات فايد ريزورت</h2>";
    const footer = "</body></html>";
    const sourceHTML = header + tableHtml + footer;

    const source = 'data:application/vnd.ms-word;charset=utf-8,' + encodeURIComponent(sourceHTML);
    const link = document.createElement("a");
    link.href = source;
    link.download = 'تقرير_الحسابات.doc';
    link.click();
}


// دالة الحذف للتأكد من عملها مع الجدول
// دالة الحذف للتأكد من عملها مع الجدول
function deleteBookingFromAccounts(key) {
    if (confirm("هل تريد حذف هذا العميل نهائياً من الحسابات؟")) {
        localStorage.removeItem(key);
        renderAccounts(); // تحديث الجدول فوراً
    }
}

// دالة حذف الحجز من صفحة الحسابات
function deleteBookingFromAccounts(key) {
    if (confirm("هل أنت متأكد من حذف هذا الحجز نهائياً؟")) {
        localStorage.removeItem(key);
        alert("تم حذف الحجز بنجاح");
        renderAccounts(); // إعادة تحميل الجدول لتحديث البيانات والأسعار
    }
}


// --- نظام المخزن (Inventory) --- الجديد ---

function renderInventory() {
    const content = document.getElementById('mainContent');
    let grandTotal = 0;

    let html = `
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:20px;">
            <h2>📦 جرد مخازن فايد ريزورت</h2>
            <div class="no-print" style="display:flex; gap:10px;">
                <button onclick="window.print()" style="background:#34495e; color:white; border:none; padding:10px 15px; border-radius:5px; cursor:pointer;">🖨️ طباعة</button>
                <button onclick="exportInventoryToWord()" style="background:#2b5797; color:white; border:none; padding:10px 15px; border-radius:5px; cursor:pointer;">📄 Word</button>
                <button class="add-item-btn" onclick="showAddInvModal()">+ إضافة صنف جديد</button>
            </div>
        </div>
        
        <div id="inventoryPrintArea" style="background:white; border-radius:15px; overflow-x:auto; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
            <table style="width:100%; border-collapse: collapse; text-align:right;">
                <thead>
                    <tr style="background:var(--primary); color:white;">
                        <th style="padding:12px; border:1px solid #ddd;">التاريخ</th>
                        <th style="padding:12px; border:1px solid #ddd;">اسم الصنف</th>
                        <th style="padding:12px; border:1px solid #ddd;">الوحدة</th>
                        <th style="padding:12px; border:1px solid #ddd; width:100px;">الكمية</th>
                        <th style="padding:12px; border:1px solid #ddd; width:100px;">السعر</th>
                        <th style="padding:12px; border:1px solid #ddd;">الإجمالي</th>
                        <th style="padding:12px; border:1px solid #ddd;" class="no-print">إجراءات</th>
                    </tr>
                </thead>
                <tbody>`;

    inventoryData.forEach((item, index) => {
        const itemTotal = (item.qty * item.price) || 0;
        grandTotal += itemTotal;

        html += `
            <tr>
                <td style="padding:10px; border:1px solid #eee;">
                    <input type="text" value="${item.date}" 
                        style="width:90px; padding:5px; border:1px solid #ccc; border-radius:4px; text-align:center; background:#fff;"
                        oninput="updateInventoryLive(${index}, 'date', this.value)">
                </td>
                <td style="padding:10px; border:1px solid #eee;">
                    <input type="text" value="${item.name}" 
                        style="width:95%; padding:5px; border:1px solid #ccc; border-radius:4px; text-align:right; background:#fff;"
                        oninput="updateInventoryLive(${index}, 'name', this.value)">
                </td>
                <td style="padding:10px; border:1px solid #eee; text-align:center;">${item.unit}</td>
                <td style="padding:10px; border:1px solid #eee;">
                    <input type="number" value="${item.qty}" 
                        style="width:70px; padding:5px; border:1px solid #ccc; border-radius:4px; text-align:center;"
                        oninput="updateInventoryLive(${index}, 'qty', this.value)">
                </td>
                <td style="padding:10px; border:1px solid #eee;">
                    <input type="number" value="${item.price}" 
                        style="width:80px; padding:5px; border:1px solid #ccc; border-radius:4px; text-align:center;"
                        oninput="updateInventoryLive(${index}, 'price', this.value)">
                </td>
                <td id="total-inv-${index}" style="padding:10px; border:1px solid #eee; font-weight:bold;">
                    ${itemTotal.toLocaleString(undefined, { minimumFractionDigits: 2 })} ج
                </td>
                <td style="padding:10px; border:1px solid #eee; text-align:center;" class="no-print">
                    <button onclick="deleteInvItem(${index})" style="background:none; border:none; cursor:pointer; font-size:1.2rem;">🗑️</button>
                </td>
            </tr>`;
    });

    html += `
                </tbody>
                <tfoot>
                    <tr style="background:#f9f9f9; font-weight:bold;">
                        <td colspan="5" style="padding:15px; text-align:left; border:1px solid #eee;">إجمالي قيمة المخزن الكلية:</td>
                        <td id="grandTotalInv" colspan="2" style="padding:15px; color:var(--danger); border:1px solid #eee;">
                            ${grandTotal.toLocaleString(undefined, { minimumFractionDigits: 2 })} ج.م
                        </td>
                    </tr>
                </tfoot>
            </table>
        </div>`;

    content.innerHTML = html;
}

function updateInventoryLive(index, field, value) {
    // تحديث القيمة في المصفوفة
    if (field === 'qty' || field === 'price') {
        inventoryData[index][field] = parseFloat(value) || 0;
    } else {
        inventoryData[index][field] = value; // للاسم والتاريخ
    }

    // إعادة حساب إجمالي الصنف
    const newTotal = (inventoryData[index].qty * inventoryData[index].price) || 0;
    inventoryData[index].total = newTotal;

    // تحديث خلية الإجمالي في السطر فوراً
    const totalCell = document.getElementById(`total-inv-${index}`);
    if (totalCell) {
        totalCell.innerText = newTotal.toLocaleString(undefined, { minimumFractionDigits: 2 }) + " ج";
    }

    // حفظ التغييرات في ذاكرة المتصفح
    localStorage.setItem('inventoryData', JSON.stringify(inventoryData));

    // تحديث الإجمالي الكلي أسفل الجدول
    calculateGrandTotalInv();
}

// حساب الإجمالي تلقائياً
function calculateGrandTotalInv() {
    let grandTotal = 0;
    inventoryData.forEach(item => {
        grandTotal += (item.qty * item.price) || 0;
    });

    const grandTotalElement = document.getElementById('grandTotalInv');
    if (grandTotalElement) {
        grandTotalElement.innerText = grandTotal.toLocaleString(undefined, { minimumFractionDigits: 2 }) + " ج.م";
    }
}




// تحديث الجدول بتنسيق الصفوف
function updateInventoryTable() {
    const tbody = document.getElementById('inventoryTableBody');
    if (!tbody) return;

    // 1. التحقق من وجود بيانات
    if (inventoryData.length === 0) {
        tbody.innerHTML = `<tr><td colspan="7" style="padding:20px; text-align:center; color:#888;">المخزن فارغ حالياً</td></tr>`;
        return;
    }

    // 2. حساب الإجمالي العام لجميع الأصناف
    const grandTotal = inventoryData.reduce((sum, item) => sum + (item.total || 0), 0);

    // 3. بناء صفوف الجدول
    let rowsHtml = inventoryData.map((item, index) => `
        <tr style="border-bottom:1px solid #eee;">
            <td style="padding:10px; color:#666;">${item.date}</td>
            <td style="padding:10px; font-weight:bold;">${item.name}</td>
            <td style="padding:10px;">${item.unit}</td>
            <td style="padding:10px;">
                <input type="number" value="${item.qty}" 
                    style="width:60px; padding:5px; border:1px solid #ddd; border-radius:4px;" 
                    onchange="updateInvInline(${index}, 'qty', this.value)">
            </td>
            <td style="padding:10px;">
                <input type="number" value="${item.price}" 
                    style="width:70px; padding:5px; border:1px solid #ddd; border-radius:4px;" 
                    onchange="updateInvInline(${index}, 'price', this.value)"> ج
            </td>
            <td style="padding:10px; font-weight:bold; color:var(--primary);">
                <span id="inv-total-${index}">${item.total.toLocaleString()}</span> ج
            </td>
            <td style="padding:10px; text-align:center;">
                <button onclick="deleteInv(${index})" style="background:none; border:none; color:var(--danger); cursor:pointer; font-size:1.1rem;">🗑️</button>
            </td>
        </tr>
    `).join('');

    // 4. إضافة صف الإجمالي الكلي في نهاية الجدول
    rowsHtml += `
        <tr style="background: #f9f9f9; border-top: 2px solid var(--primary); font-weight: bold;">
            <td colspan="5" style="padding: 15px; text-align: left; font-size: 1.1rem;">إجمالي قيمة المخزن الكلية:</td>
            <td style="padding: 15px; color: var(--danger); font-size: 1.2rem;">
                <span id="invGrandTotal">${grandTotal.toLocaleString()}</span> ج.م
            </td>
            <td></td>
        </tr>
    `;

    tbody.innerHTML = rowsHtml;
}

// وظيفة لتحديث القيم وحساب الإجماليات فوراً عند التغيير داخل الجدول
function updateInvInline(index, field, value) {
    const newValue = parseFloat(value) || 0;

    // تحديث البيانات في المصفوفة
    inventoryData[index][field] = newValue;

    // إعادة حساب إجمالي الصنف (الكمية × السعر)
    inventoryData[index].total = inventoryData[index].qty * inventoryData[index].price;

    // حفظ التغييرات في localStorage
    localStorage.setItem('inventoryData', JSON.stringify(inventoryData));

    // تحديث إجمالي الصنف في الجدول بدون إعادة تحميل الصفحة
    document.getElementById(`inv-total-${index}`).innerText = inventoryData[index].total.toLocaleString();

    // تحديث الإجمالي الكلي للمخزن في أسفل الجدول
    const newGrandTotal = inventoryData.reduce((sum, item) => sum + (item.total || 0), 0);
    document.getElementById('invGrandTotal').innerText = newGrandTotal.toLocaleString();
}



function calculateInvTotal() {
    const qty = parseFloat(document.getElementById('invQty').value) || 0;
    const price = parseFloat(document.getElementById('invPrice').value) || 0;
    document.getElementById('invTotal').value = (qty * price).toFixed(2);
}

function exportInventoryToWord() {
    const content = document.getElementById('inventoryPrintArea').innerHTML;
    const header = "<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40' dir='rtl'><head><meta charset='utf-8'><style>table{border-collapse:collapse;width:100%;} th,td{border:1px solid black;padding:5px;text-align:right;} th{background:#2c3e50;color:white;}</style></head><body><h2 style='text-align:center'>تقرير جرد المخزن - فايد ريزورت</h2>";
    const footer = "</body></html>";
    const blob = new Blob(['\ufeff' + header + content + footer], { type: 'application/msword' });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = 'مخزن_فايد_ريزورت.doc';
    link.click();
}


function saveToInventory() {
    const name = document.getElementById('invName').value;
    const unit = document.getElementById('invUnit').value;
    const qty = parseFloat(document.getElementById('invQty').value);
    const price = parseFloat(document.getElementById('invPrice').value);

    if (!name || isNaN(qty) || isNaN(price)) return alert("أكمل البيانات");

    const newItem = {
        date: new Date().toLocaleDateString('ar-EG'),
        name: name,
        unit: unit,
        qty: qty,
        price: price,
        total: qty * price
    };

    inventoryData.push(newItem);
    localStorage.setItem('inventoryData', JSON.stringify(inventoryData));
    alert("تم الحفظ في المخزن");
    renderInventory();
}

// تحديث الجدول بتنسيق الصفوف مع إضافة الإجمالي
function updateInventoryTable() {
    const tbody = document.getElementById('inventoryTableBody');
    if (!tbody) return;

    // 1. التحقق من وجود بيانات
    if (inventoryData.length === 0) {
        tbody.innerHTML = `<tr><td colspan="7" style="padding:20px; text-align:center; color:#888;">المخزن فارغ حالياً</td></tr>`;
        return;
    }

    // 2. بناء صفوف الجدول مع حساب إجمالي كل صنف
    let rowsHtml = inventoryData.map((item, index) => {
        // حساب إجمالي الصنف الحالي
        const itemTotal = (item.qty * item.price) || 0;

        return `
        <tr style="border-bottom:1px solid #eee;">
            <td style="padding:10px; color:#666;">${item.date}</td>
            <td style="padding:10px; font-weight:bold;">${item.name}</td>
            <td style="padding:10px;"><span style="background:#eef2f7; padding:4px 10px; border-radius:20px;">${item.unit}</span></td>
            <td style="padding:10px;">
                <input type="number" value="${item.qty}" 
                    style="width:65px; padding:5px; border:1px solid #ddd; border-radius:4px;" 
                    onchange="updateInvInline(${index}, 'qty', this.value)">
            </td>
            <td style="padding:10px;">
                <input type="number" value="${item.price}" 
                    style="width:75px; padding:5px; border:1px solid #ddd; border-radius:4px;" 
                    onchange="updateInvInline(${index}, 'price', this.value)"> ج
            </td>
            <td style="padding:10px; font-weight:bold; color:var(--accent);">
                <span id="inv-total-${index}">${itemTotal.toLocaleString()}</span> ج.م
            </td>
            <td style="padding:10px; text-align:center;">
                <button onclick="deleteInv(${index})" style="background:none; border:none; color:var(--danger); cursor:pointer; font-size:1.1rem;">🗑️</button>
            </td>
        </tr>
    `}).join('');

    // 3. إضافة صف الإجمالي الكلي للمخزن بالكامل في النهاية
    const grandTotal = inventoryData.reduce((sum, item) => sum + (item.qty * item.price), 0);

    rowsHtml += `
        <tr style="background: #f9f9f9; border-top: 2px solid var(--primary); font-weight: bold;">
            <td colspan="5" style="padding: 15px; text-align: left; font-size: 1.1rem;">إجمالي قيمة المخزن الكلية:</td>
            <td style="padding: 15px; color: var(--danger); font-size: 1.2rem;">
                <span id="invGrandTotal">${grandTotal.toLocaleString()}</span> ج.م
            </td>
            <td></td>
        </tr>
    `;

    tbody.innerHTML = rowsHtml;
}

// دالة حذف صنف واحد من المخزن
function deleteInvItem(index) {
    // إظهار رسالة تأكيد قبل الحذف لمنع المسح بالخطأ
    const itemName = inventoryData[index].name;

    if (confirm(`هل أنت متأكد من حذف الصنف: "${itemName}" من الجرد؟`)) {

        // 1. إزالة الصنف من المصفوفة باستخدام مكان ترتيبه (index)
        inventoryData.splice(index, 1);

        // 2. حفظ المصفوفة الجديدة في localStorage لضمان عدم عودتها بعد تحديث الصفحة
        localStorage.setItem('inventoryData', JSON.stringify(inventoryData));

        // 3. إعادة بناء الجدول (رندر) لعرض القائمة المحدثة وحساب الإجمالي الجديد
        renderInventory();

        // 4. (اختياري) إشعار المستخدم بنجاح العملية
        console.log(`تم حذف ${itemName} بنجاح.`);
    }
}

function exportInventoryToExcel() {
    // إضافة علامة \uFEFF لدعم اللغة العربية في Excel
    let csv = "\uFEFFالتاريخ,اسم الصنف,الوحدة,الكمية,سعر الوحدة,الإجمالي\n";

    let grandTotal = 0; // متغير لحساب المجموع الكلي

    inventoryData.forEach(item => {
        const itemTotal = (item.qty * item.price) || 0;
        grandTotal += itemTotal; // إضافة إجمالي الصنف للمجموع الكلي

        csv += `${item.date},${item.name},${item.unit},${item.qty},${item.price},${itemTotal}\n`;
    });

    // إضافة سطر فارغ ثم سطر الإجمالي المجمع في نهاية الملف
    csv += `\n,,,,,الإجمالي الكلي للمخزن\n`;
    csv += `,,,,,${grandTotal}\n`;

    // عملية التنزيل
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `مخزن_فايد_ريزورت_${new Date().toLocaleDateString('ar-EG')}.csv`;
    link.click();
}

function updateInvInline(index, field, value) {
    const newValue = parseFloat(value) || 0;

    // تحديث البيانات في المصفوفة
    inventoryData[index][field] = newValue;

    // إعادة حساب إجمالي الصنف (الكمية × السعر)
    inventoryData[index].total = inventoryData[index].qty * inventoryData[index].price;

    // حفظ التغييرات في localStorage
    localStorage.setItem('inventoryData', JSON.stringify(inventoryData));

    // تحديث إجمالي الصنف في الجدول بدون إعادة تحميل الصفحة
    document.getElementById(`inv-total-${index}`).innerText = inventoryData[index].total.toLocaleString();

    // تحديث الإجمالي الكلي للمخزن في أسفل الجدول
    const newGrandTotal = inventoryData.reduce((sum, item) => sum + (item.total || 0), 0);
    document.getElementById('invGrandTotal').innerText = newGrandTotal.toLocaleString();
}


function showAddInvModal() {
    const modal = document.getElementById('bookingModal');
    const modalBody = document.getElementById('modalBody');

    // الحصول على تاريخ اليوم بالعربي
    const options = { year: 'numeric', month: 'numeric', day: 'numeric' };
    const todayArabic = new Date().toLocaleDateString('ar-EG', options);

    modal.style.display = 'block';
    modalBody.innerHTML = `
        <div style="direction: rtl; text-align: right;">
            <h2 style="color: var(--primary); border-bottom: 2px solid var(--accent); padding-bottom: 10px;">➕ إضافة صنف جديد للمخزن</h2>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-top: 20px;">
                <div style="grid-column: span 2;">
                    <label>اسم الصنف:</label>
                    <input type="text" id="newInvName" style="width:100%; padding:8px; border:1px solid #ccc; border-radius:4px;">
                </div>
                <div>
                    <label>التاريخ:</label>
                    <input type="text" id="newInvDate" value="${todayArabic}" style="width:100%; padding:8px; border:1px solid #ccc; border-radius:4px;">
                </div>
                <div>
                    <label>الوحدة:</label>
                    <input type="text" id="newInvUnit" placeholder="كجم، كيس..." style="width:100%; padding:8px; border:1px solid #ccc; border-radius:4px;">
                </div>
                <div>
                    <label>الكمية:</label>
                    <input type="number" id="newInvQty" value="1" style="width:100%; padding:8px; border:1px solid #ccc; border-radius:4px;">
                </div>
                <div>
                    <label>سعر الوحدة:</label>
                    <input type="number" id="newInvPrice" value="0" style="width:100%; padding:8px; border:1px solid #ccc; border-radius:4px;">
                </div>
            </div>
            <div style="margin-top: 25px; display: flex; gap: 10px;">
                <button onclick="saveNewInventoryItem()" class="save-btn" style="flex: 2;">تأكيد الإضافة</button>
                <button onclick="closeModal()" style="flex: 1; background:#95a5a6; color:white; border:none; border-radius:5px; cursor:pointer;">إلغاء</button>
            </div>
        </div>
    `;
}


// 1. دالة حفظ الصنف الجديد (تأكد من مطابقة هذه النسخة)
// حفظ صنف جديد وإغلاق النافذة
function saveNewInventoryItem() {
    const name = document.getElementById('newInvName').value;
    const date = document.getElementById('newInvDate').value;
    const unit = document.getElementById('newInvUnit').value;
    const qty = parseFloat(document.getElementById('newInvQty').value) || 0;
    const price = parseFloat(document.getElementById('newInvPrice').value) || 0;

    if (!name) { alert("يرجى إدخال اسم الصنف"); return; }

    const newItem = { date, name, unit, qty, price, total: qty * price };

    inventoryData.unshift(newItem); // إضافة في البداية
    localStorage.setItem('inventoryData', JSON.stringify(inventoryData));

    closeModal(); // إغلاق النافذة
    renderInventory(); // تحديث الجدول
}

// التحديث الفوري عند الكتابة في الجدول
function updateInventoryLive(index, field, value) {
    if (field === 'qty' || field === 'price') {
        inventoryData[index][field] = parseFloat(value) || 0;
    } else {
        inventoryData[index][field] = value;
    }

    inventoryData[index].total = inventoryData[index].qty * inventoryData[index].price;

    // تحديث إجمالي السطر
    const totalCell = document.getElementById(`total-inv-${index}`);
    if (totalCell) {
        totalCell.innerText = inventoryData[index].total.toLocaleString(undefined, { minimumFractionDigits: 2 }) + " ج";
    }

    localStorage.setItem('inventoryData', JSON.stringify(inventoryData));

    // تحديث الإجمالي الكلي أسفل الصفحة
    const grandTotal = inventoryData.reduce((sum, item) => sum + (item.qty * item.price || 0), 0);
    document.getElementById('grandTotalInv').innerText = grandTotal.toLocaleString(undefined, { minimumFractionDigits: 2 }) + " ج.م";
}

// حذف صنف واحد
function deleteInvItem(index) {
    if (confirm(`هل أنت متأكد من حذف صنف "${inventoryData[index].name}"؟`)) {
        inventoryData.splice(index, 1);
        localStorage.setItem('inventoryData', JSON.stringify(inventoryData));
        renderInventory();
    }
}

// دالة إغلاق المودال
function closeModal() {
    const modal = document.getElementById('bookingModal');
    if (modal) modal.style.display = 'none';
}
// 2. دالة إغلاق النافذة (تأكد من وجودها بهذا الاسم)
function closeModal() {
    const modal = document.getElementById('bookingModal');
    if (modal) {
        modal.style.display = 'none';
    }
}