//our database url to our json.server
const URL = 'http://localhost:3000/foods';

//this grabs the data from our db.json server
$.get(URL).then(data => {
    data.map(food => {
        $('tbody').append(
            $(`
            <tr>
                <td>${food.id}</td>
                <td>${food.food}</td>
                <td>${food.calories}</td>
                <td>
                    <button onclick="deleteFood(${food.id})">Delete</button>
                </td>
            </tr>
            `)
        );
    });
});

//allows us to add food and calories to our tracker when clicking the start tracking button
$('#submitFood').click(function() {
    $.post(URL, {
        food: $('#food').val(),
        calories: $('#calories').val(),
    });
});

//deletes a food from our tracking table
function deleteFood(id) {
    $.ajax(`${URL}/${id}`, {
        type: 'DELETE'
    });
}

//this lets us update a food with the ID, food, and calories value
function updateTracker() {
    let id = $('#updateId').val();

    $.ajax(`${URL}/${id}`, {
        method: 'PUT',
        data: {
            food: $('#updateFood').val(),
            calories: $('#updateCalories').val(),
        }
    });
}

//the update button to update our food
$('#updateNew').click(updateTracker);