# Storefront



### Customer View 

Running this application will first ask a use what they would like to do. 

Selecting to view the items for sale will provide users a list of products they may purchase. From there, users will select the number of items they would like to purchase. Once the purchase is complete, the user will be shown a total cost and asked to either view the list again or exit. 

Once the customer has placed the order, the application checks if the store has enough of the product to meet the customer's request.

If not, the app should logs the phrase `Insufficient quantity!`, and prevents the order from going through.

If the store _does_ have enough of the product, the reqeust is fulfilled. All purchases update the database for future purchases. 



### Manager View

Running this application will:

  * List a set of menu options:

    * View Products for Sale
    
    * View Low Inventory
    
    * Add to Inventory
    
    * Add New Product

    * Exit

  * If a manager selects `View Products for Sale`, the app lists every available item.

  * If a manager selects `View Low Inventory`, then it lists all items with an inventory count lower than five.

  * If a manager selects `Add to Inventory`, the app displays a prompt that will let the manager "add more" of any item currently in the store.

  * If a manager selects `Add New Product`, it allows the manager to add a completely new product to the store.

  * Selecting exit will exit the process.

### Supervisor View

Running this app will provide the user with the following prompts: 

   * View Product Sales by Department

   * Create New Department

   * Exit

When a supervisor selects `View Product Sales by Department`, the app displays a summarized table in their terminal/bash window. 

Selecting `Create New Department` will create an entirely new department in the database. 

Selecting `Exit` will exit the process. 

### See the app in action
You can see a video of the app in action [here](https://drive.google.com/file/d/1QBb4oLxEPZ4cPszPmb46h198Dy9-CY33/view)
