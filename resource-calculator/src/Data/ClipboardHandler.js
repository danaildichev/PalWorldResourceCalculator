export default class ClipboardHandler
{
    constructor()
    {
    
    }
    
    async init()
    {
        // check for permissions
        /*
        *
        * checkStateOfPermissions()
        *  - calls getClipboardPermissionsStatuses()
        *  -- calls getClipboardPermissionsQueriesResults()
        *  --- calls getQueryForPermissionResult()
        *  ---- calls queryForPermission()
        *
        *  */
        this.permissions = await this.checkStateOfPermissions();
        this.hasPermissionToRead = await this.canRead();
        this.hasPermissionToWrite = await this.canWrite();
        this.hasPermissionToReadAndWrite = await this.canReadAndWrite();
    }
    
    // ---------------------------------------------
    // functions to perform clipboard read and write
    //
    // copy: write data to the clipboard
    // paste: read data from the clipboard
    //
    
    resolveClipboardCopyOp() { return true; }
    
    
    rejectClipboardCopyOp() { console.error('Failed to copy to clipboard'); return false; }
    
    /* resolveClipboardPasteOp(result) { return { success: true, text: result } };
    rejectClipboardPasteOp(result) { console.error('Failed to paste from clipboard.'); return { success: false, text: result }; } */
    
    /**
     * Perform a navigator.clipboard.writeText() operation.
     *
     * @param {String} text What to copy.
     * @return {Promise<boolean>} Whether the operation was successful.
     */
    async setTextInClipboard(text)
    {
        if (this.hasPermissionToWrite)
        {
            return await navigator.clipboard.writeText(text)
            .then
            (
                this.resolveClipboardCopyOp,
                this.rejectClipboardCopyOp
            );
        }
        
        else { alert('This app needs permission to copy information to the clipboard.') }
    }
    // end async copyTextToClipboard()
    
    
    async getTextFromClipboard()
    {
        if (this.hasPermissionToRead) { return await navigator.clipboard.readText(); }
        else { alert('This app needs permission to paste information from the clipboard. Grant permission and reload the page.') }
    }
    
    
    // end functions to perform clipboard read and write
    // -------------------------------------------------
    
    
    // ---------------------------------------
    // functions to perform permissions checks
    
    
    /**
     * Perform a navigator.permissions.query()
     *
     * @param {String} query 'clipboard-read' or 'clipboard-write'.
     * @return {Promise}
     */
    async queryForPermission(query)
    {
        /* const queryOpts = { name: query, allowWithoutGesture: true };
        const permissionStatus = await navigator.permissions.query(queryOpts); */
        
        // get permission status of 'clipboard-read' or 'clipboard-write'
        // will be 'granted', 'denied' or 'prompt'
        return await navigator.permissions.query({name: query});
    }
    // end async queryForPermission()
    
    
    /**
     * Get result from ClipboardHandler.queryForPermission()
     *
     * @param {String} permissionType
     * @return {Promise<PermissionStatus>}
     */
    async getQueryForPermissionResult(permissionType)
    {
        return await this.queryForPermission(permissionType);
    }
    // end async getQueryForPermissionResult()
    
    /**
     * Get an object containing results from ClipboardHandler.getQueryForPermissionResult()
     * for 'clipbaord-read' and 'clipboard-write'.
     *
     * @return {Promise<Object>} {read: PermissionStatus, write: PermissionStatus}
     */
    async getClipboardPermissionsQueriesResults()
    {
        // results from navigator.permissions.query()
        return {
            read: await this.getQueryForPermissionResult('clipboard-read'),
            write: await this.getQueryForPermissionResult('clipboard-write')
        };
    }
    // end async getClipboardPermissionsQueriesResults()
    
    
    /**
     * Get an object containing a PermissionStatus object for 'clipboard-read' and 'clipboard-write'
     *
     * @return {Promise<Object>} {read: PermissionStatus, write:PermissionStatus}
     */
    async getClipboardPermissionsStatuses()
    {
        return this.getClipboardPermissionsQueriesResults().then(statuses => statuses);
    }
    // end getClipboardPermissions()
    
    
    /**
     * Used in ClipboardHandler.init()
     * Determines the state of the read and write permissions via ClipboardHandler.getClipboardPermissionsStatuses().
     * Returns an object containing keys 'read' and 'write' with values 'granted', 'prompt', or 'denied'.
     *
     * @return {Promise<{read: String, write: String}>}
     */
    async checkStateOfPermissions()
    {
        const clipboardPermissionsStatuses = await this.getClipboardPermissionsStatuses();
        return {
            read: clipboardPermissionsStatuses.read.state,
            write: clipboardPermissionsStatuses.write.state
        }
    }
    // async checkStateOfPermissions()
    
    /**
     * Determine if ClipboardHandler can read data.
     *
     * @return {Promise<boolean>}
     */
    async canRead() { return this.permissions.read !== 'denied'; }
    // end async canRead()
    
    
    /**
     * Determine if ClipboardHandler can write data.
     *
     * @return {Promise<boolean>}
     */
    async canWrite() { return this.permissions.write !== 'denied'; }
    // end async canWrite()
    
    
    /**
     * Determine if ClipboardHandler can read and write data.
     *
     * @return {Promise<boolean>}
     */
    async canReadAndWrite() { return await this.canRead() && await this.canWrite(); }
    // end async canReadAndWrite()
    
    
    // end functions to perform permissions checks
    // -------------------------------------------
    
}