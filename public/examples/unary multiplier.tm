// E2pects input as 1101110, 223 = 6 , 1101110111111, a*b
CONFIG:
    START: q0
    ACCEPT: success
    REJECT: fail

MAIN:
    q0, 0 -> 0, S, success
    q0, 1 -> _, R, q1

    q1, 1 -> 1, R, q1
    q1, 0 -> 0, R, q2

    q2, 1 -> X, R, q3
    q2, 0 -> 0, L, q6

    q3, 1 -> 1, R, q3
    q3, 0 -> 0, R, q4

    q4, 1 -> 1, R, q4
    q4, _ -> 1, L, q5

    q5, 0 -> 0, L, q5
    q5, 1 -> 1, L, q5
    q5, X -> X, R, q2

    q6, X -> 1, L, q6
    q6, 0 -> 0, L, q7

    q7, 1 -> 1, L, q7
    q7, _ -> _, R, q0