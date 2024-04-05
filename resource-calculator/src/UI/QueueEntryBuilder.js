export default class QueueEntryBuilder
{
    /**
     * Constructor
     *
     * @param {HTMLElement} el_wrapperQueueListItems The Queue items column
     */
    constructor(el_wrapperQueueListItems, QItemIH)
    {
        this.QItemIH = QItemIH;     // for performing new queueItem table init calculations
        this.els = { column: el_wrapperQueueListItems };
    }
    // end constructor()
    
    // ====================================================================
    // HELPER FUNCTIONS
    
    /**
     * Create a new HTMLElement. Accepts optional id, classList, and attribute(s).
     *
     * @param {String} el HTML tag, e.g. 'div'. Required.
     * @param {String|undefined} [id] Value for tag's id. Default is undefined.
     * @param {Array|undefined} [classList] List of tag's class names. Default is undefined.
     * @param {Object|undefined} [attrs] Key/value pairs of {String}s. Default is undefined.
     * @return {HTMLElement}
     */
    createNewEl(el, id= undefined, classList= undefined, attrs= undefined)
    {
        // create a new element
        const newEl = document.createElement(el);
        
        // attach id
        if (id) { newEl.id = id; }
        
        // attach class list
        if (classList) { classList.forEach((className) => { newEl.classList.add(className) }); }
        
        // attach attributes
        if (attrs)
        {
            const attrKVs = Object.entries(attrs);
            for (const [attrName, attrValue] of attrKVs)
            {
                const attr = document.createAttribute(attrName);
                attr.value = String(attrValue);
                newEl.setAttributeNode(attr);
            }
        }
        
        // return new element
        return newEl;
        
    }
    // end createNewEl()
    
    
    /**
     * Insert a new text node into an HTMLElement.
     *
     * @param {HTMLElement} el Which element to append to.
     * @param {String} text What to append.
     */
    appendNewTextNode(el, text) { el.append(document.createTextNode(text)); }
    // end appendNewTextNode()
    
    
    /**
     * Create a new HTMLElement with innerText. Combines createNewEl and appendNewTextNode
     *
     * @param {String} el HTML tag, e.g. 'div'. Required.
     * @param {String|undefined} [id] Value for tag's id. Default is undefined.
     * @param {Array|undefined} [classList] List of tag's class names. Default is undefined.
     * @param {Object|undefined} [attrs] Key/value pairs of {String}s. Default is undefined.
     * @param {String} text What to append as the inner text of the element.
     * @return {HTMLElement}
     */
    createNewElWithInnerText(el, id= undefined, classList= undefined, attrs= undefined, text)
    {
        // create a new element, append an inner text node, then return the new element
        const newEl = this.createNewEl(el, id, classList, attrs);
        this.appendNewTextNode(newEl, text);
        return newEl;
    }
    // end createNewEl()
    
    
    /**
     * Set a function (callback) to be performed when a specified event (type) is delivered to a target (el, e.g. p, button, i, etc.)
     *
     * @param {HTMLElement} el The element that is listening for the event type.
     * @param {String} type What kind of event, e.g. 'click'.
     * @param {Function} callback What to do.
     * @param {Array} [callbackParams] What to pass. Default is [].
     * @param {Object|undefined} [options] A container for passing in options as described on MDN docs. See link. Default is undefined.
     * @param {Boolean|undefined} [useCapture] Flag for 'useCapture' behavior as described on MDN docs. See link. Default is undefined.
     *
     * @return {undefined}
     *
     * @see https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener#syntax
     */
    addEventListener(el, type, callback, callbackParams = [], options = undefined, useCapture = undefined)
    {
        // if using neither options nor useCapture
        if (!options && !useCapture)
        { el.addEventListener(type, (ev) => { callback(ev, ...callbackParams) }) }
        
        // if options but not useCapture
        if (options && !useCapture)
        { el.addEventListener(type, (ev) => { callback(ev, ...callbackParams) }, options) }
        
        // if not using options but is using useCapture
        if (!options && useCapture)
        { el.addEventListener(type, (ev) => { callback(ev, ...callbackParams) }, useCapture) }
    }
    // end addEventListener()
    
    // END HELPER FUNCTIONS
    // ====================================================================
    
    
    // ====================================================================
    // EVENT HANDLERS FOR QUEUE ITEM ELEMENT FUNCTIONS
    
    /**
     * Routine for collapsing/expanding a queue item's collapsable content area.
     * Fires when the user clicks on the queue item's title or expand/collapse button
     *
     * @param {Event} ev The event that happened.
     * @param {String} queueItemContentWrapper_elID The collapsable content to be toggled
     * @param {String} queueItemActionButtonIcon_elID The icon for the toggle button
     * @param {String} queueItemActionButtonLabel_elID The label of the toggle button
     * @param {String} queueItemCollapseStateCheckbox_elID The checkbox for querying the state of the collapsable content. Checked means expanded.
     *
     * @return {undefined}
     */
    handle_QueueItemContentWrapper_collapseState(
        ev,
        queueItemContentWrapper_elID,
        queueItemActionButtonIcon_elID,
        queueItemActionButtonLabel_elID,
        queueItemCollapseStateCheckbox_elID
    )
    {
        // ------------------------------------
        // get the wrapper for the content area
        // get the action button icon
        // get the action button label
        const queueItemContentWrapper = document.getElementById(queueItemContentWrapper_elID);
        const queueItemActionButtonIcon = document.getElementById(queueItemActionButtonIcon_elID);
        const queueItemActionButtonLabel = document.getElementById(queueItemActionButtonLabel_elID);
        const queueItemCollapseStateCheckbox = document.getElementById(queueItemCollapseStateCheckbox_elID);
        
        // content areas start with no height, i.e. "collapsed"
        if (queueItemContentWrapper.classList.contains('h-0'))
        {
            // expand the content area
            queueItemContentWrapper.classList.replace('h-0', 'h-[100%]');
            queueItemContentWrapper.classList.replace('max-h-0', 'max-h-[500px]');
            
            // toggle the state of the checkbox
            queueItemCollapseStateCheckbox.checked = !queueItemCollapseStateCheckbox.checked;
            
            // swap button icon to angle up
            queueItemActionButtonIcon.classList.replace('fa-angle-down', 'fa-angle-up');
            
            // swap button label to 'Collapse'
            queueItemActionButtonLabel.innerText = 'Collapse';
        }
        
        // or if they are currently expanded
        else
        {
            // collapse the content area.
            queueItemContentWrapper.classList.replace('h-[100%]', 'h-0');
            queueItemContentWrapper.classList.replace('max-h-[500px]', 'max-h-0');
            
            // toggle the state of the checkbox
            queueItemCollapseStateCheckbox.checked = !queueItemCollapseStateCheckbox.checked;
            
            // swap button icon to angle down
            queueItemActionButtonIcon.classList.replace('fa-angle-up', 'fa-angle-down');
            
            // swap button label to 'Expand'
            queueItemActionButtonLabel.innerText = 'Expand';
        }
    }
    // end handle_QueueItemContentWrapper_collapseState()
    
    /**
     * Pass ID to ResourceInfoModalInterfaceHandler.showResourceInfoModal()
     * Fires when user clicks on the 'info' button of a queue item's titlebar action button group.
     *
     * @param {Event} ev The event that happened.
     * @param {String} ID A recipe ID.
     * @return {undefined}
     */
    handle_passToRIMIH_InfoButtonClick(ev, ID)
    {
        window.RIMIH.showResourceInfoModal(ID);
    }
    // end handle_passToRIMIH_InfoButtonClick()
    
    
    /**
     * Pass ID to QueueInterfaceHandler.removeItemFromRecipesColumn()
     * Fires when user click on the 'remove' button of a queue item's titlebar action button group.
     *
     * @param {Event} ev The event that happened.
     * @param {String} ID A recipe ID.
     * @return {undefined}
     */
    handle_passToQIH_RemoveItemClick(ev, ID)
    {
        window.QIH.removeItemFromRecipesColumn(ID)
    }
    // end handle_passToQIH_RemoveItemClick()
    
    
    /**
     * Pass the recipe ID for the quota input field that was changed to QueueInterfaceHandler.
     *
     * @param {Event} ev The event that happened.
     * @param {String} ID A recipe ID.
     * @return {undefined}
     */
    handle_passToQIH_QuotaInput(ev, ID)
    {
        window.QIH.acceptQueueItemQuotaInput(ev, ID)
    }
    // end handle_passToQIH_QuotaChange()
    
    
    /**
     * Pass the recipe ID of the quota decrement to QueueInterfaceHandler.
     *
     * @param {Event} ev The event that happened.
     * @param {String} ID A recipe ID.
     * @return {undefined}
     */
    handle_passToQIH_QuotaDecrement(ev, ID)
    {
        window.QIH.acceptQuotaDecrement(ID);
    }
    // end handle_passToQIH_QuotaDecrement()
    
    
    /**
     * Pass the recipe ID of the quota increment to QueueInterfaceHandler.
     *
     * @param {Event} ev The event that happened.
     * @param {String} ID A recipe ID.
     * @return {undefined}
     */
    handle_passToQIH_QuotaIncrement(ev, ID)
    {
        window.QIH.acceptQuotaIncrement(ID);
    }
    // end handle_passToQIH_QuotaIncrement()
    
    
    /**
     * Pass a button click for decrementing inventory of an ingredient to window.IIH.
     *
     * @param {Event} ev Button click for decrementing inventory
     * @param {String} ID A resource ID from JSON.DataTable. In this instance it is an ingredient of queueItemID.
     * @param {String} queueItemID A resource ID from JSON.DataTable. In this instance it is a queue item.
     */
    handle_passesFor_InventoryDecrement(ev, ID, queueItemID)
    {
        // ID is the resource whose inventory is being decremented
        // IIH will handle its responsibilities,
        // then trigger QIH to take over UI updates
        window.IIH.acceptQueueItemEvent_inventoryDecrement(ID, queueItemID);
    }
    // end handle_passesFor_InventoryDecrement()
    
    /**
     * Pass a button click for incrementing inventory of an ingredient to window.IIH.
     *
     * @param {Event} ev Button click for incrementing inventory
     * @param {String} ID A resource ID from JSON.DataTable. In this instance it is an ingredient of queueItemID.
     * @param {String} queueItemID A resource ID from JSON.DataTable. In this instance it is a queue item.
     */
    handle_passesFor_InventoryIncrement(ev, ID, queueItemID)
    {
        // ID is the resource whose inventory is being incremented
        // IIH will handle its responsibilities,
        // then trigger QIH to take over UI updates
        window.IIH.acceptQueueItemEvent_inventoryIncrement(ID, queueItemID);
    }
    // end handle_passesFor_InventoryIncrement()
    
    
    /**
     * Pass an input event (of an inventory input field) to window.IIH.
     *
     * @param {Event} ev Input event on an ingredient's inventory input field.
     * @param {String} ID A resource ID from JSON.DataTable. In this instance it is an ingredient.
     * @param {String} queueItemID A resource ID from JSON.DataTable. In this instance it is a queue item.
     */
    handle_passesFor_InventoryInput(ev, ID, queueItemID)
    {
        // ID is the resource whose inventory is being changed
        // ID is an ingredient of queueItemID
        
        // --------------------------------
        // get arguments for event pass off
        const inputFieldElID = `input_ingredientTableEls-${queueItemID}_inventory-${ID}`
        const errorMessageElID = `inputErrorMessage_input_ingredientTableEls-${queueItemID}_inventory-${ID}`
        const el = document.getElementById(inputFieldElID);
        const value = el.value;
        
        // ---------------------------------------------
        // pass arguments to inventory interface handler
        // IIH will handle its responsibilities,
        // then trigger QIH to take over UI updates
        window.IIH.acceptQueueItemEvent_inventoryInput(ID, value, el, errorMessageElID, queueItemID);
    }
    // end handle_passesFor_InventoryInput()
    
    
    // END EVENT HANDLERS FOR QUEUE ITEM ELEMENT FUNCTIONS
    // ====================================================================
    
    
    /**
     * Create the outer wrapper for titlebarWrapper and collapseContentWrapper.
     * E.g. the thing that holds all the row contents
     *
     * @param {Object} newEntry Result from QueueInterfaceHandler.getNewQueueObject(ID), where ID is a recipe ID.
     * @return {HTMLElement} div
     */
    createCollapsableComponentWrapper(newEntry)
    {
        const collapsableComponentElID = `wrapper_collapsableComponent-${newEntry.id}`;
        return this.createNewEl('div', collapsableComponentElID);
    }
    // end createCollapsableComponentWrapper()
    
    
    /**
     * Create the UI, and add event listeners, for an input field and its surrounding minus/plus buttons.
     *
     * @param {Object} newEntry Result from QueueInterfaceHandler.getNewQueueObject(ID), where ID is a recipe ID.
     * @param {Object} ElIDs Key-Value pairs for strings to be used as inner element ids.
     * @param {Object} ElAttrs Key-Value pairs for strings to be used as inner element attributes.
     * @param {Object} ElEvListeners Key-Value pairs for event listeners to be added to inner elements.
     * @return {HTMLElement} div: A horizontal flexbox that contains incrementButton, inputField, decrementButton.
     */
    createNumericInputFieldComponent(newEntry, ElIDs, ElAttrs, ElEvListeners)
    {
        // ------------------------------
        // create primary wrapper for NIF
        const wrapper_NIF = this.createNewEl
        (
            'div', ElIDs.wrapper.primary, ['flex', 'items-end', 'w-fit']
        );
        
        // ------------------------------
        // create button: decrement quota
        const wrapper_NIF_btnDecrement = this.createNewEl('div', ElIDs.wrapper.btnDecrement);
        const btn_decrement = this.createNewEl
        (
            'button', ElIDs.btn.decrement,
            ['btn', 'btn-sm', 'btn-ghost', 'hover:bg-slate-800', 'hover:text-info', 'rounded-r-none'],
            ElAttrs.decrement
        );
        
        // -------------------------------
        // append icon to decrement button
        const btnIcon_decrement = this.createNewEl('i', undefined, ['fa-solid', 'fa-minus']);
        btn_decrement.append(btnIcon_decrement);
        
        // ---------------------------------------
        // add event listener for decrement button
        this.addEventListener(btn_decrement, 'click', ElEvListeners.decrement, ElEvListeners.decrementParams)
        
        // --------------------------------------
        // append decrement button to its wrapper
        wrapper_NIF_btnDecrement.append(btn_decrement);
        
        // end create button: decrement quota
        // ----------------------------------
        
        
        
        // ------------------
        // create input field
        const wrapper_NIF_inputField = this.createNewEl
        (
            'div', ElIDs.wrapper.inputField,
            ['relative']
        );
        
        const inputField = this.createNewEl
        (
            'input', ElIDs.inputField,
            [
                'px-4', 'w-28', 'h-[32px]', 'bg-slate-800',
                'text-info', 'text-right', 'text-2xl',
                'focus:outline-none', 'focus:ring-1', 'focus:ring-info'
            ],
            ElAttrs.input
        );
        
        const numbersOnlyErrorMessage = this.createNewElWithInnerText
        (
            'p', `inputErrorMessage_${ElIDs.inputField}`,
            ['absolute', 'text-sm', 'text-error', 'hidden'],
            undefined,
            'Numbers only'
        );
        
        // ------------------------------------------
        // add event listener for input field changes
        
        
        this.addEventListener(inputField, 'input', ElEvListeners.input, ElEvListeners.inputParams);
        
        this.addEventListener(inputField, 'focus', (ev) => { document.getElementById(ElIDs.inputField).select() }, undefined);
        
        // ---------------------------------
        // append quota input to its wrapper
        wrapper_NIF_inputField.append(inputField);
        wrapper_NIF_inputField.append(numbersOnlyErrorMessage);
        
        // end create input: quota
        // -----------------------
        
        
        
        // ------------------------------
        // create button: increment quota
        const wrapper_NIF_btnIncrement = this.createNewEl('div', ElIDs.wrapper.btnIncrement, []);
        const btn_increment = this.createNewEl
        (
            'button', ElIDs.btn.increment,
            ['btn', 'btn-sm', 'btn-ghost', 'hover:bg-slate-800', 'hover:text-info', 'rounded-l-none'],
            ElAttrs.increment
        );
        
        // --------------------------------
        // append label to increment button
        const btnIcon_increment = this.createNewEl('i', undefined, ['fa-solid', 'fa-plus']);
        btn_increment.append(btnIcon_increment);
        
        // ---------------------------------------
        // add event listener for increment button
        this.addEventListener(btn_increment, 'click', ElEvListeners.increment, ElEvListeners.incrementParams)
        
        // --------------------------------------
        // append increment button to its wrapper
        wrapper_NIF_btnIncrement.append(btn_increment);
        
        // end create button: increment quota
        // ----------------------------------
        
        
        
        // ---------------------------------------------------
        // append quota els wrappers to main quota els wrapper
        wrapper_NIF.append(wrapper_NIF_btnDecrement);
        wrapper_NIF.append(wrapper_NIF_inputField);
        wrapper_NIF.append(wrapper_NIF_btnIncrement);
        
        // ----------------------
        // return primary wrapper
        return wrapper_NIF;
        
    }
    // end createNumericInputFieldComponent()
    
    
    /**
     * Create the div that will hold titlebar elements like drag handle and title.
     *
     * @param {Object} newEntry Result from QueueInterfaceHandler.getNewQueueObject(ID), where ID is a recipe ID.
     * @return {HTMLElement} div (flex box)
     */
    createTitlebarWrapper(newEntry)
    {
        // titlebar wrapper element id
        const rowTitlebarElID = `queueItemTitlebarWrapper_${newEntry.id}`;
        
        // titlebar wrapper class list
        const rowTitlebarClassList =
        [
            'text-xl',
            'font-medium',
            'flex',
            'items-center',
            'gap-4'
        ];
        
        // return titlebar wrapper
        return this.createNewEl('div', rowTitlebarElID, rowTitlebarClassList);
        
    }
    // createTitlebarWrapper()
    
    
    /**
     * Create a new wrapper that will hold the drag handle icon for a queue item row.
     *
     * @param {Object} newEntry Result from QueueInterfaceHandler.getNewQueueObject(ID), where ID is a recipe ID.
     * @return {HTMLElement} div
     */
    createDragHandleWrapper(newEntry)
    {
        const dragHandleWrapperElID = `wrapper_rowTitlebar_dragHandle-${newEntry.id}`;
        return this.createNewEl('div', dragHandleWrapperElID);
    }
    // end createDragHandleWrapper()
    
    
    /**
     * Create a new drag handle icon for a queue item row
     *
     * @param {Object} newEntry Result from QueueInterfaceHandler.getNewQueueObject(ID), where ID is a recipe ID.
     * @return {HTMLElement} i
     */
    createDragHandleIcon(newEntry)
    {
        // drag handle icon class list
        const rowTitlebar_dragHandle_icon_classList =
        [
            'fa-solid',
            'fa-grip-vertical',
            'sortable-handle',
            'cursor-grab',
            'hover:text-white',
            'active:cursor-grabbing'
        ];
        
        // drag handle icon element id
        const rowTitlebar_dragHandle_icon_elID = `rowTitlebar_dragHandleIcon-${newEntry.id}`;
        
        // create a new drag handle icon element
        return this.createNewEl('i', rowTitlebar_dragHandle_icon_elID, rowTitlebar_dragHandle_icon_classList)
    }
    // end createDragHandleIcon()
    
    
    /**
     * Create a new wrapper that will hold the title (e.g. recipe name) of a queue item row.
     *
     * @param {Object} newEntry Result from QueueInterfaceHandler.getNewQueueObject(ID), where ID is a recipe ID.
     * @return {HTMLElement} div
     */
    createTitlebar_titleWrapper(newEntry)
    {
        const titleElID = `wrapper_rowTitlebar_title-${newEntry.id}`;
        return this.createNewEl('div', titleElID);
    }
    // end createTitlebar_titleWrapper()
    
    
    /**
     * Create a new title (e.g. recipe name) to insert into titlebar title wrapper.
     *
     * @param {Object} newEntry Result from QueueInterfaceHandler.getNewQueueObject(ID), where ID is a recipe ID.
     * @return {HTMLElement} p
     */
    createTitlebar_title(newEntry)
    {
        // collapse titlebar title classList
        const rowTitlebar_title_classList =
        [
            'hover:text-white',
            'hover:cursor-pointer',
            'text-3xl'
        ];
        
        // collapse titlebar title element id
        const rowTitlebar_title_elID = `queueItemTitle_${newEntry.id}`
        
        // create titlebar title element
        const rowTitlebar_title = this.createNewEl('p', rowTitlebar_title_elID, rowTitlebar_title_classList)
        
        // append title string to titlebar title element
        this.appendNewTextNode(rowTitlebar_title, newEntry.name);
        
        return rowTitlebar_title;
        
    }
    // end createTitlebar_title()
    
    
    /**
     * Build drag handle wrapper and icon.
     *
     * @param {Object} newEntry Result from QueueInterfaceHandler.getNewQueueObject(ID), where ID is a recipe ID.
     * @return {HTMLElement} div
     */
    createTitlebarWrapperCell_dragHandle(newEntry)
    {
        const rowTitlebar_dragHandleWrapper = this.createDragHandleWrapper(newEntry);
        const rowTitlebar_dragHandle_icon = this.createDragHandleIcon(newEntry);
        rowTitlebar_dragHandleWrapper.append(rowTitlebar_dragHandle_icon);
        return rowTitlebar_dragHandleWrapper;
    }
    // end createTitlebarWrapperCell_dragHandle()
    
    
    /**
     * Create titlebar cell for quota input (how many time user wants to make "queue item" in game).
     *
     * @param {Object} newEntry Result from QueueInterfaceHandler.getNewQueueObject(ID), where ID is a recipe ID.
     * @return {HTMLElement} div
     */
    createTitleBarWrapperCell_quota(newEntry)
    {
        // ----------------------------------
        // create top level wrapper for quota
        const rowTitlebar_quotaWrapper = this.createNewEl
        (
            'div', `rowTitlebar_quotaWrapper-${newEntry.id}`
        );
        
        // -------------------------------------------------
        // init data for quota numeric input field component
        
        // element IDs
        const ElIDs =
        {
            wrapper:
            {
                primary: `wrapper_quotaEls-${newEntry.id}`,
                btnDecrement: `wrapper_quotaElsBtn_decrement-${newEntry.id}`,
                inputField: `wrapper_quotaElsInput_quota-${newEntry.id}`,
                btnIncrement: `wrapper_quotaElsBtn_increment-${newEntry.id}`
            },
            
            btn:
            {
                decrement: `btn_quotaDecrement-${newEntry.id}`,
                increment: `btn_quotaIncrement-${newEntry.id}`
            },
            
            inputField: `input_queueItemQuota-${newEntry.id}`
        }
        
        const ElAttrs =
        {
            decrement: {'data-id': `${newEntry.id}`},
            input: {'type': 'text', 'value': `${newEntry.quota}` , 'data-id': `${newEntry.id}`},
            increment: {'data-id': `${newEntry.id}`}
        }
        
        
        const ElEvListeners =
        {
            decrement: this.handle_passToQIH_QuotaDecrement,
            decrementParams: [newEntry.id],
            input: this.handle_passToQIH_QuotaInput,
            inputParams: [newEntry.id],
            increment: this.handle_passToQIH_QuotaIncrement,
            incrementParams: [newEntry.id]
        }
        
        // create quota numeric input field component
        const NIF_quota = this.createNumericInputFieldComponent(newEntry, ElIDs, ElAttrs, ElEvListeners);
        
        
        // -------------------------------------------------------
        // append main quota els wrapper to top level quotaWrapper
        rowTitlebar_quotaWrapper.append(NIF_quota);
        
        // return wrapper for quota
        return rowTitlebar_quotaWrapper;
        
    }
    // end createTitleBarWrapperCell_quota()
    
    
    /**
     * Build titlebar wrapper and title. Make title trigger for toggling collapsable content.
     *
     * @param {Object} newEntry Result from QueueInterfaceHandler.getNewQueueObject(ID), where ID is a recipe ID.
     * @return {HTMLElement} div
     */
    createTitlebarWrapperCell_title(newEntry)
    {
        // create collapse titlebar title wrapper
        const rowTitlebar_titleWrapper = this.createTitlebar_titleWrapper(newEntry);
        
        // create titlebar title element
        const rowTitlebar_title = this.createTitlebar_title(newEntry)
        
        // add collapse/expand event listener to titlebar title element
        this.addEventListener
        (
            rowTitlebar_title,
            'click',
            this.handle_QueueItemContentWrapper_collapseState,
            [`queueItemContentWrapper_${newEntry.id}`, `btnIcon_showResourceInfoModal-${newEntry.id}`, `btnLabel_toggleCollapsableContent-${newEntry.id}`, `chk_collapseContentsAreExpanded-${newEntry.id}`]
        );
        
        // append collapse titlebar title to titlebar title wrapper
        rowTitlebar_titleWrapper.append(rowTitlebar_title);
        
        // return titlebar title
        return rowTitlebar_titleWrapper;
    }
    // end createTitlebarWrapperCell_title()
    
    
    /**
     * Build titlebar action buttons wrapper and button group.
     *
     * @param {Object} newEntry Result from QueueInterfaceHandler.getNewQueueObject(ID), where ID is a recipe ID.
     * @return {HTMLElement} div
     */
    createTitlebarWrapperCell_rowActionButtons(newEntry)
    {
        // -------------------------------------
        // create wrapper for button group (div)
        const rowActionButtonsWrapperElID = `wrapper_queueItem_actionButtons-${newEntry.id}`
        const rowActionButtonsWrapperClassList = ['grow', 'text-right']
        const rowActionButtonsWrapper = this.createNewEl('div', rowActionButtonsWrapperElID, rowActionButtonsWrapperClassList);
        
        // -------------------
        // create button group
        const rowActionButtonsGroupElID = `btnGroup_queueItem_actionButtons-${newEntry.id}`;
        const rowActionButtonsGroupClassList = ['join'];
        const rowActionButtonsGroup = this.createNewEl('div', rowActionButtonsGroupElID, rowActionButtonsGroupClassList);
        
        // ---------------------------------------
        // create button: show resource info modal
        const btn_showResourceInfoModalElID = `btn_queueItem_showResourceInfoModal-${newEntry.id}`
        const btn_showResourceInfoModalClassList =
        [
            'join-item', 'btn', 'btn-sm', 'btn-ghost', 'uppercase', 'hover:bg-info', 'hover:text-black'
        ];
        const btn_showResourceInfoModal = this.createNewEl('button', btn_showResourceInfoModalElID, btn_showResourceInfoModalClassList);
        
        // create icon for button
        const btnIcon_showResourceInfoModal = this.createNewEl('i', `btnIcon_showResourceInfoModal-${newEntry.id}`, ['fa-solid', 'fa-info']);
        
        // append icon and label to button
        btn_showResourceInfoModal.append(btnIcon_showResourceInfoModal);
        this.appendNewTextNode(btn_showResourceInfoModal, 'Info');
        
        // add event listener for showing resource info modal
        this.addEventListener(btn_showResourceInfoModal, 'click', this.handle_passToRIMIH_InfoButtonClick, [`${newEntry.id}`]);
        
        // end create button: show resource info modal
        // -------------------------------------------
        
        // -----------------------------------------
        // create button: toggle collapsable content
        const btn_toggleCollapsableContentElID = `btn_queueItem_toggleCollapsableContent-${newEntry.id}`
        const btn_toggleCollapsableContentClassList =
            [
                'join-item', 'w-[120px]', 'btn', 'btn-sm', 'btn-queueItemAction-toggleCollapsableContent', 'btn-ghost', 'uppercase', 'hover:bg-primary', 'hover:text-black'
            ];
        const btn_toggleCollapsableContent = this.createNewEl('button', btn_toggleCollapsableContentElID, btn_toggleCollapsableContentClassList);
        
        // create icon for button
        const btnIcon_toggleCollapsableContent = this.createNewEl('i', `btnIcon_toggleCollapsableContent-${newEntry.id}`, ['fa-solid', 'fa-angle-down']);
        
        // create label for button
        const btnLabel_toggleCollapsableContent = this.createNewEl('span', `btnLabel_toggleCollapsableContent-${newEntry.id}`);
        this.appendNewTextNode(btnLabel_toggleCollapsableContent, 'Expand');
        
        // append icon and label to button
        btn_toggleCollapsableContent.append(btnIcon_toggleCollapsableContent);
        btn_toggleCollapsableContent.append(btnLabel_toggleCollapsableContent);
        
        // add collapse/expand event listener to toggle collapsable content button
        this.addEventListener
        (
            btn_toggleCollapsableContent,
            'click',
            this.handle_QueueItemContentWrapper_collapseState,
            [`queueItemContentWrapper_${newEntry.id}`, `btnIcon_toggleCollapsableContent-${newEntry.id}`, `btnLabel_toggleCollapsableContent-${newEntry.id}`, `chk_collapseContentsAreExpanded-${newEntry.id}`]
        );
        
        // end create button: toggle collapsable content
        // ---------------------------------------------
        
        // ---------------------------------------
        // create button: remove recipe from queue
        const btn_removeQueueItemElID = `btn_queueItem_removeQueueItem-${newEntry.id}`
        const btn_removeQueueItemClassList =
            [
                'join-item', 'btn', 'btn-sm', 'btn-ghost', 'uppercase', 'hover:bg-warning', 'hover:text-black'
            ];
        const btn_removeQueueItem = this.createNewEl('button', btn_removeQueueItemElID, btn_removeQueueItemClassList);
        
        // create icon for button
        const btnIcon_removeQueueItem = this.createNewEl('i', `btnIcon_removeQueueItem-${newEntry.id}`, ['fa-solid', 'fa-xmark']);
        
        // append icon and label to button
        btn_removeQueueItem.append(btnIcon_removeQueueItem);
        this.appendNewTextNode(btn_removeQueueItem, 'Remove');
        
        // add event listener for remove recipe button
        this.addEventListener(btn_removeQueueItem, 'click', this.handle_passToQIH_RemoveItemClick, [`${newEntry.id}`]);
        
        // end create button: remove recipe from queue
        // -------------------------------------------
        
        // ------------------------------
        // append buttons to button group
        rowActionButtonsGroup.append(btn_showResourceInfoModal);
        rowActionButtonsGroup.append(btn_toggleCollapsableContent);
        rowActionButtonsGroup.append(btn_removeQueueItem);
        
        // end create button group
        // -----------------------
        
        // append button group to the wrapper
        rowActionButtonsWrapper.append(rowActionButtonsGroup)
        
        // return wrapper
        return rowActionButtonsWrapper;
    }
    // end createTitlebarWrapperCell_rowActionButtons()
    
    
    /**
     * Create a "progress bar"
     *
     * @param {Object} newEntry Result from QueueInterfaceHandler.getNewQueueObject(ID), where ID is a recipe ID.
     * @return {HTMLElement} div
     */
    createProgressBar(newEntry)
    {
        // --------------------
        // wrapper progress bar
        const progressBarWrapper = this.createNewEl(
            'div', `wrapper_queueItemProgressBar-${newEntry.id}`,
            ['relative', 'flex', 'mt-6', 'h-1', 'bg-gray-500', 'overflow-hidden']
        );
        
        // ------------------------
        // inner div - percent done
        const progressBar_done = this.createNewEl(
            'div', `wrapper_queueItemProgressBarDone-${newEntry.id}`,
            ['bg-progress-gradient', 'w-full', 'h-1']
        );
        
        //-----------------------------
        // inner div - percent not done
        const progressBar_notDone = this.createNewEl(
            'div', `wrapper_queueItemProgressBarNotDone-${newEntry.id}`,
            ['absolute', 'top-0', 'bg-gray-500', 'w-full', 'h-1', 'transition-all', 'origin-top-left', 'duration-500']
        );
        
        progressBar_notDone.style.left = '0%';
        
        // ------------------------------------------
        // append percent done and notDone to wrapper
        progressBarWrapper.append(progressBar_done);
        progressBarWrapper.append(progressBar_notDone);
        
        return progressBarWrapper;
    }
    // end createProgressbar
    
    /**
     * Create an element that will hold the data contents for a queue item.
     * This is the div that is collapse/expanded when the user clicks on titlebar title
     *
     * @param {Object} newEntry Result from QueueInterfaceHandler.getNewQueueObject(ID), where ID is a recipe ID.
     * @return {HTMLElement}
     */
    createCollapseContentWrapper(newEntry)
    {
        // collapse content el id
        const collapseContentElID = `queueItemContentWrapper_${newEntry.id}`;
        
        // collapse content el classList
        const collapseContentClassList =
        [
            'h-0',
            'max-h-0',
            'overflow-hidden',
            'transition-all',
            'duration-1000'
        ];
        
        // return collapse content wrapper
        return this.createNewEl('div', collapseContentElID, collapseContentClassList);
        
    }
    // end createCollapseContentWrapper()
    
    
    /**
     * Create a hidden checkbox for querying the collapsed/expanded state of the collapseContents wrapper.
     * checked = expanded
     *
     * @param {Object} newEntry Result from QueueInterfaceHandler.getNewQueueObject(ID), where ID is a recipe ID.
     * @return {HTMLElement} hidden input type checkbox
     */
    createCheckboxForCollapseContentsState(newEntry)
    {
        const chk_collapseContentsAreExpandedElID = `chk_collapseContentsAreExpanded-${newEntry.id}`;
        const chk_collapseContentsAreExpandedClassList = ['hidden', 'chk-collapseState'];
        const chk_collapseContentsAreExpandedAttrs = {'type': 'checkbox', 'data-collapse-id': `${newEntry.id}`};
        return this.createNewEl('input', chk_collapseContentsAreExpandedElID, chk_collapseContentsAreExpandedClassList, chk_collapseContentsAreExpandedAttrs);
    }
    // end createCheckboxForCollapseContentsState()
    
    
    /**
     * Create the ingredients table header row.
     *
     * @param {Object} newEntry Result from QueueInterfaceHandler.getNewQueueObject(ID), where ID is a recipe ID.
     * @return {HTMLElement} thead
     */
    createIngredientsTableHead(newEntry)
    {
        // ---------------------
        // create the table head
        const tableHead = this.createNewEl
        (
            'thead', `ingredientsTableHead-${newEntry.id}`,
            ['bg-gray-950', 'border-b-2', 'border-gray-700', 'text-right', 'text-xl']
        );
        
        // create the thead row
        const tableHead_row = this.createNewEl('tr');
        
        // create the contents of the table head row
        const tableHead_row_contents =
        [
            this.createNewElWithInnerText('th', undefined, ['text-left'], undefined, 'Ingredients'),
            this.createNewElWithInnerText('th', undefined, undefined, undefined, 'Qty'),
            this.createNewElWithInnerText('th', undefined, ['pr-16'], undefined, 'Inventory'),
            this.createNewElWithInnerText('th', undefined, ['text-left'], undefined, '%'),
            this.createNewElWithInnerText('th', undefined, undefined, undefined, 'Need'),
            this.createNewElWithInnerText('th', undefined, ['text-left'], undefined, '%'),
            this.createNewElWithInnerText('th', undefined, undefined, undefined, ''),
        ];
        
        // append tableHead_row_contents to tableHead_row
        tableHead_row_contents.forEach((th) => { tableHead_row.append(th); });
        
        // append the thead row to tableHead
        tableHead.append(tableHead_row);
        
        // end create the table head
        // -------------------------
        
        // ---------------------
        // return the table head
        return tableHead;
        
    }
    // end createIngredientsTableHead()
    
    
    /**
     * Build an object that contains all the element ids needed to create a new summary row in for a queue item.
     *
     * @param {Object} newEntry Result from QueueInterfaceHandler.getNewQueueObject(ID), where ID is a recipe ID.
     * @return {Object} Group of string template literals to use as element ids in an ingredients summary row.
     */
    getSummaryRowElIDs(newEntry)
    {
        return {
            tableFoot: `ingredientsTableFoot-${newEntry.id}`,
            sumRequiredQty: `ingredientsTableSum_requiredQty-${newEntry.id}`,
            sumInventory: `ingredientsTableSum_inventory-${newEntry.id}`,
            sumInventoryPct: `ingredientsTableSum_inventoryPct-${newEntry.id}`,
            sumNeedQty: `ingredientsTableSum_needQty-${newEntry.id}`,
            sumNeedPct: `ingredientsTableSum_needPct-${newEntry.id}`
            
        };
    }
    // end getSummaryRowElIDs()
    
    
    /**
     * UI updates following quota and inventory changes will require easy access to queue item elements.
     * This function inserts that collection of elements into the newEntry.els.summaryRow variable.
     *
     * @param {Object} newEntry Result from QueueInterfaceHandler.getNewQueueObject(ID), where ID is a recipe ID.
     * @param {Object} summaryRowEls Collection of HTMLElements.
     */
    insertSummaryRowElsIntoNewEntryData(newEntry, summaryRowEls)
    {
        newEntry.els.summaryRow = summaryRowEls;
    }
    // end insertSummaryRowElsIntoNewEntryData()
    
    
    /**
     * Create the ingredients table footer row.
     *
     * @param {Object} newEntry Result from QueueInterfaceHandler.getNewQueueObject(ID), where ID is a recipe ID.
     * @return {HTMLElement} tfoot
     */
    createIngredientsTableFoot(newEntry)
    {
        // get the summary row el IDs
        const rowElIDs = this.getSummaryRowElIDs(newEntry);
        
        // -----------------------
        // create the table footer
        const tableFoot = this.createNewEl
        (
            'tfoot', rowElIDs.tableFoot,
            ['bg-gray-950', 'border-t-2', 'border-gray-700', 'text-right', 'text-xl']
        );
        
        // create the tfoot row
        const tableFoot_row = this.createNewEl('tr');
        
        // create the contents of the table foot row
        const tableFoot_row_contents =
            [
                // intentionally blank
                this.createNewElWithInnerText('th', undefined, undefined, undefined, ''),
                
                // total pieces required
                this.createNewElWithInnerText
                (
                    'th', rowElIDs.sumRequiredQty,
                    [], undefined, ''
                ),
                
                // total pieces in inventory
                this.createNewElWithInnerText
                (
                    'th', rowElIDs.sumInventory,
                    ['pr-16'], undefined, ''
                ),
                
                // percentage for total_pieces_inventory / total_pieces_required
                this.createNewElWithInnerText
                (
                    'th', rowElIDs.sumInventoryPct,
                    ['text-left'], undefined, ''
                ),
                
                // total pieces needed
                this.createNewElWithInnerText
                (
                    'th', rowElIDs.sumNeedQty,
                    [], undefined, ''
                ),
                
                // percentage for total_pieces_need / total_pieces_required
                this.createNewElWithInnerText
                (
                    'th', rowElIDs.sumNeedPct,
                    ['text-left'], undefined, ''
                ),
                
                // intentionally blank
                this.createNewElWithInnerText('th', undefined, undefined, undefined, ''),
            ];
        
        // append tableFoot_row_contents to tableFoot_row
        tableFoot_row_contents.forEach((th) => { tableFoot_row.append(th); });
        
        // append the tfoot row to tableFoot
        tableFoot.append(tableFoot_row);
        
        // end create the table footer
        // ---------------------------
        
        // =========================================
        // insert summary row els into newEntry data
        this.insertSummaryRowElsIntoNewEntryData(newEntry, {
            sumRequiredQty: tableFoot_row_contents[1],
            sumInventory: tableFoot_row_contents[2],
            sumInventoryPct: tableFoot_row_contents[3],
            sumNeedQty: tableFoot_row_contents[4],
            sumNeedPct: tableFoot_row_contents[5],
        });
        // end insert summary row els into newEntry data
        // =============================================
        
        // return tableFoot
        return tableFoot;
    }
    // end createIngredientsTableHead()
    
    
    /**
     * Create a numeric input field component for an ingredient's inventory.
     *
     * @see createNumericInputFieldComponent()
     *
     * @param {Object} newEntry Result from QueueInterfaceHandler.getNewQueueObject(ID), where ID is a recipe ID.
     * @param {Object} Ingredient An item in newEntry.recipe.
     * @param {Object} IngredientData Data from JSON.DataTable[Ingredient.id]
     *
     * @return {HTMLElement} A NumericInputField component.
     */
    createIngredientsTableCellContents_InventoryNIF(newEntry, Ingredient, IngredientData)
    {
        // -----------
        // element ids
        const ElIDs =
        {
            wrapper:
            {
                primary: `wrapper_ingredientTableEls-${newEntry.id}`,
                btnDecrement: `wrapper_ingredientTableEls-${newEntry.id}_btnInventoryDecrement-${Ingredient.id}`,
                inputField: `wrapper_ingredientTableEls-${newEntry.id}_inputInventory-${Ingredient.id}`,
                btnIncrement: `wrapper_ingredientTableEls-${newEntry.id}_btnInventoryIncrement-${Ingredient.id}`
            },
            
            btn:
            {
                decrement: `btn_ingredientTableEls-${newEntry.id}_decrement-${Ingredient.id}`,
                increment: `btn_ingredientTableEls-${newEntry.id}_increment-${Ingredient.id}`
            },
            
            inputField: `input_ingredientTableEls-${newEntry.id}_inventory-${Ingredient.id}`
            
        }
        
        // ------------------
        // element attributes
        const ElAttrs =
        {
            decrement: {'data-id': `${Ingredient.id}`},
            input: {'type': 'text', 'value': `${IngredientData.inventory}` , 'data-id': `${Ingredient.id}`},
            increment: {'data-id': `${Ingredient.id}`}
        }
        
        // ---------------
        // event listeners
        const ElEvListeners =
        {
            decrement: this.handle_passesFor_InventoryDecrement,
            decrementParams: [`${Ingredient.id}`, `${newEntry.id}`],
            input: this.handle_passesFor_InventoryInput,
            inputParams: [`${Ingredient.id}`, `${newEntry.id}`],
            increment: this.handle_passesFor_InventoryIncrement,
            incrementParams: [`${Ingredient.id}`, `${newEntry.id}`]
        }
        
        // --------------------------
        // return a new NIF component
        return this.createNumericInputFieldComponent(newEntry, ElIDs, ElAttrs, ElEvListeners);
        
        
    }
    // end createIngredientsTableCell_InventoryNIF()
    
    
    /**
     * Build an object that contains all the element ids needed to create a new table row in for a queue item.
     *
     * @param {Object} newEntry Result from QueueInterfaceHandler.getNewQueueObject(ID), where ID is a recipe ID.
     * @param {Object} Ingredient An ingredient of newEntry.
     *
     * @return {Object} Grouped string template literals to use as element ids in an ingredients row.
     */
    getIngredientRowElIDs(newEntry, Ingredient)
    {
        return {
            wrapper:
            {
                row: undefined,
                actionButtons: undefined,
            },
            
            ingredient:
            {
                name: undefined,
                requiredQty: `queueItem-${newEntry.id}_ingredientRequiredQty-${Ingredient.id}`,
                inventoryInput: `queueItem-${newEntry.id}_ingredientInventoryInput-${Ingredient.id}`,
                inventoryPct: `queueItem-${newEntry.id}_ingredientInventoryPct-${Ingredient.id}`,
                needQty: `queueItem-${newEntry.id}_ingredientNeedQty-${Ingredient.id}`,
                needPct: `queueItem-${newEntry.id}_ingredientNeedPct-${Ingredient.id}`,
                actionButtons: `queueItem-${newEntry.id}_ingredientActionButtonsWrapper-${Ingredient.id}`,
            },
            
            btn:
            {
                ingredientInfoModal: `btn_ingredientAction_showResourceInfoModal-${Ingredient.id}`,
                addIngredientToQueue: `btn_ingredientAction_addIngredientToQueue-${Ingredient.id}`,
            },
            
            btnIcon:
            {
                ingredientInfoModal: undefined,
                addIngredientToQueue: undefined,
            }
        };
    }
    // end getIngredientRowElIDs()
    
    
    /**
     * UI updates following quota and inventory changes will require easy access to queue item elements.
     * This function inserts that collection of elements into the newEntry.els.ingredientRows variable.
     *
     * @param {Object} newEntry Result from QueueInterfaceHandler.getNewQueueObject(ID), where ID is a recipe ID.
     * @param {Number} ingredientID A resource ID (an ingredient of newEntry).
     * @param {Object} ingredientRowEls Collection of HTMLElements.
     */
    insertIngredientRowElsIntoNewEntryData(newEntry, ingredientID, ingredientRowEls)
    {
        newEntry.els.ingredientRows[ingredientID] = ingredientRowEls;
    }
    // end insertIngredientRowElsIntoNewEntryData()
    
    
    /**
     *
     * @param {Object} newEntry Result from QueueInterfaceHandler.getNewQueueObject(ID), where ID is a recipe ID.
     * @return {HTMLElement} tbody
     */
    createIngredientsTableBody(newEntry)
    {
        // ---------------------
        // create the table body
        const tableBody = this.createNewEl
        (
            'tbody', `ingredientsTableBody-${newEntry.id}`,
            ['bg-gray-950', 'text-right', 'text-2xl']
        );
        
        // newEntry.recipe is an array
        // each item in newEntry.recipe is an ingredient of newEntry
        // each item needs its own row in tableBody
        
        // --------------------------------------------------
        // for each newEntry.recipe as ingredient of newEntry
        newEntry.recipe.forEach((Ingredient) =>
        {
            // get ingredient data
            const IngredientData = window.QIH.JSON.resources[Ingredient.id];
            
            // get ingredient row el IDs
            const rowElID = this.getIngredientRowElIDs(newEntry, Ingredient);
            
            // ------------------
            // create a table row
            const ingredientRow = this.createNewEl
            (
                'tr', rowElID.wrapper.row,
                ['border-b-0', 'hover:bg-gray-900', 'hover:text-white']
            );
            
            // -------------------
            // create row contents
            
            // ---------------
            // ingredient name
            const cell_name = this.createNewElWithInnerText
            (
                'th', rowElID.ingredient.name, ['text-left'], undefined, `${IngredientData.name}`
            );
            
            // -----------------------
            // ingredient required qty
            const cell_requiredQty = this.createNewElWithInnerText
            (
                'td', rowElID.ingredient.requiredQty,
                undefined, undefined, `${Ingredient.qty}`
            );
            
            // --------------------------
            // ingredient inventory input
            const cell_inventoryInput = this.createNewEl
            (
                'td', rowElID.ingredient.inventoryInput,
                ['float-right'], undefined
            );
            
            // create inventory number input field component
            const inventoryNIF = this.createIngredientsTableCellContents_InventoryNIF
            (
                newEntry, Ingredient, IngredientData
            );
            
            // add class names to inventory decrement and increment buttons for disabled/enabled state
            const btns =
                {
                    dec: inventoryNIF.childNodes[0].childNodes[0],
                    inc: inventoryNIF.childNodes[2].childNodes[0]
                }
            btns.dec.classList.add(`btn_inventoryChange-${Ingredient.id}`);
            btns.inc.classList.add(`btn_inventoryChange-${Ingredient.id}`);
            
            // add class names to inventory input field for inventory update functions
            const inventoryInputField = inventoryNIF.childNodes[1].childNodes[0];
            inventoryInputField.classList.add('inventory-input');
            inventoryInputField.classList.add(`inventory-input-resource-${Ingredient.id}`);
            
            // append inventory NIF to cell_inventoryInput
            cell_inventoryInput.append(inventoryNIF);
            
            // --------------------------------------------------
            // ingredient percentage for inventory / required qty
            const cell_inventoryPct = this.createNewElWithInnerText
            (
                'td', rowElID.ingredient.inventoryPct,
                ['text-left', 'text-inventoryPct'], undefined, ''
            );
            
            // ------------------------
            // ingredient number needed
            const cell_needQty = this.createNewElWithInnerText
            (
                'td', rowElID.ingredient.needQty,
                [], undefined, ''
            );
            
            // ------------------------------------------------------
            // ingredient percentage for number needed / required qty
            const cell_needPct = this.createNewElWithInnerText
            (
                'td', rowElID.ingredient.needPct,
                ['text-left'], undefined, ''
            );
            
            // -------------------------
            // ingredient action buttons
            const cell_actionButtons = this.createNewEl
            (
                'td', rowElID.ingredient.actionButtons
            );
            
            // ---------------------------------
            // ingredient action buttons wrapper
            const wrapper_actionButtons = this.createNewEl
            (
                'div', rowElID.wrapper.actionButtons, ['join']
            );
            
            // ---------------------------------------------------
            // create btn: show resource info modal for ingredient
            const btn_ingredientInfoModal = this.createNewEl
            (
                'button', rowElID.btn.ingredientInfoModal,
                ['join-item', 'btn', 'btn-sm', 'btn-showResourceModal', 'hover:btn-info'],
            );
            
            // -------------------------------------------
            // create btn icon for btn_ingredientInfoModal
            const btnIcon_ingredientInfoModal = this.createNewEl
            (
                'i', rowElID.btnIcon.ingredientInfoModal,
                ['fa-solid', 'fa-info']
            );
            
            // ---------------------
            // append icon to button
            btn_ingredientInfoModal.append(btnIcon_ingredientInfoModal);
            
            // -----------------------------------------------
            // add event listener to show resource info button
            this.addEventListener
            (
                btn_ingredientInfoModal, 'click',
                (ev) => { window.RIMIH.showResourceInfoModal(Ingredient.id); }
            );
            
            // --------------------------------------
            // create button: add ingredient to queue
            const btn_addIngredientToQueue = this.createNewEl
            (
                'button', rowElID.btn.addIngredientToQueue,
                [
                    'join-item', 'btn', 'btn-sm',
                    'btn-addToQueue', `btn-addToQueue-${Ingredient.id}`,
                    'hover:btn-success'
                ],
            );
            
            // disable add ingredient to queue button if ingredient has no recipe
            if (!IngredientData.recipe) { btn_addIngredientToQueue.classList.add('btn-disabled'); }
            
            // disable add ingredient to queue buttin if ingredien is already in the queue
            if (window.QIH.Members.has(`${Ingredient.id}`)) { btn_addIngredientToQueue.classList.add('btn-disabled'); }
            
            // ---------------------------------------
            // create btn icon: add ingredient to queue
            const btnIcon_addIngredientToQueue = this.createNewEl
            (
                'i', rowElID.btnIcon.addIngredientToQueue,
                ['fa-solid', 'fa-plus']
            );
            
            // ---------------------------------------------------------------
            // append btnIcon_addIngredientToQueue to btn_addIngredientToQueue
            btn_addIngredientToQueue.append(btnIcon_addIngredientToQueue);
            
            // -----------------------------------------------
            // add event listener to show resource info button
            this.addEventListener
            (
                btn_addIngredientToQueue, 'click',
                (ev) =>
                {
                    window.QIH.appendNewItem(Ingredient.id);
                    window.QIH.flashQueueMessageBar(`${IngredientData.name} has been added to your queue.`);
                }
            );
            
            
            
            // ----------------------------------------------
            // append action buttons to wrapper_actionButtons
            wrapper_actionButtons.append(btn_ingredientInfoModal);
            wrapper_actionButtons.append(btn_addIngredientToQueue);
            
            // --------------------------------------------------
            // append wrapper_actionButtons to cell_actionButtons
            cell_actionButtons.append(wrapper_actionButtons);
            
            // end  ingredient action buttons
            // ------------------------------
            
            // end create row contents
            // -----------------------
            
            // --------------------------
            // append row contents to row
            ingredientRow.append(cell_name);
            ingredientRow.append(cell_requiredQty);
            ingredientRow.append(cell_inventoryInput);
            ingredientRow.append(cell_inventoryPct);
            ingredientRow.append(cell_needQty);
            ingredientRow.append(cell_needPct);
            ingredientRow.append(cell_actionButtons);
            
            // ===============================
            // update newEntry data attributes
            this.insertIngredientRowElsIntoNewEntryData(newEntry, Ingredient.id, {
                
                requiredQty: cell_requiredQty,
                inventoryField: inventoryInputField,
                inventoryPct: cell_inventoryPct,
                needQty: cell_needQty,
                needPct: cell_needPct
                
            });
            // end update newEntry data attributes
            // ===================================
            
            // ------------------------
            // append row to table body
            tableBody.append(ingredientRow);
            
            
        });
        
        // end  for each newEntry.recipe as ingredient of newEntry
        // -------------------------------------------------------
        
        // end create the table body
        // -------------------------
        
        // return table body
        return tableBody;
        
    }
    // end createIngredientsTableBody()
    
    
    /**
     * Routine for creating an ingredients table (the content in a queue item's collapsable panel).
     *
     * @param {Object} newEntry Result from QueueInterfaceHandler.getNewQueueObject(ID), where ID is a recipe ID.
     * @return {HTMLElement} table
     */
    createIngredientsTable(newEntry)
    {
        // ------------------------
        // create the table element
        const table = this.createNewEl
        (
            'table', `ingredientsTable-${newEntry.id}`,
            ['table', 'mt-6', 'mb-8']
        );
        
        // ---------------------------------------
        // create the table head, body, and footer
        const tableHead = this.createIngredientsTableHead(newEntry);
        const tableBody = this.createIngredientsTableBody(newEntry);
        const tableFoot = this.createIngredientsTableFoot(newEntry);
        
        // hide the table footer if recipe only has 1 ingredient
        if (newEntry.recipe.length === 1)
        {
            tableFoot.classList.add('hidden');
        }
        
        // ----------------------------------------------------
        // append the table head, body, and footer to the table
        table.append
        (
            tableHead,
            tableBody,
            tableFoot
        );
        
        // --------------------------------------------------------
        // init table ingredient row(s) and summary row with values
        this.QItemIH.initNewQueueItemTableUI(newEntry);
        
        // ------------------------
        // return the table element
        return table;
    }
    // end createIngredientsTable()
    
    
    /**
     * Create the recipe-to-inventory UI, e.g. the content that is seen when the queue item is expanded.
     *
     * @param {Object} newEntry Result from QueueInterfaceHandler.getNewQueueObject(ID), where ID is a recipe ID.
     * @return {HTMLElement} div
     */
    createCollapseContents(newEntry)
    {
        // ---------------------------------------------------
        // create a wrapper for all the recipe-to-inventory UI
        const collapseContentsElID = `wrapper_queueItemCollapseContents-${newEntry.id}`;
        const collapseContentsClassList = [];
        const collapseContents = this.createNewEl('div', collapseContentsElID, collapseContentsClassList);
        
        
        // -------------------------------------------
        // create a hidden checkbox for collapse state
        // append checkbox to collapseContents wrapper
        const chk_collapseContentsAreExpanded = this.createCheckboxForCollapseContentsState(newEntry)
        collapseContents.append(chk_collapseContentsAreExpanded);
        
        
        // ---------------------------
        // create an ingredients table
        const ingredientsTable = this.createIngredientsTable(newEntry);
        
        // ----------------------------------------------------
        // append ingredients table to collapseContents wrapper
        collapseContents.append(ingredientsTable);
        
        // -------------------------------
        // return collapseContents wrapper
        return collapseContents;
    }
    // end createCollapseContents()
    
    
    /**
     * Create the 'frame' that holds all the queue item's info and buttons
     *
     * @param {Object} newEntry Result from QueueInterfaceHandler.getNewQueueObject(ID), where ID is a recipe ID.
     */
    createRowContents(newEntry)
    {
        ///////////////////////////////
        // create collapsable component
        const rowContents = this.createCollapsableComponentWrapper(newEntry);
        
        // ===================================
        // create collapse titlebar (flex box)
        const rowTitlebar = this.createTitlebarWrapper(newEntry);
        
        // ---------------------------------
        // create titlebar cell: drag handle
        const rowTitlebar_dragHandleWrapper = this.createTitlebarWrapperCell_dragHandle(newEntry);
        
        // ---------------------------
        // create titlebar cell: quota
        const rowTitlebar_quota = this.createTitleBarWrapperCell_quota(newEntry);
        
        // -------------------------------------------
        // insert quota input field into newEntry data
        newEntry.els.quota = rowTitlebar_quota.childNodes[0].childNodes[1];
        
        // ---------------------------
        // create titlebar cell: title
        const rowTitlebar_titleWrapper = this.createTitlebarWrapperCell_title(newEntry);
        
        // --------------------------------------
        // create titlebar cell: row button group
        const rowTitlebar_buttonGroup = this.createTitlebarWrapperCell_rowActionButtons(newEntry);
        
        // ---------------------------------------------------------------------
        // append drag handle, title, and actions button group cells to titlebar
        rowTitlebar.append
        (
            rowTitlebar_dragHandleWrapper,
            rowTitlebar_quota,
            rowTitlebar_titleWrapper,
            rowTitlebar_buttonGroup,
        );
        
        // end create collapse titlebar
        // ============================
        
        // ==================
        // create progressBar
        const progressBar = this.createProgressBar(newEntry);
        
        // -----------------------------------------------
        // insert progress bar elements into newEntry data
        newEntry.els.progressBar = { done: progressBar.childNodes[0], notDone: progressBar.childNodes[1] }
        
        // end create progressBar
        // ======================
        
        // =======================
        // create collapse content
        
        // ---------------------------------------
        // create collapse content (outer) wrapper
        const collapseContentWrapper = this.createCollapseContentWrapper(newEntry);
    
        // --------------------------------
        // create collapse content elements
        const collapseContents = this.createCollapseContents(newEntry);
        
        // -----------------------------------------
        // append collapse contents to their wrapper
        collapseContentWrapper.append(collapseContents);
        
        // end create collapse content elements
        // ------------------------------------
        
        // end create collapse content
        // ===========================
        
        // ===========================================
        // append inner elements to collapse component
        rowContents.append
        (
            rowTitlebar,
            progressBar,
            collapseContentWrapper
        );
        
        // end create collapsable component
        ///////////////////////////////////
        
        // return the row contents
        return rowContents;
    }
    // end createRowContents()
    
    
    /**
     * Routine: create a new row for div#wrapper_queueListItems (a flex-col box).
     *
     * @param {Object} newEntry Result from QueueInterfaceHandler.getNewQueueObject(ID), where ID is a recipe ID.
     * @return {HTMLElement} newEntryRow
     */
    getNewEntryUI(newEntry)
    {
        // ------------------------------------------------------
        // create wrapper for a new row in the queue column (div)
        
        // ----------------------
        // element id for the row
        const newEntryRowElID = `wrapper_queueColumnEntry-${newEntry.id}`;
        
        // ---------------------
        // classList for the row
        // -- classes for fading-in and out at time of append and removal
        // -- class for being a SortableJS item
        const newEntryRowClassList =
        [
            'queue-list-item',
            `queue-list-item-group-${newEntry.group}`,
            'opacity-0',
            'transition-opacity',
            'duration-1000',
            'p-4',
            'rounded-box',
            'sortable-item'
        ];
        
        // -------------------------
        // dataSet items for the row
        // -- data-id for SortableJS position tracking
        const newEntryRowDataSet =
        {
            'data-id': newEntry.id,
            'x-show': `activeGroup === '${newEntry.group}' || activeGroup === 'all'`
        }
        
        // ------------------
        // create the wrapper
        const newEntryRow = this.createNewEl('div', newEntryRowElID, newEntryRowClassList, newEntryRowDataSet);
        
        // end create wrapper for a new row in the queue column (div)
        // ----------------------------------------------------------
        
        // --------------------------
        // create content for the row
        const rowContents = this.createRowContents(newEntry);
        
        // ---------------------
        // append content to row
        newEntryRow.append(rowContents);
        
        // --------------
        // return the row
        return newEntryRow;
    }
    // end getNewEntryUI()
    
    
    /**
     * Add a row in div#wrapper_queueListItems.
     * Called by QueueInterfaceHandler.appendNewEntryUIToQueueColumn()
     *
     * @param {Object} newEntry Result from QueueInterfaceHandler.getNewQueueObject(ID), where ID is a recipe ID.
     */
    appendNewEntryUI(newEntry)
    {
        const newEntryUI = this.getNewEntryUI(newEntry);
        this.els.column.append(newEntryUI);
    }
    // end appendNewEntryUI()
    
}