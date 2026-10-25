
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status


@api_view(["POST"])
def effectuer_calcul(request):
    a = request.data.get("a")
    b = request.data.get("b")
    operation = request.data.get("operation")

    if a is None or b is None or operation is None:
        return Response(
            {"erreur": "Les champs a, b et operation sont obligatoires."},
            status=status.HTTP_400_BAD_REQUEST
        )

    try:
        a = float(a)
        b = float(b)
    except (TypeError, ValueError):
        return Response(
            {"erreur": "a et b doivent être des nombres."},
            status=status.HTTP_400_BAD_REQUEST
        )

    if operation == "addition":
        resultat = a + b
    elif operation == "soustraction":
        resultat = a - b
    elif operation == "multiplication":
        resultat = a * b
    elif operation == "division":
        if b == 0:
            return Response(
                {"erreur": "Division par zéro impossible."},
                status=status.HTTP_400_BAD_REQUEST
            )
        resultat = a / b
    elif operation == "modulo":
        if b == 0:
            return Response(
                {"erreur": "Le modulo par zéro est impossible."},
                status=status.HTTP_400_BAD_REQUEST
            )
        resultat = a % b
    else:
        return Response(
            {"erreur": "Opération non reconnue."},
            status=status.HTTP_400_BAD_REQUEST
        )

    return Response({
        "a": a,
        "b": b,
        "operation": operation,
        "resultat": resultat
    })
