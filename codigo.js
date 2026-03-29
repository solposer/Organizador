const hacerInput = document.getElementById('input-hacer');
const haciendoInput=document.getElementById('input-haciendo');
const hechoInput=document.getElementById('input-hecho');
const textareaInput=document.getElementById('textarea-input');
const hacerContainer=document.getElementById('hacer-container');
const haciendoContainer=document.getElementById('haciendo-container');
const hechoContainer=document.getElementById('hecho-container');
const addButton=document.getElementById('add-button');

let hacerList=[];
let haciendoList=[];
let hechoList=[];

addButton.addEventListener('click',()=>{
    let textInput=textareaInput.value.trim(); 
    const img = document.createElement('img');
    img.src = "icono.png";
    img.classList.add("icono-menu");
    img.draggable=false;
    let pContainer= document.createElement('p');
    pContainer.classList.add('pContainer');

    if(textInput!==""){
        nuevoDiv=document.createElement('div');
        nuevoDiv.appendChild(pContainer);
        nuevoDiv.appendChild(img);
        pContainer.textContent=textInput;
        nuevoDiv.draggable = true;   
        nuevoDiv.classList.add('tarjeta');

        if(haciendoInput.checked){    
            haciendoList.push(textInput);
            haciendoContainer.appendChild(nuevoDiv);
            haciendoInput.checked=false;
        } else if(hechoInput.checked){
            hechoList.push(textInput);
            hechoContainer.appendChild(nuevoDiv);
            hechoInput.checked=false;
        } else {
            hacerList.push(textInput);
            hacerContainer.appendChild(nuevoDiv);
            hacerInput.checked=false;
        };
        textareaInput.value="";
        menuDesplegable(img,nuevoDiv,pContainer);
    }
   
});

let dragged = null; 
document.addEventListener('dragstart', (e) => {
    dragged = e.target; 
});

const zonas = [hacerContainer, haciendoContainer, hechoContainer];

zonas.forEach(zona => {
    zona.addEventListener('dragover', (e) => {
        e.preventDefault();
        const tarjetaDestino = e.target.closest('.tarjeta');

        if (tarjetaDestino && tarjetaDestino !== dragged) {
            zona.classList.remove('over');
            const rect = tarjetaDestino.getBoundingClientRect();
            const mitad = rect.top + rect.height / 2;
            const estaArriba = e.clientY < mitad;
            document.querySelectorAll('.tarjeta').forEach(t => {
            t.classList.remove('drag-over-top', 'drag-over-bottom');
            });
            tarjetaDestino.classList.add(estaArriba ? 'drag-over-top' : 'drag-over-bottom');
            
        } else if(!tarjetaDestino){
            document.querySelectorAll('.tarjeta').forEach(t => {
            t.classList.remove('drag-over-top', 'drag-over-bottom');
            zona.classList.add('over');
          });
        }

    });

    zona.addEventListener('drop', (e) => {
        e.preventDefault();  
        zona.classList.remove('over');                                          // getBoundingClientRECT()
        const tarjetaDestino = e.target.closest('.tarjeta');           //  returns a DOMRect object containing the size and position 
        if(tarjetaDestino && tarjetaDestino!== dragged){               //    of an element relative to the viewport
            const rect = tarjetaDestino.getBoundingClientRect();       //top / y: Distance from the top of the viewport to the top of the element.
            const estaArriba = e.clientY < rect.top + rect.height / 2; // height: Total height of the element (includes padding and border-width). 
            if (estaArriba) {                                          // I  ->  client x
                zona.insertBefore(dragged, tarjetaDestino);            // v      clieny y
            } else {
                zona.insertBefore(dragged, tarjetaDestino.nextSibling);
            }
        } else if (!tarjetaDestino) {
          // Soltar en zona vacía → agregar al final
          zona.appendChild(dragged);
        }
        
        actualizarListas();
    });

     zona.addEventListener('dragleave', (e) => {
        // Solo limpia si el cursor sale realmente de la zona
        if (!zona.contains(e.relatedTarget)) {
          zona.classList.remove('over');
          document.querySelectorAll('.tarjeta').forEach(t => {
            t.classList.remove('drag-over-top', 'drag-over-bottom');
          });
        }
      });
    

});

function actualizarListas(){
    zonas.forEach(zona=>{
        if (zona==zonas[0]){
            hacerList = [...hacerContainer.querySelectorAll('.pContainer')]
            .map(p=> p.textContent);
        }
        else if(zona==zonas[1]){
            haciendoList=[...haciendoContainer.querySelectorAll('.pContainer')]
            .map(p=>p.textContent);
        }
        else if (zona==zonas[2]){
            hechoList=[...hechoContainer.querySelectorAll('.pContainer')]
            .map(p=>p.textContent)
        }
    })
}

document.addEventListener('dragend',()=>{
    document.querySelectorAll('.tarjeta').forEach(t => {
        t.classList.remove('drag-over-top', 'drag-over-bottom');
      });
    document.querySelectorAll('.allContainers').forEach(z => z.classList.remove('over'));
})

function menuDesplegable(img,nuevoDiv,pContainer){

    const borrarBtn=document.createElement('button');
    borrarBtn.classList.add('borrar-option');
    borrarBtn.textContent='borrar';

    const editarBtn= document.createElement('button');
    editarBtn.classList.add('editar-option');
    editarBtn.textContent='editar';

    const menu=document.createElement('div');
    menu.classList.add('menu');
    menu.appendChild(editarBtn);
    menu.appendChild(borrarBtn);
    img.parentElement.style.position = 'relative';
    img.parentElement.appendChild(menu);

    img.addEventListener('click',(e)=>{
        e.stopPropagation();
        menu.classList.toggle('open')
    });

    borrarBtn.addEventListener('click',()=>{
        nuevoDiv.remove();
        actualizarListas()
    });

   
    
    editarBtn.addEventListener('click',()=>{
        const editionDiv = document.createElement("div");
        const textarea2 = document.createElement("textarea");
        const check = document.createElement("button");
        check.innerText="listo";
        editionDiv.appendChild(textarea2);
        editionDiv.appendChild(check);
        nuevoDiv.parentNode.replaceChild(editionDiv,nuevoDiv);

        check.addEventListener("click",()=>{
            let textarea2Value=textarea2.value.trim();
            pContainer.textContent = textarea2Value;
            editionDiv.parentNode.replaceChild(nuevoDiv,editionDiv);
            actualizarListas();
            menu.classList.add('close');
            menuDesplegable(img,nuevoDiv,pContainer)
        })
        
    })
}
