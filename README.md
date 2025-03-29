# گزارش تمرین اول درس برنامه‌سازی وب

در اینجا قرار است بخش‌های مختلف پروژه را توضیح دهیم.

## فایل script.js

ابتدا این فایل را بررسی می‌کنیم. در این فایل، یک تگ جدید به نام 
formula-eval
تعریف می‌شود. دلیل اینکه نام آن را مطابق خواسته شرح تمرین 
formula
نگذاشتیم، این بود که هنگام تعریف آن به ارور می‌خوردیم. احتمالا این ارور به این دلیل است که 
formula 
از قبل توسط 
html
تعریف شده است یا مرورگر استفاده شده اجازه تعریف آن را نمی‌دهد.

برای اینکه بتوان تگ
formula-eval
را تعریف کرد، ابتدا یک کلاس جدید که فرزند 
HTMLElement
است را تعریف کرده و نامش را 
FormulaEval
می‌گذاریم.

```javascript
class FormulaEval extends HTMLElement {
    constructor() {
        super();
    }

    // functions
}
```

سپس در آن تابعی را تعریف می‌کنیم که مطابق فرمول داده شده در 
attribute
تعریف شده 
(evaluator)
محاسبات را انجام دهد. ابتدا مطابق کد زیر، خود فرمول را می‌خوانیم. همچنین یک کپی از آن می‌سازیم که بتوانیم تغییرات مورد نیازمان را در آن بدهیم.

```javascript
const formula = this.getAttribute('evaluator');
let evaluatedFormula = formula;
```

در ادامه این تابع، ابتدا کل 
input
ها را بررسی کرده، 
id
هرکدام که در فرمول بود، مقدار آن را در فرمول جایگذاری می‌کنیم. 

```javascript
const listOfInputs = document.querySelectorAll('input');
for (const input of listOfInputs) {
    const id = input.id;
    const value = parseFloat(input.value) || 0;
    evaluatedFormula = evaluatedFormula.replace(
        new RegExp(`\\b${id}\\b`, 'g'),
        '(' + value + ')'
    );
}
```

در حلقه بالا، ابتدا 
id
و مقدار 
input
را خوانده و همچینین اگر مقدار داده شده در فرمول به صورت مقدار قابل قبولی از 
float
نبود، آن را صفر می‌کند. پس یعنی مقادیری مانند
1.3
یا
-4
یا 
2e5
قابل قبول هستند ولی مقداری مانند
123e
قابل قبول نیست و 0 فرض می‌شود.

سپس در ادامه حلقه بالا، هرجایی که 
id
این 
input
در فرمول دیده می‌شود، مقدار آن را جایگذاری می‌کند. برای این کار از رجکسی مناسبی استفاده می‌شود. در این رجکس بخش
`${id}`
بیانگر خود 
id
است و 
`b\`
بیانگر شروع یا پایان کلمه است. اگر از
`b\`
استفاده نمی‌کردیم، اگر 
id
یک ورودی شامل 
id
یک ورودی دیگر بود (برای مثال اگر 
id
یک ورودی 
count
و دیگری
discount
باشد) مشکل ایجاد می‌شد.

درنهایت عدد داده شده در ورودی را در پرانتز گذاشته و 
replace 
می‌کنیم.
دلیل وجود پرانتز این است که علامت 
`-`
در اعداد منفی موجب ایجاد مشکل در 
syntax
فرمول نشود.


در نهایت در تابع ساخته شده از تابع
`eval`
استفاده می‌کنیم تا فرمول را محاسبه کند. همچنین آن را در
`try-catch`
می‌گذاریم تا اگر مشکلی در فرمول بود، متوجه شویم و مطابق خواسته صورت پروژه ارور دهیم.

```javascript
try {
    const result = eval(evaluatedFormula);
    this.textContent = `Result: ${result}`;
} catch (e) {
    this.textContent = 'Error in formula';
}
```

تابع 
`eval`
تابعی قدرتمند در  جاواسکریپت است که هرنوع فرمول داده شده به آن را در حالت 
string
محاسبه کرده و عدد مناسب را خروجی می‌دهد.

پس طبق این توضیحات، تابع محاسبه فرمول در این کلاس به این صورت خواهد بود:

```js
evaluateFormula() {
    const formula = this.getAttribute('evaluator');
    let evaluatedFormula = formula;

    const listOfInputs = document.querySelectorAll('input');
    for (const input of listOfInputs) {
        const id = input.id;
        const value = parseFloat(input.value) || 0;
        evaluatedFormula = evaluatedFormula.replace(
            new RegExp(`\\b${id}\\b`, 'g'),
            '(' + value + ')'
        );
    }

    try {
        const result = eval(evaluatedFormula);
        this.textContent = `Result: ${result}`;
    } catch (e) {
        this.textContent = 'Error in formula';
    }
}
```

سپس باید یک تابع بگذاریم که تعدادی
eventListener
اضافه کند تا هنگام تغییر ورودی‌ها، حاصل فرمول به صورت 
responsive
تغییر کند. برای این کار با یک حلقه کل ورودی‌ها را بررسی کرده و یک
eventListener
اضافه می‌کنیم که با هر تغییر ورودی، تابع
`evaluateFormula`
محاسبه شود.

```js
setupEventListeners() {
    const listOfInputs = document.querySelectorAll('input');
    for (const input of listOfInputs) {
        input.addEventListener('input', () => this.evaluateFormula());
    }
}
```

در نهایت تابع 
`connectedCallback`
را تعریف می‌کنیم. این تابع هنگام اضافه شدن این عنصر به 
DOM
اجرا می‌شود. پس در آن دو تابعی که در بالا تعریف کرده‌ایم را 
call
می‌کنیم. 
تابع
`evaluateFormula`
برای اینکه در ابتدا که هنوز ورودی داده نشده است با مقدار پیش‌فرض (که طبق توضیحات بالا 0 است) فرمول محاسبه شود، و تابع
`setupEventListeners`
برای این است که 
eventListener
ها اضافه شوند.

```js
connectedCallback() {
    this.evaluateFormula();
    this.setupEventListeners();
}
```

پس توابع کلاس 
`FormulaEval`
به این صورت هستند. درنهایت با خط زیر، تگ
`formula-eval`
که در فایل
html
ما به کار رفته است را تعریف می‌کنیم.

```js
customElements.define('formula-eval', FormulaEval);
```

## فایل index.html

این همان فایل
html
مورد استفاده است. در این صفحه می‌خواهیم کاربر یک تابع چندجمله‌ای درجه 3 تعریف کند و مقدار خود آن، مشتقش و انتگرالش را در بازه یا نقاطی که کاربر می‌خواهد حساب کنیم.

برای اینکه صفحه ما زیباتر شود، از
bootstrap
استفاده می‌کنیم (تعدادی از کدهای 
bootstrap
اضافه شده، با کمک بخش آموزش
bootstrap
در سایت 
w3schools
نوشته شده اند).
برای اضافه کردن 
bootstrap
در تگ 
`head`
دو خط زیر را اضافه می‌کنیم:

```html
<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"></script>
```

همچنین برای اینکه 
script
ما نیز اضافه شود، نیز خط زیر را به 
`head`
اضافه می‌کنیم:

```html
<script src="script.js"></script>
```

حال به سراغ 
`body`
می‌رویم. ابتدا در بالای صفحه تیتر مناسب و توضیحات مورد نیاز را می‌دهیم:

```html
<div class="container-fluid p-5 bg-primary text-white text-center">
    <h1>Formula Evaluator</h1>
    <p>This page does several calculations based on the 3rd degree polynomial you provide for us</p> 
    <p>Note that the default value of the inputs is 0 (whether the input is empty or a non-valid number like '142e')</p> 
</div>
```

در
bootstrap
می‌توان با نام کلاسی که برای عناصر می‌گذاریم، به آنها 
style
مناسب داد. پس به آن برخی ویژگی‌ها مانند پدینگ مناسب، رنگ پس‌زمینه و قرار دادن متن در وسط را اضافه می‌کنیم.

سپس خود چندجمله‌ای را از کاربر ورودی می‌گیریم. برای این کار، فقط کافی است ضرایب پشت
x^n
برای ورودی را از کاربر بگیریم.

پس یک 
div
به عنوان
container
تعریف کرده و چهار ضریب خواسته شده را با 
`input`
می‌گیریم.
همچنین برای قابل فهم‌تر بودن آن برای کاربر، متن
placeholder
گذاشته و در آخر آن، نشان می‌دهیم که ضریب برای کدام جمله است. برای مثال برای  ضریبت
x^3
به این صورت ورودی می‌گیریم:

```html
<div class="input-group mb-3">
    <input type="text" class="form-control" id="x3" placeholder="coef of x^3">
    <span class="input-group-text">x^3</span>
</div>
```

همچنین برای بخش‌های مختلف، یک
div
جداگانه تعریف کرده و فرمولی که می‌خواهیم را در آن می‌گذاریم. برای مثال برای بخش محاسبه مشتق داریم:

```html
<div class="container bg-secondary text-white text-center px-5 py-3 my-5">
    <h3>Derivative Evaluator</h3>
    <p>Calculates the derivative of your polynomial based on the point you want</p>
    <div class="d-flex justify-content-between mt-4">
        <div class="d-flex justify-content-start gap-2">
        <input type="text" class="form-control" id="valueD" placeholder="value of x">
        </div>
        <formula-eval evaluator="x3 * 3 * valueD**2 + x2 * 2 * valueD + x1"></formula-eval>
    </div>
</div>
```

در آن ابتدا یک 
container
تعریف شده و در آن توضیحات لازم برای کاربر نوشته می‌شود. سپس یک
flex
تعریف شده که در سمت چپ آن ورودی(ها) قرار دارند و در سمت راست آن، تگ
`formula-eval`
که مطابق فرمول مشتق محاسبات را انجام می‌دهد.