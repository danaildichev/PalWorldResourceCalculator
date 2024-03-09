// ----------------------------------
// import data and interface handlers
import JsonHandler from "./Data/JsonHandler.js";
import InterfaceHandler from "./UI/InterfaceHandler.js";
import QueueInterfaceHandler from "./UI/QueueInterfaceHandler.js";
import RecipesInterfaceHandler from "./UI/RecipesInterfaceHandler.js";
import DataInterfaceHandler from "./UI/DataInterfaceHandler.js";
import InventoryInterfaceHandler from "./UI/InventoryInterfaceHandler.js";
import ResourceInfoModalInterfaceHandler from "./UI/ResourceInfoModalInterfaceHandler.js";


// -----------------
// init JSON handler
window.jsonHandler = new JsonHandler();

// ----------------------
// init interface handler
window.IH = new InterfaceHandler();

// ----------------------------
// init queue interface handler
window.QIH = new QueueInterfaceHandler();

// ----------------------------
// init data interface handler
window.DIH = new DataInterfaceHandler();

// --------------------------------
// init inventory interface handler
window.IIH = new InventoryInterfaceHandler();

// ------------------------------------------
// init resource info modal interface handler
window.RIMIH = new ResourceInfoModalInterfaceHandler();


// ===============================
// build recipes interface handler

// -------------------------------------------------
// get elements for recipes column show/hide handler
const showHide_recipesColumn =
{
    button: document.getElementById("btn_toggleDisplayOfRecipesColumn"),
    icon: document.getElementById("icon_toggleDisplayOfRecipesColumn"),
    chk: document.getElementById("chk_isDisplayed_col_recipes"),
    colsWrapper: document.getElementById("cols_wrapper"),
    colRecipes: document.getElementById("col_recipes"),
    colRecipesItems: document.getElementById("col_recipes_listItems"),
    colQueue: document.getElementById("col_queue"),
};

// ---------------------------------------------------------
// get all the elements needed for recipes interface handler
const els_RIH =
{
    showHide_recipesColumn
};

// ------------------------------
// init recipes interface handler
window.RIH = new RecipesInterfaceHandler(els_RIH);

// end build recipes interface handler
// ===================================
