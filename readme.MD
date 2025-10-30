# ServiceNow Script Console

**Script Console** is a modern, React application built using **ServiceNow SDK 4.0**.

It provides a quick, configurable, and enhanced interface for managing scripting-related records - including (but not limited to) **Business Rules**, **Script Includes**, **Client Scripts**, and **Service Portal Widgets**. It can be configured to work with any record that includes a script field.

The build process uses **ServiceNow Fluent**, allowing the frontend React application and backend ServiceNow application files to coexist seamlessly within a single repository.

### Purpose

This application is built for pro code ServiceNow developers. It isn’t intended to replace tools like ServiceNow Studio, which focus on creating applications from scratch. Instead, it streamlines updates to existing script-based records.

By targeting scripts specifically, the frontend remains lightning fast - it skips unnecessary metadata queries and gets straight to what matters: **writing code**. And dont worry, all the features you are use to from the out of the box script editor such as IntelliSense autocompletions are also here.

---

![Home Page Screenshot](/public/screenshots/homepage_light.png)  
_Figure 1: Script Console home dashboard in light mode_

---

## ⚡ Quick Start (Installation)

You can install Script Console in two ways:  
**1. Install via Update Set**, or **2. Build It Yourself** using SDK 4.0.

### Option 1: Install via Update Set

If you're planning to use the application as-is, this is the simplest and recommended approach.

1. Download the latest [update set](/public/Script%20Console%20V1.0.2.xml) from the public folder of this repository or from [ServiceNow Share](https://developer.servicenow.com/connect.do#!/share/contents/1722570_script_console?t=PRODUCT_DETAILS).
2. Import and commit it to your ServiceNow instance via the **Update Sets** module.

That’s it! The update set installs one file in the global scope - a script include named `ScriptConsoleG` - and the scoped application **Script Console**.

You can now visit:  
`https://your-instance.service-now.com/x_659318_script_console.do`

---

### Option 2: Build It Yourself (SDK 4.0)

Use this option if you plan to modify or explore the application.

1. Fork or clone this repository:
   ```bash
   git clone https://github.com/vincepg13/sn-script-console.git
   cd sn-script-console
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. In your editor, search and replace all occurrences of `x_659318` with your instance/company prefix.
4. Make sure you’re authenticated to your target instance. If not, run:
   ```bash
   npx @servicenow/sdk auth --add <instance_url>
   ```
5. Build and deploy:
   ```bash
   npm run build
   npm run deploy
   ```
6. Finally, include the global Script Include `ScriptConsoleG` in your instance. Download the XML from the [public folder](/public/ScriptConsoleG.xml) and import it. You will also need to Turn on ECMAScript 2021(ES12) mode for this script after you have imported it.

Although Script Console is a scoped application, it relies on one global Script Include for simplified cross scope access as well as making use of APIs which only exist in the global scope.

**PLEASE NOTE** - The application makes use of user preferences to store user related configuration. Therefore I would suggest also setting up a clone preserve to keep your configuration on sub production instances which is where this application will mainly be used. To do this you can set a preserve on the `sys_user_preference` table with a query of `nameSTARTSWITHscript_console`.

---

## 🛠 Technology Stack

- **TypeScript** – Strong typing for maintainable and predictable code.
- **React 19** – Fast, modern component framework.
- **React Router v7 (Data Mode)** – Declarative routing with loaders and actions.
- **TanStack Query** – Data fetching, caching, and background updates.
- **Tailwind CSS** – Utility-first styling for responsive design.
- **Shadcn UI** – Headless, accessible component primitives.
- **sn-shadcn-kit** – Shadcn-based components built specifically for ServiceNow.
- **ServiceNow Fluent** – Define ServiceNow metadata in TypeScript.

💡 Together, these tools deliver a truly modern developer experience on ServiceNow - with real routing, theming, caching, and a component-driven architecture.

---

## 📐 Layout

The Script Console layout is divided into three key regions: the **Fixed Header**, the **Collapsible Sidebar**, and the **Content Pane**.

### Header / Navigation Menu

The header is fixed at the top of the screen and serves multiple purposes, split into three sections:

1. **Quick Controls (left)** – Open/close the sidebar, toggle between fluid and fixed width, and switch between light and dark themes.
2. **Navigation Menu (centre)** – Provides dropdown menus for each script category. For example, hover over **Server Scripts** to view all accessible server-side script tables. Clicking any table opens its list view. The navigation menu is fully customizable (see [Configuration](#configuration)).
3. **Application / Update Set Pickers (right)** – Change your current application or update set. Each picker includes an options button that opens a menu for additional actions.

### Sidebar / Package Manager

The sidebar can be toggled open or closed, with its previous state remembered between sessions. It hosts the **Package Manager**, which lets you group scripts across application scopes into organized packages.

Packages are stored as JSON in a user preference record and rendered dynamically in the sidebar. You can create multiple packages, switch between them, and manage them via the options menu (create, delete, rename).

![Package Manager Screenshot](/public/screenshots/package.png)  
_Figure 2: Script Console package manager_

### Content Pane

The content pane houses the router outlet and displays the active route’s content. It includes a dedicated scroll area so the header and sidebar remain visible while scrolling.

---

## 🧠 Routes

Script Console operates with five main routes: **home**, **list**, **script**, **widget_editor**, and **form**.

### `Homepage`

Refer to Figure 1 above for an overview of the home dashboard. It includes two key sections:

**My Script Stats** – Displays statistics about your script activity across key tables.

Each card shows the number of records you’ve updated in the past 30 days, then animates to reveal your all-time created count. Cards alternate every 10 seconds.

The displayed tables are configurable (see [Configuration](#configuration)).

**My Script Config** – Exposes all user-configurable options for the script editor. The editor uses **CodeMirror** with extensions tailored for ServiceNow scripting:

1. **Prettier Configuration** – [Prettier](https://prettier.io/) is an opinionated code formatter.  
   Defaults match ServiceNow’s formatting but can be customized (e.g. change tab width from 4 to 2 spaces). Documentation is linked from the card header.
2. **ESLint Configuration** – [ESLint](https://eslint.org/) analyzes JS code and highlights potential issues. Rules mirror ServiceNow’s defaults with additional useful ones included. Documentation on rules is linked from the card header.
3. **General Configuration** – Options include:
   - Change the editor theme
   - Automatically update your scope when opening a record
   - Auto-add opened records to your active package
   - Open your last edited widget by default in the Widget Editor

---

### `/script`

Used for editing a single script field on a given record. This view includes a **toolbar** and the **script editor** itself.

**Toolbar**

- **Left Side:**
  - A table dropdown and record picker for selecting records.
  - Add/remove the active record to/from the current package.
- **Right Side:**
  - Two button groups:
    1. **Editor Commands:** search, comment, format, and fullscreen - each with tooltips showing keyboard shortcuts.
    2. **Record Actions:** view previous versions, open in platform, and save (bound to **Ctrl+S**).

**Script Field** – The main editor area where you modify code for the selected record’s script field.

![Script Editor Screenshot](/public/screenshots/script.png)  
_Figure 3: Script editor_

---

### `/widget_editor`

If you’ve developed Service Portal widgets, you’ll be familiar with the native Widget Editor. While functional, it becomes sluggish with larger widgets due to heavy metadata loading.

ServiceNow seems to load the widget’s metadata **plus all dependency metadata** (providers, templates, etc.) before initializing the editor. For widgets with many dependencies and large scripts, this can result in severe performance degradation.

To address this, the Script Console Widget Editor was rebuilt from scratch - focusing on **performance** and **UX**. It loads only the data it needs, fetching dependencies lazily when opened.

I conducted a performance comparison when opening a large widget (6 dependencies, 7 angular providers, 2 HTML templates):

| Editor                           | Load Time |
| -------------------------------- | --------- |
| **Polaris UI**                   | 9.6 s     |
| **ServiceNow Widget Editor**     | 9.1 min   |
| **Script Console Widget Editor** | 1.4 s     |

That’s right - over **9 minutes** in the native editor versus **1.4 seconds** in Script Console. I think there must be a bug which stops widgets over a certain size from loading properly in the widget editor on certain instances. But even comparing against just opening a widget in Polaris UI, its still a significant saving.

![Polaris UI Load Time](/public/screenshots/sn_widget_respone_time.png)  
_Figure 4: Response time opening a widget in Polaris UI_

![ServiceNow Widget Editor Load Time](/public/screenshots/sn_widget_editor_respone_time.png)  
_Figure 5: Response time opening a widget in the native editor_

![Script Console Widget Editor Load Time](/public/screenshots/sc_widget_respone_time.png)  
_Figure 6: Response time opening a widget in Script Console_

The rebuilt editor retains the familiar horizontal layout but introduces several UX enhancements:

- Displays only buttons for hidden script fields (e.g., HTML, Client, CSS, Server, Link).  
  Click to show field, and to hide a field use the close button in the fields header.
- Dependency management is more intuitive:  
  A new **Dependencies** button displays the total count. The button opens a dropdown with an item per dependency type. Clicking any dependency type opens a sidebar to view, add, or remove dependencies.
- Adjacent to the dependencies button is another dropdown toggle (down arrow icon), it includes useful actions like: _Export to XML_, _Clone_, _Open in Platform_, _Show Versions_, and _Create Macro_.
- Toolbar buttons on the right let you create, delete, and save widgets (**Ctrl+S** supported).

Read-only widgets (e.g., those in different scopes) automatically hide restricted actions.

![Widget Editor Screenshot](/public/screenshots/widget_editor.png)  
_Figure 7: Script Console Widget Editor_

---

### `/list` and `/form`

The **List** route is linked to by the navigation menu items and displays the records for a given table. Selecting a record opens it in the script editor. On the table you can filter by doing a text search for the display field, or clicking the filter icon next to the input to do an advanced search. There is also an icon allowing you to open that table in the main instance which is handy if you want to create a new record etc.

If a record can’t be displayed in the script route (for example, no script field exists), the app gracefully falls back to the **Form** route, showing the full ServiceNow form.

**Please note**: The form route is only meant to be used   as a fallback since the form component from _sn-shadcn-kit_ is not 100% complete yet. There may be things which do not work. Once it is finalised I plan to encorporate it into the application so you can also make configuraion changes e.g. updating UI policies.

---

## ⚙️ Configuration <a id="configuration"></a>

Parts of the Script Console application can be customized through system properties. Administrators can modify these properties to tailor the experience per instance.

| Property                        | Description                                                            |
| ------------------------------- | ---------------------------------------------------------------------- |
| `x_659318_script.stats_tables`  | Tables which show on the stats section of the homepage                 |
| `x_659318_script.script_tables` | Table to script field mapping for records viewable in the script route |
| `x_659318_script.app_menu`      | Builds the menu items and dropdowns for the navigation menu            |

### x_659318_script.stats_tables

This property is simply a **comma seperated list** of **table names**. For each table, a stat card will be displayed on the homepage. Due to the layout (4 column grid), I would suggest having either 4 or 8 tables in this property at all times. In a future update I may revisit this and do something like place the stat cards in a carousel allowing as many entries as desired.

### x_659318_script.script_tables

This property dictates which tables can be used in the _/script_ route. It is a mapping of the table name to all the necessary metadata, telling the route which field to display the script from. If a table does not exist in this property, the script route will not be able to open it and will instead forward it to the form route. This property also decides what appears in the table picker on the script route, which allows you to quickly swap between tables/records.

The property is stored as a JSON parseble string. If invalid JSON is detected and parsing fails, the application will fallback to its default tables which are stored locally. So when updating this property take care to make sure it stays valid. The property is one large object where each key is a table name, and its value is an object including the table name, table label, display fields(array) and script field.

For example if I wanted to add a new table called "x_shadkit_script" and the script was stored in the field "ecma_script", with the table having a display field of "title", I would add the following

```json
"x_shadkit_script": {
   "table": "x_shadkit_script",
   "label": "Shadkit Demo Script",
   "display": ["title"],
   "script": "ecma_script"
}
```

Now if I visit the script route I will see that I can select and open records from the _x_shadkit_script_ table and edit the _ecma_script_ field directly.

### x_659318_script.app_menu

This property is used to build the configurable menu items in the navigation menu. The nav menu will always feature a home item, but the remainder of the items can be configured. Like the property above, the menu is stores as a JSON parseable string with a locally stored fallback if needed. The property is an array of objects, where each object defines a menu item.

Each object should define the menu items label, icon, type and items:

- `label`: The label of the navigation menu item.
- `icon`: The icon to display to the left of the nav menu. You can use the [lucide icons](https://lucide.dev/icons/) _Code, Code2, Braces, Brackets or Server_. If you would like to use a different lucide icon, you can include its raw SVG html string instead. (open the icon and click the _Copy SVG_ button. you will need to escape any double quotes).
- `type`: should have the value "single" or "multi". This determines whether the dropdown menu shows as a single column or with two columns.
- `items`: an array of objects which define the menu items in the dropdown menu.
  - _title_ - Title of the dropdown menu item.
  - _href_ - link to the list route for the given table, should be 'list/\<table name\>'. You can filter the table by adding _?query=\<eoncoded_query\>_.
  - _description_ - The description of the item, will display below the title and on the list page above the table.

Lets say I wanted to add a menu item called "Application Logic" which should have a dropdown which links to client scripts, business rules and script includes, as well as using the _app-window_ lucide icon, I would add the following object into the system property:

```json
{
   "label": "Application Logic",
   "icon": "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" class=\"lucide lucide-app-window-icon lucide-app-window\"><rect x=\"2\" y=\"4\" width=\"20\" height=\"16\" rx=\"2\"/><path d=\"M10 4v4\"/><path d=\"M2 8h20\"/><path d=\"M6 4v4\"/></svg>"
   "type": "single",
   "items": [
      {
        "title": "Client Scripts",
        "href": "/list/sys_script_client?query=sys_class_name=sys_script_client",
        "description": "Manage client scripts to run JavaScript in forms and catalog items."
      },
      {
        "title": "Business Rules",
        "href": "/list/sys_script",
        "description": "Respond to database updates with business logic that runs on the server."
      },
      {
        "title": "Script Includes",
        "href": "/list/sys_script_include",
        "description": "Use script includes to keep your server code centralised and reusable."
      },
   ]
}
```

With this you now have all the tools necessary to configure the script console application.

---

## 📢 Summary

The **ServiceNow Script Console** application modernizes script development on the platform by using a **React 19** based UI. It delivers a faster, cleaner, flexible experience for developers - built entirely with **Shadcn** / **sn-shadcn-kit** components and a modern frontend stack.

This application demonstrates what is now possible to build on the platform thanks to Zurichs new "Bring your own frontend" approach to application development via **SDK 4.0**.

---
