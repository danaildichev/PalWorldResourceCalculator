export default class RecipesColumnShowHideHandler
{
    /**
     * Performs show or hide animations for recipes column based on the state of '#chk_isDisplayed_col_recipes'.
     *
     * @param {Object} els Contains the HTMLElements involved in toggling visibility of recipes column.
     * @return {undefined}
     */
    constructor(els)
    {
        this.button = els.button;           // UI trigger for recipes column show/hide animation
        this.icon = els.icon;               // this.button's toggle icon
        this.chk = els.chk;                 // checkbox for state of recipes column. default is checked.
        this.colsWrapper = els.colsWrapper; // parent element that holds recipes and queue columns
        this.colRecipes = els.colRecipes;   // the recipes column
        this.colQueue = els.colQueue;       // the queue column
        this.fadeDelay = 250;               // delay between fade and width animation
        
        this.button.addEventListener('click', () => { this.toggleDisplayOfRecipesColumn(); });
    }
    // end constructor()
    
    /*
    * ----------------------------------------------------------
    * The logic for animating the recipes column is contained in
    *
    * animateHide()
    * animateShow()
    * toggleFade()
    *
    * If ever there needed to be edits, probably these are the only
    * functions that would need to be changed.
    *
    * ------------------------------------------
    * The functions mentioned above are fed into
    *
    * hideRecipesColumn()
    * showRecipesColumn()
    *
    * ------------------------------------------
    * The functions mentioned above are fed into
    *
    * toggleDisplayOfRecipesColumn()
    *
    *  */
    
    
    /**
     * Procedure: CSS changes for hiding the recipes column.
     *
     * @return {undefined}
     */
    animateHide()
    {
        // remove gap between recipes and queue columns
        this.colsWrapper.classList.toggle('gap-4');
        
        // set recipes column width to 0
        this.colRecipes.classList.replace('w-1/4', 'w-0');
        
        // set queue column width to full
        this.colQueue.classList.replace('w-3/4', 'w-full');
        
        // toggle off styles for the animation's trigger button's icon
        this.icon.classList.replace('fa-toggle-on', 'fa-toggle-off');
        this.icon.classList.replace('text-success', 'text-base');
    }
    // end animateHide()
    
    
    /**
     * Procedure: CSS changes for showing the recipes column.
     *
     * @return {undefined}
     */
    animateShow()
    {
        // add gap between recipes and queue columns
        this.colsWrapper.classList.toggle('gap-4');
        
        // set recipes column width to 1/4
        this.colRecipes.classList.replace('w-0', 'w-1/4');
        
        // set queue column width to 3/4
        this.colQueue.classList.replace('w-full', 'w-3/4');
        
        // toggle on styles for the animation's trigger button's icon
        this.icon.classList.replace('fa-toggle-off', 'fa-toggle-on');
        this.icon.classList.replace('text-base', 'text-success');
    }
    // end animateShow()
    
    
    /**
     * Animation step: toggle opacity of recipes column.
     *
     * @return {undefined}
     */
    toggleFade() { this.colRecipes.classList.toggle('opacity-0'); }
    // end toggleFade()
    
    
    /**
     * Procedure: animation steps for hiding the recipes column.
     *
     * @return {undefined}
     */
    hideRecipesColumn()
    {
        this.toggleFade();
        setTimeout(() => { this.animateHide(); }, this.fadeDelay);
    }
    // end hideRecipesColumn()
    
    
    /**
     * Procedure: animation steps for showing the recipes column.
     *
     * @return {undefined}
     */
    showRecipesColumn()
    {
        this.animateShow();
        setTimeout(() => { this.toggleFade(); }, this.fadeDelay);
    }
    // end showRecipesColumn()
    
    
    /**
     * Perform animation: toggle the display of the recipes column based on state of checkbox
     *
     * @return {undefined}
     */
    toggleDisplayOfRecipesColumn()
    {
        // hide or show
        if (this.chk.checked){ this.hideRecipesColumn(); }
        else { this.showRecipesColumn(); }
        
        // toggle state of checkbox
        this.chk.checked = !this.chk.checked;
    }
    // end toggleDisplayOfRecipesColumn()
    
}