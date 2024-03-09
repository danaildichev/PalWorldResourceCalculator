import InterfaceHandler from "./InterfaceHandler.js";
export default class DataInterfaceHandler extends InterfaceHandler
{
    /**
     * Handles UI and events for the data import/export modal.
     *
     * @return {undefined}
     */
    constructor()
    {
        super();
    }
    
    
    /**
     * Replace a button color style, then change it back after a time delay.
     *
     * @param {HTMLElement} btn Which button to flash.
     * @param {String} styleFrom E.g. 'btn-info'
     * @param {String} styleTo E.g. 'btn-success'
     * @param {Number} flashDelay E.g. 600
     */
    flashTriggerState(btn, styleFrom, styleTo, flashDelay)
    {
        btn.classList.replace(styleFrom, styleTo);
        setTimeout(() =>
        {
            btn.classList.replace(styleTo, styleFrom);
            
        }, flashDelay);
    }
    // end flashTriggerState()
    
    
    /**
     * Send a string to JsonHandler.Clipboard.copyTextToClipboard().
     *
     * @param {String} elID Which element to pull context from.
     * @param {String} context 'innerHTML' or 'innerText'
     * @param {String} trigger The button that the user clicked on to call this function
     */
    async copyToClipboardFrom(elID, context, trigger = undefined)
    {
        // get the element to pull text from
        const source = document.getElementById(elID);
        
        // get the button that triggered this function
        const btn = document.getElementById(trigger);
        
        // get result of copy operations
        const copyResult = await this.JSON.Clipboard.setTextInClipboard(source[context]);
        
        if (trigger)
        {
            // flash UI with result
            if (copyResult) { this.flashTriggerState(btn, 'btn-info', 'btn-success', 600); }
            else { this.flashTriggerState(btn, 'btn-info', 'btn-error', 600); }
        }
        
        
    }
    // end copyToClipboardFrom()
    
    
    /**
     * Pastes from clipboard into the contents of an HTMLElement or alerts user on failure.
     * Can replace, prepend, or append text into a specfied context.
     *
     * @param {String} elID Which element to paste into.
     * @param {String} context 'innerHTML' or 'innerText'
     * @param {String} mode 'replace', prepend, or 'append'
     * @return {Promise<void>}
     */
    async pasteFromClipboardTo(elID, context, mode)
    {
        // get the element that text will be pasted into
        const pasteTarget = document.getElementById(elID);
        
        // get result of paste operation, e.g. the text that will be pasted
        const resultFromClipboardPasteOp = await this.JSON.Clipboard.getTextFromClipboard();
        
        // if text from the clipboard was received
        // and it is not-undefined, not-null, and not-empty
        if
        (
            resultFromClipboardPasteOp !== undefined
            && resultFromClipboardPasteOp !== null
            && resultFromClipboardPasteOp !== ''
        )
        {
            // if mode is 'replace', overwrite the contents of pasteTarget[context]
            if (mode === 'replace') { pasteTarget[context] = resultFromClipboardPasteOp; }
            
            // if mode is 'prepend', prepend the contents of pasteTarget[context]
            if (mode === 'prepend') { pasteTarget[context] = resultFromClipboardPasteOp + pasteTarget[context] }
            
            // if mode is 'append', append the contents of pasteTarget[context]
            if (mode === 'append') { pasteTarget[context] += resultFromClipboardPasteOp }
            
        }
        
        // else alert the user that something is wrong with the paste operation
        else
        {
            alert
            (
                'Something went wrong.\n\n'
                + 'It\'s also possible that your clipboard is empty.\n\n'
                + 'Please make sure you have something in your clipboard to paste with then try again, try something different, or just manually enter your data.'
            );
        }
        
    }
    // end async pasteFromClipboardTo()
    
    
    
}