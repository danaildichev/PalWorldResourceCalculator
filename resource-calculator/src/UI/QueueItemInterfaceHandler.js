/**
 * // regarding newEntry
 * @see QueueInterfaceHandler.getNewQueueObject()
 */
export default class QueueItemInterfaceHandler
{
    
    /**
     * Constructor
     */
    constructor()
    {
        this.precision = 2;
        this.decimal = new Intl.NumberFormat
        (
            'en-US',
            {style: "decimal", minimumFractionDigits: this.precision}
        );
    }
    // end constructor
    
    
    /**
     * Prevent division by 0.
     * - If denominator is 0, returns 0
     * - else returns quotient
     *
     * @param {Number|String} numerator The value to be divided.
     * @param {Number|String} denominator The divisor that will be validated for zero-ness.
     * @return {number}
     */
    safeDivide(numerator, denominator)
    {
        // make sure we are using Numbers
        const num = Number(numerator);
        const den = Number(denominator);
        
        // return 0 if denominator is 0 or return quotient
        if (den === 0) { return 0 }
        else { return num/den; }
    }
    // end safeDivide()
    
    
    /**
     * Turn a quotient into a percentage.
     * - uses safeDivide() and toFixed()
     * - uses en-US number format
     *
     * @param {Number|String} numerator The value to be divided.
     * @param {Number|String} denominator The divisor that will be validated for zero-ness.
     * @param {Number} [precision] How many digits past the decimal point. Default is 2.
     * @return {string} The quotient as a percentage.
     */
    toPercent(numerator, denominator, precision = this.precision)
    {
        return (this.safeDivide(numerator, denominator) * 100).toFixed(precision);
    }
    // end toPercent()
    
    
    /**
     * For use in conjunction with toPercent(). Formats a quotient into en-US deciaml format.
     *
     * @param quotient
     * @return {string}
     */
    toPercentF(quotient)
    {
        return this.decimal.format(Number(quotient));
    }
    // end toPercentF()
    
    
    /**
     * Search a queueItem's recipe to get data about an ingredient.
     *
     * @param {Object} queueItem An item in the Queue.
     * @param {String} ingredientID The ingredient being searched for.
     * @return {Object} The entry in queueItem.recipe whose id property matches ingredientID.
     */
    searchQueueItemRecipeForIngredient(queueItem, ingredientID)
    {
        const isIngredientID = (recipe) => { return recipe.id === Number(ingredientID); }
        return queueItem.recipe.find(isIngredientID);
    }
    // end searchQueueItemRecipeForIngredient()
    
    
    /**
     * Calculate values for an ingredient row.
     * - requiredQty        quota * ingredientQty
     * - inventoryPct       inventory / requiredQty
     * - needQty            requiredQty - inventory
     * - needPct            needQty / requiredQty
     *
     * @param {Object} queueItem The item in Queue that calcs will be performed for.
     * @param {Object} Ingredient The ingredient of queueItem that calcs will be performed for.
     * @return {Object} The result of calcs.
     */
    getCalcs_ingredientRow(queueItem, Ingredient)
    {
        // get quota
        const quota = queueItem.quota;
        
        // using quota, calc required qty of this ingredient
        const requiredQty = quota * Ingredient.qty;
        
        // get value in this ingredient's inventory field
        // use inventory to calculate inventoryPct
        const inventory = queueItem.els.ingredientRows[Ingredient.id].inventoryField.value;
        const inventoryPct = this.toPercent(inventory, requiredQty);
        
        // determine need qty
        const needQty = requiredQty - inventory;
        
        // determine need pct
        const needPct = this.toPercent(needQty, requiredQty);
        
        return {
            requiredQty: requiredQty,
            inventoryPct: inventoryPct,
            needQty: needQty,
            needPct: needPct
        };
    }
    // end getCalcs_ingredientRow()
    
    
    /**
     * Set text color of the inventory percent cell of an ingredient row.
     * - 0 = red
     * - between 0 and 100 = yellow
     * - 100 = green
     * - >100 = blue
     *
     * @param {HTMLElement} inventoryPctEl The inventory percent cell.
     * @param {String} inventoryPct The inventory percent.
     * @return {undefined}
     */
    setInventoryPctTextColor(inventoryPctEl, inventoryPct)
    {
        // cast inventoryPct string to number
        const inventoryPct_N = Number(inventoryPct);
        
        // determine text color based on value of inventoryPct
        let textColor = '';
        if (inventoryPct_N === 0) { textColor = 'text-error'; }
        else if (0 < inventoryPct && inventoryPct_N < 100) { textColor = 'text-warning'; }
        else if (inventoryPct_N === 100) { textColor = 'text-success'; }
        else if (inventoryPct_N > 100) { textColor = 'text-info'; }
        
        // ------------------------------------------
        // set text color of the inventoryPct element
        inventoryPctEl.classList.replace('text-inventoryPct', textColor);
        inventoryPctEl.classList.replace('text-error', textColor);
        inventoryPctEl.classList.replace('text-warning', textColor);
        inventoryPctEl.classList.replace('text-success', textColor);
        inventoryPctEl.classList.replace('text-info', textColor);
    }
    // end setInventoryPctTextColor()
    
    
    /**
     * Using results of ingredient row calcs, format calcs for display in an ingredient row.
     *
     * @param {Object} ingredientRowCalcs Result from getCalcs_ingredientRow().
     * @return {Object}
     */
    castIngredientRowCalcsToStrings(ingredientRowCalcs)
    {
        return {
            requiredQty: `${ingredientRowCalcs.requiredQty}`,
            inventoryPct: `${this.toPercentF(ingredientRowCalcs.inventoryPct)}%`,
            needQty: (ingredientRowCalcs.needQty > 0) ? `${ingredientRowCalcs.needQty}` : '',
            needPct: (ingredientRowCalcs.needPct > 0) ? `${this.toPercentF(ingredientRowCalcs.needPct)}%` : ''
        }
    }
    // end castIngredientRowCalcsToStrings()
    
    
    /**
     * Get a collection of data that is needed to populate the innerText of an ingredient row's table cells.
     * - data about the ingredient
     * - calcs for the ingredient
     * - calcs as strings
     *
     * @see searchQueueItemRecipeForIngredient()
     * @see getCalcs_ingredientRow()
     * @see castIngredientRowCalcsToStrings()
     *
     * @param {Object} queueItem An item in the Queue.
     * @param {String} ingredientID The ID of the ingredient as it would appear in DataTable
     *
     * @return {Object} A collection of results from 3 different functions.
     */
    getIngredientRowData(queueItem, ingredientID)
    {
        // get all the data that is needed for the row
        const Ingredient = this.searchQueueItemRecipeForIngredient(queueItem, ingredientID);
        const IngredientRowCalcs = this.getCalcs_ingredientRow(queueItem, Ingredient);
        const CalcsStrings = this.castIngredientRowCalcsToStrings(IngredientRowCalcs);
        
        return {
            Ingredient: Ingredient,
            IngredientRowCalcs: IngredientRowCalcs,
            CalcsStrings: CalcsStrings
        };
    }
    // end getIngredientRowData()
    
    
    /**
     * Set the innerText of the cells of an ingredient row in a queue item's table.
     * For use with something like Object.entries(queueItem.els.ingredientRows to get IngredientRowEls.
     * CalcsStrings could come from getIngredientRowData() or castIngredientRowCalcsToStrings().
     *
     * @see getIngredientRowData()
     *
     * @param {Object} IngredientRowEls Collection of HTMlElements.
     * @param CalcsStrings
     */
    setIngredientRowData(IngredientRowEls, CalcsStrings)
    {
        // set strings into the elements of the ingredient row
        IngredientRowEls.requiredQty.innerText = CalcsStrings.requiredQty;
        IngredientRowEls.inventoryPct.innerText = CalcsStrings.inventoryPct;
        IngredientRowEls.needQty.innerText = CalcsStrings.needQty;
        IngredientRowEls.needPct.innerText = CalcsStrings.needPct;
    }
    // end setIngredientRowData()
    
    
    /**
     * Routine for getting data and setting it as the innerText of elements in an ingredient row.
     *
     * @see getIngredientRowData()
     * @see setIngredientRowData()
     * @see setInventoryPctTextColor()
     *
     * @param {Object} queueItem The item in Queue that will have (an or each) ingredient row's calcs set.
     * @param {String} ingredientID The ID of the ingredient whose UI is being set
     * @param {Object} ingredientRowEls Collection of HTMLElements in the ingredient row.
     *
     * @return {undefined}
     */
    setUIForIngredientRow(queueItem, ingredientID, ingredientRowEls)
    {
        // ----------------------------
        // get and set data for the row
        // set text color of inventoryPct
        const RowData = this.getIngredientRowData(queueItem, ingredientID);
        this.setIngredientRowData(ingredientRowEls, RowData.CalcsStrings);
        this.setInventoryPctTextColor(ingredientRowEls.inventoryPct, RowData.IngredientRowCalcs.inventoryPct);
    }
    // end setUIForIngredientRow()
    
    
    /**
     * For an item in the Queue, set the innerText for each ingredient row's elements.
     * - Gets each ingredient row's calcs
     * - Gets calcs cast to strings
     * - Sets strings in their respective element
     * - Updates the text color of inventoryPct string.
     *
     * @see setUIForIngredientRow()
     *
     * @param {Object} queueItem The item in the Queue that will have each ingredient row's calcs set.
     * @return {undefined}
     */
    setCalcsForIngredientRows(queueItem)
    {
        // ----------------------------
        // for ingredients of queueItem
        for (const [ingredientID, ingredientRowEls] of (Object.entries(queueItem.els.ingredientRows)))
        {
            // set ingredient row contents
            this.setUIForIngredientRow(queueItem, ingredientID, ingredientRowEls);
        }
        // end for ingredients of queueItem
        // --------------------------------
    }
    // end setCalcsForIngredientRows()
    
    
    /**
     * Calculate values for a queue item's recipe's summary row.
     *
     * @return {Object}
     */
    getCalcs_summaryRow(queueItem)
    {
        const sums =
        {
            requiredQtys: 0,
            maxCountableInventoryQtys: {},
            inventoryThatCounts: {},
            inventoryQtysPct: 0,
            needQtys: 0,
            needQtysPct: 0
        };
        
        // --------------------------------------------------
        // calculate sum of required qtys for each ingredient
        // and use that as max count for inventory pieces
        for (const Ingredient of Object.values(queueItem.recipe))
        {
            const requiredQty = queueItem.quota * Ingredient.qty;
            sums.requiredQtys += requiredQty;
            sums.maxCountableInventoryQtys[Ingredient.id] = requiredQty;
        }
        
        // -----------------------------------
        // determine the inventory that counts
        
        // get the current value in each ingredient's inventory input field
        const currentInventoryAmounts = {};
        for (const [ingredientID, ingredientRowEls] of Object.entries(queueItem.els.ingredientRows))
        {
            currentInventoryAmounts[ingredientID] = ingredientRowEls.inventoryField.value;
        }
        
        // use info from sums.maxCountableInventoryQtys and currentInventoryAmounts
        // to determine if each ingredient's maxInventoryQty or currentInventoryAmount is bigger
        for (const [ingredientID, maxCountableInventoryQty] of Object.entries(sums.maxCountableInventoryQtys))
        {
            // get current inventory amount for the ingredient that is being iterated
            const currentInventoryAmount = Number(currentInventoryAmounts[ingredientID]);
            
            // ------------------------------------------------------------------
            // determine which value to use in summing up "inventory that counts"
            // pick the smaller of the two options:
            sums.inventoryThatCounts[ingredientID] =
                (currentInventoryAmount < maxCountableInventoryQty)
                ? currentInventoryAmount        // the current amount of ingredient in inventory
                : maxCountableInventoryQty;     // the most that could count in the tally
        }
        
        // get sum of "inventory amounts that count"
        // needs to be display in the cell of the summary row's inventory column
        let tallyOfInventoryThatCounts = 0;
        for (const inventoryAmountsThatCount of Object.values(sums.inventoryThatCounts))
        {
            tallyOfInventoryThatCounts += inventoryAmountsThatCount;
        }
        
        // end determine the inventory that counts
        // ---------------------------------------
        
        // ---------------------------------------------------------------------------
        // determine percentage for (sum of inventoryPieces*) / (sum of required qtys)
        const pct_inventoryPiecesThatCount = this.toPercent(tallyOfInventoryThatCounts, sums.requiredQtys);
        
        // --------------------------
        // determine sum of need qtys
        // determine percentage for (sum of need qtys) / (sum of required qtys)
        const sumNeedQtys = sums.requiredQtys - tallyOfInventoryThatCounts;
        const pct_sumNeedQtys = this.toPercent(sumNeedQtys, sums.requiredQtys);
        
        // ----------------------------------------------------
        // return values determined by summary row calculations
        return {
            sumRequiredQty: sums.requiredQtys,
            sumInventory: tallyOfInventoryThatCounts,
            sumInventoryPct: pct_inventoryPiecesThatCount,
            sumNeedQty: sumNeedQtys,
            sumNeedPct: pct_sumNeedQtys
        };
    }
    // end getCalcs_summaryRow()
    
    
    /**
     * Format strings so they can be displayed in a summary row.
     *
     * @param summaryRowCalcs Result from getCalcs_summaryRow().
     * @return {Object} Collection of strings for use in setCalcsForSummaryRow().
     */
    castSummaryRowCalcsToStrings(summaryRowCalcs)
    {
        const sumNeedQtyIsZero = Number(summaryRowCalcs.sumNeedQty) === 0;
        
        const strSumNeedQty = (sumNeedQtyIsZero) ? '' : `${summaryRowCalcs.sumNeedQty}`;
        const strSumNeedPct = (sumNeedQtyIsZero) ? '' : `${this.toPercentF(summaryRowCalcs.sumNeedPct)}%`;
        
        return {
            sumRequiredQty: `${summaryRowCalcs.sumRequiredQty}`,
            sumInventory: `${summaryRowCalcs.sumInventory}`,
            sumInventoryPct: `${this.toPercentF(summaryRowCalcs.sumInventoryPct)}%`,
            sumNeedQty: strSumNeedQty,
            sumNeedPct: strSumNeedPct
        }
    }
    // end castSummaryRowCalcsToStrings()
    
    
    /**
     * For an item in the Queue, set the innerText for summary row elements.
     *
     * @param {Object} queueItem An item in Queue.
     * @param {Object} summaryRowCalcs Result from getCalcs_summaryRow()
     * @return {undefined}
     */
    setCalcsForSummaryRow(queueItem, summaryRowCalcs)
    {
        const summaryRowStrings = this.castSummaryRowCalcsToStrings(summaryRowCalcs)
        
        queueItem.els.summaryRow.sumRequiredQty.innerText = summaryRowStrings.sumRequiredQty;
        queueItem.els.summaryRow.sumInventory.innerText = summaryRowStrings.sumInventory;
        queueItem.els.summaryRow.sumInventoryPct.innerText = summaryRowStrings.sumInventoryPct;
        queueItem.els.summaryRow.sumNeedQty.innerText = summaryRowStrings.sumNeedQty;
        queueItem.els.summaryRow.sumNeedPct.innerText = summaryRowStrings.sumNeedPct;
        
    }
    // end setCalcsForSummaryRow()
    
    
    /**
     * Set style.left for the "notDone" progress bar.
     *
     * - The (gray) "notDone" progressBar div is the one that slides horizontally.
     * - The (color gradient) "done" progressBar is static.
     * - "progress" comes from sumInventoryPct determined in getCalcs_summaryRow().
     * - That is, (the amount of inventory that counts toward covering the sum of required ingredient qtys) divided by (the sum of required ingredient qtys)
     *
     * @param {Object} queueItem An item in Queue.
     * @param {String} progress The value that style.left is set to.
     */
    setProgressBar(queueItem, progress)
    {
        let progress_N = Number(progress)
        if (progress_N > 100) { progress_N = 100; }
        queueItem.els.progressBar.notDone.style.left = `${progress_N}%`;
    }
    // end setProgressBar()
    
    
    setUIForSummaryRowAndProgressBar(queueItem)
    {
        const summaryRowCalcs = this.getCalcs_summaryRow(queueItem);
        this.setCalcsForSummaryRow(queueItem, summaryRowCalcs);
        this.setProgressBar(queueItem, summaryRowCalcs.sumInventoryPct);
    }
    
    
    /**
     * Set the UI for a queue item's elements:
     * - each ingredient row
     * - summary row
     * - progress bar
     *
     * @param queueItem
     */
    setQueueItemTableText(queueItem)
    {
        // -----------------------------
        // set calcs for ingredient rows
        this.setCalcsForIngredientRows(queueItem);
        
        // ---------------------------------
        // get and set calcs for summary row
        // and update progressBar
        this.setUIForSummaryRowAndProgressBar(queueItem);
    }
    // end setQueueItemTableText()
    
    
    /**
     * Populate ingredients table of a new queue item.
     * - Get initial calculations for each ingredientRow and the summaryRow
     * - Set them as text in the ingredients table
     *
     * @param {Object} newEntry Originates from QEB. Populated with data for and HTMLElements of a queue item.
     */
    initNewQueueItemTableUI(newEntry)
    {
        this.setQueueItemTableText(newEntry);
    }
    // end initNewQueueItemUI()
    
    
    /**
     * Update a queue item's table and progress bar.
     *
     * @param {Object} queueItem An item in Queue.
     * @return {undefined}
     */
    acceptQueueItemQuotaChange(queueItem)
    {
        this.setQueueItemTableText(queueItem);
    }
    // end acceptQueueItemQuotaChange()
    
    
    /**
     * On change of an ingredient's inventory, update a queue item's UI:
     * - ingredient row
     * - summary row
     * - progressBar
     *
     * @param {Object} queueItem An item in Queue.
     * @param {String} ingredientID ID for an ingredient of queueItem
     * @return {undefined}
     */
    acceptIngredientInventoryChange(queueItem, ingredientID)
    {
        // ----------------------------------------------------------
        // reset UI for ingredient row, summary row, and progress bar
        const ingredientRowEls = queueItem.els.ingredientRows[ingredientID]
        this.setUIForIngredientRow(queueItem, ingredientID, ingredientRowEls);
        this.setUIForSummaryRowAndProgressBar(queueItem);
    }
    // end acceptIngredientInventoryChange()
    
}