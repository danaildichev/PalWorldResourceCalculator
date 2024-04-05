import InterfaceHandler from "./InterfaceHandler.js";
import RecipesColumnShowHideHandler from "./RecipesColumnShowHideHandler.js";
export default class RecipesInterfaceHandler extends InterfaceHandler
{
    /**
     * Handles UI and events the recipes column.
     *
     * @param {Object} els A collection of collections of HTMLElements
     * @return {undefined}
     */
    constructor(els)
    {
        super();
        this.els = els;
        this.QIH = window.QIH;
        this.RCSHH = new RecipesColumnShowHideHandler(this.els.showHide_recipesColumn);
        document.addEventListener('DOMContentLoaded', () =>
        {
            setTimeout(() =>
            {
                // -------------------
                // fade in the recipes
                this.els.showHide_recipesColumn.colRecipesItems.classList.replace('opacity-0', 'opacity-100');
                
                // -------------------------------
                // clear the loading splash screen
                setTimeout(() =>
                {
                    document.getElementById('modal_loadingSplashScreen').classList.remove('modal-open');
                    
                }, 1000);
                
            }, 50);
        });
    }
    // end constructor()
    
    
    /**
     * Get all entry IDs in recipes.json as an array.
     *
     * @return {string[]}
     */
    getRecipeIDs() { return this.JSON.getKeysOf('resources'); }
    // end getRecipeIDs()
    
    
    /**
     * Get the value for 'name' of an entry in resources.json
     *
     * @param ID
     * @return {*}
     */
    getResourceName(ID) { return this.JSON.getValueAt('resources', ID, 'name') }
    // end getResourceName()
    
    
    /**
     * Using the IDs of the entries in recipes.json,
     * get a collection of resources from JsonHandler.DataTable
     *
     * @return {Object} Created with JsonHandler.collectFrom()
     */
    getRecipesData()
    {
        const recipesKeys = Array.from(this.JSON.getKeysOf('resources'));
        console.log(recipesKeys);
        return this.JSON.collectFrom(this.JSON.resources, recipesKeys);
    }
    // end getRecipesData()
    
    
    /**
     * Pass a recipe ID to QueueInterfaceHandler
     *
     * @param {Number|String} ID
     * @return {undefined}
     */
    addRecipeToQueue(ID)
    {
        // pass ID to QueueInterfaceHandler
        // QIH will take over disabling 'btn-addToQueue-ID' if this ID is a new entry
        this.QIH.acceptNewItemFromRecipesColumn(ID);
        
    }
    // end addRecipeToQueue()
    
}