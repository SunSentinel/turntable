// Refactored script


var tableData = { data: [], columns: {}};
var options = {};

var getColumnNames = function getColumnNames(row) {
	var columns = row.split('\t');
	if (columns.length <= 1) throw new Error('not enough columns');else {
		return columns.map(function (c) {
			return c.trim();
		});
	}
};

var getData = function getData(rows) {
	return rows.map(function (r) {
		var columns = r.split('\t');
		return columns.map(function (c) {
			return c.trim();
		});
	});
};

var parsePaste = function parsePaste(pasteInput){
	var rows = pasteInput.split('\n');
	// Must have more than just header
	if (rows.length > 1) {
		var names = getColumnNames(rows.shift());
		var data = getData(rows);
		return { names: names, data: data };
	} else {
		throw new Error('Not enough rows');
	}
}

var parseOptions = function parseOptions(){
	var tableTitle = document.getElementById("tableTitle").value;
    var tableDescription = document.getElementById("tableDescription").value;
    var tableSource = document.getElementById("tableSource").value;
    var tableByline = document.getElementById("tableByline").value;
    var sortKeySelect = document.getElementById("sortKey")
    var tableSortKey = sortKeySelect.options[sortKeySelect.selectedIndex].value;
    var sortOrderSelect = document.getElementById("sortMethod")
    var tableSortOrder = sortOrderSelect.options[sortOrderSelect.selectedIndex].value;
    var searchToggle = document.getElementById("searchCheck").checked;

	options = {
		"table_title": tableTitle,
		"table_description": tableDescription,
		"table_source": tableSource,
		"table_byline": tableByline,
		"table_sort_key": parseInt(tableSortKey),
		"table_sort_order": tableSortOrder,
		"table_search_check": searchToggle,
	}

}


function loadData() {
	optionsSection = document.getElementById("optionsSection")
	optionsSection.style.display = "block";
	optionsSection.scrollIntoView({behavior: 'smooth'});


    // Add headers to 'sort by' dropdown
	var keySelect = document.getElementById('sortKey')
    keySelect.innerHTML = ''
	
	for(var column in tableData.columns.names) {
        var option = document.createElement('option')
        option.value = column
        option.text = tableData.columns.names[column]
        keySelect.add(option);
    }

}



function generateTable() {

	document.getElementById("resultsSection").style.display = "block";
	
	// Create random hash to create unique table id
	// This helps to prevent overlapping init scripts when multiple tables exist on a page.
	var tableID = "table-" + Math.random().toString(36).substring(2, 5) + Math.random().toString(36).substring(2, 5);

	// Create table
    var table = document.createElement("table");
    table.setAttribute('class', 'table');
    table.setAttribute('id', tableID);
    

    var thead = document.createElement("thead");
    var headerRow = document.createElement("tr");
    for(var headerName in tableData.columns.names) {
        var headerCell = document.createElement("th");
        headerCell.innerText = tableData.columns.names[headerName]
        headerRow.appendChild(headerCell);

    }
    thead.appendChild(headerRow)
	table.appendChild(thead)
    
    for(var rowIndex in tableData.data) {
        var row = document.createElement("tr");

        for(var x in tableData.data[rowIndex]) {
            var cell = document.createElement("td");
            cell.innerText = tableData.data[rowIndex][x]
            row.appendChild(cell);
        }

        table.append(row);
    }

    // Make table code
    var compiled_table = generateTableContainer(table)

    // Generate embed
    generateEmbedCode(compiled_table, tableID)

    
}


function generateEmbedCode(compiled_table, tableID) {

    // Create datatables dependencies
    var dtStyles = document.createElement("link")
    dtStyles.setAttribute("href", "https://cdn.datatables.net/1.10.20/css/jquery.dataTables.min.css")

    var dtScript = document.createElement("script")
    dtScript.setAttribute("src", "https://cdn.datatables.net/v/dt/jq-3.2.1/dt-1.10.16/r-2.2.1/datatables.min.js")


    // Configure datatables init snippet
    var dtInit = document.createElement("script")
    dtInit.appendChild(document.createTextNode(`$(document).ready(function() {$('#${tableID}').DataTable({'order': [[ ${options.table_sort_key}, '${options.table_sort_order}' ]],'iDisplayLength': 10,'lengthChange': false, 'searching': ${options.table_search_check}, responsive: true});});`))

    // Create styles
    var stylesTag = document.createElement("style")
    stylesTag.appendChild(document.createTextNode(".table-container{font-family:'Open Sans',Helvetica,Arial,sans-serif;padding:10px;}.table{width:100%}.table-container tr td{font-size:.8em; line-height: 1.3;}.table-title{font:600 1.2em 'Open Sans',Helvetica,Arial,sans-serif;letter-spacing:0;margin-bottom:0}.table-description{font:400 .85em 'Open Sans',Helvetica,Arial,sans-serif;margin:5px 0 15px}.table-source{font:400 .9em 'Open Sans',Helvetica,Arial,sans-serif;color:gray;font-style:italic}.dataTables_info,.dataTables_paginate{text-align:center}table.dataTable.dtr-inline.collapsed>tbody>tr>td:first-child:before,table.dataTable.dtr-inline.collapsed>tbody>tr>th:first-child:before{top:auto;border:0;box-shadow:none;line-height:auto}table.dataTable thead th{color:#000;text-align:left;font-size:.8em;padding:0 8px;border-bottom:2px solid #000;line-height:1.3}table.dataTable td{padding:4px 8px}.dataTables_paginate a.disabled{color:gray;pointer-events:none}table.dataTable tr{border-bottom:1px solid #ccc}table.dataTable.dtr-inline.collapsed>tbody>tr[role=row]>td:first-child:before,table.dataTable.dtr-inline.collapsed>tbody>tr[role=row]>th:first-child:before{background-color:#0063b1}.dataTables_wrapper .dataTables_paginate .paginate_button{padding:5px 12px;border-radius:4px;margin: 0 5px;}.dataTables_wrapper .dataTables_paginate .paginate_button.current{background:0 0;background-color:#000;color:#fff!important;border:none}#table_info,#table_paginate{padding:5px}#table_info{margin-top:10px;padding: 10px;}#table_paginate{margin-bottom:10px}{display: flex;justify-content: space-between;color:#8A8A8A !important;font-style:italic !important;font-size: .9em;}.table-footer{display: flex;justify-content: space-between;color:#8A8A8A !important;font: 400 .9em 'Open Sans',Helvetica,Arial,sans-serif !important; margin-top:10px}.table-source{align-self: flex-start;}.table-byline{align-self: flex-end;font: 400 .9em 'Open Sans',Helvetica,Arial,sans-serif !important;color:#8A8A8A !important}#table-mvgtpe_previous::before {content: '< ';}#table-mvgtpe_next::after {content: ' >';}#table-mvgtpe_previous, #table-mvgtpe_next {color:white;background:black;}"))


    var compiled_html = dtStyles.outerHTML + stylesTag.outerHTML + compiled_table.outerHTML + dtScript.outerHTML + dtInit.outerHTML

    renderedTable = document.getElementById("renderedTable");
    renderedTable.innerHTML = ""
    renderedTable.innerHTML = compiled_html

    document.getElementById("embedCode").innerText = compiled_html

    document.getElementById("resultsSection").scrollIntoView({
        behavior: 'smooth'
    });

}

function generateTableContainer(table_code) {

    var tableContainer = document.createElement("div");
    tableContainer.setAttribute('class', 'table-container');

    var title = document.createElement("h3");
    title.setAttribute('class', 'table-title');
    title.innerText = options.table_title

    var description = document.createElement("p");
    description.setAttribute('class', 'table-description');
    description.innerText = options.table_description

	var footer = document.createElement("div")
	footer.setAttribute('class', 'table-footer')

    var source = document.createElement("p");
    source.setAttribute('class', 'table-source');
    source.innerText = options.table_source

	var byline = document.createElement("p");
    byline.setAttribute('class', 'table-byline');
    byline.innerText = options.table_byline

    tableContainer.appendChild(title)
    tableContainer.appendChild(description)
	tableContainer.appendChild(table_code)
	
    footer.appendChild(source)
    footer.appendChild(byline)
    tableContainer.appendChild(footer)

    return tableContainer

}

// Events
function bindEvents() {

	var pasteSubmit = document.getElementById("pasteSubmit");
	pasteSubmit.addEventListener("click", function(event){
		event.preventDefault();
		var pasteData = document.getElementById("datapaste")
		try {
			var _parseInput = parsePaste(pasteData.value);

			var names = _parseInput.names;
			var data = _parseInput.data;
			tableData.columns.names = names;
			tableData.data = data;

			loadData()
		} catch (error) {
			alert(error);
			console.error(error);
		}

		return false;
		// loadData();
	});

	var optionsSubmit = document.getElementById("optionsSubmit");
	optionsSubmit.addEventListener("click", function(event){
		event.preventDefault();
		parseOptions();
		generateTable();
	})

}

bindEvents();

