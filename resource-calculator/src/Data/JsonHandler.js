// -----------
// import json
import inventory from "../JSON/inventory.js";
import resources from "../JSON/resources.js";
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
        this.queue = queue;
        this.favorites = favorites;
        this.Clipboard = new ClipboardHandler();
        this.Clipboard.init(); // async checks for clipboard permissions
        this.resourceGroups = ["all", "craft", "food", "meds", "tech", "build", "armor", "weapons", "ammo", "spheres"];
    }
    // end constructor
    
    
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