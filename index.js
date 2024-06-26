import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js"
import { getDatabase, ref, push, onValue, remove } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js"

const appSettings = {
    databaseURL: "https://realtime-database-25c02-default-rtdb.firebaseio.com/"
}

const app = initializeApp(appSettings)
const database = getDatabase(app)
const shoppingListInDB = ref(database, "shoppingList")

const inputFieldEl = document.getElementById("input-field")
const addButtonEl = document.getElementById("add-button")
const shoppingListEl = document.getElementById("shopping-list")

addButtonEl.addEventListener("click", function() {
    // let inputValue = inputFieldEl.value
    
    // push(shoppingListInDB, inputValue)

    let newSubListRef = shoppingListInDB.push();
    newSubListRef.key = 'test';
    newSubListRef.set({});
    
    
    clearInputFieldEl()
})

onValue(shoppingListInDB, function(snapshot) {
    if (snapshot.exists()) {
        let itemsArray = Object.entries(snapshot.val())
    
        clearShoppingListEl()
        
        for (let i = 0; i < itemsArray.length; i++) {
            let currentItem = itemsArray[i]
            let currentItemID = currentItem[0]
            let currentItemValue = currentItem[1]
            
            appendItemToShoppingListEl(currentItem)
        }    
    } else {
        shoppingListEl.innerHTML = "No items here... yet"
    }
})

function clearShoppingListEl() {
    shoppingListEl.innerHTML = ""
}

function clearInputFieldEl() {
    inputFieldEl.value = ""
}

function appendItemToShoppingListEl(item) {
    let itemID = item[0]
    let itemValue = item[1]
    
    let newEl = document.createElement("li")
    
    newEl.textContent = itemValue
    
    //removes item on double click
    newEl.addEventListener("dblclick", function() {
        let exactLocationOfItemInDB = ref(database, `shoppingList/${itemID}`)
        
        remove(exactLocationOfItemInDB)
    })

    //adds sub list on single click
    newEl.addEventListener("click", function() {
        let exactLocationOfItemInDB = ref(database, `shoppingList/${itemID}`);

        // shoppingListInDB.instance
        //     .collection("top-level-collection")
        //     .doc("document-id-1")
        //     .collection("nested-subcollection")
        //     .doc("document-id-2")
        // const subItemListInDB = ref(shoppingListInDB, exactLocationOfItemInDB)
        console.log(shoppingListInDB)
        onValue(subItemListInDB, function(snapshot) {
            if (snapshot.exists()) {
                let itemsArray = Object.entries(snapshot.val())
            
                clearShoppingListEl()
                
                for (let i = 0; i < itemsArray.length; i++) {
                    let currentItem = itemsArray[i]
                    let currentItemID = currentItem[0]
                    let currentItemValue = currentItem[1]
                    
                    appendItemToShoppingListEl(currentItem)
                }    
            } else {
                shoppingListEl.innerHTML = "No items here... yet"
            }
        })
            
        
        // remove(exactLocationOfItemInDB)
    })
    
    shoppingListEl.append(newEl)
}