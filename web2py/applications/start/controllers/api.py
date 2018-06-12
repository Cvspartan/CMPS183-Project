# Here go your api methods.

def get_workouts():
    start_idx = int(request.vars.start_idx) if request.vars.start_idx is not None else 0
    end_idx = int(request.vars.end_idx) if request.vars.end_idx is not None else 0
    workouts = []
    rows = []
    if auth.user is not None:
        rows = db(db.workout.user_email == auth.user.email).select(limitby=(start_idx, end_idx + 1))
    for i, r in enumerate(rows):
        if i < end_idx - start_idx:
            t = dict(
                id = r.id,
                user_email = r.user_email,
                name=r.name,
                reps = r.reps,
                weight = r.weight,
                day_value = r.day_value
            )
            workouts.append(t)
    logged_in = auth.user is not None
    return response.json(dict(
        workouts = workouts,
        logged_in = logged_in,
    ))

@auth.requires_signature()
def add_workout():
    workout_id = db.workout.insert(
        name = request.vars.name,
        reps = request.vars.reps,
        weight = request.vars.weight,
        day_value = request.vars.day_value
    )
    temp = db.workout(workout_id)
    return response.json(dict(workout=temp))

@auth.requires_signature()
def delete_workout():
    db(db.workout.id == request.vars.workout_id).delete()
    return "ok"

