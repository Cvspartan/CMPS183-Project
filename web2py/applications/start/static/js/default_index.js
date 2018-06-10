// This is the js for the default/index.html view.

var app = function() {

    var self = {};

    Vue.config.silent = false; // show all warnings

    // Extends an array
    self.extend = function(a, b) {
        for (var i = 0; i < b.length; i++) {
            a.push(b[i]);
        }
    };

    var enumerate = function(v) { var k=0; return v.map(function(e) {e._idx = k++;});};

    function get_workout_url(start_idx, end_idx){
        var pp ={
            start_idx: start_idx,
            end_idx: end_idx
        };
        return get_workouts_url + "?" + $.param(pp)
    }

    self.get_workouts = function(){
        $.getJSON(get_workout_url(0,10), function(data){
            self.vue.workouts = data.workouts;
            self.vue.logged_in = data.logged_in;
            enumerate(self.vue.workouts);
        })
    };

    self.add_workout = function(){
        $.post(add_workout_url,
            {
                reps: self.vue.rep_amount,
                name: self.vue.workout_name
            },
            function(data){
                $.web2py.enableElement($("#add_workout_submit"));
                self.vue.workouts.unshift(data.workout);
                enumerate(self.vue.workouts);
            });

    };

    self.delete_workout = function(workout_id){
        $.post(delete_workout_url,
            {
                workout_id: workout_id
            },
            function(){
                var idx = null;
                for(var i = 0; i < self.vue.workouts.length;i++){
                    if(workout_id == self.vue.workouts[i].id){
                        idx = i + 1;
                        break;
                    }
                }
                if(idx){
                    self.vue.workouts.splice(idx - 1, 1);
                    enumerate(self.vue.workouts);
                }
            }
        )
    };


    // Complete as needed.
    self.vue = new Vue({
        el: "#vue-div",
        delimiters: ['${', '}'],
        unsafeDelimiters: ['!{', '}'],
        data: {
            logged_in: false,
            workouts: [],
            workout_name: null,
            rep_amount: 0,
        },
        methods: {
            add_workout: self.add_workout,
            delete_workout: self.delete_workout,
        }

    });

    self.get_workouts();
    $("#vue-div").show();

    return self;
};

var APP = null;

// This will make everything accessible from the js console;
// for instance, self.x above would be accessible as APP.x
jQuery(function(){APP = app();});
