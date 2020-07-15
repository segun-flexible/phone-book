
const all = document.querySelector(".phone_list.all");
const fav = document.querySelector(".phone_list.fav");
const input = document.querySelectorAll("input[type='radio']");
const labels = document.querySelectorAll(".phoneHeadTitle label");
const textbox = document.querySelector(".textbox");
const editBox = document.querySelector(".editbox") 
const input_1 = document.querySelector("input.name");
const input_2 = document.querySelector("input.number");
const addBtn = document.querySelector(".add-new");
const closeAddNew = document.querySelector(".textbox span");
const saveBtn = document.querySelector("button.save");
const message = document.querySelector(".messageWrap");
const deleteAllIcon = document.querySelectorAll(".option span");
const searchBox = document.querySelector(".search.box");
const btnSearch = document.querySelector(".btn_search");



//Contact Data
let contactBox = JSON.parse(localStorage.getItem("contact_book")) || []
let recoverContactBox = JSON.parse(localStorage.getItem("contact_recover")) || [];
let favouriteBox = JSON.parse(localStorage.getItem("favourite_contact")) || []
let extraSaveFav = JSON.parse(localStorage.getItem("extra_save_liked")) || []

class Contact{
    
    //Adding Contact        
    addContact(){
        let data = {cName: input_1.value, cNum: input_2.value, liked: false, id:makeID(7)};
        
        if(data.cName !== "" && data.cNum !== ""){
            //Here i check If New Number Is Already Saved Before
        if(contactBox.findIndex(i => i.cName === data.cName) === -1 && contactBox.findIndex(i => i.cNum === data.cNum) === -1){
        contactBox.push(data)
        //Save To Storage Call
        saveToStorage(contactBox,recoverContactBox)

        //Populate UI
        populateUI(data)
        //Clears Fields
        clearFields()

        messageCheck("true")
        return contactBox
        }else{
            console.error("Error In Adding Name");
            messageCheck("false")
        }
        }
        else{
            messageCheck("null")
        }
        
         
    }

    
    //Delete
    deleteContact(id,index,indexF){
        
        //Save It To Backup Before Delete
        this.recover(id,null,"option1")

        //Delete it From Data
        contactBox.splice(index,1)
        //also from the favourite list
        favouriteBox.splice(favouriteBox.findIndex(i => i.id === id),1)

        saveToStorage(contactBox,recoverContactBox);
        defaultPopulation();

        

        //Delete From UI
        let deleteUI = Array.from(document.querySelectorAll(".phone_list.all li"));
        deleteUI[index].remove();


    }


    //Delete All Contact
    deleteAll(){
        //Delete All From data
        contactBox.map(i => this.recover(null,i.id,"option2"));
        contactBox = [];
        favouriteBox = [];
        saveToStorage(contactBox,recoverContactBox,favouriteBox)
        //Delete All From UI
        //Delete From UI
        let deleteUI = [...Array.from(document.querySelectorAll(".phone_list.all li")),...Array.from(document.querySelectorAll(".phone_list.fav li"))];
        deleteUI.forEach(i => i.remove())

    }

    //Favourite List
    favourite(id){
        let item = contactBox.find(i => i.id === id);
        let check = favouriteBox.findIndex(i => i.id === id);

        if(check === -1){
            item.liked = true
            favouriteBox.push(item);
            extraSaveFav.push(item);
            saveToStorage(contactBox,recoverContactBox)
            populateFav(item)
            isLiked();
        }
       

        
    }

    unliked(id){
        let item = contactBox.find(i => i.id === id);
        let check = favouriteBox.findIndex(i => i.id === id);

        if(check === -1){
            item.liked = false
            favouriteBox.push(item);
            extraSaveFav.push(item);
            saveToStorage(contactBox,recoverContactBox)
            populateFav(item)
            isLiked();
        }
    }

    //Recover Contact
    recover(id,id2,option){
        

        if(option === "option1"){
            let contactToRecover = contactBox.find(i => i.id === id);
            
             
            let check = recoverContactBox.findIndex(i => i.id === id)
        if(check === -1){
            recoverContactBox = [...recoverContactBox,contactToRecover];
            saveToStorage(contactBox,recoverContactBox)
        } 
        }
        else{
            let contactToRecover = contactBox.find(i => i.id === id2);
            let check = recoverContactBox.findIndex(i => i.id === id2)
            if(check === -1){
            recoverContactBox = [...recoverContactBox,contactToRecover];
            saveToStorage(contactBox,recoverContactBox)
        }
            
        }

       
        
    }




}
//Init
let myContact = new Contact();


//Checking Likes
function isLiked(){

try{

[fav,all].forEach(i => i.querySelectorAll("ul li").forEach(i => {
let id = i.dataset.id;

let check = favouriteBox.find(i => i.id === id && i.liked === true);

check ? i.querySelector(".fa-heart").classList.add("like") : i.querySelector(".fa-heart").classList.remove("like")

}))

}catch(err){
    console.error(err)
}

//add like css to all liked


}

//Populate Favourite

function populateFav(favC){
fav.querySelector("ul").insertAdjacentHTML("beforeend",`
<li data-id=${favC.id}>${favC.cName}<br> <span class="number">${favC.cNum}</span> <div class="option-c"><span class="c_option delete" data-id=${favC.id} title="Delete"><i class="fa fa-trash"></i></span> <span data-id=${favC.id} class="c_option edit" title="Edit"><i class="fa fa-pencil-square-o"></i></span> <span data-id=${favC.id} class="c_option add_to_fav" title="Add To Favourite"><i class="fa fa-heart"></i></span></div></li>
`);

//Fav
}


//Populate To UI
function populateUI(allC){
all.querySelector("ul").insertAdjacentHTML("beforeend",`
<li data-id=${allC.id}>${allC.cName}<br> <span class="number">${allC.cNum}</span> <div class="option-c"><span class="c_option delete" data-id=${allC.id} title="Delete"><i class="fa fa-trash"></i></span> <span data-id=${allC.id} class="c_option edit" title="Edit"><i class="fa fa-pencil-square-o"></i></span> <span data-id=${allC.id} class="c_option add_to_fav" title="Add To Favourite"><i class="fa fa-heart"></i></span></div></li>
`);

//Fav
}

function defaultPopulation(){
all.querySelector("ul").innerHTML = "";

if(contactBox.length > 0){
contactBox.forEach(data =>{
    
   all.querySelector("ul").insertAdjacentHTML("beforeend",`<li data-id=${data.id}>${data.cName}<br> <span class="number">${data.cNum}</span> <div class="option-c"><span class="c_option delete" data-id=${data.id} title="Delete"><i class="fa fa-trash"></i></span> <span data-id=${data.id} class="c_option edit" title="Edit"><i class="fa fa-pencil-square-o"></i></span> <span data-id=${data.id} class="c_option add_to_fav" title="Add To Favourite"><i class="fa fa-heart"></i></span></div></li>`)
 });

 //Favourite
 fav.querySelector("ul").innerHTML = "";
favouriteBox.forEach(data =>{
    
   fav.querySelector("ul").insertAdjacentHTML("beforeend",`<li data-id=${data.id}>${data.cName}<br> <span class="number">${data.cNum}</span> <div class="option-c"><span class="c_option delete" data-id=${data.id} title="Delete"><i class="fa fa-trash"></i></span> <span data-id=${data.id} class="c_option edit" title="Edit"><i class="fa fa-pencil-square-o"></i></span> <span onclick="return false" data-id=${data.id} class="c_option add_to_fav" title="Remove Favourite"><i class="fa fa-heart"></i></span></div></li>`)
 })
}

}

//Add New Contact BTN
addBtn.addEventListener("click",()=>{textbox.style.display = "flex"})
saveBtn.addEventListener("click",myContact.addContact);
textbox.addEventListener("keydown",(e)=>{
    e.keyCode === 13 ? myContact.addContact() : "";
})
//Close Add New
closeAddNew.addEventListener("click",()=>{textbox.style.display = "none"})
editBox.addEventListener("click",(e)=>{ e.target.classList.contains("fa") ? editBox.style.display = "none" : ""})


//Message To Display When You Want To Add
function messageCheck(val){
        if(val === "true"){
            message.classList.add("clearMessage")
            message.innerHTML = `<div class="message" style="background: #52ab0f;padding: 10px;border-radius: 5px;"><i class="fa fa-check"></i> New Contact Added</div>`;
            setTimeout(()=>{message.classList.remove("clearMessage")},3000)
        }
        else if(val === "false"){
            message.classList.add("clearMessage")
            message.innerHTML = `<div class="message" style="background: #ab330f;padding: 10px;border-radius: 5px;"><i class="fa fa-times"></i> Contact Already Added Before</div>`;
            setTimeout(()=>{message.classList.remove("clearMessage")},3000)

        }
        else if(val === "null"){
            message.classList.add("clearMessage")
            message.innerHTML = `<div class="message" style="background: #ab330f;padding: 10px;border-radius: 5px;"><i class="fa fa-times"></i> Fields Cannot Be Empty</div>`;
            setTimeout(()=>{message.classList.remove("clearMessage")},3000)
        }
    }


//Store To Storage (Locally)

function saveToStorage(contact,recover,favouriteList = favouriteBox, likes = favouriteBox){
localStorage.setItem("contact_book",JSON.stringify(contact));
localStorage.setItem("contact_recover",JSON.stringify(recover));
localStorage.setItem("favourite_contact",JSON.stringify(favouriteBox));
localStorage.setItem("extra_save_liked",JSON.stringify(extraSaveFav));
}


//Clear Fields
function clearFields(){
    input_1.value = "";
    input_2.value = "";
    input_1.focus()
}




//Create ID For Each Contact
function makeID(leng){
    let result = '';
    let chact = `ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890!@#$%^&*()_+?`;
    
    for(i=0;i < leng;i++){
    result += chact.charAt(Math.floor(Math.random() * chact.length))
    }
    return result
    } 


//Event Delegation On Phone List
all.parentElement.addEventListener("click",function(e){

    //If Button CLicked Is Delete
    if(e.target.classList.contains("fa-trash")){
        let parent = e.target.parentElement.parentElement.parentElement
        //Get The Id
        let id = parent.dataset.id;
        let index = contactBox.findIndex(i => i.id === id);
        let indexF = favouriteBox.findIndex(i => i.id === id);
        myContact.deleteContact(id,index,indexF)
    }
    else if(e.target.classList.contains("fa-pencil-square-o")){
        let id = e.target.parentElement.dataset.id;
        
       
        //Display The Texbox For Editing
        editBox.style.display = "flex";
    }

    //Like button is Trigger
    else if(e.target.classList.contains("fa-heart")){
        if(e.target.classList.contains("like")){
            let id = e.target.parentElement.dataset.id;
            myContact.unliked(id);

            //Remove Css Style
            e.target.classList.remove("like");
            
            //Remove From Data Also
            let indexF = favouriteBox.findIndex(i => i.id === id);

            let indexC = contactBox.findIndex(i => i.id === id);
            


            //Set it back to false
            contactBox[indexC].liked = false;
            favouriteBox[indexF].liked = false;

            favouriteBox.splice(indexF,1); 
            


            saveToStorage(contactBox,recoverContactBox);
            defaultPopulation();
            isLiked()

        }
        else{
            myContact.favourite(e.target.parentElement.dataset.id);
            
            //Add Css Style
            e.target.classList.add("like")
        }
        
    }

})




//When DeleteAll Button Is Trigger
deleteAllIcon[0].addEventListener("click",function(){
    myContact.deleteAll()
})

//When Recover Contacts Button Clicked
deleteAllIcon[1].addEventListener("click",()=>{
    contactBox = [...recoverContactBox];
    favouriteBox = [...extraSaveFav]
    saveToStorage(contactBox,recoverContactBox,favouriteBox);
    defaultPopulation()
});

//Search
searchBox.addEventListener("change",findContact);
searchBox.addEventListener("keyup",findContact);
btnSearch.addEventListener("click",findContact)

function findContact(){
    let word = searchBox.value;
    let findit = contactBox.find(i => i.cName === word.toLowerCase());
    all.querySelector("ul").innerHTML = `<li data-id=${findit.id}>${findit.cName}<br> <span class="number">${findit.cNum}</span> <div class="option-c"><span class="c_option delete" data-id="${findit.id}" title="Delete"><i class="fa fa-trash"></i></span> <span data-id="${findit.id}" class="c_option edit" title="Edit"><i class="fa fa-pencil-square-o"></i></span> <span data-id="${findit.id}" class="c_option add_to_fav" title="Add To Favourite"><i class="fa fa-heart"></i></span></div></li>`
}

/* const regex = new RegExp(word,'gi'); */


//Toggle Between Contact Tabs
input.forEach(i =>{
i.addEventListener("click",(e)=>{
let id = e.target.id;
if(id === "fav"){
fav.classList.add("show");
all.classList.add("hide");
labels[0].classList.remove("after")
labels[1].classList.add("after")

}else{
fav.classList.remove("show");
all.classList.remove("hide")
all.classList.add("show")
labels[1].classList.remove("after")
labels[0].classList.add("after")
}
})
})




//Init
function init(){

//Default Population
defaultPopulation();
isLiked()
}

document.addEventListener("DOMContentLoaded",init)