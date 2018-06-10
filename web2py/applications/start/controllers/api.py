# Here go your api methods.

def get_memos():
    start_idx = int(request.vars.start_idx) if request.vars.start_idx is not None else 0
    end_idx = int(request.vars.end_idx) if request.vars.end_idx is not None else 0
    memos = []
    rows = []
    if auth.user is not None:
        rows = db(db.memo.user_email == auth.user.email).select(limitby=(start_idx, end_idx + 1))
    for i, r in enumerate(rows):
        if i < end_idx - start_idx:
            t = dict(
                id = r.id,
                user_email = r.user_email,
                title = r.title,
                memo_content = r.memo_content,
                reps = r.reps,
                name = r.name
            )
            memos.append(t)
    logged_in = auth.user is not None
    return response.json(dict(
        memos = memos,
        logged_in = logged_in,
    ))

@auth.requires_signature()
def add_memo():
    workout_id = db.memo.insert(
        title = request.vars.title,
        memo_content = request.vars.memo_content,
        reps = request.vars.reps,
        name = request.vars.name
    )
    temp = db.memo(workout_id)
    return response.json(dict(memo=temp))

@auth.requires_signature()
def delete_memo():
    db(db.memo.id == request.vars.memo_id).delete()
    return "ok"

@auth.requires_signature()
def edit_memo():
    row = db(db.memo.id == request.vars.memo_id).select().first()
    row.update_record(title = request.vars.edit_title)
    row.update_record(memo_content = request.vars.edit_memo_content)
    c = db.memo(request.vars.memo_id)
    l = dict(
        id = c.id,
        title = c.title,
        memo_content = c.memo_content
    )
    return response.json(dict(memo=l))
