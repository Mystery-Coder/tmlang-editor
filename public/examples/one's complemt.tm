CONFIG:
    START: q0
    ACCEPT: success
    REJECT: fail

MAIN:
    q0, 0 -> 1, R, q0
    q0, 1 -> 0, R, q0
    q0, _ -> _, S, success