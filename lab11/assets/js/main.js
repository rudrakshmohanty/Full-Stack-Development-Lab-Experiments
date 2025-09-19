$(document).ready(function() {
    // --- 1. Fetch and Display Users on Page Load ---
    fetchUsers();

    function fetchUsers() {
        $.ajax({
            url: 'api.php?action=fetch_all',
            type: 'GET',
            dataType: 'json',
            success: function(users) {
                let tableBody = $('#userTableBody');
                tableBody.empty(); // Clear existing rows
                users.forEach(user => {
                    tableBody.append(`
                        <tr>
                            <td>${user.id}</td>
                            <td>${user.name}</td>
                            <td>${user.email}</td>
                            <td>${user.phone}</td>
                            <td class="text-center">
                                <button class="btn btn-sm btn-info editBtn" data-id="${user.id}"><i class="fas fa-edit"></i> Edit</button>
                                <button class="btn btn-sm btn-danger deleteBtn" data-id="${user.id}"><i class="fas fa-trash"></i> Delete</button>
                            </td>
                        </tr>
                    `);
                });
            }
        });
    }

    // --- 2. Handle Add/Update Form Submission ---
    $('#userForm').on('submit', function(e) {
        e.preventDefault();
        let formData = $(this).serialize();
        let userId = $('#userId').val();
        let url = userId ? 'api.php' : 'api.php';
        formData += userId ? '&action=update_user' : '&action=add_user';

        $.ajax({
            url: url,
            type: 'POST',
            data: formData,
            dataType: 'json',
            success: function(response) {
                if(response.success) {
                    $('#userModal').modal('hide');
                    fetchUsers(); // Refresh the table
                }
            }
        });
    });
    
    // --- 3. Handle 'Add User' Button Click ---
    $('#addUserBtn').on('click', function() {
        $('#userForm')[0].reset();
        $('#userId').val('');
        $('#modalTitle').text('Add New User');
    });

    // --- 4. Handle 'Edit' Button Click ---
    $('#userTableBody').on('click', '.editBtn', function() {
        let userId = $(this).data('id');
        $.ajax({
            url: `api.php?action=fetch_single&id=${userId}`,
            type: 'GET',
            dataType: 'json',
            success: function(user) {
                $('#modalTitle').text('Edit User');
                $('#userId').val(user.id);
                $('#userName').val(user.name);
                $('#userEmail').val(user.email);
                $('#userPhone').val(user.phone);
                $('#userModal').modal('show');
            }
        });
    });

    // --- 5. Handle 'Delete' Button Click ---
    $('#userTableBody').on('click', '.deleteBtn', function() {
        let userId = $(this).data('id');
        if (confirm('Are you sure you want to delete this user?')) {
            $.ajax({
                url: 'api.php',
                type: 'POST',
                data: { action: 'delete_user', id: userId },
                dataType: 'json',
                success: function(response) {
                    if (response.success) {
                        fetchUsers(); // Refresh the table
                    }
                }
            });
        }
    });
});