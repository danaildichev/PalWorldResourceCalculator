export default class InterfaceHandler
{
    /**
     * Parent class for other interface handlers.
     *
     * @return {undefined}
     */
    constructor()
    {
        this.JSON = window.jsonHandler;
    }
    // end constructor()
    
    
    /**
     * Save a file to the local system.
     *
     * The method below uses the File System Access API when it's supported
     * and else falls back to the classic approach.
     * In both cases the function saves the file,
     * but in case of where the File System Access API is supported,
     * the user will get a file save dialog
     * where they can choose where the file should be saved.
     *
     * @see https://web.dev/patterns/files/save-a-file
     *
     * @param {Blob} blob
     * @param {String} suggestedName
     * @return {Promise<void>}
     */
    async saveFile(blob, suggestedName)
    {
        // Feature detection. The API needs to be supported
        // and the app not run in an iframe.
        const supportsFileSystemAccess =
            'showSaveFilePicker' in window &&
            (() => {
                try {
                    return window.self === window.top;
                } catch {
                    return false;
                }
            })();
        
        // If the File System Access API is supported…
        if (supportsFileSystemAccess) {
            try {
                // Show the file save dialog.
                const handle = await showSaveFilePicker({
                    suggestedName,
                });
                // Write the blob to the file.
                const writable = await handle.createWritable();
                await writable.write(blob);
                await writable.close();
                return;
            } catch (err) {
                // Fail silently if the user has simply canceled the dialog.
                if (err.name !== 'AbortError') {
                    console.error(err.name, err.message);
                    return;
                }
            }
        }
        
        
        // Fallback if the File System Access API is not supported…
        // Create the blob URL.
        const blobURL = URL.createObjectURL(blob);
        // Create the `<a download>` element and append it invisibly.
        const a = document.createElement('a');
        a.href = blobURL;
        a.download = suggestedName;
        a.style.display = 'none';
        document.body.append(a);
        // Programmatically click the element.
        a.click();
        // Revoke the blob URL and remove the element.
        setTimeout(() => {
            URL.revokeObjectURL(blobURL);
            a.remove();
        }, 1000);
    }
    // end saveFile()
    
    
    /**
     * Send a Blob to saveFile().
     *
     * @param {String} snapshot
     * @param {String} suggestedName
     * @return {Promise<void>}
     */
    async saveToLocal(snapshot, suggestedName)
    {
        // turn snapshot into a Blob
        const blob = new Blob([snapshot], { type: 'application/json' });
        
        // save the Blob as a file
        await this.saveFile(blob, suggestedName);
    }
    // end saveToLocal()
    
    
    /**
     * Generic getter for a JSON Object.
     *
     * @param {String} Object The name of the Object to get.
     * @return {*}
     */
    getJSON(Object) { return this.JSON[Object] }
    // end getJSON()
    
    
    /**
     * Get an entry from resources.json by entry ID.
     *
     * @param {String} ID
     * @return {Object}
     */
    getResourceAt(ID) { return this.JSON.getEntryAt('resources', ID) }
    // end getResourceAt()
    
    
    /**
     * Get the resource groups array from JsonHandler.
     *
     * @return {Array}
     */
    getListOfResourceGroups() { return this.JSON.resourceGroups }
    // end getListOfResourceGroups()
    
    
    /**
     * Get key-value pairs of resource group names and their icons
     *
     * @return {Object}
     */
    getResourceGroupsIcons()
    {
        return {
            all: "fa-solid fa-eye",
            craft: "fa-solid fa-hand",
            food: "fa-solid fa-pizza-slice",
            meds: "fa-solid fa-mortar-pestle",
            tech: "fa-solid fa-wrench",
            build: "fa-solid fa-hammer",
            armor: "fa-solid fa-shield-halved",
            weapons: "fa-solid fa-gun",
            ammo: "fa-solid fa-box",
            spheres: "fa-solid fa-circle"
        };
    }
    // end getResourceGroupsIcons()
    
    
    /**
     * Get an entry from recipes.json by entry ID.
     *
     * @param {String} ID
     * @return {Object}
     */
    getRecipeAt(ID) { return this.JSON.getEntryAt('resources', ID) }
    // end getRecipeAt()
    
    
    /**
     * Get an entry from JsonHandler.DataTable.json by entry ID
     *
     * @param {Number|String} ID
     * @return {Object}
     */
    getInventoryAt(ID) { return this.JSON.getValueAt('resources', ID, 'inventory') }
    // end getInventoryAt()
    
    
    /**
     * Set a value for inventory for an entry in JsonHandler.DataTable by entry ID
     *
     * @param {String} ID
     * @param {Number|String} value
     * @return {undefined}
     */
    setInventoryAt(ID, value)
    {
        this.JSON.setValueAt('resources', ID, 'inventory', value);
    }
    // end setInventoryAt()
    
    
    /**
     * Get an entry from DataTable by entry ID
     *
     * @param {String} ID
     * @return {Object}
     */
    getDataTableEntryAt(ID) { return this.JSON.getEntryAt('resources', ID) }
    // end getDataTableEntryAt()
    
    
    getSearchResults(Data, search)
    {
        // create an empty object to hold search results
        let searchResults = {}
        
        // using keys in Data
        for (const key of Object.keys(Data))
        {
            // get entry and name as lowercase
            const entry = Data[key];
            const name = entry.name.toLowerCase();
            
            // if name contains search string insert entry to search results
            if (name.includes(search)) { searchResults[key] = entry }
        }
        // end using keys in Data
        
        // return search results
        return searchResults;
        
    }
    // end getSearchResults()
    
    
    /**
     * Add a resource ID to favorites list
     *
     * @param {String} ID The resource to be added.
     * @return {undefined}
     */
    addRecipeToFavorites(ID)
    {
        alert('TO DO: build a favorites list and add recipe ID ' + ID + ' to it.');
    }
    // end addRecipeToFavorites()
    
    
    /**
     * Remove a resource ID from favorites list
     *
     * @param {String} ID The resource to be removed.
     * @return {undefined}
     */
    removeRecipeFromFavorites(ID)
    {
        alert('TO DO: build a favorites list and remove recipe ID ' + ID + ' from it.');
    }
    // end addRecipeToFavorites()
    
    
    /**
     * Generic show modal.
     *
     * @param {String} elID
     * @return {undefined}
     */
    showModal(elID) { document.getElementById(elID).showModal(); }
    // end showModal()
    
    
    /**
     * Generic close modal.
     *
     * @param {String} elID
     * @return {undefined}
     */
    closeModal(elID) { document.getElementById(elID).close(); }
    // end closeModal()
    
    
    
    
}