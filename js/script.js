// ----------------------------------------DECLARACION DE VARIABLES--------------------------------------
const actionToggle = document.querySelector(".toggle");
const navMenu= document.querySelector(".nav-menu");
const info = document.querySelector("#info");
const bandera = false;
const imagen = document.getElementById("image");

const baseUrl = 'https://pokeapi.co/api/v2/pokemon/';
const poke = document.getElementById("poke");
const buscar = document.getElementById("buscar");
const nombre = document.querySelector("#nombre");
const image = document.querySelector("#image");

const detalle1 =document.getElementById("detalle1"),
    detalle2 =document.getElementById("detalle2"),
    detalle3 = document.getElementById("detalle3");

// ---------------------------------------------AL CARGAR EL DOM--------------------------------------------------------

function stateInitial(state, action){
    switch(action.type){
        case 'imagenAnimado':
            return state = action.type; //lo pasa a nuestro estado y lo devuelve
    }
}
const store = Redux.createStore(stateInitial);

function renderInit(){
    const clase = store.getState();
    imagen.classList.remove(clase);  //una vez obtenido el state inicial le asignamos ese valor a la etiqueta
}
renderInit();
store.subscribe(renderInit);

document.addEventListener("DOMContentLoaded", ()=>{
    store.dispatch({type:"imagenAnimado"}); //se le envia la clase que va a tener por defecto la imagen
})

// -------------------------------------TOGGLE DEL ICONO HAMBURGUESA Y ESTILOS----------------------------------------------------

function menu(state, action){
    // las asignamos a las propiedades de nuestro state
    state = {
        menu: action.type.clase1,
        animation: action.type.clase2,
        imagen: action.type.clase3
    }
    return state;
}
const store2 = Redux.createStore(menu);

function showMenu(){
    const menu = store2.getState();
    navMenu.classList.toggle(menu.menu);
    imagen.classList.remove(menu.animation);
    imagen.className =menu.imagen;
    // finalmente se obtienen esos valores para asignarlos a las etiquetas correspondientes para
    // no tener conflictos con el renderizado de los elementos.
}
showMenu();
store2.subscribe(showMenu);

actionToggle.addEventListener("click", ()=>{
    // Al cliquear el icono hamburguesa mandamos ciertas propiedades para el menu e imagen
    store2.dispatch(
        {
            type:{
                clase1:"menu-visible",
                clase2:"imagenAnimado",
                clase3:"imagen"
            }
        }
    );
    
});

// -----------------------------AL DAR CLIC Y BUSCAR UN POKEMON DEL API Y RENDRIZADO------------------------------------------------

function atraparPokemon(state, action){
    let url = baseUrl+action.type.namepokemon; //concatenamos la url mas el nombre del pokemon a buscar
    state = url;
    return state;
}

const store3 = Redux.createStore(atraparPokemon);

function renderPokemon(){
    let datos = store3.getState();
    // si el valor es undefined normalmente es al cargar la pagina, simplemente finalizamos para evitar alfun error.
    if(datos === 'https://pokeapi.co/api/v2/pokemon/undefined'){
        return;
    }
    
    // realizamos nuestra peticion fetch con nuestro state el cual guardo la url
    fetch(store3.getState())
    .then((response)=>{
        return response.json();
    })
    .then(response =>{
        // la solicitud nos devuelve todas las propiedades que le hallamos inidicado y las mandamos a otra funcion.
        mostrarPokemon(response.name, response.sprites.front_default, response);
    })

    function mostrarPokemon(name, img, response){
    // la funcion se encarga de renderizar los datos en las etiquetas html correspondientes.
     nombre.textContent = name;
     image.setAttribute('src', img);
     detalle1.textContent = "1.- "+response.moves[0].move.name;
     detalle2.textContent = "2.- "+response.moves[1].move.name;
     detalle3.textContent = "3.- "+response.moves[2].move.name;
     poke.value="";
    }
    
}
renderPokemon();
store3.subscribe(renderPokemon);

buscar.addEventListener("click", (bandera)=>{
    // mandamos el valor del input, asignamos nuevos estilos y se usa una bandera para indicar el cambio de algunos estilos en especifico.
    if(poke.value!= ''){ //si hay datos en el input realizara la busqueda.
    imagen.className = "imagenAnimado";
    bandera = true;
    
    if(bandera == true){
        info.className ="info-desabilitada";
        info.classList.remove("info");
    }
    store3.dispatch({
        type:{
            namepokemon: poke.value //mandamos el valor del input
        }
    });
    
    }else{
        // si no hay datos en el input el navegador lanzara una notificacion push al cliente.
        let warning = "Atencion Usuario";
        window.onload = ()=>{ Push.Permission.request(); }
        Push.create(warning,{
            body: "Porfavor Ingresa el nombre de un pokemon",
            icon:"img/warning.png",
            timeout: 6000,
            onClick: ()=>{
                window.focus();
                this.close();
            }
        });
    }
});
