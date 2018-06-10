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

    function get_memo_url(start_idx, end_idx){
        var pp ={
            start_idx: start_idx,
            end_idx: end_idx
        };
        return get_memos_url + "?" + $.param(pp)
    }

    self.get_memos = function(){
        $.getJSON(get_memo_url(0,10), function(data){
            self.vue.memos = data.memos;
            self.vue.logged_in = data.logged_in;
            enumerate(self.vue.memos);
        })
    };

    self.add_memo = function(){
        $.post(add_memo_url,
            {
                reps: self.vue.rep_amount,
                name: self.vue.workout_name
            },
            function(data){
                $.web2py.enableElement($("#add_memo_submit"));
                self.vue.memos.unshift(data.memo);
                enumerate(self.vue.memos);
            });

    };

    self.delete_memo = function(memo_id){
        $.post(delete_memo_url,
            {
                memo_id: memo_id
            },
            function(){
                var idx = null;
                for(var i = 0; i < self.vue.memos.length;i++){
                    if(memo_id == self.vue.memos[i].id){
                        idx = i + 1;
                        break;
                    }
                }
                if(idx){
                    self.vue.memos.splice(idx - 1, 1);
                    enumerate(self.vue.memos);
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
            memos: [],
            rep_amount: 0,
            workout_name: null
        },
        methods: {
            add_memo: self.add_memo,
            delete_memo: self.delete_memo,
        }

    });

    self.get_memos();
    $("#vue-div").show();

    return self;
};

var APP = null;

// This will make everything accessible from the js console;
// for instance, self.x above would be accessible as APP.x
jQuery(function(){APP = app();});
