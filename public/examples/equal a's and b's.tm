// TM to recognise strings with equal a's and b's
// Strictly follows the order of a then b, always looking for 'a' first
// Then moving to start to find corresponding b

CONFIG:
    START: q0
    ACCEPT: success
    REJECT: fail

MAIN:
    q0, X -> X, R, q0
    q0, b -> b, R, q0
    q0, a -> X, L, q1
    q0, _ -> _, S, success // If you see blank on q0, then the complete string is covered

    q1, a -> a, L, q1
    q1, b -> b, L, q1
    q1, X -> X, L, q1
    q1, _ -> _, R, q2

    q2, X -> X, R, q2
    q2, a -> a, R, q2
    q2, b -> X, L, q3


    q3, a -> a, L, q3
    q3, b -> b, L, q3
    q3, X -> X, L, q3
    q3, _ -> _, R, q0