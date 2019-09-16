function generateTable() {

    document.getElementById("resultsSection").style.display = "block";

    // Set options
    var tableTitle = document.getElementById("tableTitle").value;
    var tableDescription = document.getElementById("tableDescription").value;
    var tableSource = document.getElementById("tableSource").value;
    var sortKeySelect = document.getElementById("sortKey")
    var tableSortKey = sortKeySelect.options[sortKeySelect.selectedIndex].value;
    var sortOrderSelect = document.getElementById("sortMethod")
    var tableSortOrder = sortOrderSelect.options[sortOrderSelect.selectedIndex].value;
    var searchToggle = document.getElementById("searchCheck").checked;

    // Parse table data
    var data = document.getElementById("datapaste").value
    var all_rows = data.split("\n");

    var table = document.createElement("table");
    table.setAttribute('class', 'table');
    table.setAttribute('id', 'table');
    
    var headerData = all_rows[0]
    var headerCells = headerData.split("\t");
    var thead = document.createElement("thead");
    var headerRow = document.createElement("tr");
    for(var x in headerCells) {
        var headerCell = document.createElement("th");
        headerCell.innerText = headerCells[x]
        headerRow.appendChild(headerCell);

        // headerKeys.push(headerCells[x])
    }
    thead.appendChild(headerRow)
    table.appendChild(thead)

    
    var rows = all_rows.slice(1,)
    for(var row in rows) {

        var cells = rows[row].split("\t");
        var row = document.createElement("tr");

        for(var x in cells) {
            var cell = document.createElement("td");
            cell.innerText = cells[x]
            row.appendChild(cell);
        }

        table.append(row);
    }

    // Make table code
    var compiled_table = generateTableContainer(table, tableTitle, tableDescription, tableSource)

    // Generate embed
    generateEmbedCode(compiled_table, tableSortKey, tableSortOrder, searchToggle)

    
}

function generateEmbedCode(compiled_table, tableSortKey, tableSortOrder, searchToggle) {
    renderedTable = document.getElementById("renderedTable");
    renderedTable.innerHTML = ""
    renderedTable.appendChild(compiled_table);

    // Create datatables dependencies
    var dtScript = document.createElement("script")
    dtScript.setAttribute("src", "https://cdn.datatables.net/v/dt/jq-3.2.1/dt-1.10.16/r-2.2.1/datatables.min.js")

    // Configure datatables init snippet
    var dtInit = document.createElement("script")
    dtInit.appendChild(document.createTextNode(`$(document).ready(function() {$('#table').DataTable({'order': [[ ${tableSortKey}, '${tableSortOrder}' ]],'iDisplayLength': 10,'lengthChange': false, 'searching': ${searchToggle}, responsive: true});});`))

    // Create styles
    var stylesTag = document.createElement("style")
    stylesTag.appendChild(document.createTextNode(".table-container{font-family:'Open Sans',Helvetica,Arial,sans-serif;padding:10px}.table-container tr td{font-size:.8em}.table-title{font:600 1.2em 'Open Sans',Helvetica,Arial,sans-serif;letter-spacing:0;margin-bottom:0}.table-description{font:400 1em 'Open Sans',Helvetica,Arial,sans-serif;margin:5px 0 15px}.table-source{font:400 .9em 'Open Sans',Helvetica,Arial,sans-serif;color:gray;font-style:italic}table.dataTable.dtr-inline.collapsed>tbody>tr>td:first-child:before,table.dataTable.dtr-inline.collapsed>tbody>tr>th:first-child:before{top:auto;border:0;box-shadow:none;line-height:auto}table.dataTable thead th{color:#000;text-align:left;font-size:.8em;padding:0 8px;border-bottom:2px solid #000}table.dataTable td{padding:4px 8px}.dataTables_paginate a.disabled{color:gray;pointer-events:none}table.dataTable tr{border-bottom:1px solid #ccc}table.dataTable.dtr-inline.collapsed>tbody>tr[role=row]>td:first-child:before,table.dataTable.dtr-inline.collapsed>tbody>tr[role=row]>th:first-child:before{background-color:#0063b1}.dataTables_wrapper .dataTables_paginate .paginate_button{padding:5px 12px;border-radius:4px}.dataTables_wrapper .dataTables_paginate .paginate_button.current{background:0 0;background-color:#000;color:#fff!important;border:none}#table_info,#table_paginate{padding:5px}#table_info{margin-top:10px}#table_paginate{margin-bottom:10px}")) 



    var compiled_html = stylesTag.outerHTML + compiled_table.outerHTML + dtScript.outerHTML + dtInit.outerHTML

    document.getElementById("embedCode").innerText = compiled_html

    document.getElementById("resultsSection").scrollIntoView({
        behavior: 'smooth'
    });
}

function generateTableContainer(table_code, tableTitle, tableDescription, tableSource) {

    var tableContainer = document.createElement("div");
    tableContainer.setAttribute('class', 'table-container');

    var title = document.createElement("h3");
    title.setAttribute('class', 'table-title');
    title.innerText = tableTitle

    var description = document.createElement("p");
    description.setAttribute('class', 'table-description');
    description.innerText = tableDescription

    var source = document.createElement("p");
    source.setAttribute('class', 'table-source');
    source.innerText = tableSource

    tableContainer.appendChild(title)
    tableContainer.appendChild(description)
    tableContainer.appendChild(table_code)
    tableContainer.appendChild(source)

    return tableContainer

}

function keysInit(paste) {
    // Parse header row
    var pastesplit = paste.split("\n")
    var keysRow = pastesplit[0]
    keys = keysRow.split("\t")

    var keySelect = document.getElementById('sortKey')

    // Clear any existing keys in dropdown
    keySelect.innerHTML = ''

    // Add new keys to 'sort by' dropdown
    for(var key in keys) {
        var option = document.createElement('option')
        option.value = key
        option.text = keys[key]
        keySelect.add(option);
    }
}



var pasteField = document.getElementById("datapaste")
pasteField.addEventListener('paste', (event) => {
    let paste = (event.clipboardData || window.clipboardData).getData('text');
    keysInit(paste)
})

var tableform = document.getElementById("tableForm");
tableform.addEventListener("submit", function(event){
    event.preventDefault();
    generateTable();
});
