class Day {
    constructor(day) {
    this.day = day;
    this.diets = [];
    }

    addFood(food, calories) {
        this.diets.push(new Diet(food, calories));
    }
}

class Diet {
    constructor(food, calories) {
        this.food = food;
        this.calories = calories;
    }
}

class DietTracker {
    static url = 'http://localhost:3000/diets';

    static getAllDays() {
        return $.get(this.url);
    }

    static getDay(id) {
        return $.get(this.url + `/${id}`);
    }

    static createDay(day) {
        return $.post(this.url, day);
    }

    static updateDay(day) {
        return $.ajax({
            url: this.url + `/${day._id}`,
            dataType: 'json',
            data: JSON.stringify(day),
            contentType: 'application/json',
            type: 'PUT'
        });
    }

    static deleteDay(id) {
        return $.ajax({
            url: this.url + `/${id}`,
            type: 'DELETE'
        });
    }
}

class DOMManager {
    static days;

    static getAllDays() {
        DietTracker.getAllDays().then(days => this.render(days));
    }

    static createDay(day) {
        DietTracker.createDay(new Day(day))
            .then(() => {
                return DietTracker.getAllDays();
            })
            .then((days) => this.render(days));
    }

    static deleteDay(id) {
        DietTracker.deleteDay(id)
            .then(() => {
                return DietTracker.getAllDays();
            })
            .then((days) => this.render(days));
    }

    static addFood(id) {
        for (let day of this.days) {
            if (day._id == id) {
                day.diets.push(new Diet($(`#${day._id}-diet-food`).val(), $(`#${day._id}-diet-calories`).val()));
                DietTracker.updateDay(day)
                    .then(() => {
                        return DietTracker.getAllDays();
                    })
                    .then((days) => this.render(days));
            }
        }
    }

    static deleteFood(dayId, dietId) {
        for (let day of this.days) {
            if (day._id == dayId) {
                for (let diet of day.diets) {
                    if (diet._id == dietId) {
                        day.diets.splice(day.diets.indexOf(diet), 1);
                        DietTracker.updateDay(day)
                        .then(() => {
                            return DietTracker.getAllDays();
                        })
                        .then((days) => this.render(days));
                    }
                }
            }
        }
    }

    static render(days) {
        this.days = days;
        $('#list').empty();
        for (let day of days) {
            $('#list').prepend(
                `<div id="${day._id}" class="card">
                    <div class="card-header">
                        <h2>${day.day}</h2>
                        <button class="btn btn-danger" onclick="DOMManager.deleteDay('${day._id}')">Delete</button>
                    </div>
                    <div class="card-body">
                        <div class="card">
                            <div class"row">
                                <div class"col-sm">
                                    <input type="text" id="${day._id}-diet-food" class="form-control" placeholder="Food">
                                </div>
                                <div class"col-sm">
                                    <input type="text" id="${day._id}-diet-calories" class="form-control" placeholder="Calories">
                                </div>
                            </div>
                            <button id="${day._id}-new-food" onclick="DOMManager.addFood('${day._id}')" class="btn btn-success form-control">Add Food</button>
                        </div>
                    </div>
                </div><br>`
            );
            for (let diet of day.diets) {
                $(`#${day._id}`).find('.card-body').append(
                    `<p>
                        <span id="food-${diet._id}"><strong>Food: </strong> ${diet.food}</span>
                        <span id="calories-${diet._id}"><strong>Calories: </strong> ${diet.calories}</span>
                        <button class="btn btn-success" onclick="DOMManager.deleteFood('${day._id}', '${diet._id}')">Delete Food</button>`
                );
            }
        }
    }
}

$('#createDiet').click(() => {
    DOMManager.createDay($('#dayOfWeek').val());
    $('#dayOfWeek').val('');
});

DOMManager.getAllDays();