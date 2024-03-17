document.getElementById('fileInput').addEventListener('change', function(event) {
    var file = event.target.files[0];
    var reader = new FileReader();
  
    reader.onload = function(e) {
      var data = new Uint8Array(e.target.result);
      var workbook = XLSX.read(data, {type: 'array'});
      var sheetName = workbook.SheetNames[0];
      var sheet = workbook.Sheets[sheetName];
      var htmlTable = XLSX.utils.sheet_to_html(sheet);
      document.getElementById('tableContainer').innerHTML = htmlTable;
    };
  
    reader.readAsArrayBuffer(file);
  });
  