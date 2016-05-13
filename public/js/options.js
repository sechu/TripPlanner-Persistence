$(function() {
    function fillInOptions(collection, $selectElement) {
        collection.forEach(function (item) {
            $selectElement.append('<option value="' + item.id + '">' + item.name + '</option>');
        });
    }

    function addtoCollections(type) {
        $.get('/api/' + type)
        .then(function(typeData) {
            fillInOptions(typeData, $('#' + type + '-choices'));
        });
    } 

    addtoCollections('hotel');
    addtoCollections('restaurant');
    addtoCollections('activity');    
});   

   