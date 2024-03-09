import InterfaceHandler from "./InterfaceHandler.js";

export default class ResourceInfoModalInterfaceHandler extends InterfaceHandler
{
    constructor() { super() }
    // end constructor()
    
    /**
     * Get the resource modal.
     *
     * @return {HTMLElement} The resource modal to be shown or closed.
     */
    getResourceInfoModal() { return document.getElementById('modal_resourceInfo'); }
    // end getResourceInfoModalByID()
    
    
    /**
     * Get a collection of all the elements in the resource info modal
     * that need to be updated every time a info button is clicked.
     *
     * @return {Object} Collection of HTMLElements
     */
    getResourceInfoModalElements()
    {
        // document.getElementById('')
        return {
            title: document.getElementById('resourceInfoModal_resourceName'),
            thumbnail: document.getElementById('resourceInfoModal_resourceThumbnail'),
            group: document.getElementById('resourceInfoModal_resourceGroup'),
            inventory: document.getElementById('resourceInfoModal_resourceInventory'),
            isInQueue: document.getElementById('dataTarget_resourceIsInQueue'),
            btn_addResourceToQueue: document.getElementById('btn_resourceInfoModal_addResourceToQueue'),
            btn_removeResourceFromQueue: document.getElementById('btn_resourceInfoModal_removeResourceFromQueue'),
            ingredientsList: document.getElementById('resourceInfoModal_ingredientsList'),
            ingredientOfList: document.getElementById('resourceInfoModal_ingredientOfList'),
            tab_usedIn: document.getElementById('tab_resourceInfoModal_recipeDataset_usedIn'),
            tab_ingredients: document.getElementById('tab_resourceInfoModal_recipeDataset_ingredients')
            
        }
    }
    // end getResourceInfoModalElements()
    
    
    /**
     * Get a list of Resources that will be used to build the 'Recipe' panel's grid.
     *
     * @param {Object} recipe DataTable[ID].recipe which contains an array.
     * @return {Array} List of objects containing enough details about an ingredient to build its grid cell in the 'Recipe' panel.
     */
    getResourcesFromRecipe(recipe)
    {
        // handle resource that has no recipe
        if (recipe === undefined) { return [] }
        
        // make an empty array to hold each Resource
        const ingredientsAsResources = [];
        
        // for each ingredient in the recipe
        recipe.forEach((ingredient) =>
        {
            // get ingredient data
            const ingredientData = this.JSON.getEntryAt('DataTable', ingredient.id)
            
            // get the details from ingredient data that are needed for recipe panel
            let ingredientAsResource = {};
            ingredientAsResource.id = ingredient.id;
            ingredientAsResource.qty = ingredient.qty;
            ingredientAsResource.name = ingredientData.name;
            ingredientAsResource.img = `assets/images/items/${ingredientData.img}`;
            //ingredientAsResource.group = ingredientData.group;
            //ingredientAsResource.inventory = ingredientData.inventory;
            //ingredientAsResource.hasRecipe = ingredientData.recipe !== undefined;
            //ingredientAsResource.isInQueue = '// TO DO';
            
            // push selected ingredient data object to list of ingredientsAsResources
            ingredientsAsResources.push(ingredientAsResource);
            
        });
        // end for each ingredient in the recipe
        
        // return ingredients as collection of Resources
        return ingredientsAsResources;
        
    }
    // end getResourcesFromRecipe()
    
    
    /**
     * Build the 'Recipe' panel's grid: creates and appends grid cells from data collected in ResourceInfoModalInterfaceHandler.getResourcesFromRecipe().
     *
     * @param {Array} ingredientsAsResources The list of ingredients that will be appended as a grid cell.
     * @param {HTMLElement} ingredientsListEl The recipe grid of the 'Recipe' panel.
     */
    routineForSettingIngredientsInRecipePanel(ingredientsAsResources, ingredientsListEl)
    {
        // for each ingredient
        ingredientsAsResources.forEach((ingredient) =>
        {
            // create a grid cell: a flex-col div
            const ingredientListGridCell = document.createElement('div');
            ingredientListGridCell.classList.add('flex');
            ingredientListGridCell.classList.add('flex-col');
            ingredientListGridCell.classList.add('cursor-pointer');
            
            // make the grid cell a button that can swap to a different resource
            ingredientListGridCell.role = 'button';
            ingredientListGridCell.addEventListener('click', () =>
            {
                this.closeAndReopenResourceInfoModalWith(ingredient.id);
            });
            
            // create a div to hold the img, and a div to hold the (qty and ingredient name)
            const ingredientImgWrapper = document.createElement('div');
            const ingredientLabelWrapper = document.createElement('div');
            
            // ---------------
            // create an image
            const ingredientImg = document.createElement('img');
            ingredientImg.src = ingredient.img;
            ingredientImg.alt = `Thumbnail for ${ingredient.name}`;
            ingredientImg.classList.add('w-[100px]');
            ingredientImg.classList.add('h-[100px]');
            ingredientImg.classList.add('mx-auto');
            
            // append img to its wrapper
            ingredientImgWrapper.append(ingredientImg)
            
            // ------------------------------------------------------------
            // create a paragraph for the ingredient's label (qty and name)
            const ingredientLabel = document.createElement('p');
            ingredientLabel.innerText = `(${ingredient.qty}) ${ingredient.name}`;
            ingredientLabel.classList.add('text-xl');
            
            // append the paragraph to its wrapper
            ingredientLabelWrapper.append(ingredientLabel)
            
            // --------------------------------------------------
            // append the img and label wrappers to the grid cell
            ingredientListGridCell.append(ingredientImgWrapper);
            ingredientListGridCell.append(ingredientLabelWrapper);
            
            // append the grid cell to the recipe panel's grid
            ingredientsListEl.append(ingredientListGridCell);
            
        })
        // end for each ingredient
    }
    // end routineForSetIngredientsList()
    
    
    /**
     * Get a list of Resources that will be used to build the 'Used In' panel's grid.
     *
     * @param {Object} usedInList DataTable[ID].usedInRecipesFor which contains an array.
     * @return {Array} List of the Resources that use the corresponding DataTable[ID] as an ingredient.
     */
    getUsedInListItemsAsResources(usedInList)
    {
        // create an array that will hold the Resources listed in usedInList
        const usedInListItemsAsResources = [];
        
        // for each Resource in usedInList as 'ingredientOf'
        usedInList.forEach((ingredientOf) =>
        {
            // get the Resource entry from DataTable
            const resourceOf = this.JSON.getEntryAt('DataTable', ingredientOf.id);
            resourceOf.id = ingredientOf.id;
            
            // push the Resource
            usedInListItemsAsResources.push(resourceOf);
        });
        
        // return the list of Resources
        return usedInListItemsAsResources
    }
    // end getUsedInListItemsAsResources()
    
    
    /**
     * Build the 'Used In' panel's grid: creates and appends grid cells from data collected in ResourceInfoModalInterfaceHandler.getUsedInListItemsAsResources().
     *
     * @param {Array} usedInListItemsAsResources The list of Resources that will be appended as a grid cell.
     * @param {HTMLElement} ingredientOfListEl The used-in grid of the 'Used In' panel.
     */
    routineForSettingUsedInGridItems(usedInListItemsAsResources, ingredientOfListEl)
    {
        // for each Resource from a 'used-in' list
        usedInListItemsAsResources.forEach((resourceOf) =>
        {
            // create a div to be a flex-col
            const resourceOfGridCell = document.createElement('div');
            resourceOfGridCell.classList.add('flex');
            resourceOfGridCell.classList.add('flex-col');
            
            // make the grid cell a button that can swap to a different resource
            resourceOfGridCell.role = 'button';
            resourceOfGridCell.addEventListener('click', () =>
            {
                this.closeAndReopenResourceInfoModalWith(resourceOf.id);
            });
            
            // create a div to hold the img and label
            const resourceOfImgWrapper = document.createElement('div');
            const resourceOfLabelWrapper = document.createElement('div');
            
            // ---------------
            // create an image
            const resourceOfImg = document.createElement('img');
            resourceOfImg.src = `assets/images/items/${resourceOf.img}`;
            resourceOfImg.alt = `Thumbnail for ${resourceOf.name}`;
            resourceOfImg.classList.add('w-[100px]');
            resourceOfImg.classList.add('h-[100px]');
            resourceOfImg.classList.add('mx-auto');
            
            // append img to its wrapper
            resourceOfImgWrapper.append(resourceOfImg)
            
            // ------------------------------------------
            // create a paragraph for the ingredient name
            const resourceOfNameTextNode = document.createElement('p');
            resourceOfNameTextNode.innerText = `${resourceOf.name}`;
            resourceOfNameTextNode.classList.add('text-xl');
            
            // append the paragraph to its wrapper
            resourceOfLabelWrapper.append(resourceOfNameTextNode)
            
            // -----------------------------------------
            // append the img and label to the grid cell
            resourceOfGridCell.append(resourceOfImgWrapper);
            resourceOfGridCell.append(resourceOfLabelWrapper);
            
            // append the grid cell to the ingredients list
            ingredientOfListEl.append(resourceOfGridCell);
            
        });
        // end for each Resource from a 'used-in' list
    }
    // end routineForSettingUsedInGridItems()
    
    
    /**
     * The operations to perform before showing the resource info modal.
     *
     * @param {Object} Resource Which resource will be displayed.
     * @param {Object} modalEls A collection of HTMLElements to act on.
     * @param {Number|String} ID The ID of the resource that will be displayed.
     * @return {undefined}
     */
    routineForResourceInfoModalUpdates(Resource, modalEls, ID)
    {
        // --------------------------
        // set data for this Resource
        
        // title
        modalEls.title.innerText = Resource.name;
        
        // thumbnail
        modalEls.thumbnail.src = `assets/images/items/${Resource.img}`;
        modalEls.thumbnail.alt = `Thumbnail for ${Resource.img}`;
        
        // group
        modalEls.group.innerText = Resource.group;
        
        // inventory
        modalEls.inventory.innerText = Resource.inventory;
        
        // is in queue
        const resourceIsInQueue = window.QIH.Members.has(`${ID}`);
        modalEls.isInQueue.innerText = (resourceIsInQueue) ? 'Yes' : 'No';
        
        // ------------------------------------------
        // toggle hidden state of queue action button
        // corresponding to result of resourceIsInQueue
        modalEls.btn_removeResourceFromQueue.dataset.id = ID;
        modalEls.btn_addResourceToQueue.dataset.id = ID;
        
        // if resource has a recipe, show one of the two queue buttons
        if (Resource.recipe)
        {
            // if resource is in queue, show the 'remove' button
            if (resourceIsInQueue) { modalEls.btn_removeResourceFromQueue.classList.remove('hidden'); }
            
            // else show the 'add button'
            else { modalEls.btn_addResourceToQueue.classList.remove('hidden'); }
        }
        
        // end toggle hidden state of queue action button
        // ----------------------------------------------
        
        
        // end set data for this Resource
        // ------------------------------
        
        // ---------------------------------------------
        // get and set the Resources for the recipe grid
        const ingredientsAsResources = this.getResourcesFromRecipe(Resource.recipe);
        this.routineForSettingIngredientsInRecipePanel(ingredientsAsResources, modalEls.ingredientsList);
        
        // ----------------------------------------------
        // get and set the Resources for the used-in grid
        const usedInListItemsAsResources = this.getUsedInListItemsAsResources(Resource.usedInRecipesFor);
        this.routineForSettingUsedInGridItems(usedInListItemsAsResources, modalEls.ingredientOfList);
        
    }
    // end routineForResourceInfoModalUpdates()
    
    
    /**
     * Make the updates to the resource info modal.
     *
     * @return {undefined}
     */
    setDataInResourceInfoModal(ID)
    {
        // get the resource data
        const Resource = this.JSON.getEntryAt('DataTable', ID)
        
        // get the elements that need to be updated with resource data
        const modalEls = this.getResourceInfoModalElements();
        
        // perform the data update routine
        this.routineForResourceInfoModalUpdates(Resource, modalEls, ID);
    }
    // end setDataInResourceInfoModal()
    
    
    /**
     * Show the resource info modal.
     *
     * - Event is triggered from @click attribute on Recipe Column Items (set up with Alpine)
     * - Event is triggered from info button of Queue Column Items,
     * via listener at QueueEntryBuilder.handle_passToRIMIH_InfoButtonClick().
     *
     * @param {String} ID Which info modal to show
     * @return {undefined}
     */
    showResourceInfoModal(ID)
    {
        // (re)set data in the modal
        this.setDataInResourceInfoModal(ID);
        
        // show the modal
        this.getResourceInfoModal().showModal();
    }
    // end showResourceInfoModal()
    
    
    /**
     * Close the resource info modal.
     *
     * @return {undefined}
     */
    closeResourceInfoModal()
    {
        // get the elements that need to be updated
        const modalEls = this.getResourceInfoModalElements();
        
        // hide both the queue buttons
        modalEls.btn_addResourceToQueue.classList.add('hidden');
        modalEls.btn_removeResourceFromQueue.classList.add('hidden');
        
        
        // clear the contents of the ingredient's list (grid)
        // const ingredientsList = document.getElementById('resourceInfoModal_ingredientsList');
        if (modalEls.ingredientsList.hasChildNodes()) { modalEls.ingredientsList.innerHTML = ''; }
        
        // clear the contents of the ingredient's list (grid)
        //const ingredientOfList = document.getElementById('resourceInfoModal_ingredientOfList');
        if (modalEls.ingredientOfList.hasChildNodes()) { modalEls.ingredientOfList.innerHTML = ''; }
        
        // reset 'recipe' as the checked panel
        modalEls.tab_usedIn.checked = false;
        modalEls.tab_ingredients.checked = true;
        
        
        
        
        // close the modal
        this.getResourceInfoModal().close();
    }
    // end showResourceInfoModal()
    
    
    closeAndReopenResourceInfoModalWith(ID)
    {
        this.closeResourceInfoModal();
        this.showResourceInfoModal(ID);
    }
    
}