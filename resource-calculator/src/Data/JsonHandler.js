// -----------
// import json
import inventory from "../JSON/inventory.js";
import resources from "../JSON/resources.js";
import recipes from "../JSON/recipes.js";
import queue from "../JSON/queue.js";
import favorites from "../JSON/favorites.js";

// ------------------------
// import Clipboard handler
import ClipboardHandler from "./ClipboardHandler.js";


// -----------------------------
export default class JsonHandler
{
    constructor()
    {
        this.inventory = inventory;
        this.resources = resources;
        this.recipes = recipes;
        this.queue = queue;
        this.favorites = favorites;
        this.DataTable = this.buildDataTable();
        this.buildCollectionsOfUsesForResourcesFromRecipes();
        this.Clipboard = new ClipboardHandler();
        this.Clipboard.init(); // async checks for clipboard permissions
        this.resourceGroups = ["all", "craft", "food", "meds", "tech", "build", "armor", "weapons", "ammo", "spheres"];
    }
    // end constructor
    
    
    /**
     * Compile resources, inventory, and recipes JSON into  one object
     *
     * @return {Object}
     */
    buildDataTable()
    {
        // --------------------
        // start with resources
        let DataTable = this.resources
        
        // ------------------------
        // append accompanying data
        for (const resourceID in DataTable)
        {
            // append inventory as exists in inventory.json at time of page load
            DataTable[resourceID].inventory = this.getEntryAt('inventory', resourceID);
            
            // append recipe if exists
            const recipe = this.getEntryAt('recipes', resourceID);
            if (recipe !== undefined) { DataTable[resourceID].recipe = recipe; }
            
            // create an empty list to hold this resource's uses
            // e.g. which recipes use this resource
            DataTable[resourceID].usedInRecipesFor = [];
            
        }
        
        // return data
        return DataTable;
        
    }
    // end buildDataTable()
    
    
    /**
     * Populate every DataTable entry's 'usedInRecipesFor' array with objects
     * that contain the ID of the recipe and the required qty for corresponding entry.
     * E.g. DataTable entry X, Bone, is used in recipe Y, Cement, with qty 2.
     * Since DataTable entry Y has a 'recipe' key that contains {id: X, qty: 2},
     * this function reciprocates {id: Y, qty: 2} in DataTable entry X's 'usedInRecipesFor' key.
     *
     * @return {undefined}
     */
    buildCollectionsOfUsesForResourcesFromRecipes()
    {
        // iterate through each recipe
        for (const recipeID of Object.keys(this.recipes))
        {
            // get the ingredients list for the recipe in the current iteration
            const ingredientsList = this.recipes[recipeID];
            
            // for each ingredient in ingredientsList
            // ingredient is an object that contains
            // the ingredient's resource id and required qty
            // to make 1 instance of recipeID
            ingredientsList.forEach((ingredient) =>
            {
                // create an object that holds a 'use' for the ingredient
                // where in 'use' is: the recipeID that the ingredient is used in and what qty
                const use = {id: recipeID, qty:ingredient.qty};
                
                // get a reference to the 'usedInRecipesFor' array of the ingredient's record in DataTable
                const useTarget = this.DataTable[ingredient.id].usedInRecipesFor;
                
                // push the 'use' to the array
                useTarget.push(use);
                
            });
            // end for each ingredient in ingredientsList
        }
        // end iterate through each recipe
    }
    // end buildCollectionsOfUsesForResourcesFromRecipes()
    
    
    /**
     * Get the keys of a JSON Object.
     *
     * @param {String} json
     * @return {string[]}
     */
    getKeysOf(json) { return Object.keys(this[json]) }
    
    
    /**
     * Get the entries of a JSON Object.
     *
     * @param {String} json
     * @return {unknown[]}
     */
    getEntriesOf(json) { return Object.values(this[json]) }
    
    
    /**
     * Get an entry in a JSON Object by its ID.
     *
     * @param {String} json
     * @param {String} ID
     * @return {*}
     */
    getEntryAt(json, ID) { return this[json][ID] }
    
    
    /**
     * Get a value by its key from a record in a JSON Object.
     *
     * @param {String} json
     * @param {String} ID
     * @param {String} key
     * @return {*}
     */
    /* getValueAt(json, ID, key) { return this.getEntryAt(json, ID)[key] } */
    getValueAt(json, ID, key)
    {
        return this.getEntryAt(json, ID)[key];
    }
    // end getValueInEntryByKey()
    
    
    /**
     * Set a value for an entry in a JSON object by reference to entry ID and key name.
     *
     * @param {String} json
     * @param {String} ID
     * @param {String} key
     * @param {String} value
     * @return {undefined}
     */
    setValueAt(json, ID, key, value)
    {
        this[json][ID][key] = value;
    }
    // end setValueAt()
    
    
    /**
     * Get a Map from a JSON Object.
     *
     * @param {String} json
     * @return {Map<string, unknown>}
     */
    convertToMap(json) { return new Map(Object.entries(this[json])) }
    // end convertToMap()
    
    
    /**
     * Get a JS Object from a Map.
     *
     * @param {Map} map
     * @return {Object}
     */
    convertToObject(map) { return Object.fromEntries(map.entries()); }
    // end convertToObject()
    
    
    /**
     * Take a subset of a JSON Object by array of IDs.
     *
     * @param {Object} json
     * @param {Array} keys
     * @return {Object}
     */
    collectFrom(json, keys)
    {
        let collection = {};
        for (const key of keys) { collection[key] = json[key]; }
        return collection;
    }
    // end collectFrom()
    
    
    /**
     * Create a custom object from a target JSON Object and a list of desired criteria to pull from it.
     *
     * @param {String} Object The JSON file to use. e.g. 'DataTable'.
     * @param {Array} criteria List of details to pull out. e.g ['name', 'inventory'].
     * @param {Boolean} convertToObject Whether to return a JS Object instead of Map. Default false.
     * @return {Map<any, any>|Object}
     */
    makeSnapshot(Object, criteria, convertToObject = false)
    {
        // create a new Map
        let snapshot = new Map();
        
        // get the JSON Object and it's keys
        const JSON = this[Object];
        const jsonKeys = this.getKeysOf(Object);
        
        // for each key in the JSON Object (e.g. resource ID)
        for (const jsonKey of jsonKeys)
        {
            // make an object to hold the list of criteria we are looking for
            let entryForSnapshot = {};
            
            // for each 'detail' we are looking for
            // make an entry to set into the snapshot
            criteria.forEach(detail => { entryForSnapshot[detail] = JSON[jsonKey][detail]; });
            
            // set the entry into snapshot
            snapshot.set(jsonKey, entryForSnapshot);
        }
        
        // return the snapshot
        return (convertToObject) ? this.convertToObject(snapshot) : snapshot;
        
    }
    // end makeSnapshot()
    
    
}