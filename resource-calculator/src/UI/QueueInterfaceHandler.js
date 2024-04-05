import InterfaceHandler from "./InterfaceHandler.js";
import List from "../Data/List.js";
import QueueEntryBuilder from "./QueueEntryBuilder.js";
import QueueItemInterfaceHandler from "./QueueItemInterfaceHandler.js";

export default class QueueInterfaceHandler extends InterfaceHandler
{
    /**
     * Handles UI and events for the queue column.
     *
     * @return {undefined}
     */
    constructor()
    {
        super();
        
        /******************************
         *
         * init
         *
         * this.Members     - auxiliary list for checking whether a recipe ID is in Queue items
         *                  - a Set()
         *
         * this.Queue       - container for queue items (and some functions for managing them)
         *                  - i.e. "order" of items in the queue. see acceptQueueItemDragEvent().
         */
        this.init();
        
        
        this.messageBar = document.getElementById('queue_message_bar');
        this.messageEl = document.getElementById('queue_message_bar_text');
        this.btn_dismiss_queueMessageBar = document.getElementById('btn_dismiss_queueMessageBar');
        this.relaxaurusSays = document.getElementById('relaxaurusSays');
        
        this.wrapperQueueListEmpty = document.getElementById('wrapper_queueListItemsEmpty');
        this.wrapperQueueListItems = document.getElementById('wrapper_queueListItems');
        
        this.modalDataTarget_currentQueueItemsCount = document.getElementById('dataTarget_currentQueueItemCount');
        
        this.QItemIH = new QueueItemInterfaceHandler();
        this.QEB = new QueueEntryBuilder(this.wrapperQueueListItems, this.QItemIH);
    }
    
    
    /**
     * Routine: Upon construction of QueueInterfaceHandler
     * - get entries from queue.json
     * - if queue.json is empty, e.g. '{}', create empty init objects (Members, Queue, items), then when page has loaded, fade in Relaxaurus.
     * - else refactor data from queue JSON for init objects and queue column UI, then when page has loaded, fade in queue items.
     *
     * @return {undefined}
     */
    init()
    {
        // ---------------------------
        // get entries from queue.json
        const queueJsonEntries = Object.entries(this.JSON.queue);
        
        // ----------------------
        // if queue json is empty
        if (queueJsonEntries.length === 0)
        {
            // -------------------------
            // create empty init objects
            this.Members = new Set();
            this.Queue = new List();
            
            // ----------------------------------------
            // when page has loaded, fade in Relaxaurus
            document.addEventListener('DOMContentLoaded', () =>
            {
                this.wrapperQueueListEmpty.classList.remove('hidden');
                setTimeout(() =>
                {
                    this.wrapperQueueListEmpty.classList.replace('opacity-0', 'opacity-100');
                    
                }, 50);
                
            });
            
        }
        // end if queue json is empty
        // --------------------------
        
        //--------------------------------------------------------
        // else, refactor data from queue JSON for initializing UI
        else
        {
            // -------------------------------------
            // Members needs to be a Set of the keys
            this.Members = new Set(Object.keys(this.JSON.queue));
            
            // -----------------------------------------------------------
            // Queue needs to use each entry with this.getNewQueueObject()
            // where ID comes from key and quota is value
            const queueData = [];
            for (const [ID, quota] of queueJsonEntries)
            {
                queueData.push( this.getNewQueueObject(ID, quota) );
            }
            this.Queue = new List(queueData);
            
            // -----------------------------------------
            // when page has loaded, fade in queue items
            document.addEventListener('DOMContentLoaded', () =>
            {
                // --------------------------------------------
                // disable addToQueue buttons for queue members
                this.Members.forEach((ID) =>
                {
                    this.disableAddToQueueButtonsFor(ID);
                });
                
                // ----------------------------
                // append items to queue col UI
                this.Queue.items.forEach((item) =>
                {
                    this.appendNewEntryUIToQueueColumn(item);
                    
                });
                // end append items to queue col UI
                
                // -------------------
                // fade in queue items
                this.wrapperQueueListItems.classList.remove('hidden');
                setTimeout(() =>
                {
                    this.wrapperQueueListItems.classList.replace('opacity-0', 'opacity-100');
                    
                }, 50);
                
            });
        }
        // end else, refactor data from queue JSON for initializing UI
        // -----------------------------------------------------------
    }
    // end init()
    
    
    /**
     * Take an queue snapshot of quota and return it as JSON (for data export modal).
     *
     * @return {String}
     */
    stringifyQueueSnapshot()
    {
        let snapshot = new Map();
        for (const queueItem of this.Queue.items) { snapshot.set(`${queueItem.id}`, queueItem.quota); }
        return JSON.stringify(Object.fromEntries(snapshot));
    }
    // end stringifyInventorySnapshot()
    
    
    /**
     * Save an inventory snapshot to local files. For use in data export modal.
     *
     * @see IntefaceHandler.saveToLocal()
     *
     */
    async saveJSON_queue()
    {
        // pass queue snapshot to InterfaceHandler
        const fileContent = `export default ${this.stringifyQueueSnapshot()}`;
        await this.saveToLocal(fileContent, 'queue.js');
    }
    // end saveToJSON_inventory()
    
    
    /**
     * Show the queue message bar. Auto close after 10 seconds.
     *
     * @param {String} message
     * @return {undefined}
     */
    flashQueueMessageBar(message)
    {
        // set message text and open message bar
        this.messageEl.innerText = message;
        this.messageBar.classList.replace('h-0', 'h-[100%]');
        
        // wait 10 seconds, then close message bar
        // wait for hide animaiton before clearing text
        const timeoutID_closeQueueMessageBar = setTimeout(() =>
        {
            this.messageBar.classList.replace('h-[100%]', 'h-0');
            setTimeout(() => {
                this.messageEl.innerText = '';
                
            }, 1050)
        }, 10000);
        
        // pass timeout id to dismiss button
        this.btn_dismiss_queueMessageBar.dataset.timeoutId = String(timeoutID_closeQueueMessageBar);
        
    }
    // end flashQueueMessageBar()
    
    
    /**
     * Hide the queue message bar.
     *
     * @param {HTMLElement} dismissBtn The button that triggers the dismissal.
     */
    dismissQueueMessageBar(dismissBtn)
    {
        
        // cancel flash timeout
        const timeoutID = dismissBtn.dataset.timeoutId;
        clearTimeout(Number(timeoutID));
        
        // toggle button color to indicate click success
        dismissBtn.classList.toggle('btn-info');
        
        // slide message bar up
        this.messageBar.classList.replace('h-[100%]', 'h-0');
        
        // wait for slide up animation then
        setTimeout(() => {
            
            //  clear message text
            this.messageEl.innerText = '';
            
            // clear button color
            dismissBtn.classList.toggle('btn-info');
            
        }, 1050)
    }
    
    
    /**
     * Build a new JS object for Queue item data.
     *
     * @param {Number|String} ID Recipe ID
     * @param {Number} quota How many units of Recipe ID user wants to make.
     * @return {Object} Collection of data, e.g. the state of the Queue Item as it would appear in the UI.
     */
    getNewQueueObject(ID, quota = 1)
    {
        /**
         * when a queue item is initialized
         *
         *  it will have
         *    - group					string		- which recipe group this resource belongs to
         *    - id					    string		- its resource ID in DataTable
         *    - img					    string		- fileName.png
         *    - incidentOf*			    []			- TBD
         *    - inventory				number		- number of units that have been recorded in app's inventory
         *    - key					    string		- in-game identifier (Not being used by this app)
         *    - name					string		- this queue item's name
         *    - quota					number		- how many the user wants to make. default init value is 1.
         *    - recipe				    []			- list of objects like {id: $ingredientID, qty: $ingredientRequiredQty}
         *    - usedInRecipesFor		[]			- list of objects like {id: $resourceID, qty: $requiredQtyOfThisQueueItem}
         *
         * // -----
         * // notes
         *
         * *incidentOf isn't being used.
         *      - it's there for if/when that idea gets built into the app:
         *      - for recording any pre-existing queue items that this new queue item is an ingredient of
         *      - the essence of the idea is to build a view, i.e. "a manifest", of all the (sums of) resources
         *        that are needed to cover the quotas of every item in the queue
         *            - e.g. "what are the sums of all the ${X}, ${Y}, ${Z} that I need"
         */
        
        return {
            id: ID,
            ...this.JSON.resources[ID],
            quota: quota,
            incidentOf: [],
            els:
            {
                quota: null,
                progressBar: {},
                ingredientRows: {},
                summaryRow: {}
            }
        };
        
        /**
         * -------------
         * regarding els
         *
         * These properties will be populated by QEB.
         * All paths contain an HTMLElement
         *
         * progressBar will be an object with keys "done" and "notDone"
         *     - The (gray) "notDone" progressBar div is the one that slides horizontally.
         *     - The (color gradient) "done" progressBar is static.
         *
         * ingredientRows will contain one or more objects like:
         *     - ingredientID: {}
         *         -- The keys contained within are
         *             "requiredQty"
         *             "inventoryField"
         *             "inventoryPct"
         *             "needQty"
         *             "needPct"
         *
         * summary row will contain one object
         *     - the keys contained within are
         *         "sumRequiredQty"
         *         "sumInventory"
         *         "sumInventoryPct"
         *         "sumNeedQty"
         *         "sumNeedPct"
         *
         */
        
    }
    // end getNewEntry()
    
    
    /**
     * Get an entry in Queue.items by item.id.
     *
     * @param {String} ID The item.id
     * @return {*|undefined} The queue item or undefined
     */
    findQueueItemByID(ID)
    {
        const itemWithMatchingID = (item) => { return item.id === ID; }
        return this.Queue.find(itemWithMatchingID);
    }
    // end findQueueItemByID()
    
    /**
     * Disable addToQueue buttons for this ID.
     *
     * @param {Number|String} ID Recipe ID.
     */
    disableAddToQueueButtonsFor(ID)
    {
        const className = `.btn-addToQueue-${ID}`;
        const buttonsForID = document.querySelectorAll(className);
        buttonsForID.forEach((btn) =>
        {
           btn.disabled = true;
           btn.classList.toggle('btn-disabled');
        });
    }
    // end disableAddToQueueButtonsFor()
    
    
    /**
     * Enable addToQueue buttons for this ID.
     *
     * @param {Number|String} ID Recipe ID.
     */
    enableAddToQueueButtonsFor(ID)
    {
        const className = `.btn-addToQueue-${ID}`;
        const buttonsForID = document.querySelectorAll(className);
        buttonsForID.forEach((btn) =>
        {
           btn.disabled = false;
           btn.classList.toggle('btn-disabled');
        });
    }
    // end enableAddToQueueButtonsFor()
    
    
    /**
     * Update queue item count in remove all recipes confirmation modal
     *
     * @return {undefined}
     */
    updateQueueItemCountInRemoveAllRecipesConfirmationModal()
    {
        this.modalDataTarget_currentQueueItemsCount.innerText = String(this.Queue.size());
    }
    // end updateQueueItemCountInRemoveAllRecipesConfirmationModal()
    
    
    /**
     * Routine: Using QueueEntryBuilder- appends new row in Queue column (div#wrapper_queueListItems).
     *
     * - Used in QueueInterfaceHandler.appendNewItem().
     *
     * @param {Object} newEntry Result from QueueInterfaceHandler.getNewQueueObject(ID), where ID is a recipe ID.
     * @return {undefined}
     *
     * @see QueueEntryBuilder.appendNewEntryUI()
     */
    appendNewEntryUIToQueueColumn(newEntry)
    {
        // pass newEntry to QueueEntryBuilder
        this.QEB.appendNewEntryUI(newEntry);
        
        const rowThatWasAdded = document.getElementById(`wrapper_queueColumnEntry-${newEntry.id}`);
        setTimeout(() => {
            rowThatWasAdded.classList.replace('opacity-0', 'opacity-100');
            
        }, 100);
        
        
        // update queue item count in remove all recipes confirmation modal
        this.updateQueueItemCountInRemoveAllRecipesConfirmationModal();
        
    }
    // end updateQueueWithNewEntry()
    
    
    /**
     * Append a new entry to Queue if ID is not already in Members Set.
     *
     * @param {Number|String} ID Recipe ID.
     * @return {undefined}
     */
    appendNewItem(ID)
    {
        // ------------------------------------------
        // if there is no recipe for this resource ID
        if (!this.JSON.resources[ID])
        {
            // alert the user that they cannot add this resource to the queue
            this.flashQueueMessageBar(`${this.JSON.resources[ID]['name']} does not have a recipe. It cannot be added to your Queue.`);
        }
        
        // ------------------------------------
        // if ID is already in members list
        else if (this.Members.has(String(ID)))
        {
            // alert user that the recipe is already in their queue
            this.flashQueueMessageBar("That recipe is already in your Queue.")
        }
        
        // ---------------------------------------------
        // else proceed to operations for new Queue item
        else
        {
            // add ID to members Set
            this.Members.add(String(ID))
            
            // create a new entry object
            const newEntry = this.getNewQueueObject(ID);
            
            // create a new list entry
            this.Queue.append([newEntry]);
            
            // disable all buttons with instances of class name like 'btn-addToQueue-ID'
            this.disableAddToQueueButtonsFor(ID);
            
            // if this is the first item in the queue
            // fade out Relaxaurus wrapper and hide it
            // then unhide queue items wrapper
            // and update queue UI to show first item
            if (this.Queue.size() === 1)
            {
                this.wrapperQueueListEmpty.classList.replace('opacity-100', 'opacity-0');
                setTimeout(() =>
                {
                    this.wrapperQueueListEmpty.classList.toggle('hidden');
                    this.wrapperQueueListItems.classList.toggle('hidden');
                    this.wrapperQueueListItems.classList.replace('opacity-0', 'opacity-100');
                    this.appendNewEntryUIToQueueColumn(newEntry)
                    
                }, 1050);
            }
            
            // else update Queue UI
            else
            {
                this.appendNewEntryUIToQueueColumn(newEntry)
            }
        }
    }
    // end appendNewItem()
    
    
    /**
     * Accept a recipe ID from a Recipe column 'add' button click.
     * Passes ID to QueueInterfaceHandler.appendNewItem().
     *
     * @param {Number|String} ID The recipe to be added to Queue
     * @return {undefined}
     *
     * @see RecipeInterfaceHandler.addRecipeToQueue()
     */
    acceptNewItemFromRecipesColumn(ID)
    {
        this.appendNewItem(ID);
    }
    // acceptNewItemFromRecipesColumn()
    
    
    /**
     * Relaxaurus makes fun of you for removing 0 items from queue.
     */
    relaxaurusMocks()
    {
        this.relaxaurusSays.innerText = "Hey..."
        setTimeout(() =>
        {
            this.relaxaurusSays.innerText = "... hey you."
            setTimeout(() =>
            {
                this.relaxaurusSays.innerText = "What were you expecting?";
                setTimeout(() =>
                {
                    this.relaxaurusSays.innerText = "There's nothing to remove.";
                    setTimeout(() =>
                    {
                        this.relaxaurusSays.innerText = "Add a recipe to get started!";
                        
                    }, 3000);
                    
                }, 3000);
                
            }, 3000);
            
        }, 3000);
    }
    // end relaxaurusMocks()
    
    
    /**
     * Remove a single item from the queue.
     * Event is passed in from listener at QueueEntryBuilder.handle_passToQIH_RemoveItemClick()
     *
     * @param {Number|String} ID The recipe that is being removed from the queue
     */
    removeItemFromRecipesColumn(ID)
    {
        // remove entries from data objects
        this.Members.delete(ID);
        const indexOfItemWithID = this.Queue.items.findIndex( item => item.id === ID);
        this.Queue.remove(indexOfItemWithID);
        
        // remove queue item UI
        // wrapper_queueColumnEntry-ID
        const rowToBeRemoved = document.getElementById(`wrapper_queueColumnEntry-${ID}`);
        rowToBeRemoved.classList.replace('opacity-100', 'opacity-0');
        setTimeout(() => { rowToBeRemoved.remove() }, 1050)
        
        // enable addToQueue button(s) for ID
        this.enableAddToQueueButtonsFor(ID);
        
        // update queue item count in remove all recipes confirmation modal
        this.updateQueueItemCountInRemoveAllRecipesConfirmationModal();
        
        // if the queue is empty, toggle hidden states of queue column and relaxaurus
        if (this.Queue.size() === 0)
        {
            this.wrapperQueueListItems.classList.replace('opacity-100', 'opacity-0');
            this.wrapperQueueListItems.classList.toggle('hidden');
            this.wrapperQueueListEmpty.classList.toggle('hidden');
            setTimeout(() =>
            {
                this.wrapperQueueListEmpty.classList.replace('opacity-0', 'opacity-100');
                
            }, 1050);
        }
        
    }
    // end removeItemFromRecipesColumn()
    
    
    /**
     * Removes all items from queue column and handles "reset" of UI
     */
    removeAllItemsFromRecipesColumn()
    {
        // get which recipe IDs are currently in Queue
        const currentMembers = Array.from(this.Members.values());
        
        // bypass this routine if currentMembers is empty
        if (currentMembers.length === 0)
        {
            this.closeModal('modal_confirm_removeAllRecipesFromQueue');
            this.relaxaurusMocks();
            return 0;
        }
        
        // clear out Members and Queue.items
        this.Members.clear();
        this.Queue.clear();
        
        // fade out contents of queue column
        for (const row of this.wrapperQueueListItems.children)
        {
            row.classList.replace('opacity-100', 'opacity-0');
        }
        
        // wait for fade animation, then
        setTimeout(() =>
        {
            // clear innerHTML of queue column
            this.wrapperQueueListItems.innerHTML = '';
            
            // hide queue column and unhide Relaxaurus
            this.wrapperQueueListItems.classList.toggle('hidden');
            this.wrapperQueueListEmpty.classList.toggle('hidden');
            setTimeout(() =>
            {
                // fade in Relaxaurus
                this.wrapperQueueListEmpty.classList.replace('opacity-0', 'opacity-100')
                
                // enable all addToQueue-ID buttons for each ID that is in Queue
                currentMembers.forEach((ID) => { this.enableAddToQueueButtonsFor(ID); });
                
            }, 1050);
            
            // flash a confirmation message
            this.flashQueueMessageBar('Queue has been cleared');
            
        }, 1050);
        
        // close the remove all recipes confirmation modal
        this.closeModal('modal_confirm_removeAllRecipesFromQueue');
        
        // update queue item count in remove all recipes confirmation modal
        this.updateQueueItemCountInRemoveAllRecipesConfirmationModal();
        
    }
    // end removeAllItemsFromRecipesColumn()
    
    
    /**
     * Collapse all recipe collapsable contents.
     *
     * @return {undefined}
     */
    collapseAllCollapsableRecipeContents()
    {
        // get all collapse checkboxes
        const chkBoxes = document.querySelectorAll('.chk-collapseState');
        
        // if it is checked, that means the collapse content is expanded
        chkBoxes.forEach((chk) =>
        {
            if (chk.checked)
            {
                // get the checkbox's id from dataSet
                const ID = chk.dataset.collapseId;
                
                // find the corresponding button and 'click' it
                const btnElID = `btn_queueItem_toggleCollapsableContent-${ID}`;
                const btn = document.getElementById(btnElID);
                btn.click();
            }
            
        });
    }
    // end collapseAllCollapsableRecipeContents()
    
    
    /**
     * Toggle state for all recipe collapsable contents
     *
     * @return {undefined}
     */
    toggleAllCollapsableRecipeContents()
    {
        /* const toggleStateBtns = document.querySelectorAll('.btn-queueItemAction-toggleCollapsableContent');
        toggleStateBtns.forEach((btn) => { btn.click() }); */
        
        // get all collapse checkboxes
        const chkBoxes = document.querySelectorAll('.chk-collapseState');
        
        // make lists of what's currently open and closed
        const currentlyOpen = [];
        const currentlyClosed = [];
        chkBoxes.forEach((chk) =>
        {
            // get the checkbox's id from dataSet
            const ID = chk.dataset.collapseId;
            
            // find the corresponding button
            const btnElID = `btn_queueItem_toggleCollapsableContent-${ID}`;
            const btn = document.getElementById(btnElID);
            
            // push corresponding button for open collapse contents to open list
            // or likewise for closed contents
            if (chk.checked) { currentlyOpen.push(btn); } else { currentlyClosed.push(btn); }
            
        });
        
        // -----------------------------------
        // if all are closed, open all of them
        if (currentlyOpen.length === 0) { currentlyClosed.forEach((btn) => { btn.click(); }); return; }
        
        // ----------------------------------
        // if all are open, close all of them
        if (currentlyClosed.length === 0) { currentlyOpen.forEach((btn) => { btn.click(); }); return; }
        
        // ----------------------------------------
        // otherwise, to make and animations smooth
        // close the ones that are currently open
        // wait for close animation, then open the ones that closed
        currentlyOpen.forEach((btn) => { btn.click(); });
        setTimeout(() => { currentlyClosed.forEach((btn) => { btn.click(); }) }, 1050);
        
    }
    // end toggleAllCollapsableRecipeContents()
    
    
    /**
     * Expand all recipe collapsable contents.
     *
     * @return {undefined}
     */
    expandAllCollapsableRecipeContents()
    {
        // get all collapse checkboxes
        const chkBoxes = document.querySelectorAll('.chk-collapseState');
        
        // if it is checked, that means the collapse content is expanded
        chkBoxes.forEach((chk) =>
        {
            if (!chk.checked)
            {
                // get the checkbox's id from dataSet
                const ID = chk.dataset.collapseId;
                
                // find the corresponding button and 'click' it
                const btnElID = `btn_queueItem_toggleCollapsableContent-${ID}`;
                const btn = document.getElementById(btnElID);
                btn.click();
            }
            
        });
    }
    // end expandAllCollapsableRecipeContents()
    
    
    /**
     * Accept a completed drag event from SortableJS.
     *
     * @param {Event} ev The drag event that was completed.
     *
     * @see onEnd() at https://github.com/SortableJS/Sortable?tab=readme-ov-file#options
     */
    acceptQueueItemDragEvent(ev)
    {
        /**
         * evt.item                     // dragged HTMLElement
         * => ev.item.dataset.id        // the queue item ID
         * ev.oldIndex                  // where it was
         * ev.newIndex                  // where it is now
          */
        
        /**
         * multi-select is enabled
         * and ev.item.dataset.id is:
         *     -- the item that the user dragged
         *     -- or used to drag all selected items
         *
         * => That means that we cannot rely only on event attributes to update queue order.
         * => every time this event is accepted:
         *    QIH will have to
         *        -- get HTMLCollection of the queue column rows via children()
         *        -- make a list dataset.id found in collection
         *        -- update Members, Queue items, or both
          */
          
        // create an empty array to store the new order of queue items
        const newOrder = [];
        
        // get all queue item wrapper elements
        [...this.wrapperQueueListItems.children].forEach((queueItemWrapper) =>
        {
            // get the queue item id from wrapper dataset
            const queueItemID = queueItemWrapper.dataset.id
            
            // get the queueItem by its ID and push it to the newOrder array
            newOrder.push(this.findQueueItemByID(queueItemID))
        });
        
        // replace this.Queue.items with the newOrder
        this.Queue.items = newOrder;
        
    }
    // end acceptQueueItemDragEvent()
    
    
    /**
     * Validate the value of a queue item quota input field. Must be numbers onlu
     *
     * @param {HTMLElement} inputFieldEl The input field where the input event happened.
     * @param {String} inputFieldValue The value in the input field.
     * @param {HTMLElement} inputFieldErrorMessageEl The corresponding error message element.
     * @return {Boolean} Whether input value contains only numbers
     */
    validateQueueItemQuotaInput(inputFieldEl, inputFieldValue, inputFieldErrorMessageEl)
    {
        // make sure value is only numbers
        const regex_isOnlyNumbers = /^\d+$/;
        const isOnlyNumbers = regex_isOnlyNumbers.test(inputFieldValue);
        
        // if value is only numbers
        if(isOnlyNumbers)
        {
            // clear error UI
            inputFieldEl.classList.replace('focus:ring-error', 'focus:ring-info');
            inputFieldEl.classList.replace('text-error', 'text-info');
            inputFieldEl.classList.remove('border-2');
            inputFieldEl.classList.remove('border-error');
            inputFieldErrorMessageEl.classList.add('hidden');
            
            // return true
            return true;
        }
        
        // else trigger error UI
        else
        {
            // show error UI
            inputFieldEl.classList.replace('focus:ring-info', 'focus:ring-error');
            inputFieldEl.classList.replace('text-info', 'text-error');
            inputFieldEl.classList.add('border-2');
            inputFieldEl.classList.add('border-error');
            inputFieldErrorMessageEl.classList.remove('hidden');
            
            // return false
            return false;
        }
        
    }
    // end validateQueueItemQuotaInput()
    
    
    /**
     * Pass a queue item to QItemIH.acceptQueueItemQuotaChange()
     *
     * - Find queue item by its ID
     * - Update the items quota
     * - Send the queue item to QItemIH
     *
     * @param {String} ID A queue item ID
     * @param {String} value The updated quota
     */
    handleSuccessfulQuotaChange(ID, value)
    {
        // get the queue item
        const queueItem = this.findQueueItemByID(ID)
        
        // update the quota
        queueItem.quota = Number(value);
        
        // pass it to QItemIH
        this.QItemIH.acceptQueueItemQuotaChange(queueItem);
    }
    // end handleSuccessfulQuotaChange()
    
    
    /**
     * Take a validated quota value and either
     * - send the queue item to QItemIH, or
     * - disable decrement/increment buttons and
     * - let the user correct mistake in quota input field.
     *
     * @param {String} value The value in the quota input field
     * @param {Boolean} valueIsValid The result of validateQueueItemQuotaInput()
     * @param {String} ID The ID of the queue item
     */
    handleQuotaValueValidation(value, valueIsValid, ID)
    {
        // get decrement and increment buttons
        const btns =
        {
            dec: document.getElementById(`btn_quotaDecrement-${ID}`),
            inc: document.getElementById(`btn_quotaIncrement-${ID}`)
        }
        
        
        // if input is valid, perform UI updates
        if (valueIsValid)
        {
            // enable buttons if they are disabled
            for (const btnEl of Object.values(btns))
            {
                if (btnEl.classList.contains('btn-disabled')) { btnEl.classList.remove('btn-disabled'); }
            }
            
            // send queue item to QItemIH by its ID
            this.handleSuccessfulQuotaChange(ID, value)
            
        }
        
        // else disable decrement/increment buttons that correspond to this quota input field
        else
        {
            btns.dec.classList.add('btn-disabled');
            btns.inc.classList.add('btn-disabled');
        }
    }
    // end handleQuotaValueValidation()
    
    
    /**
     * Handle queue UI changes when user types into a quota input field.
     * Event is passed in from listener at QueueEntryBuilder.handle_passToQIH_QuotaInput().
     *
     * @param {Event} ev The input event that happened to the quota input field.
     * @param {String} ID The recipe ID that the user is updating the quota for.
     */
    acceptQueueItemQuotaInput(ev, ID)
    {
        // get the elements needed for validating input
        const inputFieldEl = ev.target;
        let inputFieldValue = inputFieldEl.value;
        
        // reset value of 0 to 1
        if (inputFieldValue === "0")
        {
            inputFieldEl.value = 1
            inputFieldValue = 1;
        }
        
        const ErrorMessageElID = `inputErrorMessage_input_queueItemQuota-${ID}`;
        const inputFieldErrorMessageEl = document.getElementById(ErrorMessageElID);
        
        // validate input
        const valueIsValid = this.validateQueueItemQuotaInput
        (
            inputFieldEl,
            inputFieldValue,
            inputFieldErrorMessageEl
        );
        
        // handle validated input
        this.handleQuotaValueValidation(inputFieldValue, valueIsValid, ID);

    }
    // end acceptQueueItemQuotaChangeEvent()
    
    
    /**
     * Updates value in a quota input field after a decrement/increment button press
     *
     * @param {String} ID The ID of the queue item whose quota value is being changed.
     * @param {Number} changeBy 1 or -1
     */
    updateQuotaInputUI(ID, changeBy)
    {
        // get the input field and its value
        const inputFieldID = `input_queueItemQuota-${ID}`;
        const inputFieldEl = document.getElementById(inputFieldID);
        const inputFieldValue = Number(inputFieldEl.value);
        
        // get new input field value
        let newInputFieldValue = inputFieldValue + changeBy;
        
        // reject negative numbers
        if (newInputFieldValue < 1) { newInputFieldValue = 1; }
        
        // set the new value in the input field
        inputFieldEl.value = newInputFieldValue;
        
        // return the new value
        return newInputFieldValue;
    }
    // end updateQuotaInputUI()
    
    
    /**
     * Accept an decrement button click for a quota.
     * Event is passed in from listener at QueueEntryBuilder.handle_passToQIH_QuotaDecrement().
     *
     * @param {String} ID The ID of the queue item receiving the quota decrement.
     */
    acceptQuotaDecrement(ID)
    {
        const newQuotaValue =  this.updateQuotaInputUI(ID, -1);
        this.handleSuccessfulQuotaChange(ID, `${newQuotaValue}`);
    }
    // end acceptQuotaDecrement()
    
    
    /**
     * Accept an increment button click for a quota.
     * Event is passed in from listener at QueueEntryBuilder.handle_passToQIH_QuotaIncrement().
     *
     * @param {String} ID The ID of the queue item receiving the quota increment.
     */
    acceptQuotaIncrement(ID)
    {
        const newQuotaValue =  this.updateQuotaInputUI(ID, 1);
        this.handleSuccessfulQuotaChange(ID, `${newQuotaValue}`);
    }
    // end acceptQuotaDecrement()
    
    
    /**
     * Routine for inventory change of an ingredient inventory input field.
     *
     * @param {String} ingredientID The ID of the ingredient.
     * @param {String} [queueItemID] The ID of the queue item. Default is '', so it could be omitted if you wanted to.
     */
    handleInventoryChange(ingredientID, queueItemID = '')
    {
        // make a Set for: queue item IDs where ingredientID is in the list of recipe objects
        // then add the known queueItemID to the Set
        // queueItemID could be '' to trigger this function without being specific
        const queueItemIDs = new Set();
        //queueItemIDs.add(queueItemID);
        if (queueItemID !== '') { queueItemIDs.add(queueItemID) }
        
        // find all the other queueItem IDs that have this ingredient ID in their recipe
        for (const item of this.Queue.items)
        {
            for (const ingredient of item.recipe)
            {
                if (ingredient.id === Number(ingredientID))
                {
                    queueItemIDs.add(item.id);
                }
            }
        }
        
        // send queueItem and ingredientID to QItemIH
        queueItemIDs.forEach((queueItemID) =>
        {
            const queueItem = this.findQueueItemByID(queueItemID);
            this.QItemIH.acceptIngredientInventoryChange(queueItem, `${ingredientID}`);
        });
    }
    // end handleInventoryChange()
    
    
    /**
     * Pass an ingredientID and queueItemID to handleInventoryChange().
     * Inventory value was validated by InventoryInterfaceHandler.
     * Default for queueItemID is ''. e.g. by omitting it will cascade UI changes for all items in queue.
     *
     * @param {String} ingredientID The ingredient whose inventory changed.
     * @param {String} [queueItemID] The queue item that the ingredient belongs to.
     */
    acceptInventoryInputEvent_updateQueueItemUIFor(ingredientID, queueItemID = '')
    {
        this.handleInventoryChange(ingredientID, queueItemID);
    }
    // end acceptInventoryInputEvent_updateQueueItemUIFor()
    
    
    /**
     * Pass an ingredientID and queueItemID to handleInventoryChange().
     * Inventory value was validated by InventoryInterfaceHandler.
     * Default for queueItemID is ''. e.g. by omitting it will cascade UI changes for all items in queue.
     *
     * @param {String} ingredientID The ingredient whose inventory changed.
     * @param {String} queueItemID The queue item that the ingredient belongs to.
     */
    acceptInventoryDecrementEvent_updateQueueItemUIFor(ingredientID, queueItemID = '')
    {
        this.handleInventoryChange(ingredientID, queueItemID);
    }
    // end acceptInventoryDecrementEvent_updateQueueItemUIFor()
    
    
    /**
     * Pass an ingredientID and queueItemID to handleInventoryChange().
     * Inventory value was validated by InventoryInterfaceHandler.
     * Default for queueItemID is ''. e.g. by omitting it will cascade UI changes for all items in queue.
     *
     * @param {String} ingredientID The ingredient whose inventory changed.
     * @param {String} queueItemID The queue item that the ingredient belongs to.
     */
    acceptInventoryIncrementEvent_updateQueueItemUIFor(ingredientID, queueItemID = '')
    {
        this.handleInventoryChange(ingredientID, queueItemID);
    }
    // end acceptInventoryIncrementEvent_updateQueueItemUIFor()
    
}