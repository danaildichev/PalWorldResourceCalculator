import InterfaceHandler from "./InterfaceHandler.js";

export default class InventoryInterfaceHandler extends InterfaceHandler
{
    constructor()
    {
        super();
    }
    
    // -------------------------------------------------------
    // get inventory at: See InterfaceHandler.getInventoryAt()
    // set inventory at: See InterfaceHandler.setInventoryAt()
    
    // --------------------------------------
    // class name for inventory input fields:
    // 'inventory-input-resource-'+ID
    
    
    /**
     * Take an inventory snapshot from DataTable and return it as JSON (for data export modal).
     *
     * @return {String}
     */
    stringifyInventorySnapshot()
    {
        // get snapshot
        const snapshot = this.JSON.makeSnapshot('resources', ['inventory'], true);
        
        // extract inventory value from snapshot structure
        for (const ID of Object.keys(snapshot)) { snapshot[ID] = Number(snapshot[ID]['inventory']); }
        
        // return data extracted from snapshot as stringified JSON
        return JSON.stringify(snapshot);
    }
    // end stringifyInventorySnapshot()
    
    
    /**
     * Save an inventory snapshot to local files. For use in data export modal.
     *
     * @see IntefaceHandler.saveToLocal()
     *
     */
    async saveJSON_inventory()
    {
        // pass inventory snapshot to InterfaceHandler
        const fileContent = `export default ${this.stringifyInventorySnapshot()}`;
        await this.saveToLocal(fileContent, 'inventory.js')
    }
    // end saveToJSON_inventory()
    
    
    validateInventoryValue(value)
    {
        // make sure value is only numbers
        const regex_isOnlyNumbers = /^\d+$/;
        return regex_isOnlyNumbers.test(value);
    }
    
    
    /**
     * Get a list of all the inventory input fields for a particular resource ID.
     *
     * @param {Number|String} ID
     * @return {Array} List of HTMLElements
     */
    getInventoryInputFieldsFor(ID)
    {
        // list of class names to search for
        const classNames = [`.inventory-input-resource-${ID}`];
        
        // create an array to hold class name query results
        const queryResults = [];
        
        // for each class name to search for, push query results
        classNames.forEach((className) =>
        {
            queryResults.push(...document.querySelectorAll(className));
        });
        
        // return query results
        return queryResults;
    }
    // end getInventoryInputFieldsFor()
    
    
    /**
     * Update values in inventory input fields for a Resource ID.
     *
     * @param {Number|String} ID
     * @param {Number|String} value
     * @return {undefined}
     */
    updateInventoryInputFields(ID, value)
    {
        const inputFields = this.getInventoryInputFieldsFor(ID);
        inputFields.forEach((field) => { field.value = value; });
        
        // update table UIs
        window.QIH.acceptInventoryIncrementEvent_updateQueueItemUIFor(ID);
    }
    // updateInventoryInputFields()
    
    
    /**
     * Decrement the inventory of a Resource and update instances of input fields for that Resource's inventory.
     *
     * @param {Number|String} ID
     * @return {undefined}
     */
    decrementInventoryFor(ID)
    {
        // decrement or make 0
        let decremented =  --this.JSON.resources[ID].inventory;
        if (decremented < 0) { decremented = 0 }
        this.setInventoryAt(ID, decremented);
        
        // update input fields
        this.updateInventoryInputFields(ID, decremented);
        
        // update table UIs
        window.QIH.acceptInventoryDecrementEvent_updateQueueItemUIFor(ID)
    }
    // end decrementInventoryFor()
    
    
    /**
     * Increment the inventory of a Resource and update instances of input fields for that Resource's inventory.
     *
     * @param {Number|String} ID
     * @return {undefined}
     */
    incrementInventoryFor(ID)
    {
        // increment the inventory count
        // update values in inventory input fields for this ID
        const incremented = ++this.JSON.resources[ID].inventory;
        this.updateInventoryInputFields(ID, incremented);
    }
    // end incrementInventoryFor()
    
    
    /**
     * Handle changes to an inventory input field.
     * - Validates input and handles validation UI
     * - Updates inventory if input is valid.
     *
     * @param {String} ID A resource ID (e.g. an item in JSON.DataTable).
     * @param {String} value The input value to be validated for containing only numbers.
     * @param {HTMLElement} el The inventory input field.
     * @param {String} errorMessageElID The element ID of the corresponding error message for the inventory input field.
     *
     * @return {undefined}
     */
    setInventoryFor(ID, value, el, errorMessageElID)
    {
        // get the error message HTMLElement that corresponds to the inventory input field for 'ID'
        const thisResourcesHiddenErrorMessage = document.getElementById(errorMessageElID)
        
        // get the plus/minus buttons for this inventory field
        const btns = document.querySelectorAll(`.btn_inventoryChange-${ID}`);
        
        // validate inventory value
        const isOnlyNumbers = this.validateInventoryValue(value);
        
        // if value is "good"
        if(isOnlyNumbers)
        {
            // enable plus/minus buttons for this inventory field
            btns.forEach((btn) => { btn.classList.remove('btn-disabled') });
            
            // clear error text color
            el.classList.replace('focus:ring-error', 'focus:ring-info');
            el.classList.replace('text-error', 'text-info');
            el.classList.remove('border-2');
            el.classList.remove('border-error');
            thisResourcesHiddenErrorMessage.classList.add('hidden');
            
            // update inventory
            this.setInventoryAt(ID, value);
            
            // update inventory input fields
            this.updateInventoryInputFields(ID, value);
            
            // update table UIs
            window.QIH.acceptInventoryInputEvent_updateQueueItemUIFor(ID);
        }
        
        // else trigger error UI
        else
        {
            // disable plus/minus buttons for this inventory field
            btns.forEach((btn) => { btn.classList.add('btn-disabled') });
            
            el.classList.replace('focus:ring-info', 'focus:ring-error');
            el.classList.replace('text-info', 'text-error');
            el.classList.add('border-2');
            el.classList.add('border-error');
            thisResourcesHiddenErrorMessage.classList.remove('hidden');
        }
    }
    // end setInventoryFor()
    
    
    // ===========================================================
    // functions for:
    // - accepting queue items events,
    // - handling them,
    // - and then passing UI update responsibilities to window.QIH
    
    /**
     * Accept an input event from a queue item: An inventory input field of an ingredient of a queue item was changed.
     * This function passes arguments to InventoryInterfaceHandler.setInventoryFor(),
     * then it triggers QueueInterfaceHandler to perform UI updates for the queue item.
     *
     * @see setInventoryFor()
     *
     * @param {String} ID A resource ID from JSON.DataTable. In this instance it is an ingredient.
     * @param {String} value The input value to be validated for containing only numbers.
     * @param {HTMLElement} el The inventory input field.
     * @param {String} errorMessageElID The element ID of the corresponding error message for the inventory input field.
     * @param {String} queueItemID A resource ID from JSON.DataTable. In this instance it is a queue item.
     *
     * @return {undefined}
     */
    acceptQueueItemEvent_inventoryInput(ID, value, el, errorMessageElID, queueItemID)
    {
        this.setInventoryFor(ID, value, el, errorMessageElID);
    }
    // end acceptQueueItemEvent_inventoryInput()
    
    
    /**
     * Accept a button click from a queue item. A decrement button of an ingredient of a queue item.
     * This function passes arguments to InventoryInterfaceHandler.decrementInventoryFor(),
     * then it triggers QueueInterfaceHandler to perform UI updates for the queue item.
     *
     * @see decrementInventoryFor()
     *
     * @param {String} ID A resource ID from JSON.DataTable. In this instance it is an ingredient.
     * @param {String} queueItemID A resource ID from JSON.DataTable. In this instance it is a queue item.
     *
     * @return {undefined}
     */
    acceptQueueItemEvent_inventoryDecrement(ID, queueItemID)
    {
        this.decrementInventoryFor(ID);
    }
    // end acceptQueueItemEvent_inventoryDecrement()
    
    
    /**
     * Accept a button click from a queue item. A increment button of an ingredient of a queue item.
     * This function passes arguments to InventoryInterfaceHandler.incrementInventoryFor(),
     * then it triggers QueueInterfaceHandler to perform UI updates for the queue item.
     *
     * @see incrementInventoryFor()
     *
     * @param {String} ID A resource ID from JSON.DataTable. In this instance it is an ingredient.
     * @param {String} queueItemID A resource ID from JSON.DataTable. In this instance it is a queue item.
     *
     * @return {undefined}
     */
    acceptQueueItemEvent_inventoryIncrement(ID, queueItemID)
    {
        this.incrementInventoryFor(ID);
    }
    // end acceptQueueItemEvent_inventoryIncrement()
    
    
    
    // end functions for accepting queue item events
    // =============================================
    
}