# Pal World Resource Calculator
Crafting &amp; Inventory Tracking for Pal World

Forked from [danaildichev/PalWorldResourceCalculator](https://github.com/danaildichev/PalWorldResourceCalculator).

Watch a demo on YouTube at [https://www.youtube.com/watch?v=MYMQfKZfxzY](https://www.youtube.com/watch?v=MYMQfKZfxzY)

![Static Badge](https://img.shields.io/badge/version-1.3-blue) July 2026

An easy to use crafting to do list with inventory tracking and extra features.
- Decide what you want to make and how many.
- Use the inventory inputs to tell the app what you already have.
- Then the app will tell you what you need to get to complete your goal.

> [!NOTE]
> Item data updated for Palworld's v1.0 full release (July 2026): new Sunreach/World Tree items (Wing Pack, Soralite/Paloxite lines, Ancient civilization building set, new Sky-tier weapons, etc.), plus a pass correcting roughly 250 pre-existing recipes whose costs had drifted out of date. Sakurajima and Feybreak-era items are not yet individually audited; that's next, see To Do below.
>
> The UI also got a pass: a custom "Palworld Fresh" theme (self-hosted Nunito font, grass green / warm amber palette), a properly alphabetized and filterable recipe list, and graceful fallback icons for items still missing artwork.

## Initial Screen
![Initial screen](https://github.com/danaildichev/PalWorldResourceCalculator/blob/main/readme/01_initial.png)

## Use the Quota and Inventory input fields to tell the app what you want and what you have so far
![Use the Quota and Inventory input fields to tell the app what you want and what you have so far](https://github.com/danaildichev/PalWorldResourceCalculator/blob/main/readme/08_gigaSphereInventoryAppliedToNewItemWithSimilarIngredients.png)

## And more!

See more screenshots at [PalWorldResourceCalculator/readme](https://github.com/danaildichev/PalWorldResourceCalculator/tree/main/readme)


## Table of Contents

- [Live Demo](https://vaughant31.github.io/PalWorldResourceCalculator/)
- [Contributing](#contributing)
- [To Do (1)](#to-do)
- [License](#license)

## Live Demo

Available at [https://vaughant31.github.io/PalWorldResourceCalculator/](https://vaughant31.github.io/PalWorldResourceCalculator/)

You can also watch a demo on YouTube at [https://www.youtube.com/watch?v=MYMQfKZfxzY](https://www.youtube.com/watch?v=MYMQfKZfxzY)

## Install

- Get the code and put it on a server.
- Even though it is only HTML, CSS, and JS the app will not work on 'file' protocol.

## Usage

- Show/Hide the Recipes Column.
- Search and filter recipes.
- View details about an item in the Resource Info Modal.
- Add/remove recipes from your Queue.
- Reorder 1 or more Queue items with click and drag.
- Change quotas for Queue items.
- Expand/collapse ingredients tables.
- Update inventory levels for ingredients.

### Additional Features

- Notes: a text area for your ideas.
- Data Export: Get Inventory and Queue data as JSON or save-as.
- About Section: Info about the app and how to use it.

## API

This app does not consume or provide any APIs.

## Issues

Open an issue or hit me up.

## Contributing

PRs accepted.

## To Do

**Data**
- Source real icon images for the v1.0 items added in this pass (data is in place, images are placeholders for now). See FModel + the game's own `Pal/Content/Paks` for current icons.
- Add items introduced in the Sakurajima update.
- Add items introduced in the Feybreak update.
- Audit Sakurajima/Feybreak-era recipes for cost rebalances, the same way the v1.0 pass corrected roughly 250 stale recipes.

**UI**
- Extend the density pass (smaller text, tighter rows) to the Queue and Inventory lists; only the Recipes list got tightened so far.
- Fix the resource-group filter buttons in the Inventory modal: the `:class` binding there is malformed (a semicolon-separated pair of ternaries where only the first is ever applied), so the active-group highlight only partially works.
- Either finish or remove the Favorites feature. The buttons exist in the markup (commented out in the Recipes list) but `addRecipeToFavorites()`/`removeRecipeFromFavorites()` are just placeholder alerts.
- Clean up the sizeable blocks of commented-out markup (dead dropdown filter modifiers, unused favorites buttons) once a decision is made on the item above.
- Once real icons are sourced, remove the SVG placeholder fallback logic or keep it as a permanent safety net for missing files, worth deciding explicitly rather than leaving implicit.

## License

### GPL-3.0
Do whatever you want with this, as long as you keep it free for your users.
