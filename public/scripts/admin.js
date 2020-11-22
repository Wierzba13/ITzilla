const addPostBtn = document.querySelector('#addPost');
const delPostBtn = document.querySelector('#delPost');
const addAdminBtn = document.querySelector('#addAdmin');

let adminForms = [
    document.querySelector('#addPostForm'),
    document.querySelector('#delPostForm'),
    document.querySelector('#addAdminForm')
];
let hideForms = adminForms.slice(1, adminForms.length);

hideForms.forEach(form => {
    form.style.display = 'none';
});

let toggleForms = (index) => {
    adminForms.forEach(form => {
        form.style.display = 'none';
    });
    adminForms[index].style.display = 'block';
}
addPostBtn.addEventListener('click', () => toggleForms(0));
delPostBtn.addEventListener('click', () => toggleForms(1));
addAdminBtn.addEventListener('click', () => toggleForms(2));