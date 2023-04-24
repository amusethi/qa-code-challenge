import { test, expect, type Page } from '@playwright/test';
import { checkNumberOfCompletedTodosInLocalStorage, checkNumberOfTodosInLocalStorage, checkTodosInLocalStorage } from '../src/todo-app'

test.beforeEach(async ({ page }) => {
  await page.goto('https://demo.playwright.dev/todomvc');
});

const TODO_ITEMS = [
  'complete code challenge for reach',
  'ensure coverage for all items is automated',
  ' complete code challenge for reach  '
];

test.describe('Create New Todo', () => {
  test('should be able to create new items on the page', async ({ page }) => {
    // create a new todo locator
    const newTodo = page.getByPlaceholder('What needs to be done?');

    // Create 1st todo.
    await newTodo.fill(TODO_ITEMS[0]);
    await newTodo.press('Enter');

    // Make sure the list only has one todo item.
    await expect(page.getByTestId('todo-title')).toHaveText([
      TODO_ITEMS[0]
    ]);

    // Create 2nd todo.
    await newTodo.fill(TODO_ITEMS[1]);
    await newTodo.press('Enter');

    // Make sure the list now has two todo items.
    await expect(page.getByTestId('todo-title')).toHaveText([TODO_ITEMS[0],
      TODO_ITEMS[1]
    ]);

    await checkNumberOfTodosInLocalStorage(page, 2);
  });

// Case - 1
  test('should be able to clear input text when an item is added', async ({ page }) => {
    // create a new todo locator
    const newTodo = page.getByPlaceholder('What needs to be done?');
  
    // Enter the value in input text field   
    await newTodo.fill(TODO_ITEMS[0]);

    // Clear the value of input text field
    await newTodo.clear();

    // Enter the value of 1st to do
    await newTodo.fill(TODO_ITEMS[1]);
    await newTodo.press('Enter');

    // Validate the correct value of input text
    await expect(page.getByTestId('todo-title')).toHaveText(TODO_ITEMS[1]);

    await checkNumberOfTodosInLocalStorage(page, 1);
    await checkTodosInLocalStorage(page, TODO_ITEMS[1]);
  });

  test('should trim entered text', async ({ page }) => {
    // create a new todo locator
    const newTodo = page.getByPlaceholder('What needs to be done?');
  
    // Enter the value with white spaces   
    await newTodo.fill(TODO_ITEMS[2]);
    await newTodo.press('Enter');

    // Validate the entered text is trimmed
    await expect(page.getByTestId('todo-title')).toHaveText(TODO_ITEMS[0]);

    await checkNumberOfTodosInLocalStorage(page, 1);
    await checkTodosInLocalStorage(page, TODO_ITEMS[0]);
  });

  test('should append new items to the bottom of the list', async ({ page }) => {
    // create a new todo locator
    const newTodo = page.getByPlaceholder('What needs to be done?');
  
    // Enter the value of 1st Todo
    await newTodo.fill(TODO_ITEMS[0]);
    await newTodo.press('Enter');

    // Enter the value of 2nd Todo
    await newTodo.fill(TODO_ITEMS[1]);
    await newTodo.press('Enter');

    // Validate newly added todo appends to the bottom of list
    await expect(page.getByTestId('todo-title')).toHaveText([TODO_ITEMS[0],TODO_ITEMS[1]]);

    await checkNumberOfTodosInLocalStorage(page, 2);
    await checkTodosInLocalStorage(page, TODO_ITEMS[0]);
    await checkTodosInLocalStorage(page, TODO_ITEMS[1]);
  });

  test('should not mark new item as completed', async ({ page }) => {
    // create a new todo locator
    const newTodo = page.getByPlaceholder('What needs to be done?');
  
    // Enter the value of 1st Todo
    await newTodo.fill(TODO_ITEMS[0]);
    await newTodo.press('Enter');

    // Enter the value of 2nd Todo
    await newTodo.fill(TODO_ITEMS[1]);
    await newTodo.press('Enter');

    // Validate new items are Active
    await page.getByRole('link', {name:'Active'}).click();
    await expect(page.getByTestId('todo-title')).toHaveCount(2); 
    await expect(page.getByTestId('todo-title')).toHaveText([TODO_ITEMS[0],TODO_ITEMS[1]]);

    // Validate new items are not marked completed by default
    await page.getByRole('link', {name:'Completed'}).click();
    await expect(page.getByTestId('todo-title')).toHaveCount(0); 

    // Navigate to All
    await page.getByRole('link', {name:'All'}).click();

    await checkNumberOfTodosInLocalStorage(page, 2);
    await checkNumberOfCompletedTodosInLocalStorage(page, 0);
    await checkTodosInLocalStorage(page, TODO_ITEMS[0]);
    await checkTodosInLocalStorage(page, TODO_ITEMS[1]);

  });
  
  test('should not create item in todo list with no/blank value', async ({ page }) => {
    // create a new todo locator
    const newTodo = page.getByPlaceholder('What needs to be done?');
  
    // Enter the value of 1st Todo
    await newTodo.fill(TODO_ITEMS[0]);
    await newTodo.press('Enter');

    // Enter the value of 2nd Todo
    await newTodo.fill(TODO_ITEMS[1]);
    await newTodo.press('Enter');

    // Enter the blank value
    await newTodo.press('Enter');

    // Validate newly added todo appends to the bottom of list
    await expect(page.getByTestId('todo-title')).toHaveText([TODO_ITEMS[0],TODO_ITEMS[1]]);

    await checkNumberOfTodosInLocalStorage(page, 2);
    await checkTodosInLocalStorage(page, TODO_ITEMS[0]);
    await checkTodosInLocalStorage(page, TODO_ITEMS[1]);
  });
  
  test('should not create item in todo list with only white spaces', async ({ page }) => {
    // create a new todo locator
    const newTodo = page.getByPlaceholder('What needs to be done?');
  
    // Enter the value of 1st Todo
    await newTodo.fill(TODO_ITEMS[0]);
    await newTodo.press('Enter');

    // Enter the value of 2nd Todo
    await newTodo.fill(TODO_ITEMS[1]);
    await newTodo.press('Enter');

    // Enter the blank value
    await newTodo.fill(" ");
    await newTodo.press('Enter');

    // Validate newly added todo appends to the bottom of list
    await expect(page.getByTestId('todo-title')).toHaveText([TODO_ITEMS[0],TODO_ITEMS[1]]);

    await checkNumberOfTodosInLocalStorage(page, 2);
    await checkTodosInLocalStorage(page, TODO_ITEMS[0]);
    await checkTodosInLocalStorage(page, TODO_ITEMS[1]);
  });
});
  
// Case - 2
test.describe('Marking as completed', () => {
  test('should be able to mark all items as completed', async ({ page }) => {
    // create a new todo locator
    const newTodo = page.getByPlaceholder('What needs to be done?');

    // Create 1st todo   
    await newTodo.fill(TODO_ITEMS[0]);
    await newTodo.press('Enter');
    
    // Create 2nd todo
    await newTodo.fill(TODO_ITEMS[1]);
    await newTodo.press('Enter');
  
    // Mark all items as completed
    await page.getByRole('checkbox', {name:'Toggle Todo'}).nth(0).check();
    await page.getByRole('checkbox', {name:'Toggle Todo'}).nth(1).check();

    // Validate all items are marked completed
    expect(await page.isChecked('input.toggle')).toBeTruthy(); //input[name=checkbox]
  
    await expect(page.getByTestId('todo-title')).toHaveText([ TODO_ITEMS[0], TODO_ITEMS[1]]);
  
    await checkNumberOfTodosInLocalStorage(page, 2);
    await checkNumberOfCompletedTodosInLocalStorage(page, 2);
  });

  test('should allow clearing the completed state back to incomplete', async ({ page }) => {
    // create a new todo locator
    const newTodo = page.getByPlaceholder('What needs to be done?');

    // Create 1st todo   
    await newTodo.fill(TODO_ITEMS[0]);
    await newTodo.press('Enter');
    
    // Create 2nd todo
    await newTodo.fill(TODO_ITEMS[1]);
    await newTodo.press('Enter');
  
    // Mark all items as completed
    await page.getByRole('checkbox', {name:'Toggle Todo'}).nth(0).check();
    await page.getByRole('checkbox', {name:'Toggle Todo'}).nth(1).check();

    // Validate all items are marked completed
    expect(await page.isChecked('input.toggle:nth-child(1)')).toBeTruthy(); //input[name=checkbox]

    // Marking all items back to incomplete
    await page.getByRole('checkbox', {name:'Toggle Todo'}).nth(0).uncheck();
    await page.getByRole('checkbox', {name:'Toggle Todo'}).nth(1).uncheck();

    // Validate items are marked incompleted
    expect(await page.isChecked('input.toggle')).toBeFalsy();
  
    await checkNumberOfTodosInLocalStorage(page, 2);
  });

  test('should allow marking all as completed with the arrow next to the prompt', async ({ page }) => {
    // create a new todo locator
    const newTodo = page.getByPlaceholder('What needs to be done?');

    // Create 1st todo   
    await newTodo.fill(TODO_ITEMS[0]);
    await newTodo.press('Enter');
    
    // Create 2nd todo
    await newTodo.fill(TODO_ITEMS[1]);
    await newTodo.press('Enter');
  
    // Mark all items as completed by checking the arrow
    await page.getByText('Mark all as complete').check();

    // Validate all items are marked completed
    expect(await page.getByText('Mark all as complete').isChecked()).toBeTruthy()
  
    await checkNumberOfTodosInLocalStorage(page, 2);
    await checkNumberOfCompletedTodosInLocalStorage(page, 2);
  });

  test('should not mark completed untill checkbox is checked', async ({ page }) => {
    // create a new todo locator
    const newTodo = page.getByPlaceholder('What needs to be done?');

    // Create 1st todo   
    await newTodo.fill(TODO_ITEMS[0]);
    await newTodo.press('Enter');
    
    // Create 2nd todo
    await newTodo.fill(TODO_ITEMS[1]);
    await newTodo.press('Enter');

    // Validate items are not marked completed
    expect(await page.getByText('Mark all as complete').isChecked()).toBeFalsy();
  
    // Mark all items as completed by checking the checkbox
    await page.getByText('Mark all as complete').check();

    // Validate items are marked completed after checkbox is checked
    expect(await page.getByText('Mark all as complete').isChecked()).toBeTruthy()
  
    await checkNumberOfTodosInLocalStorage(page, 2);
    await checkNumberOfCompletedTodosInLocalStorage(page, 2);
  });

  test('new todo should not be completed', async ({ page }) => {
    // create a new todo locator
    const newTodo = page.getByPlaceholder('What needs to be done?');

    // Create 1st todo   
    await newTodo.fill(TODO_ITEMS[0]);
    await newTodo.press('Enter');

    // Validate todo is not marked completed
    expect(await page.getByText('Mark all as complete').isChecked()).toBeFalsy();
  
    await checkNumberOfTodosInLocalStorage(page, 1);
  });

  test('completed todo is not displayed under active', async ({ page }) => {
    // create a new todo locator
    const newTodo = page.getByPlaceholder('What needs to be done?');

    // Create 1st todo   
    await newTodo.fill(TODO_ITEMS[0]);
    await newTodo.press('Enter');

    // Mark todo as completed
    await page.getByText('Mark all as complete').check();

    // Navigate to active tab
    await page.getByRole('link', {name:'Active'}).click();

    // Validate completed todo is not displayed under Active
    expect(await page.getByText(TODO_ITEMS[0])).toHaveCount(0);

    await checkNumberOfTodosInLocalStorage(page, 1);
    await checkNumberOfCompletedTodosInLocalStorage(page, 1);
  });

  test('Completed mark todo displays under completed', async ({ page }) => {
    // create a new todo locator
    const newTodo = page.getByPlaceholder('What needs to be done?');

    // Create 1st todo   
    await newTodo.fill(TODO_ITEMS[0]);
    await newTodo.press('Enter');

    // Mark todo as completed
    await page.getByText('Mark all as complete').check();

    // Navigate to active tab
    await page.getByRole('link', {name:'Completed'}).click();

    // Validate completed todo is not displayed under Active
    expect(await page.getByText(TODO_ITEMS[0])).toHaveCount(1);

    await checkNumberOfTodosInLocalStorage(page, 1);
    await checkNumberOfCompletedTodosInLocalStorage(page, 1);
    await checkTodosInLocalStorage(page, TODO_ITEMS[0]);

  });

});

// Case - 3
test.describe('Editing existing todos', () => {
  test('should be able to edit a record', async ({ page }) => {
    // create a new todo locator
    const newTodo = page.getByPlaceholder('What needs to be done?');

    // Create 1st todo.
    await newTodo.fill(TODO_ITEMS[0]);
    await newTodo.press('Enter');

    // Make sure the list only has one todo item.
    await expect(page.getByTestId('todo-title')).toHaveText([TODO_ITEMS[0]]);

    // create record locator
    const record = await page.getByTestId('todo-title'); 

    // Editing a record
    await record.dblclick();
    await record.press('Meta+A'); // Windows we use Control+A, MacOS: Meta+A
    await record.press('Backspace');

    // Retyping text to edit a record
    await record.type(TODO_ITEMS[1]);
    await record.press('Enter');
    
    // Validate the list now has updated todo item
    await expect(page.getByTestId('todo-title')).toHaveText([TODO_ITEMS[1]]);

    await checkNumberOfTodosInLocalStorage(page, 1);
  });

  test('should trim entered text', async ({ page }) => {
    // create a new todo locator
    const newTodo = page.getByPlaceholder('What needs to be done?');

    // Create 1st todo
    await newTodo.fill(TODO_ITEMS[1]);
    await newTodo.press('Enter');

    // Make sure the list only has one todo item.
    await expect(page.getByTestId('todo-title')).toHaveText([TODO_ITEMS[1]]);

    // create record locator
    const record = await page.getByTestId('todo-title'); 

    // Editing a record
    await record.dblclick();
    await record.press('Meta+A'); // Windows:use Control+A, MacOS: Meta+A
    await record.press('Backspace');

    // Retyping text to edit a record with white spaces
    await record.type(TODO_ITEMS[2]);
    await record.press('Enter');
    
    // Validate the entered text is trimmed
    await expect(page.getByTestId('todo-title')).toHaveText([TODO_ITEMS[0]]);

    await checkNumberOfTodosInLocalStorage(page, 1);
  });

  test('should remove the item if the text is cleared', async ({ page }) => {
    // create a new todo locator
    const newTodo = page.getByPlaceholder('What needs to be done?');

    // Create 1st todo
    await newTodo.fill(TODO_ITEMS[0]);
    await newTodo.press('Enter');

    // Make sure the list has one todo item.
    await expect(page.getByTestId('todo-title')).toHaveText(TODO_ITEMS[0]);

    // Create record locator
    const record = await page.getByTestId('todo-title'); 

    // Edit a record to clear text from todo
    await record.dblclick();
    await record.press('Meta+A'); // Windows:use Control+A, MacOS: Meta+A
    await record.press('Backspace');
    await record.press('Enter');

    // Validate cleared text does not exist
    await expect(page.getByTestId('todo-title')).not.toHaveText([TODO_ITEMS[0]]);

    await checkNumberOfTodosInLocalStorage(page, 0);
  });

  test('should cancel edits on escape', async ({ page }) => {
    // create a new todo locator
    const newTodo = page.getByPlaceholder('What needs to be done?');

    // Create 1st todo
    await newTodo.fill(TODO_ITEMS[0]);
    await newTodo.press('Enter');

    // Make sure the list has one todo item.
    await expect(page.getByTestId('todo-title')).toHaveText(TODO_ITEMS[0]);

    // Create record locator
    const record = await page.getByTestId('todo-title'); 

    // Edit a record with new todo
    await record.dblclick();
    await record.press('Meta+A'); // Windows:use Control+A, MacOS: Meta+A
    await record.press('Backspace');
    await record.type(TODO_ITEMS[1]);

    // Press escape after editting record
    await record.press('Escape');

    // Validate edit is cancelled on escape and first todo value displays
    await expect(page.getByTestId('todo-title')).toHaveText([TODO_ITEMS[0]]);

    await checkNumberOfTodosInLocalStorage(page, 1);
  });

  test('should not display todo on Delete', async ({ page }) => {
    // create a new todo locator
    const newTodo = page.getByPlaceholder('What needs to be done?');

    // Create 1st todo
    await newTodo.fill(TODO_ITEMS[0]);
    await newTodo.press('Enter');

    // Make sure the list has one todo item.
    await expect(page.getByTestId('todo-title')).toHaveText(TODO_ITEMS[0]);

    // Create record locator
    const record = await page.getByTestId('todo-title'); 

    // Delete todo
    await record.dblclick();
    await record.press('Meta+A'); // Windows:use Control+A, MacOS: Meta+A
    await record.press('Delete');
    await record.press('Enter');

    // Validate todo does not display on Delete
    await expect(page.getByTestId('todo-title')).not.toHaveText([TODO_ITEMS[0]]);

    await checkNumberOfTodosInLocalStorage(page, 0);
  });

  test('should not display todo on clicking X', async ({ page }) => {
    // create a new todo locator
    const newTodo = page.getByPlaceholder('What needs to be done?');

    // Create 1st todo
    await newTodo.fill(TODO_ITEMS[0]);
    await newTodo.press('Enter');

    // Make sure the list has one todo item.
    await expect(page.getByTestId('todo-title')).toHaveText(TODO_ITEMS[0]);

    // Create record locator
    const record = await page.getByTestId('todo-title'); 

    // Click X
    await record.hover();
    await page.getByLabel('Delete').click();

    // Validate todo does not display after clicking X
    await expect(page.getByTestId('todo-title')).not.toHaveText([TODO_ITEMS[0]]);

    await checkNumberOfTodosInLocalStorage(page, 0);
  });

});

// Case - 4
test.describe('Other functions', () => {
  test('should disable buttons when editing an item', async ({ page }) => {
    // Create a new todo locator
    const newTodo = page.getByPlaceholder('What needs to be done?');

    // Create 1st todo.
    await newTodo.fill(TODO_ITEMS[0]);
    await newTodo.press('Enter');

    // Make sure the list only has one todo item.
    await expect(page.getByTestId('todo-title')).toHaveText([TODO_ITEMS[0]]);

    const record = await page.getByTestId('todo-title'); 

    // Edit a record 
    await record.dblclick();
    await record.press('Meta+A');

    // Validate button is disabled while editting
    await page.getByRole('checkbox', {name:'Toggle Todo'}).nth(0).isHidden();

    await checkNumberOfTodosInLocalStorage(page, 1);
  });

  test('should filter the list on completion by the active or complete filters', async ({ page }) => {
    // Create a new todo locator
    const newTodo = page.getByPlaceholder('What needs to be done?');

    // Create 1st todo.
    await newTodo.fill(TODO_ITEMS[0]);
    await newTodo.press('Enter');

    // Create 2nd todo.
    await newTodo.fill(TODO_ITEMS[1]);
    await newTodo.press('Enter');

    // Make sure the list only has two todo item.
    await expect(page.getByTestId('todo-title')).toHaveText([TODO_ITEMS[0], TODO_ITEMS[1]]);

    // Mark first todo as complete
    await page.getByRole('checkbox', {name:'Toggle Todo'}).nth(0).click();

    // Validate the filter list by active or complete
    await page.getByRole('link', {name:'Active'}).click();
    await expect(page.getByTestId('todo-title')).toHaveText(TODO_ITEMS[1]); 
    await page.getByRole('link', {name:'Completed'}).click();
    await expect(page.getByTestId('todo-title')).toHaveText(TODO_ITEMS[0]); 
    await page.getByRole('link', {name:'All'}).click();

    await checkNumberOfTodosInLocalStorage(page, 2);
    await checkNumberOfCompletedTodosInLocalStorage(page, 1);
  });

  test('should persist it’s data on browser refresh', async ({ page }) => {
    // Create a new todo locator
    const newTodo = page.getByPlaceholder('What needs to be done?');

    // Create 1st todo.
    await newTodo.fill(TODO_ITEMS[0]);
    await newTodo.press('Enter');

    // Create 2nd todo.
    await newTodo.fill(TODO_ITEMS[1]);
    await newTodo.press('Enter');

    // Make sure the list only has two todo item.
     await expect(page.getByTestId('todo-title')).toHaveText([TODO_ITEMS[0], TODO_ITEMS[1]]);

    // Refreshing browser
    page.reload();

    // Validate data after refresh
    await expect(page.getByTestId('todo-title')).toHaveText([TODO_ITEMS[0], TODO_ITEMS[1]]); 

    await checkNumberOfTodosInLocalStorage(page, 2);
    
  });

  test('should retain the changes made after adding items once reloaded', async ({ page }) => {
    // Create a new todo locator
    const newTodo = page.getByPlaceholder('What needs to be done?');

    // Create 1st todo.
    await newTodo.fill(TODO_ITEMS[0]);
    await newTodo.press('Enter');

    // Create 2nd todo.
    await newTodo.fill(TODO_ITEMS[1]);
    await newTodo.press('Enter');

    // Make sure the list only has two todo item.
    await expect(page.getByTestId('todo-title')).toHaveText([TODO_ITEMS[0], TODO_ITEMS[1]]);

    // Change the value of the first item in list
    const record = await page.getByTestId('todo-title').nth(0);
    await record.dblclick();
    await record.press('Meta+A'); // Windows:use Control+A, MacOS: Meta+A
    await record.press('Delete');
    await record.type(TODO_ITEMS[1]);
    await record.press('Enter');

    // Refreshing browser
    page.reload();

    // Validate data after refresh
    await expect(page.getByTestId('todo-title')).toHaveText([TODO_ITEMS[1], TODO_ITEMS[1]]); 

    await checkNumberOfTodosInLocalStorage(page, 2);
    
  });
});