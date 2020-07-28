


const currentPage = window.location.pathname;   //pega o nome da pagina atual (Ex: /instructors/3)
const menuItems = document.querySelectorAll("header .links a") //pega os links do cabeçalho

for (item of menuItems) {
    if (currentPage.includes(item.getAttribute("href"))) {  //se a pagina atual incluir o href do menu (intructors ou members) ele adicona a classe ativo
        item.classList.add("active");
    }
}
