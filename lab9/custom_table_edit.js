$(document).ready(function(){
    $('#data_table').Tabledit({
        url: 'live_edit.php',
        editButton: false, // We will edit on cell click, so we don't need a separate button
        deleteButton: true,
        hideIdentifier: false, // Show the ID column for reference
        columns: {
            identifier: [0, 'id'],
            editable: [
                [1, 'name'],
                [2, 'gender', '{"Male": "Male", "Female": "Female", "Other": "Other"}'], // Creates a dropdown
                [3, 'age'],
                [4, 'designation'],
                [5, 'address']
            ]
        },
        onSuccess: function(data, textStatus, jqXHR) {
            console.log('Successfully updated:', data);
        },
        onFail: function(jqXHR, textStatus, errorThrown) {
            console.error('Update failed:', errorThrown);
        }
    });
});