import pandas as pd
import re

df = pd.read_csv("texto_ocr.csv")

supuestos = []
preguntas = []

supuesto_id = 1

for _, fila in df.iterrows():

    titulo = str(fila["archivo"])
    texto = str(fila["texto"])

    inicio_preguntas = re.search(
    r"\n\s*(\d{1,3})[\.\-]",
    texto
)

    if not inicio_preguntas:
        print("NO SE ENCONTRARON PREGUNTAS:", titulo)
        continue

    enunciado = texto[:inicio_preguntas.start()].strip()

    supuestos.append({
        "id": supuesto_id,
        "titulo": titulo,
        "enunciado": enunciado
    })

    patron = r"(\d{1,3}[\.\-].*?)(?=\n\s*\d{1,3}[\.\-]|\Z)"

    bloques = re.findall(
        patron,
        texto,
        flags=re.S
    )

    for bloque in bloques:

        opciones = re.split(
            r"\n[Aa]\)",
            bloque,
            maxsplit=1
        )

        if len(opciones) < 2:
            continue

        pregunta = opciones[0].strip()

        resto = "A)" + opciones[1]

        m = re.search(
    r"[Aa]\)(.*?)[Bb]\)(.*?)[Cc]\)(.*?)[Dd]\)(.*)",
    resto,
    re.S
)
        if not m:
            continue

        preguntas.append({
            "supuesto_id": supuesto_id,
            "pregunta": pregunta,
            "opcion_a": m.group(1).strip(),
            "opcion_b": m.group(2).strip(),
            "opcion_c": m.group(3).strip(),
            "opcion_d": m.group(4).strip()
        })

    supuesto_id += 1

pd.DataFrame(supuestos).to_csv(
    "SUPUESTOS.csv",
    index=False,
    encoding="utf-8-sig"
)

pd.DataFrame(preguntas).to_csv(
    "PREGUNTAS_SUPUESTO.csv",
    index=False,
    encoding="utf-8-sig"
)

print("SUPUESTOS.csv generado")
print("PREGUNTAS_SUPUESTO.csv generado")