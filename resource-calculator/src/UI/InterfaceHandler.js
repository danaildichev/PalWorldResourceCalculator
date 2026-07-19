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
    
    
    /**
     * Get search results as an alphabetically-sorted array, optionally
     * restricted to a resource group and to entries that have a recipe
     * (i.e. are actually craftable, not just raw materials).
     *
     * Plain objects keyed by numeric-looking IDs always enumerate in
     * ascending ID order in JS, regardless of insertion order, so an
     * array is returned here instead — it's the only way to control
     * display order (e.g. alphabetically) when IDs are numeric strings.
     *
     * @param {Object} Data
     * @param {String} search Lowercased search string.
     * @param {String} [group] A resource group, or 'all'.
     * @param {Boolean} [craftableOnly] Only include entries with a recipe.
     * @return {Array} Array of entries, each with an added `ID` property.
     */
    getFilteredSortedResults(Data, search, group = 'all', craftableOnly = false)
    {
        const results = [];

        for (const [ID, entry] of Object.entries(Data))
        {
            if (craftableOnly && entry.recipe == null) continue;
            if (group !== 'all' && entry.group !== group) continue;
            if (!entry.name.toLowerCase().includes(search)) continue;

            results.push({ ...entry, ID });
        }

        results.sort((a, b) => a.name.localeCompare(b.name));

        return results;
    }
    // end getFilteredSortedResults()


    /**
     * A neutral placeholder icon, used as the fallback `<img src>` when
     * a resource's real icon file doesn't exist yet (e.g. newly-added
     * items awaiting sourced game icons).
     *
     * @return {String} A `data:image/svg+xml` URI.
     */
    getFallbackImageDataUri()
    {
        return 'data:image/svg+xml;utf8,' + encodeURIComponent(
            '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">' +
                '<rect width="100" height="100" rx="12" fill="#27272a"/>' +
                '<path d="M28 66 L42 48 L54 60 L70 38 L80 66 Z" fill="#52525b"/>' +
                '<circle cx="37" cy="36" r="7" fill="#52525b"/>' +
            '</svg>'
        );
    }
    // end getFallbackImageDataUri()
    
    
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