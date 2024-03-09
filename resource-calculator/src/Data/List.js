// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array
export default class List
{
    /**
     * An JS Array with additional functions.
     *
     * @param {Array} [items] Optional initial values.
     */
    constructor(items = undefined)
    {
        this.items = items ?? [];
    }
    // end constructor()
    
    
    /**
     * Convert List items to JSON string.
     *
     * @return {String}
     */
    toJSON()
    {
        return JSON.stringify(this.items);
    }
    // end toJSON()
    
    
    /**
     * Get the length of the List's items array.
     *
     * @return {number}
     */
    size() { return this.items.length }
    // end size()
    
    
    /**
     * Determine if an item is undefined
     *
     * @param {Number} i The index to check.
     * @return {boolean}
     */
    itemIsUndefined(i) { return this.items[i] === undefined; }
    // end itemIsUndefined()
    
    /**
     * Determine if an item is null.
     *
     * @param {Number} i The index to check.
     * @return {boolean}
     */
    itemIsNull(i) { return this.items[i] === null; }
    // end itemIsNull()
    
    /**
     * Determine if an item is an empty string.
     *
     * @param {Number} i The index to check.
     * @return {boolean}
     */
    itemIsEmptyString(i) { return this.items[i] === ''; }
    // end itemIsEmpty()
    
    
    /**
     * Insert new item(s) at start of List. Uses unshift().
     *
     * @param {Array} newItems What to insert.
     * @return {Number} The new length of List items.
     */
    prepend(newItems)
    {
        return this.items.unshift(...newItems);
    }
    // end prepend()
    
    
    /**
     * Insert new item(s) at end of List. Uses push().
     *
     * @param {Array} newItems What to insert.
     * @return {Number} The new length of List items.
     */
    append(newItems)
    {
        return this.items.push(...newItems);
    }
    // end append()
    
    
    /**
     * Insert new item(s) at a certain position. Uses splice() with delete count of 0.
     *
     * @param {Number} index The position to start inserting new item(s).
     * @param {Array} newItems What to insert.
     * @return {Array} Returns an empty array.
     */
    insertAt(index, newItems)
    {
        return this.items.splice(index, 0, ...newItems);
    }
    // end insertAt()
    
    
    /**
     * Replace items starting at a certain position. Uses splice() with delete count of newItems.length.
     *
     * @param {Number} index The position to start replacing.
     * @param {Array} newItems What to replace with.
     * @return {Array} The items that were replaced.
     */
    replaceAt(index, newItems)
    {
        return this.items.splice(index, newItems.length, ...newItems);
    }
    // end replaceAt()
    
    
    /**
     * Change positions of 2 items using any indices. Consider using List.swapIfBothDefined() instead.
     *
     * - This function could result in undefined list items e.g. index a and/or b exceed items.length.
     * - If you want to implement this function, consider using some of the List class's helper functions like:
     * size(), itemIsUndefined(), itemIsNull(), itemIsEmptyString(), and getObjectPrototypeString().
     *
     * @param {Number} a An index of a List item
     * @param {Number} b An index of a List item
     * @return {undefined}
     */
    swap(a, b)
    {
        [this.items[a], this.items[b]] = [this.items[b], this.items[a]];
    }
    // end swap()
    
    
    /**
     * Swaps the position of items[a] and items[b], if values at both indices are not undefined.
     *
     * @param {Number} a An index of a List item.
     * @param {Number} b An index of a List item.
     * @return {undefined}
     */
    swapIfBothDefined(a, b)
    {
        if(!this.itemIsUndefined(a) && !this.itemIsUndefined(b))
        {
            this.swap(a, b);
        }
    }
    // end swapIfBothDefined()
    
    
    /**
     * Get the current state of List items spread out in a new array.
     *
     * @return {*[]}
     */
    getCopyOfItems() { return [...this.items]; }
    // end getCopyOfItems()
    
    
    /**
     * Turn List items into an empty array.
     *
     * @return {Array} backup A copy of List items before it was cleared out
     */
    clear()
    {
        const backup = this.getCopyOfItems();
        this.items = [];
        return backup;
    }
    // end clear()
    
    
    /**
     * Remove an item by its index. Uses splice() with deleteCount of 1.
     *
     * @param {Number} index The position of the item to be removed
     * @return {*[]} An array containing the item that was removed.
     */
    remove(index) { return this.items.splice(index, 1); }
    // end remove()
    
    
    /**
     * Use Array.prototype.find() to get the first item that satisfies the callback function.
     *
     * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/find
     *
     * @param {Function} callback A function to execute for each element in the array.
     * @param {undefined|*} [thisArg] A value to use as 'this' when executing callback.
     * @return {*|undefined} The first item that satisfies the callback, or undefined.
     */
    find(callback, thisArg = undefined)
    {
        return this.items.find(callback, thisArg);
    }
    // end findFirstWhere()
    
    
    /**
     * Determines what the prototype of an item is by:
     * 1. Getting the result of Object.prototype.toString.call(item)
     * 2. Then stripping '[object ' and '] from  result.
     *
     * e.g. turns result like '[object Number]' to 'Number'.
     *
     *
     * @param {*} i
     * @return {string}
     */
    getObjectPrototypeString(i)
    {
        let prototypeStr = Object.prototype.toString.call(i);
        
        // prototype is a string like '[object Number]'
        // need to strip out '[object ' and '];
        // find pos of ' ' and ']'
        const posAfterSpace = prototypeStr.indexOf(' ') + 1; // where to start the substring
        const posClosingBracket = prototypeStr.indexOf(']'); // where to end the substring
        return prototypeStr.substring(posAfterSpace, posClosingBracket);
        
    }
    // end getObjectPrototypeString()
    
    
    /**
     * Iterate through items and get each typeof.
     *
     * @param {Boolean} getPrototype Whether to get prototype. Default false.
     * @param {Boolean} asSet Whether to return a new Set(). Default false.
     * @return {[]|Set}
     */
    getItemTypes(getPrototype = false, asSet = false)
    {
        const types = [];
        
        // get prototype or type
        this.items.forEach((i) =>
        {
            const type= (getPrototype) ? this.getObjectPrototypeString(i) : typeof i;
            types.push(type);
        });
        
        // return based on asSet condition
        if (asSet) { return new Set(types) }
        else { return types; }
    }
    // end itemTypes()
    
    
    /**
     * Iterate through items and get each item's type or prototype.
     *
     * @param {Boolean} getPrototype Whether to get prototype. Default false.
     * @return {{}}
     */
    getItemTypesCounts(getPrototype = false)
    {
        const typeCounts = {};
        this.items.forEach((i) =>
        {
            // const type = typeof i;
            const type = (getPrototype) ? this.getObjectPrototypeString(i) : typeof i;
            if (typeCounts[type] === undefined) { typeCounts[type] = 1 }
            else { ++typeCounts[type] }
        });
        return typeCounts;
    }
    // end itemTypesCounts()
    
    
    /**
     * Determine if all List items have the same (proto)type.
     *
     * @param {Boolean} checkPrototype Whether to check prototype. Default false.
     * @return {Boolean}
     */
    itemsAreAllSameType(checkPrototype = false)
    {
        // get result from List.
        const types = this.getItemTypes(checkPrototype, true);
        return types.size === 1;
    }
    // end isUniform()
    
}

